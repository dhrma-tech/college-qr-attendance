-- Comprehensive Row Level Security (RLS) Policies
-- This migration replaces basic RLS policies with comprehensive, role-based security

-- Drop existing basic policies
drop policy if exists "Users can read their profile" on users;
drop policy if exists "Students read own attendance" on attendance_records;
drop policy if exists "Teachers manage own sessions" on attendance_sessions;
drop policy if exists "Teachers read records for own sessions" on attendance_records;
drop policy if exists "Users read notifications" on notifications;

-- =============================================================================
-- COLLEGES TABLE POLICIES
-- =============================================================================

-- Admins can read colleges within their own college
create policy "Admins read own college" on colleges
  for select using (
    auth.uid() in (
      select id from users 
      where role = 'admin' 
      and college_id = colleges.id
      and is_active = true
    )
  );

-- No insert/update/delete policies for colleges (managed by system)

-- =============================================================================
-- USERS TABLE POLICIES
-- =============================================================================

-- Users can read their own profile
create policy "Users read own profile" on users
  for select using (auth.uid() = id);

-- Students can read basic info of other students in same college/department
create policy "Students read college mates" on users
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'student'
      and u.is_active = true
      and u.college_id = users.college_id
      and (
        u.department_id = users.department_id
        or users.role = 'student' -- Allow seeing other students
      )
    )
  );

-- Teachers can read students and teachers in their college/department
create policy "Teachers read college users" on users
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'teacher'
      and u.is_active = true
      and u.college_id = users.college_id
      and (
        u.department_id = users.department_id
        or users.role in ('student', 'teacher')
      )
    )
  );

-- HODs can read all users in their department
create policy "HODs read department users" on users
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = users.department_id
    )
  );

-- Admins can read all users in their college
create policy "Admins read college users" on users
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = users.college_id
    )
  );

-- Users can update their own profile (limited fields)
create policy "Users update own profile" on users
  for update using (
    auth.uid() = id
  )
  with check (
    auth.uid() = id
    and role = old.role -- Cannot change role
    and college_id = old.college_id -- Cannot change college
    and department_id = old.department_id -- Cannot change department
  );

-- =============================================================================
-- DEPARTMENTS TABLE POLICIES
-- =============================================================================

-- Teachers and students can read departments in their college
create policy "College users read departments" on departments
  for select using (
    auth.uid() in (
      select id from users u
      where u.is_active = true
      and u.college_id = departments.college_id
      and u.role in ('student', 'teacher')
    )
  );

-- HODs can read their own department
create policy "HODs read own department" on departments
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = departments.id
    )
  );

-- Admins can read all departments in their college
create policy "Admins read college departments" on departments
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = departments.college_id
    )
  );

-- =============================================================================
-- SUBJECTS TABLE POLICIES
-- =============================================================================

-- Students can read subjects in their college/department
create policy "Students read college subjects" on subjects
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'student'
      and u.is_active = true
      and u.college_id = subjects.college_id
      and u.department_id = subjects.department_id
    )
  );

-- Teachers can read subjects in their college/department
create policy "Teachers read college subjects" on subjects
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'teacher'
      and u.is_active = true
      and u.college_id = subjects.college_id
      and u.department_id = subjects.department_id
    )
  );

-- HODs can read subjects in their department
create policy "HODs read department subjects" on subjects
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = subjects.department_id
    )
  );

-- Admins can read all subjects in their college
create policy "Admins read college subjects" on subjects
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = subjects.college_id
    )
  );

-- =============================================================================
-- SUBJECT ASSIGNMENTS TABLE POLICIES
-- =============================================================================

-- Students can read subject assignments for their enrolled subjects
create policy "Students read subject assignments" on subject_assignments
  for select using (
    auth.uid() in (
      select se.student_id
      from student_enrollments se
      where se.student_id = auth.uid()
      and se.subject_id = subject_assignments.subject_id
    )
  );

-- Teachers can read their own subject assignments
create policy "Teachers read own assignments" on subject_assignments
  for select using (auth.uid() = teacher_id);

-- HODs can read subject assignments in their department
create policy "HODs read department assignments" on subject_assignments
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = (
        select department_id from subjects 
        where subjects.id = subject_assignments.subject_id
      )
    )
  );

