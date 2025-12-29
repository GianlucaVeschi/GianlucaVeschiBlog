---
layout: default
title:
---

<div class="site-header-container has-cover" style="background-image: url({{ '/assets/header_image.jpg' | relative_url }});">
  <div class="scrim has-cover">
    <header class="site-header">
      <h1 class="title">{{ site.description }}</h1>
      <p class="subtitle">{{ site.title }}</p>
    </header>
  </div>
</div>

<section class="section">
  <h2 class="section-title">Latest posts</h2>
  <div class="post-list">
    {%- assign latest = site.posts | slice: 0, 8 -%}
    {%- for post in latest -%}
      <article class="post-item">
        <h3 class="post-item-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
        <div class="post-item-meta">{{ post.date | date: "%B %-d, %Y" }}</div>
        {%- if post.excerpt -%}
          <p class="post-item-excerpt">{{ post.excerpt | strip_html | strip_newlines | truncate: 180 }}</p>
        {%- endif -%}
      </article>
    {%- endfor -%}
  </div>

  <p class="more">
    <a href="{{ '/posts' | relative_url }}">View all posts →</a>
  </p>
</section>


