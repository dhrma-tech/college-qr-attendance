insert into colleges (id, name, code, address, attendance_threshold, allow_self_registration)
values ('00000000-0000-0000-0000-000000000001', 'Riverside Institute of Technology', 'RIT', 'Main Campus, Knowledge Park', 75, false)
on conflict (code) do nothing;

-- Create matching Supabase Auth users first, then insert profile rows with their auth UUIDs.
-- This seed keeps institution data ready without shipping real student records.
