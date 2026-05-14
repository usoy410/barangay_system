-- BARANGAY INFORMATION SYSTEM

-- Enable UUID extension
create extension if not exists "uuid-ossp";


-- 2. Residents Table
create table public.residents (
    id uuid default uuid_generate_v4() primary key,
    first_name text not null,
    middle_name text,
    last_name text not null,
    birth_date date not null,
    gender text check (gender in ('Male', 'Female', 'Other')),
    civil_status text check (civil_status in ('Single', 'Married', 'Widowed', 'Separated')),
    address text not null,
    mobile_number text not null unique,
    password_hash text,
    role text check (role in ('Resident', 'Official', 'Admin')) default 'Resident' not null,
    occupation text,
    profile_url text,
    is_archived boolean default false not null,
    updated_by uuid, -- Transit column for audit logs
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Clearance/Service Requests Table
create table public.clearance_requests (
    id uuid default uuid_generate_v4() primary key,
    resident_id uuid references public.residents(id) on delete cascade not null,
    type text check (type in ('Clearance', 'Indigency')) not null,
    purpose text not null,
    status text check (status in ('Pending', 'Issued', 'Void')) default 'Pending' not null,
    issued_at timestamp with time zone,
    issued_by uuid references public.residents(id),
    updated_by uuid, -- Transit column for audit logs
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Incidents Table
create table public.incidents (
    id uuid default uuid_generate_v4() primary key,
    resident_id uuid references public.residents(id) on delete set null,
    reporter_name text not null,
    title text not null,
    description text not null,
    location text,
    image_url text,
    status text check (status in ('Pending', 'In Progress', 'Resolved', 'Spam')) default 'Pending' not null,
    updated_by uuid, -- Transit column for audit logs
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Announcements Table
create table public.announcements (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    category text check (category in ('General', 'Emergency', 'Event', 'Holiday')) default 'General' not null,
    image_url text,
    is_active boolean default true not null,
    starts_at timestamp with time zone default timezone('utc'::text, now()),
    expires_at timestamp with time zone,
    updated_by uuid, -- Transit column for audit logs
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Configuration
alter table public.residents enable row level security;
alter table public.clearance_requests enable row level security;
alter table public.incidents enable row level security;
alter table public.announcements enable row level security;


-- 2. Residents: Public can register and look up, Auth (Officials) can manage
create policy "Anyone can register" on public.residents for insert with check (true);
create policy "Public can look up residents" on public.residents for select using (true);
create policy "Authenticated users can manage residents" on public.residents for all using (auth.role() = 'authenticated');

-- 3. Clearance Requests: Public can submit and track, Auth (Officials) can issue
create policy "Anyone can submit requests" on public.clearance_requests for insert with check (true);
create policy "Public can track requests" on public.clearance_requests for select using (true);
create policy "Authenticated users can manage requests" on public.clearance_requests for all using (auth.role() = 'authenticated');

-- 4. Incidents: Public can report and track, Auth (Officials) can manage
create policy "Anyone can report an incident" on public.incidents for insert with check (true);
create policy "Public can track incidents" on public.incidents for select using (true);
create policy "Authenticated users can manage incidents" on public.incidents for all using (auth.role() = 'authenticated');

-- 5. Announcements: Public can view, Auth can manage
create policy "Public can view announcements" on public.announcements for select using (true);
create policy "Authenticated users can manage announcements" on public.announcements for all using (auth.role() = 'authenticated');

-- Trigger for updated_at in residents
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_residents_updated_at
before update on public.residents
for each row execute procedure public.handle_updated_at();

create trigger set_announcements_updated_at
before update on public.announcements
for each row execute procedure public.handle_updated_at();


-- 8. Audit Logging System
-- This table tracks all modifications to sensitive data for accountability and DPA compliance.
create table public.audit_logs (
    id uuid default uuid_generate_v4() primary key,
    table_name text not null,
    record_id uuid not null,
    action text not null,
    old_data jsonb,
    new_data jsonb,
    changed_by uuid references public.residents(id), -- Tracks which admin/official made the change
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Audit Logs: Only admins and officials can see history
alter table public.audit_logs enable row level security;
create policy "Officials can view audit logs" on public.audit_logs for select using (
    exists (
        select 1 from public.residents 
        where id = auth.uid() 
        and role in ('Official', 'Admin')
    )
);



-- Automated Audit Function
create or replace function public.process_audit_log()
returns trigger as $$
declare
    current_user_id uuid;
begin
    -- 1. Try to get ID from the record itself (if we passed updated_by)
    if (TG_OP = 'UPDATE' or TG_OP = 'INSERT') then
        current_user_id := NEW.updated_by;
    end if;

    -- 2. Fallback to Supabase Auth or Session Variable
    if (current_user_id is null) then
        current_user_id := coalesce(
            auth.uid(), 
            nullif(current_setting('app.current_user_id', true), '')::uuid
        );
    end if;

    if (TG_OP = 'UPDATE') then
        insert into public.audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
        values (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), to_jsonb(NEW), current_user_id);
        return NEW;
    elsif (TG_OP = 'DELETE') then
        insert into public.audit_logs (table_name, record_id, action, old_data, changed_by)
        values (TG_TABLE_NAME, OLD.id, TG_OP, to_jsonb(OLD), current_user_id);
        return OLD;
    elsif (TG_OP = 'INSERT') then
        insert into public.audit_logs (table_name, record_id, action, new_data, changed_by)
        values (TG_TABLE_NAME, NEW.id, TG_OP, to_jsonb(NEW), current_user_id);
        return NEW;
    end if;
    return null;
end;
$$ language plpgsql security definer;

-- Helper to set the current user ID for the session (Custom Auth support)
create or replace function public.set_app_user_id(user_id uuid)
returns void as $$
begin
    perform set_config('app.current_user_id', user_id::text, true);
end;
$$ language plpgsql security definer;

-- Apply Audit Trigger to sensitive tables
create trigger audit_residents_changes
after insert or update or delete on public.residents
for each row execute procedure public.process_audit_log();

create trigger audit_requests_changes
after update or delete on public.clearance_requests
for each row execute procedure public.process_audit_log();

create trigger audit_incidents_changes
after insert or update or delete on public.incidents
for each row execute procedure public.process_audit_log();

create trigger audit_announcements_changes
after insert or update or delete on public.announcements
for each row execute procedure public.process_audit_log();


-- 5. Storage Configuration (Document Templates)

insert into storage.buckets (id, name, public)
values ('document-templates', 'document-templates', true)
on conflict (id) do nothing;

-- 6. Storage Policies
-- Allow public access to read templates
create policy "Templates are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'document-templates' );

-- Allow authenticated admins to manage templates
create policy "Admins can upload templates"
  on storage.objects for insert
  with check ( bucket_id = 'document-templates' );

create policy "Admins can update templates"
  on storage.objects for update
  using ( bucket_id = 'document-templates' );

create policy "Admins can delete templates"
  on storage.objects for delete
  using ( bucket_id = 'document-templates' );

-- 7. Incident Photos Bucket
insert into storage.buckets (id, name, public)
values ('incident-photos', 'incident-photos', true)
on conflict (id) do nothing;

create policy "Anyone can upload incident photos" on storage.objects for insert with check (bucket_id = 'incident-photos');
create policy "Anyone can view incident photos" on storage.objects for select using (bucket_id = 'incident-photos');
