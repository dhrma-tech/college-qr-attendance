-- Hardened attendance marking function with comprehensive validation
-- This replaces the existing mark_attendance_from_qr function with enhanced security

drop function if exists mark_attendance_from_qr(uuid, uuid, numeric, numeric, text);

create or replace function mark_attendance_from_qr(
  scan_token uuid,
  student_uuid uuid,
  scan_latitude numeric default null,
  scan_longitude numeric default null,
  scan_device_fingerprint text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_session attendance_sessions%rowtype;
  target_student users%rowtype;
  target_enrollment student_enrollments%rowtype;
  computed_distance numeric;
  should_flag boolean := false;
  record_id uuid;
  existing_record uuid;
  audit_context jsonb;
begin
  -- Validate input parameters
  if scan_token is null or student_uuid is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Invalid parameters: token and student ID are required'
    );
  end if;

  -- Validate device fingerprint length
  if scan_device_fingerprint is not null and length(scan_device_fingerprint) > 255 then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Device fingerprint too long'
    );
  end if;

  -- Validate coordinates if provided
  if scan_latitude is not null then
    if scan_latitude < -90 or scan_latitude > 90 then
      return jsonb_build_object(
        'status', 'error',
        'message', 'Invalid latitude value'
      );
    end if;
  end if;

  if scan_longitude is not null then
    if scan_longitude < -180 or scan_longitude > 180 then
      return jsonb_build_object(
        'status', 'error',
        'message', 'Invalid longitude value'
      );
    end if;
  end if;

  -- Verify student exists and is active
  select *
  into target_student
  from users
  where id = student_uuid
    and role = 'student'
    and is_active = true
  limit 1;

  if target_student.id is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Student not found or inactive'
    );
  end if;

  -- Find and validate session
  select *
  into target_session
  from attendance_sessions
  where qr_token = scan_token
    and status = 'active'
    and qr_expires_at > now()
  limit 1;

  if target_session.id is null then
    -- Log failed attempt for security monitoring
    insert into audit_logs(
      actor_id, 
      action, 
      table_name, 
      record_id, 
      old_val, 
      new_val,
      created_at
    ) values (
      student_uuid,
      'FAILED_ATTENDANCE_ATTEMPT',
      'attendance_sessions',
      scan_token,
      jsonb_build_object('reason', 'invalid_or_expired_token'),
      jsonb_build_object('scan_time', now()),
      now()
    );

    return jsonb_build_object(
      'status', 'expired',
      'message', 'Session expired or invalid token'
    );
  end if;

  -- Verify student is enrolled in the session's subject
  select se.*
  into target_enrollment
  from subject_assignments sa
  join subjects s on s.id = sa.subject_id
  join student_enrollments se on se.subject_id = s.id
  where sa.id = target_session.subject_assignment_id
    and se.student_id = student_uuid
    and se.section = sa.section
  limit 1;

  if target_enrollment.id is null then
    -- Log unauthorized attempt
    insert into audit_logs(
      actor_id, 
      action, 
      table_name, 
      record_id, 
      old_val, 
      new_val,
      created_at
    ) values (
      student_uuid,
      'UNAUTHORIZED_ATTENDANCE_ATTEMPT',
      'attendance_sessions',
      target_session.id,
      jsonb_build_object('reason', 'not_enrolled'),
      jsonb_build_object('scan_time', now()),
      now()
    );

    return jsonb_build_object(
      'status', 'unauthorized',
      'message', 'Student not enrolled in this session'
    );
  end if;

  -- Verify student belongs to same college as session/teacher
  if target_student.college_id != target_session.college_id then
    -- Log cross-college attempt
    insert into audit_logs(
      actor_id, 
      action, 
      table_name, 
      record_id, 
      old_val, 
      new_val,
      created_at
    ) values (
      student_uuid,
      'CROSS_COLLEGE_ATTENDANCE_ATTEMPT',
      'attendance_sessions',
      target_session.id,
      jsonb_build_object('student_college', target_student.college_id),
      jsonb_build_object('session_college', target_session.college_id),
      now()
    );

    return jsonb_build_object(
      'status', 'unauthorized',
      'message', 'College mismatch'
    );
  end if;

  -- Check for existing attendance record
  select id
  into existing_record
  from attendance_records
  where session_id = target_session.id
    and student_id = student_uuid
  limit 1;

  if existing_record is not null then
    return jsonb_build_object(
      'status', 'already',
      'session_id', target_session.id,
      'record_id', existing_record,
      'message', 'Attendance already marked'
    );
  end if;

  -- Calculate distance and check geofence
  computed_distance := distance_meters(
    target_session.latitude, 
    target_session.longitude, 
    scan_latitude, 
    scan_longitude
  );
  
  should_flag := computed_distance is not null 
    and target_session.radius_meters is not null
    and computed_distance > target_session.radius_meters;

  -- Create attendance record
  insert into attendance_records (
    session_id,
    student_id,
    status,
    latitude,
    longitude,
    device_fingerprint,
    is_proxy_flagged,
    distance_meters,
    created_at
  )
  values (
    target_session.id,
    student_uuid,
    case when should_flag then 'flagged' else 'present' end,
    scan_latitude,
    scan_longitude,
    scan_device_fingerprint,
    should_flag,
    computed_distance,
    now()
  )
  returning id into record_id;

  -- Log successful attendance marking
  audit_context := jsonb_build_object(
    'session_id', target_session.id,
    'student_id', student_uuid,
    'status', case when should_flag then 'flagged' else 'present' end,
    'distance_meters', computed_distance,
    'radius_meters', target_session.radius_meters,
    'device_fingerprint', scan_device_fingerprint
  );

  insert into audit_logs(
    actor_id, 
    action, 
    table_name, 
    record_id, 
    old_val, 
    new_val,
    created_at
  ) values (
    student_uuid,
    'MARK_ATTENDANCE',
    'attendance_records',
    record_id,
    null,
    audit_context,
    now()
  );

  return jsonb_build_object(
    'status', case when should_flag then 'flagged' else 'present' end,
    'session_id', target_session.id,
    'record_id', record_id,
    'distance_meters', computed_distance,
    'radius_meters', target_session.radius_meters,
    'message', case 
      when should_flag then 'Attendance marked but flagged due to location'
      else 'Attendance marked successfully'
    end
  );
