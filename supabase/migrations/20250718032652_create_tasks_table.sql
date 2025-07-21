create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'in-progress', 'done')) default 'pending',
  extras jsonb,
  inserted_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can access their own tasks"
on tasks for all
using (auth.uid() = user_id);