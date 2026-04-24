create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_path text not null,
  post_title text not null,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint comments_post_path_length check (char_length(trim(post_path)) between 1 and 180),
  constraint comments_post_title_length check (char_length(trim(post_title)) between 1 and 140),
  constraint comments_author_name_length check (char_length(trim(author_name)) between 1 and 40),
  constraint comments_body_length check (char_length(trim(body)) between 1 and 500)
);

create index if not exists comments_post_path_created_at_idx
on public.comments (post_path, created_at desc);

alter table public.comments enable row level security;

drop policy if exists "Public comments are readable" on public.comments;
create policy "Public comments are readable"
on public.comments for select
to anon, authenticated
using (true);

drop policy if exists "Public comments can be inserted" on public.comments;
create policy "Public comments can be inserted"
on public.comments for insert
to anon, authenticated
with check (
  char_length(trim(post_path)) between 1 and 180
  and char_length(trim(post_title)) between 1 and 140
  and char_length(trim(author_name)) between 1 and 40
  and char_length(trim(body)) between 1 and 500
);
