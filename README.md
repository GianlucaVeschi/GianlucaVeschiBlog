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
