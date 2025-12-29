---
layout: page
title: Posts
permalink: /posts/
---

<div class="post-list">
  {%- for post in site.posts -%}
    <article class="post-item">
      <h2 class="post-item-title"><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
      <div class="post-item-meta">{{ post.date | date: "%B %-d, %Y" }}</div>
      {%- if post.excerpt -%}
        <p class="post-item-excerpt">{{ post.excerpt | strip_html | strip_newlines | truncate: 220 }}</p>
      {%- endif -%}
    </article>
  {%- endfor -%}
</div>


