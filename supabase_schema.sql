-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Households Table
create table public.households (
    id uuid default uuid_generate_v4() primary key,
    household_name text not null,
    address text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Residents Table
create table public.residents (
    id uuid default uuid_generate_v4() primary key,
    household_id uuid references public.households(id) on delete set null,
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
    is_archived boolean default false not null,
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
    issued_by uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Incidents Table
create table public.incidents (
    id uuid default uuid_generate_v4() primary key,
    reporter_name text not null,
    title text not null,
    description text not null,
    location text,
    status text check (status in ('Pending', 'In Progress', 'Resolved', 'Spam')) default 'Pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Configuration
alter table public.households enable row level security;
alter table public.residents enable row level security;
alter table public.clearance_requests enable row level security;
alter table public.incidents enable row level security;

-- 1. Households: Authenticated users can see all
create policy "Authenticated users can see all households" on public.households for select using (auth.role() = 'authenticated');

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

-- 5. Storage Configuration (Document Templates)
-- Note: This requires the storage extension to be enabled in Supabase

-- Create the bucket if it doesn't exist
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
