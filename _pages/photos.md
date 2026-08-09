---
permalink: /photos/
title: "Photos"
author_profile: true
---

<style>
.photo-wall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 1em;
}
.photo-wall figure {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.photo-wall figure:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}
.photo-wall img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}
.photo-wall figcaption {
  padding: 10px 14px;
  font-size: 0.9em;
  color: var(--global-text-color, #555);
  text-align: center;
}
</style>

<div class="photo-wall">
  <figure>
    <img src="/images/quleda-drink.jpg" alt="芝芝绿妍茶后" loading="lazy" />
    <figcaption>QULEDA 芝芝绿妍茶后 🍵 · August 5, 2026</figcaption>
  </figure>
</div>
