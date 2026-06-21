-- RenoTrack tasks

create table reno_tasks (
  id              text primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  notes           text not null default '',
  assigned_to     text,
  due_date        text,
  date_completed  text,
  status          text not null default 'Not Started',
  created_at      timestamptz default now()
);

alter table reno_tasks enable row level security;
create policy "own reno_tasks" on reno_tasks for all using (auth.uid() = user_id);
create index on reno_tasks (user_id, created_at);