-- Admins can read all subject assignments in their college
create policy "Admins read college assignments" on subject_assignments
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = (
        select college_id from subjects 
        where subjects.id = subject_assignments.subject_id
      )
    )
  );

-- =============================================================================
-- STUDENT ENROLLMENTS TABLE POLICIES
-- =============================================================================

-- Students can read their own enrollments
create policy "Students read own enrollments" on student_enrollments
  for select using (auth.uid() = student_id);

-- Teachers can read enrollments for their assigned subjects
create policy "Teachers read subject enrollments" on student_enrollments
  for select using (
    auth.uid() in (
      select teacher_id from subject_assignments
      where subject_assignments.subject_id = student_enrollments.subject_id
    )
  );

-- HODs can read enrollments in their department
create policy "HODs read department enrollments" on student_enrollments
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = (
        select department_id from subjects 
        where subjects.id = student_enrollments.subject_id
      )
    )
  );

-- Admins can read all enrollments in their college
create policy "Admins read college enrollments" on student_enrollments
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = (
        select college_id from subjects 
        where subjects.id = student_enrollments.subject_id
      )
    )
  );

-- =============================================================================
-- TIMETABLE TABLE POLICIES
-- =============================================================================

-- Students can read timetable for their enrolled subjects
create policy "Students read subject timetable" on timetable
  for select using (
    auth.uid() in (
      select se.student_id
      from student_enrollments se
      join subject_assignments sa on sa.subject_id = se.subject_id
      where se.student_id = auth.uid()
      and sa.id = timetable.subject_assignment_id
    )
  );

-- Teachers can read their own timetable
create policy "Teachers read own timetable" on timetable
  for select using (
    auth.uid() in (
      select teacher_id from subject_assignments
      where subject_assignments.id = timetable.subject_assignment_id
    )
  );

-- HODs can read timetable for their department
create policy "HODs read department timetable" on timetable
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = (
        select s.department_id 
        from subject_assignments sa
        join subjects s on s.id = sa.subject_id
        where sa.id = timetable.subject_assignment_id
      )
    )
  );

-- Admins can read all timetable in their college
create policy "Admins read college timetable" on timetable
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = (
        select s.college_id 
        from subject_assignments sa
        join subjects s on s.id = sa.subject_id
        where sa.id = timetable.subject_assignment_id
      )
    )
  );

-- =============================================================================
-- ATTENDANCE SESSIONS TABLE POLICIES
-- =============================================================================

-- Students can read active sessions for their enrolled subjects
create policy "Students read enrolled sessions" on attendance_sessions
  for select using (
    auth.uid() in (
      select se.student_id
      from student_enrollments se
      join subject_assignments sa on sa.subject_id = se.subject_id
      where se.student_id = auth.uid()
      and sa.id = attendance_sessions.subject_assignment_id
      and attendance_sessions.status = 'active'
    )
  );

-- Teachers can read and manage their own sessions
create policy "Teachers manage own sessions" on attendance_sessions
  for all using (auth.uid() = teacher_id);

-- HODs can read sessions in their department
create policy "HODs read department sessions" on attendance_sessions
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = (
        select s.department_id 
        from subject_assignments sa
        join subjects s on s.id = sa.subject_id
        where sa.id = attendance_sessions.subject_assignment_id
      )
    )
  );

-- Admins can read all sessions in their college
create policy "Admins read college sessions" on attendance_sessions
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = attendance_sessions.college_id
    )
  );

-- =============================================================================
-- ATTENDANCE RECORDS TABLE POLICIES
-- =============================================================================

-- Students can read their own attendance records
create policy "Students read own attendance" on attendance_records
  for select using (auth.uid() = student_id);

-- Teachers can read and update attendance for their own sessions
create policy "Teachers manage session attendance" on attendance_records
  for all using (
    auth.uid() in (
      select teacher_id from attendance_sessions
      where attendance_sessions.id = attendance_records.session_id
    )
  );

-- HODs can read attendance in their department
create policy "HODs read department attendance" on attendance_records
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'hod'
      and u.is_active = true
      and u.department_id = (
        select u.department_id 
        from users u
        where u.id = attendance_records.student_id
      )
    )
  );

