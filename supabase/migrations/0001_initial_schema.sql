create extension if not exists "pgcrypto";

create type user_role as enum ('student', 'teacher', 'hod', 'admin');
create type session_status as enum ('active', 'closed', 'cancelled');
create type attendance_status as enum ('present', 'absent', 'late', 'excused');

create table colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  logo_url text,
  address text,
  attendance_threshold integer not null default 75,
  allow_self_registration boolean not null default false,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  college_id uuid references colleges(id) on delete cascade,
  department_id uuid,
  role user_role not null,
  name text not null,
  email text not null unique,
  phone text,
  roll_number text,
  employee_id text,
  profile_photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table departments (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references colleges(id) on delete cascade,
  name text not null,
  code text not null,
  hod_id uuid references users(id),
  created_at timestamptz not null default now(),
  unique (college_id, code)
);

alter table users add constraint users_department_id_fkey foreign key (department_id) references departments(id);

create table subjects (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references colleges(id) on delete cascade,
  department_id uuid not null references departments(id) on delete cascade,
  name text not null,
  code text not null,
  semester integer not null,
  year integer not null,
  credit_hours integer not null default 3,
  created_at timestamptz not null default now(),
  unique (college_id, code)
);

create table subject_assignments (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects(id) on delete cascade,
  teacher_id uuid not null references users(id) on delete cascade,
  academic_year text not null,
  semester integer not null,
  section text not null
);

create table student_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references users(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  academic_year text not null,
  semester integer not null,
  section text not null,
  enrolled_at timestamptz not null default now(),
  unique (student_id, subject_id, academic_year, semester, section)
);

create table timetable (
  id uuid primary key default gen_random_uuid(),
  subject_assignment_id uuid not null references subject_assignments(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 1 and 7),
  start_time time not null,
  end_time time not null,
  room text not null
);

create table attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  subject_assignment_id uuid not null references subject_assignments(id) on delete cascade,
  teacher_id uuid not null references users(id) on delete cascade,
  date date not null default current_date,
  start_time timestamptz not null default now(),
  end_time timestamptz,
  qr_token uuid not null default gen_random_uuid(),
  qr_expires_at timestamptz not null default now() + interval '30 seconds',
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  radius_meters integer not null default 100,
  status session_status not null default 'active',
  created_at timestamptz not null default now()
);

create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references attendance_sessions(id) on delete cascade,
  student_id uuid not null references users(id) on delete cascade,
  status attendance_status not null default 'present',
  marked_at timestamptz not null default now(),
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  device_fingerprint text,
  ip_address inet,
  is_proxy_flagged boolean not null default false,
  manually_overridden boolean not null default false,
  override_reason text,
  override_by uuid references users(id),
  unique (session_id, student_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_val jsonb,
  new_val jsonb,
  created_at timestamptz not null default now()
);

alter table colleges enable row level security;
alter table users enable row level security;
alter table departments enable row level security;
alter table subjects enable row level security;
alter table subject_assignments enable row level security;
alter table student_enrollments enable row level security;
alter table timetable enable row level security;
alter table attendance_sessions enable row level security;
alter table attendance_records enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

create policy "Users can read their profile" on users for select using (auth.uid() = id);
create policy "Students read own attendance" on attendance_records for select using (auth.uid() = student_id);
create policy "Teachers manage own sessions" on attendance_sessions for all using (auth.uid() = teacher_id);
create policy "Teachers read records for own sessions" on attendance_records for select using (
  exists (
    select 1 from attendance_sessions
    where attendance_sessions.id = attendance_records.session_id
    and attendance_sessions.teacher_id = auth.uid()
  )
);
create policy "Users read notifications" on notifications for select using (auth.uid() = user_id);
