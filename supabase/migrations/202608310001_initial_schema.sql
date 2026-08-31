-- Teacher Internship System: initial database schema and authorization policies.
-- Run this migration on a new Supabase project.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'student', 'supervisor', 'school');
create type public.placement_status as enum ('pending', 'approved', 'active', 'completed', 'cancelled');
create type public.visit_type as enum ('onsite', 'online');
create type public.record_status as enum ('draft', 'submitted');
create type public.evaluator_type as enum ('supervisor', 'school');
create type public.evaluation_status as enum ('draft', 'submitted', 'published');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role public.user_role not null default 'student',
  full_name text not null default '',
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_email_lower_idx on public.profiles (lower(email));
create index profiles_role_idx on public.profiles (role);

create table public.student_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  student_code text not null unique,
  program_name text not null,
  year_level smallint not null check (year_level between 1 and 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null default '',
  district text not null default '',
  province text not null default '',
  postal_code text,
  contact_name text,
  contact_phone text,
  contact_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index schools_name_idx on public.schools (name);
create index schools_province_idx on public.schools (province);

create table public.school_memberships (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, school_id)
);

create index school_memberships_school_idx on public.school_memberships (school_id);

create table public.academic_terms (
  id uuid primary key default gen_random_uuid(),
  academic_year integer not null check (academic_year between 2500 and 3000),
  semester smallint not null check (semester between 1 and 3),
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (academic_year, semester),
  check (end_date >= start_date)
);

create unique index academic_terms_one_active_idx
  on public.academic_terms (is_active)
  where is_active;

create table public.placements (
  id uuid primary key default gen_random_uuid(),
  term_id uuid not null references public.academic_terms (id) on delete restrict,
  student_id uuid not null references public.profiles (id) on delete restrict,
  school_id uuid not null references public.schools (id) on delete restrict,
  supervisor_id uuid not null references public.profiles (id) on delete restrict,
  start_date date not null,
  end_date date not null,
  status public.placement_status not null default 'pending',
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (term_id, student_id),
  check (student_id <> supervisor_id),
  check (end_date >= start_date)
);

create index placements_student_idx on public.placements (student_id);
create index placements_supervisor_idx on public.placements (supervisor_id);
create index placements_school_idx on public.placements (school_id);
create index placements_term_idx on public.placements (term_id);

create table public.supervision_visits (
  id uuid primary key default gen_random_uuid(),
  placement_id uuid not null references public.placements (id) on delete cascade,
  supervisor_id uuid not null references public.profiles (id) on delete restrict,
  visit_date date not null,
  visit_type public.visit_type not null,
  status public.record_status not null default 'draft',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index supervision_visits_placement_idx on public.supervision_visits (placement_id);
create index supervision_visits_supervisor_idx on public.supervision_visits (supervisor_id);

create table public.evaluations (
  id uuid primary key default gen_random_uuid(),
  placement_id uuid not null references public.placements (id) on delete cascade,
  evaluator_id uuid not null references public.profiles (id) on delete restrict,
  evaluator_type public.evaluator_type not null,
  teaching_score numeric(5, 2) check (teaching_score between 0 and 100),
  classroom_score numeric(5, 2) check (classroom_score between 0 and 100),
  responsibility_score numeric(5, 2) check (responsibility_score between 0 and 100),
  ethics_score numeric(5, 2) check (ethics_score between 0 and 100),
  comments text not null default '',
  status public.evaluation_status not null default 'draft',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (placement_id, evaluator_type),
  check (
    status = 'draft'
    or (
      teaching_score is not null
      and classroom_score is not null
      and responsibility_score is not null
      and ethics_score is not null
    )
  )
);

create index evaluations_placement_idx on public.evaluations (placement_id);
create index evaluations_evaluator_idx on public.evaluations (evaluator_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger student_profiles_set_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

create trigger schools_set_updated_at
before update on public.schools
for each row execute function public.set_updated_at();

create trigger academic_terms_set_updated_at
before update on public.academic_terms
for each row execute function public.set_updated_at();

create trigger placements_set_updated_at
before update on public.placements
for each row execute function public.set_updated_at();

create trigger supervision_visits_set_updated_at
before update on public.supervision_visits
for each row execute function public.set_updated_at();

create trigger evaluations_set_updated_at
before update on public.evaluations
for each row execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.profiles
  where id = (select auth.uid())
    and is_active;
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select public.current_user_role()) = 'admin', false);
$$;

