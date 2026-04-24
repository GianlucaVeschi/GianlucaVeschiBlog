# Gianluca Veschi Blog (Jekyll)

A personal blog featuring reflections on software engineering, personal growth, and life. Built with Jekyll and deployed to GitHub Pages, this site powers www.gianlucaveschi.com.

## Run locally

From this repo root:

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open `http://127.0.0.1:4000`.

## Deploy to GitHub Pages

This repo is configured to deploy via **GitHub Actions** on every push to `main`.

In GitHub:

- Go to **Settings → Pages**
- Under **Build and deployment**, set **Source** to **GitHub Actions**

### Custom domain

This repo includes a `CNAME` file for:

`www.gianlucaveschi.com`

In your DNS (GoDaddy), set:

- **CNAME**: `www` → `GianlucaVeschi.github.io`

Then in **Settings → Pages → Custom domain**, set it to `www.gianlucaveschi.com` and enable **Enforce HTTPS**.

### Default URL (without custom domain)

Your site will also be available at:

`https://GianlucaVeschi.github.io/GianlucaVeschiBlog/`

## Writing posts

Create files in `_posts/` named like:

`YYYY-MM-DD-title.md`

## Notion (later)

You can export pages from Notion as Markdown and place them into `_posts/`.
We'll add an importer script later to automate this.

## Comments

The site includes a no-login comments section for posts. Because this is a static Jekyll site, public comments need an external store; the implementation uses Supabase with public read/insert policies and client-side validation.

1. Create a Supabase project.
2. In the Supabase SQL editor, run [`supabase/comments.sql`](./supabase/comments.sql).
3. Copy your project URL and anon key into `comments.supabase.url` and `comments.supabase.anon_key` in [`_config.yml`](./_config.yml).
4. Set `comments.enabled: true` in [`_config.yml`](./_config.yml).

Notes:

- On `localhost`, if Supabase is not configured yet, the form falls back to `localStorage` so you can preview the UI without a backend.
- The current limits are `40` characters for the name and `500` for the comment body.
- Add `comments: false` in a post front matter block if you want to hide comments on a specific post.
- Public no-login comments can attract spam. This implementation includes a honeypot field plus database-side length checks, but heavier moderation/rate-limiting would need a small server-side layer later.
