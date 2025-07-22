create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text check (status in ('pending', 'in-progress', 'done')) default 'pending',
  extras jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default null
);

alter table tasks enable row level security;

create policy "Users can access their own tasks"
on tasks for all
using (auth.uid() = user_id);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  if row(new) is distinct from row(old) then
    new.updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on tasks
for each row
execute procedure update_updated_at_column();