-- LinkedJob database schema, Row Level Security and storage rules.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run on an empty project; it is not written to be an incremental migration.

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type public.verification_status as enum ('pending', 'verified', 'rejected');
create type public.request_status as enum ('pending', 'accepted', 'rejected');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per job seeker. Created by the on-signup trigger below.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 100),
  headline text not null default '' check (char_length(headline) <= 120),
  location text not null default '' check (char_length(location) <= 120),
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  bio text not null default '' check (char_length(bio) <= 1000),
  skills text[] not null default '{}' check (cardinality(skills) <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per company. verification is changed by an administrator only.
create table public.companies (
  id uuid primary key references auth.users (id) on delete cascade,
  company_name text not null check (char_length(company_name) between 1 and 120),
  ipa_number text not null unique check (ipa_number ~ '^[A-Z0-9][A-Z0-9/-]{3,24}$'),
  industry text not null default '' check (char_length(industry) <= 80),
  location text not null default '' check (char_length(location) <= 120),
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  about text not null default '' check (char_length(about) <= 1000),
  website text not null default '' check (char_length(website) <= 200),
  verification public.verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A job seeker owns many documents (1 : N). The file itself lives in Storage.
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 80),
  file_name text not null check (char_length(file_name) <= 255),
  storage_path text not null unique,
  mime_type text not null,
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 5242880),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_owner_idx on public.documents (owner_id);

-- A company asks a job seeker for access to their documents (N : M through this table).
create table public.access_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default auth.uid() references public.companies (id) on delete cascade,
  individual_id uuid not null references public.profiles (id) on delete cascade,
  message text not null default '' check (char_length(message) <= 500),
  status public.request_status not null default 'pending',
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index access_requests_company_idx on public.access_requests (company_id);
create index access_requests_individual_idx on public.access_requests (individual_id);
-- A company can have only one open request per candidate.
create unique index one_pending_request_per_pair
  on public.access_requests (company_id, individual_id)
  where status = 'pending';

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so policies can look across tables safely)
-- ---------------------------------------------------------------------------
create function public.is_verified_company()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.companies
    where id = auth.uid() and verification = 'verified'
  );
$$;

create function public.has_accepted_access(owner uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.access_requests
    where company_id = auth.uid() and individual_id = owner and status = 'accepted'
  );
$$;

-- Lets the sign-up form say "already registered" before an account is created.
create function public.ipa_number_available(candidate text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (
    select 1 from public.companies where ipa_number = upper(trim(candidate))
  );
$$;
grant execute on function public.ipa_number_available(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

-- Creates the profile or company row when someone signs up. The app passes
-- account_type, full_name, company_name and ipa_number as sign-up metadata.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.raw_user_meta_data ->> 'account_type' = 'company' then
    insert into public.companies (id, company_name, ipa_number)
    values (
      new.id,
      trim(coalesce(new.raw_user_meta_data ->> 'company_name', '')),
      upper(trim(coalesce(new.raw_user_meta_data ->> 'ipa_number', '')))
    );
  else
    insert into public.profiles (id, full_name)
    values (
      new.id,
      coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'New user')
    );
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger companies_touch before update on public.companies
  for each row execute function public.touch_updated_at();
create trigger documents_touch before update on public.documents
  for each row execute function public.touch_updated_at();
create trigger access_requests_touch before update on public.access_requests
  for each row execute function public.touch_updated_at();

-- A signed-in user can never change their own IPA number or verification status.
-- auth.uid() is null when an administrator runs SQL in the dashboard, so admins can.
create function public.protect_company_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is not null then
    new.ipa_number := old.ipa_number;
    new.verification := old.verification;
  end if;
  return new;
end;
$$;

create trigger companies_protect before update on public.companies
  for each row execute function public.protect_company_fields();

-- Enforces who may change what on a request:
--   company   -> only the message, and only while the request is pending
--   candidate -> only the decision (accepted or rejected), once
create function public.guard_request_update()
returns trigger
language plpgsql
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if new.company_id <> old.company_id
     or new.individual_id <> old.individual_id
     or new.created_at <> old.created_at then
    raise exception 'The parties to a request cannot be changed';
  end if;

  if auth.uid() = old.company_id then
    if old.status <> 'pending' then
      raise exception 'Only pending requests can be edited';
    end if;
    if new.status <> old.status or new.responded_at is distinct from old.responded_at then
      raise exception 'Only the candidate can respond to a request';
    end if;
  elsif auth.uid() = old.individual_id then
    if old.status <> 'pending' then
      raise exception 'You have already responded to this request';
    end if;
    if new.status not in ('accepted', 'rejected') then
      raise exception 'A response must be accepted or rejected';
    end if;
    if new.message <> old.message then
      raise exception 'You cannot edit the company''s message';
    end if;
    new.responded_at := now();
  end if;

  return new;
end;
$$;

create trigger access_requests_guard before update on public.access_requests
  for each row execute function public.guard_request_update();

-- ---------------------------------------------------------------------------
-- Row Level Security: nothing is readable or writable unless a policy allows it
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.documents enable row level security;
alter table public.access_requests enable row level security;

-- profiles: your own row, or any row if you are a verified company.
-- There is no insert policy on purpose: rows are created by the sign-up trigger.
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_verified_company());
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- companies: company details are public to signed-in users; only the owner edits.
create policy companies_select on public.companies
  for select to authenticated
  using (true);
create policy companies_update_own on public.companies
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- documents: private to the owner until a request is accepted.
create policy documents_select on public.documents
  for select to authenticated
  using (owner_id = auth.uid() or public.has_accepted_access(owner_id));
create policy documents_insert_own on public.documents
  for insert to authenticated
  with check (owner_id = auth.uid());
create policy documents_update_own on public.documents
  for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy documents_delete_own on public.documents
  for delete to authenticated
  using (owner_id = auth.uid());

-- access_requests: only the two parties see a request.
create policy requests_select_parties on public.access_requests
  for select to authenticated
  using (company_id = auth.uid() or individual_id = auth.uid());
create policy requests_insert_verified_company on public.access_requests
  for insert to authenticated
  with check (
    company_id = auth.uid()
    and public.is_verified_company()
    and status = 'pending'
    and responded_at is null
  );
create policy requests_update_parties on public.access_requests
  for update to authenticated
  using (company_id = auth.uid() or individual_id = auth.uid())
  with check (company_id = auth.uid() or individual_id = auth.uid());
create policy requests_delete_own_pending on public.access_requests
  for delete to authenticated
  using (company_id = auth.uid() and status = 'pending');

-- ---------------------------------------------------------------------------
-- Storage: a private bucket; files live under <user id>/<file>
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy documents_files_insert_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy documents_files_select_own_or_granted on storage.objects
  for select to authenticated
  using (
    bucket_id = 'documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.has_accepted_access(((storage.foldername(name))[1])::uuid)
    )
  );
create policy documents_files_update_own on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy documents_files_delete_own on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