create function public.is_school_member(target_school_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.school_memberships
    where profile_id = (select auth.uid())
      and school_id = target_school_id
  );
$$;

revoke all on function public.current_user_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_school_member(uuid) from public;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_school_member(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.schools enable row level security;
alter table public.school_memberships enable row level security;
alter table public.academic_terms enable row level security;
alter table public.placements enable row level security;
alter table public.supervision_visits enable row level security;
alter table public.evaluations enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.student_profiles from anon, authenticated;
revoke all on table public.schools from anon, authenticated;
revoke all on table public.school_memberships from anon, authenticated;
revoke all on table public.academic_terms from anon, authenticated;
revoke all on table public.placements from anon, authenticated;
revoke all on table public.supervision_visits from anon, authenticated;
revoke all on table public.evaluations from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on table public.profiles to authenticated;
grant select, insert, update on table public.student_profiles to authenticated;
grant select, insert, update, delete on table public.schools to authenticated;
grant select, insert, delete on table public.school_memberships to authenticated;
grant select, insert, update, delete on table public.academic_terms to authenticated;
grant select, insert, update, delete on table public.placements to authenticated;
grant select, insert, update, delete on table public.supervision_visits to authenticated;
grant select, insert, update, delete on table public.evaluations to authenticated;

create policy profiles_select
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (select public.is_admin())
  or exists (
    select 1 from public.placements p
    where p.supervisor_id = (select auth.uid())
      and p.student_id = profiles.id
  )
  or exists (
    select 1 from public.placements p
    where p.student_id = (select auth.uid())
      and p.supervisor_id = profiles.id
  )
  or exists (
    select 1 from public.placements p
    where p.student_id = profiles.id
      and (select public.is_school_member(p.school_id))
  )
);

create policy profiles_update
on public.profiles for update
to authenticated
using (id = (select auth.uid()) or (select public.is_admin()))
with check (id = (select auth.uid()) or (select public.is_admin()));

create policy student_profiles_select
on public.student_profiles for select
to authenticated
using (
  profile_id = (select auth.uid())
  or (select public.is_admin())
  or exists (
    select 1 from public.placements p
    where p.student_id = student_profiles.profile_id
      and p.supervisor_id = (select auth.uid())
  )
  or exists (
    select 1 from public.placements p
    where p.student_id = student_profiles.profile_id
      and (select public.is_school_member(p.school_id))
  )
);