-- Admins can read all attendance in their college
create policy "Admins read college attendance" on attendance_records
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = (
        select u.college_id 
        from users u
        where u.id = attendance_records.student_id
      )
    )
  );

-- =============================================================================
-- NOTIFICATIONS TABLE POLICIES
-- =============================================================================

-- Users can read their own notifications
create policy "Users read own notifications" on notifications
  for select using (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
create policy "Users update own notifications" on notifications
  for update using (auth.uid() = user_id);

-- =============================================================================
-- AUDIT LOGS TABLE POLICIES
-- =============================================================================

-- Only admins can read audit logs (restricted to their college)
create policy "Admins read college audit logs" on audit_logs
  for select using (
    auth.uid() in (
      select id from users u
      where u.role = 'admin'
      and u.is_active = true
      and u.college_id = (
        select u.college_id 
        from users u
        where u.id = audit_logs.actor_id
      )
    )
  );

-- No insert/update/delete policies for audit logs (system-managed)

-- =============================================================================
-- SIGNUP REQUESTS TABLE POLICIES (if exists)
-- =============================================================================

-- Note: This assumes a signup_requests table exists from migration 0003
-- Adjust if the actual table structure is different

do $$
begin
  -- Check if signup_requests table exists
  if exists (select 1 from information_schema.tables where table_name = 'signup_requests') then
    
    -- Drop existing policies if any
    drop policy if exists "Public read signup requests" on signup_requests;
    drop policy if exists "Admins manage signup requests" on signup_requests;
    
    -- HODs can read signup requests for their department
    create policy "HODs read department signup requests" on signup_requests
      for select using (
        auth.uid() in (
          select id from users u
          where u.role = 'hod'
          and u.is_active = true
          and u.department_id = signup_requests.department_id
        )
      );
    
    -- Admins can read and manage signup requests in their college
    create policy "Admins manage college signup requests" on signup_requests
      for all using (
        auth.uid() in (
          select id from users u
          where u.role = 'admin'
          and u.is_active = true
          and u.college_id = signup_requests.college_id
        )
      );
    
    -- Users can read their own signup requests
    create policy "Users read own signup requests" on signup_requests
      for select using (auth.uid() = email); -- Assuming email is used as identifier
    
  end if;
end $$;

-- =============================================================================
-- SECURITY POLICY COMMENTS
-- =============================================================================

comment on policy "Users read own profile" on users is 'Users can only read their own user profile';
comment on policy "Students read college mates" on users is 'Students can read basic info of other students in same college/department';
comment on policy "Teachers read college users" on users is 'Teachers can read students and teachers in their college/department';
comment on policy "HODs read department users" on users is 'HODs can read all users in their department';
comment on policy "Admins read college users" on users is 'Admins can read all users in their college';

comment on policy "Students read own attendance" on attendance_records is 'Students can only read their own attendance records';
comment on policy "Teachers manage session attendance" on attendance_records is 'Teachers can read and update attendance for their own sessions only';
comment on policy "HODs read department attendance" on attendance_records is 'HODs can read attendance records for their department';
comment on policy "Admins read college attendance" on attendance_records is 'Admins can read all attendance records in their college';

comment on policy "Admins read college audit logs" on audit_logs is 'Only admins can read audit logs, restricted to their college';

-- Add function to check RLS policy effectiveness
create or replace function test_rls_policies() returns table(
  table_name text,
  policy_count integer,
  has_select_policy boolean,
  has_insert_policy boolean,
  has_update_policy boolean,
  has_delete_policy boolean
) language sql
security definer
as $$
select 
  t.table_name,
  count(p.policyname) as policy_count,
  bool_or(p.cmd = 'SELECT') as has_select_policy,
  bool_or(p.cmd = 'INSERT') as has_insert_policy,
  bool_or(p.cmd = 'UPDATE') as has_update_policy,
  bool_or(p.cmd = 'DELETE') as has_delete_policy
from information_schema.tables t
left join pg_policies p on p.tablename = t.table_name
where t.table_schema = 'public'
  and t.table_name in (
    'colleges', 'users', 'departments', 'subjects', 
    'subject_assignments', 'student_enrollments', 'timetable',
    'attendance_sessions', 'attendance_records', 'notifications', 'audit_logs'
  )
group by t.table_name
order by t.table_name;
$$;
