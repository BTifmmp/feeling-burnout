create table moods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  inserted_at timestamptz default now(),
  updated_at timestamptz default now(),
  at_local_time_added timestamptz not null,  -- local time when entry added
  mood_value integer not null check (mood_value between 0 and 4),
  deleted boolean default false not null
);

create index on moods(user_id);

alter
  publication supabase_realtime add table moods;

alter table moods ENABLE row LEVEL SECURITY;

create policy "Users can create their own mood entries." on moods
for insert with check (auth.uid () = user_id);

create policy "Users can view their own mood entries." on moods
for select using (auth.uid () = user_id);

create policy "Users can update their own mood entries." on moods
for update using (auth.uid () = user_id);

create policy "Users can delete their own mood entries." on moods
for delete using (auth.uid () = user_id);

CREATE OR REPLACE FUNCTION handle_times()
    RETURNS trigger AS
    $$
    BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.inserted_at := now();
        NEW.updated_at := now();
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.inserted_at = OLD.inserted_at;
        NEW.updated_at = now();
    END IF;
    RETURN NEW;
    END;
    $$ language plpgsql;

CREATE TRIGGER handle_times
    BEFORE INSERT OR UPDATE ON moods
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();




create type badge as enum ('positive', 'neutral', 'negative');

create table journals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  inserted_at timestamptz default now(),
  updated_at timestamptz default now(),
  at_local_time_added timestamptz not null,  -- local time when entry added
  entry text not null check (length(entry) <= 5000),
  badge badge not null,
  deleted boolean default false not null
);

create index on journals(user_id);

alter publication supabase_realtime add table journals;

alter table journals ENABLE row LEVEL SECURITY;

create policy "Users can create their own journal entries." on journals
for insert with check (auth.uid () = user_id);

create policy "Users can view their own journal entries." on journals
for select using (auth.uid () = user_id);

create policy "Users can update their own journal entries." on journals
for update using (auth.uid () = user_id);

create policy "Users can delete their own journal entries." on journals
for delete using (auth.uid () = user_id);

CREATE TRIGGER handle_times
    BEFORE INSERT OR UPDATE ON journals
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();


create table goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  inserted_at timestamptz default now(),
  updated_at timestamptz default now(),
  at_local_time_added timestamptz not null, -- device-local timestamp
  text text not null check (length(text) <= 5000),
  deleted boolean default false not null
);

create index on goals(user_id);

alter publication supabase_realtime add table goals;

alter table goals enable row level security;

-- RLS policies
create policy "Users can create their own goal entries." on goals
for insert with check (auth.uid() = user_id);

create policy "Users can view their own goal entries." on goals
for select using (auth.uid() = user_id);

create policy "Users can update their own goal entries." on goals
for update using (auth.uid() = user_id);

create policy "Users can delete their own goal entries." on goals
for delete using (auth.uid() = user_id);

-- Trigger: handle insert/update timestamps
create trigger handle_times
before insert or update on goals
for each row execute procedure handle_times();