create policy student_profiles_insert
on public.student_profiles for insert
to authenticated
with check (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy student_profiles_update
on public.student_profiles for update
to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()))
with check (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy schools_select
on public.schools for select
to authenticated
using (true);

create policy schools_admin_insert
on public.schools for insert
to authenticated
with check ((select public.is_admin()));

create policy schools_admin_update
on public.schools for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy schools_admin_delete
on public.schools for delete
to authenticated
using ((select public.is_admin()));

create policy school_memberships_select
on public.school_memberships for select
to authenticated
using (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy school_memberships_admin_insert
on public.school_memberships for insert
to authenticated
with check ((select public.is_admin()));

create policy school_memberships_admin_delete
on public.school_memberships for delete
to authenticated
using ((select public.is_admin()));

create policy academic_terms_select
on public.academic_terms for select
to authenticated
using (true);

create policy academic_terms_admin_insert
on public.academic_terms for insert
to authenticated
with check ((select public.is_admin()));

create policy academic_terms_admin_update
on public.academic_terms for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy academic_terms_admin_delete
on public.academic_terms for delete
to authenticated
using ((select public.is_admin()));

create policy placements_select
on public.placements for select
to authenticated
using (
  (select public.is_admin())
  or student_id = (select auth.uid())
  or supervisor_id = (select auth.uid())
  or (select public.is_school_member(school_id))
);

create policy placements_admin_insert
on public.placements for insert
to authenticated
with check ((select public.is_admin()));

create policy placements_admin_update
on public.placements for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy placements_admin_delete
on public.placements for delete
to authenticated
using ((select public.is_admin()));

create policy supervision_visits_select
on public.supervision_visits for select
to authenticated
using (
  (select public.is_admin())
  or supervisor_id = (select auth.uid())
  or exists (
    select 1 from public.placements p
    where p.id = supervision_visits.placement_id
      and p.student_id = (select auth.uid())
  )
);

create policy supervision_visits_insert
on public.supervision_visits for insert
to authenticated
with check (
  (select public.is_admin())
  or (
    supervisor_id = (select auth.uid())
    and exists (
      select 1 from public.placements p
      where p.id = supervision_visits.placement_id
        and p.supervisor_id = (select auth.uid())
    )
  )
);

create policy supervision_visits_update
on public.supervision_visits for update
to authenticated
using (
  (select public.is_admin())
  or (
    supervisor_id = (select auth.uid())
    and status = 'draft'
  )
)
with check (
  (select public.is_admin())
  or (
    supervisor_id = (select auth.uid())
    and exists (
      select 1 from public.placements p
      where p.id = supervision_visits.placement_id
        and p.supervisor_id = (select auth.uid())
    )
  )
);

create policy supervision_visits_delete
on public.supervision_visits for delete
to authenticated
using (
  (select public.is_admin())
  or (supervisor_id = (select auth.uid()) and status = 'draft')
);

create policy evaluations_select
on public.evaluations for select
to authenticated
using (
  (select public.is_admin())
  or evaluator_id = (select auth.uid())
  or exists (
    select 1 from public.placements p
    where p.id = evaluations.placement_id
      and p.student_id = (select auth.uid())
      and evaluations.status = 'published'
  )
  or (
    evaluator_type = 'school'
    and exists (
      select 1 from public.placements p
      where p.id = evaluations.placement_id
        and (select public.is_school_member(p.school_id))
    )
  )
);

create policy evaluations_insert
on public.evaluations for insert
to authenticated
with check (
  (select public.is_admin())
  or (
    evaluator_id = (select auth.uid())
    and evaluator_type = 'supervisor'
    and exists (
      select 1 from public.placements p
      where p.id = evaluations.placement_id
        and p.supervisor_id = (select auth.uid())
    )
  )
  or (
    evaluator_id = (select auth.uid())
    and
    evaluator_type = 'school'
    and exists (
      select 1 from public.placements p
      where p.id = evaluations.placement_id
        and (select public.is_school_member(p.school_id))
    )
  )
);

create policy evaluations_update
on public.evaluations for update
to authenticated
using (
  (select public.is_admin())
  or (evaluator_id = (select auth.uid()) and status = 'draft')
)
with check (
  (select public.is_admin())
  or (
    evaluator_type = 'supervisor'
    and evaluator_id = (select auth.uid())
    and exists (
      select 1 from public.placements p
      where p.id = evaluations.placement_id
        and p.supervisor_id = (select auth.uid())
    )
  )
  or (
    evaluator_id = (select auth.uid())
    and evaluator_type = 'school'
    and exists (
      select 1 from public.placements p
      where p.id = evaluations.placement_id
        and (select public.is_school_member(p.school_id))
    )
  )
);

create policy evaluations_delete
on public.evaluations for delete
to authenticated
using (
  (select public.is_admin())
  or (evaluator_id = (select auth.uid()) and status = 'draft')
);
