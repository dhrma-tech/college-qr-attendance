create type signup_status as enum ('pending', 'approved', 'rejected');

create table signup_requests (
  id uuid primary key default gen_random_uuid(),
  requested_role user_role not null,
  status signup_status not null default 'pending',
  full_name text not null,
  email text not null,
  mobile_number text not null,
  department text,
  branch text,
  year text,
  semester text,
  division text,
  batch text,
  roll_number text,
  employee_id text,
  designation text,
  subjects_taught text,
  classes_assigned text,
  leadership_role text,
  parent_mobile_number text,
  address text,
  emergency_contact text,
  profile_photo_url text,
  office_location text,
  cabin_room_number text,
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);

create table academic_structure_items (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  item_type text not null check (item_type in ('department', 'branch', 'year', 'semester', 'division', 'batch', 'subject')),
  label text not null,
  code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (college_id, item_type, label)
);

create table attendance_rule_sets (
  id uuid primary key default gen_random_uuid(),
  college_id uuid references colleges(id) on delete cascade,
  name text not null default 'Default attendance rules',
  lecture_duration_minutes integer not null default 50,
  qr_expiry_seconds integer not null default 30,
  late_after_minutes integer not null default 10,
  minimum_percentage integer not null default 75,
  geofence_radius_meters integer not null default 100,
  proxy_qr_rotation boolean not null default true,
  proxy_geofence boolean not null default true,
  proxy_device_fingerprint boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_signup_requests_status_role on signup_requests(status, requested_role);
create index if not exists idx_signup_requests_department on signup_requests(department);
create index if not exists idx_academic_structure_items_type on academic_structure_items(college_id, item_type, is_active);
create index if not exists idx_attendance_rule_sets_college on attendance_rule_sets(college_id);

alter table signup_requests enable row level security;
alter table academic_structure_items enable row level security;
alter table attendance_rule_sets enable row level security;

create policy "Public can create signup requests" on signup_requests
for insert
with check (true);

create policy "Admins can read signup requests" on signup_requests
for select
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.role in ('admin', 'hod')
  )
);

create policy "Admins manage academic structure" on academic_structure_items
for all
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.role = 'admin'
  )
);

create policy "Admins manage attendance rules" on attendance_rule_sets
for all
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.role = 'admin'
  )
);

create or replace view pending_account_approvals as
select
  id,
  requested_role,
  full_name,
  email,
  mobile_number,
  department,
  branch,
  year,
  semester,
  division,
  batch,
  employee_id,
  designation,
  leadership_role,
  created_at
from signup_requests
where status = 'pending'
order by created_at asc;
