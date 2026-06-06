-- Propel My Life — initial schema

create extension if not exists "uuid-ossp";

-- Habits
create table habits (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  glyph       text not null,
  color_from  text not null,
  color_to    text not null,
  name        text not null,
  meta        text not null default '',
  streak      int  not null default 0,
  done        bool not null default false,
  sort_order  int  not null default 0,
  created_at  timestamptz default now()
);

-- Habit completions (one row per habit per day)
create table habit_completions (
  id         uuid primary key default uuid_generate_v4(),
  habit_id   uuid not null references habits(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  date       date not null default current_date,
  unique(habit_id, date)
);

-- Reminders
create table reminders (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  glyph      text not null,
  title      text not null,
  sub        text not null default '',
  days       int  not null default 30,
  cat        text not null default 'Renewal',
  auto_nudge bool not null default true,
  created_at timestamptz default now()
);

-- Tasks
create table tasks (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  description text not null default '',
  status     text not null default 'Not Started',
  due_date   text not null default '',
  priority   text not null default 'Med',
  pillar     text not null default '',
  sort_order int  not null default 0,
  created_at timestamptz default now()
);

-- Subtasks
create table subtasks (
  id         uuid primary key default uuid_generate_v4(),
  task_id    uuid not null references tasks(id) on delete cascade,
  text       text not null,
  done       bool not null default false,
  due_date   text not null default '',
  sort_order int  not null default 0
);

-- User settings
create table user_settings (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  auto_remind  bool not null default true,
  theme        text not null default 'aurora',
  density      text not null default 'cozy',
  updated_at   timestamptz default now()
);

-- RLS
alter table habits           enable row level security;
alter table habit_completions enable row level security;
alter table reminders        enable row level security;
alter table tasks            enable row level security;
alter table subtasks         enable row level security;
alter table user_settings    enable row level security;

-- Policies: users can only access their own data
create policy "own habits"     on habits            for all using (auth.uid() = user_id);
create policy "own completions" on habit_completions for all using (auth.uid() = user_id);
create policy "own reminders"  on reminders         for all using (auth.uid() = user_id);
create policy "own tasks"      on tasks             for all using (auth.uid() = user_id);
create policy "own subtasks"   on subtasks          for all
  using (exists (select 1 from tasks where tasks.id = subtasks.task_id and tasks.user_id = auth.uid()));
create policy "own settings"   on user_settings     for all using (auth.uid() = user_id);

-- Indexes
create index on habits           (user_id, sort_order);
create index on reminders        (user_id, days);
create index on tasks            (user_id, sort_order);
create index on subtasks         (task_id, sort_order);
create index on habit_completions (habit_id, date);