end;
$$;

-- Add constraints for attendance sessions
alter table attendance_sessions 
  add constraint check_latitude check (latitude >= -90 and latitude <= 90),
  add constraint check_longitude check (longitude >= -180 and longitude <= 180),
  add constraint check_radius check (radius_meters > 0 and radius_meters <= 10000);

-- Add constraint for QR expiry (must be in future when set)
alter table attendance_sessions 
  add constraint check_qr_expires_at check (
    qr_expires_at is null or qr_expires_at > created_at
  );

-- Add index for audit log security monitoring
create index if not exists idx_audit_logs_action_time 
  on audit_logs(action, created_at desc);

-- Add index for failed attendance attempts monitoring
create index if not exists idx_audit_logs_failed_attempts 
  on audit_logs(actor_id, created_at desc) 
  where action in ('FAILED_ATTENDANCE_ATTEMPT', 'UNAUTHORIZED_ATTENDANCE_ATTEMPT', 'CROSS_COLLEGE_ATTENDANCE_ATTEMPT');

-- Add function to get suspicious attendance patterns
create or replace function get_suspicious_attendance_patterns(
  p_hours interval default interval '24 hours'
) returns table (
  student_id uuid,
  student_name text,
  suspicious_attempts bigint,
  unique_locations bigint,
  avg_distance numeric,
  max_distance numeric,
  last_attempt timestamptz
)
language sql
security definer
set search_path = public
as $$
select 
  u.id as student_id,
  u.name as student_name,
  count(*) filter (where ar.action in ('FAILED_ATTENDANCE_ATTEMPT', 'UNAUTHORIZED_ATTENDANCE_ATTEMPT')) as suspicious_attempts,
  count(distinct ar.new_val->>'device_fingerprint') as unique_locations,
  avg((ar.new_val->>'distance_meters')::numeric) as avg_distance,
  max((ar.new_val->>'distance_meters')::numeric) as max_distance,
  max(ar.created_at) as last_attempt
from users u
join audit_logs ar on ar.actor_id = u.id
where u.role = 'student'
  and ar.created_at > now() - p_hours
  and ar.action in ('FAILED_ATTENDANCE_ATTEMPT', 'UNAUTHORIZED_ATTENDANCE_ATTEMPT', 'CROSS_COLLEGE_ATTENDANCE_ATTEMPT', 'MARK_ATTENDANCE')
group by u.id, u.name
having count(*) filter (where ar.action in ('FAILED_ATTENDANCE_ATTEMPT', 'UNAUTHORIZED_ATTENDANCE_ATTEMPT')) > 0
order by suspicious_attempts desc, last_attempt desc;
$$;

-- Add function to cleanup old audit logs (retention policy)
create or replace function cleanup_old_audit_logs(
  p_retention_days integer default 365
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from audit_logs 
  where created_at < now() - (p_retention_days || ' days')::interval;
  
  get diagnostics deleted_count = row_count;
  
  return deleted_count;
end;
$$;

-- Add comment explaining the hardened function
comment on function mark_attendance_from_qr is 'Hardened attendance marking function with comprehensive validation, enrollment checks, college verification, geofencing, and audit logging. Prevents duplicate attendance, unauthorized access, and cross-college attempts.';
