create index if not exists idx_users_role_college on users(role, college_id);
create index if not exists idx_users_department on users(department_id);
create index if not exists idx_subjects_department_semester on subjects(department_id, semester, year);
create index if not exists idx_subject_assignments_teacher on subject_assignments(teacher_id);
create index if not exists idx_student_enrollments_student on student_enrollments(student_id);
create index if not exists idx_attendance_sessions_teacher_status on attendance_sessions(teacher_id, status);
create index if not exists idx_attendance_sessions_token on attendance_sessions(qr_token);
create index if not exists idx_attendance_records_session on attendance_records(session_id);
create index if not exists idx_attendance_records_student on attendance_records(student_id);
create index if not exists idx_notifications_user_read on notifications(user_id, is_read);
create index if not exists idx_audit_logs_actor_time on audit_logs(actor_id, created_at desc);

create or replace function distance_meters(
  lat1 numeric,
  lon1 numeric,
  lat2 numeric,
  lon2 numeric
) returns numeric
language sql
immutable
as $$
  select case
    when lat1 is null or lon1 is null or lat2 is null or lon2 is null then null
    else 6371000 * acos(
      least(
        1,
        greatest(
          -1,
          cos(radians(lat1::double precision)) *
          cos(radians(lat2::double precision)) *
          cos(radians((lon2 - lon1)::double precision)) +
          sin(radians(lat1::double precision)) *
          sin(radians(lat2::double precision))
        )
      )
    )
  end;
$$;

create or replace function rotate_attendance_session_token(session_uuid uuid)
returns table(id uuid, qr_token uuid, qr_expires_at timestamptz)
language plpgsql
security definer
as $$
begin
  update attendance_sessions
  set qr_token = gen_random_uuid(),
      qr_expires_at = now() + interval '30 seconds'
  where attendance_sessions.id = session_uuid
    and attendance_sessions.status = 'active'
  returning attendance_sessions.id, attendance_sessions.qr_token, attendance_sessions.qr_expires_at
  into id, qr_token, qr_expires_at;

  return next;
end;
$$;

create or replace function mark_attendance_from_qr(
  scan_token uuid,
  student_uuid uuid,
  scan_latitude numeric default null,
  scan_longitude numeric default null,
  scan_device_fingerprint text default null
) returns jsonb
language plpgsql
security definer
as $$
declare
  target_session attendance_sessions%rowtype;
  computed_distance numeric;
  should_flag boolean := false;
  record_id uuid;
begin
  select *
  into target_session
  from attendance_sessions
  where qr_token = scan_token
    and status = 'active'
    and qr_expires_at > now()
  limit 1;

  if target_session.id is null then
    return jsonb_build_object('status', 'expired', 'message', 'Session expired or invalid token');
  end if;

  computed_distance := distance_meters(target_session.latitude, target_session.longitude, scan_latitude, scan_longitude);
  should_flag := computed_distance is not null and computed_distance > target_session.radius_meters;

  insert into attendance_records (
    session_id,
    student_id,
    status,
    latitude,
    longitude,
    device_fingerprint,
    is_proxy_flagged
  )
  values (
    target_session.id,
    student_uuid,
    'present',
    scan_latitude,
    scan_longitude,
    scan_device_fingerprint,
    should_flag
  )
  on conflict (session_id, student_id)
  do update set marked_at = attendance_records.marked_at
  returning id into record_id;

  return jsonb_build_object(
    'status', case when should_flag then 'flagged' else 'present' end,
    'session_id', target_session.id,
    'record_id', record_id,
    'distance_meters', computed_distance,
    'radius_meters', target_session.radius_meters
  );
end;
$$;

create or replace view student_attendance_summary as
select
  u.id as student_id,
  u.name as student_name,
  u.roll_number,
  s.id as subject_id,
  s.name as subject_name,
  count(ar.id) filter (where ar.status = 'present') as present_count,
  count(ar.id) filter (where ar.status = 'late') as late_count,
  count(ar.id) filter (where ar.status = 'absent') as absent_count,
  count(ar.id) as total_records,
  case
    when count(ar.id) = 0 then 0
    else round((count(ar.id) filter (where ar.status in ('present', 'late'))::numeric / count(ar.id)::numeric) * 100, 2)
  end as attendance_percentage
from users u
join student_enrollments se on se.student_id = u.id
join subjects s on s.id = se.subject_id
left join subject_assignments sa on sa.subject_id = s.id and sa.section = se.section
left join attendance_sessions ass on ass.subject_assignment_id = sa.id
left join attendance_records ar on ar.session_id = ass.id and ar.student_id = u.id
where u.role = 'student'
group by u.id, u.name, u.roll_number, s.id, s.name;

create or replace view active_session_status as
select
  ass.id as session_id,
  ass.status,
  ass.qr_expires_at,
  ass.teacher_id,
  teacher.name as teacher_name,
  subj.name as subject_name,
  sa.section,
  count(ar.id) filter (where ar.status in ('present', 'late')) as marked_count,
  count(se.id) as enrolled_count
from attendance_sessions ass
join subject_assignments sa on sa.id = ass.subject_assignment_id
join subjects subj on subj.id = sa.subject_id
join users teacher on teacher.id = ass.teacher_id
left join student_enrollments se on se.subject_id = subj.id and se.section = sa.section
left join attendance_records ar on ar.session_id = ass.id and ar.student_id = se.student_id
group by ass.id, ass.status, ass.qr_expires_at, ass.teacher_id, teacher.name, subj.name, sa.section;

create or replace view low_attendance_alerts as
select
  summary.student_id,
  summary.student_name,
  summary.roll_number,
  summary.subject_id,
  summary.subject_name,
  summary.attendance_percentage,
  colleges.attendance_threshold,
  case
    when summary.attendance_percentage < 50 then 'critical'
    when summary.attendance_percentage < colleges.attendance_threshold then 'warning'
    else 'healthy'
  end as severity
from student_attendance_summary summary
join users u on u.id = summary.student_id
join colleges on colleges.id = u.college_id
where summary.attendance_percentage < colleges.attendance_threshold;

create or replace function write_audit_log()
returns trigger
language plpgsql
as $$
begin
  insert into audit_logs(actor_id, action, table_name, record_id, old_val, new_val)
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    to_jsonb(old),
    to_jsonb(new)
  );
  return coalesce(new, old);
end;
$$;

drop trigger if exists audit_attendance_records on attendance_records;
create trigger audit_attendance_records
after insert or update or delete on attendance_records
for each row execute function write_audit_log();
