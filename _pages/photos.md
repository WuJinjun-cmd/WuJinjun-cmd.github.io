---
permalink: /travel/
title: "Travel"
author_profile: true
redirect_from:
  - /photos/
---

<style>
  .travel-page {
    --travel-ink: #243129;
    --travel-muted: #6d786f;
    --travel-surface: #f5f8f3;
    --travel-surface-strong: #ffffff;
    --travel-border: #dce6dd;
    --travel-ocean: #e8f0ee;
    --travel-land: #d4e2d5;
    --travel-land-shadow: #c4d8c7;
    --travel-route: #b77858;
    --travel-home: #2f7d62;
    --travel-school: #6b5b95;
    --travel-trip: #d66f5f;
    --travel-gold: #c68c3b;
    --travel-land-alt-a: #d9e6d9;
    --travel-land-alt-b: #cfe0d3;
    --travel-land-hover: #bed7c5;
    --travel-province-stroke: rgba(116, 151, 124, 0.72);
    --travel-province-stroke-hover: #527e61;
    --travel-grid-line: #9eb8b2;
    --travel-sea-label: #8ea9aa;
    --travel-control-ink: #222222;
    --travel-control-hover: #f2f2f2;
    --travel-callout-surface: rgba(255, 255, 255, 0.97);
    --travel-callout-ink: #222222;
    --travel-callout-muted: #5f675f;
    --travel-shadow: 0 12px 30px rgba(45, 69, 54, 0.07);
    color: var(--travel-ink);
  }

  .travel-language-switch {
    display: flex;
    justify-content: flex-end;
    gap: 0.35rem;
    margin: -0.45rem 0 0.85rem;
    position: relative;
    z-index: 3;
  }

  .travel-language-button {
    min-width: 2.7rem;
    padding: 4px 12px;
    border: 1.5px solid var(--travel-control-ink);
    border-radius: 4px;
    background: transparent;
    color: var(--travel-control-ink);
    cursor: pointer;
    font: inherit;
    font-size: 0.9em;
    font-weight: 700;
    line-height: 1.25;
  }

  .travel-language-button:hover,
  .travel-language-button:focus-visible,
  .travel-language-button.is-active {
    background: var(--travel-control-hover);
    color: var(--travel-control-ink);
    outline: none;
  }

  .travel-intro {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1.5rem;
    align-items: end;
    margin: 0 0 1.5rem;
  }

  .travel-eyebrow {
    margin: 0 0 0.45rem;
    color: var(--travel-route);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .travel-intro h2 {
    margin: 0;
    color: var(--travel-ink);
    font-size: clamp(1.7rem, 3.4vw, 2.5rem);
    letter-spacing: 0;
    line-height: 1.1;
  }

  .travel-page[lang="zh-CN"] .travel-intro h2 {
    font-size: clamp(1.42rem, 2.45vw, 1.82rem);
    white-space: nowrap;
  }

  .travel-intro p {
    max-width: 38rem;
    margin: 0.65rem 0 0;
    color: var(--travel-muted);
    font-size: 0.98rem;
  }

  .travel-stats {
    display: flex;
    gap: 1.2rem;
    align-items: flex-end;
    padding-bottom: 0.15rem;
  }

  .travel-stat {
    min-width: 4.5rem;
    padding-left: 1rem;
    border-left: 1px solid var(--travel-border);
  }

  .travel-stat strong {
    display: block;
    color: var(--travel-ink);
    font-size: 1.45rem;
    line-height: 1;
  }

  .travel-stat span {
    display: block;
    margin-top: 0.3rem;
    color: var(--travel-muted);
    font-size: 0.73rem;
    white-space: nowrap;
  }

  .travel-layout {
    display: block;
  }

  .travel-map-card,
  .travel-itinerary {
    overflow: hidden;
    border: 1px solid var(--travel-border);
    border-radius: 14px;
    background: var(--travel-surface-strong);
    box-shadow: var(--travel-shadow);
  }

  .travel-map-card {
    min-width: 0;
  }

  .travel-map-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 1rem 1.1rem 0.85rem;
    border-bottom: 1px solid var(--travel-border);
  }

  .travel-map-header strong {
    font-size: 0.98rem;
  }

  .travel-map-header span {
    color: var(--travel-muted);
    font-size: 0.76rem;
  }

  .travel-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem 0.8rem;
    margin: 0;
    padding: 0.8rem 1.1rem 0;
    color: var(--travel-muted);
    font-size: 0.73rem;
  }

  .travel-legend span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .travel-legend i {
    display: inline-flex;
    align-items: baseline;
    width: 0.58rem;
    height: 0.58rem;
    border-radius: 50%;
  }

  .travel-legend .legend-home { background: var(--travel-home); }
  .travel-legend .legend-school { background: var(--travel-school); }
  .travel-legend .legend-trip { background: var(--travel-trip); }

  .travel-map {
    position: relative;
    margin: 0.65rem;
    border-radius: 12px;
    background: var(--travel-ocean);
    isolation: isolate;
  }

  .travel-map svg {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1.55 / 1;
  }

  .travel-map .legacy-map { display: none; }

  .map-ocean { fill: var(--travel-ocean); }
  .accurate-map .map-grid { fill: url(#accurate-grid); opacity: 0.65; }
  #accurate-grid path { stroke: var(--travel-grid-line); }
  .map-status {
    fill: var(--travel-muted);
    font-size: 18px;
    text-anchor: middle;
  }
  .province-shape {
    fill: var(--travel-land);
    stroke: var(--travel-province-stroke);
    stroke-width: 0.8;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
    transition: fill 0.2s ease, stroke 0.2s ease;
  }
  .province-shape:nth-child(3n) { fill: var(--travel-land-alt-a); }
  .province-shape:nth-child(4n) { fill: var(--travel-land-alt-b); }
  .province-shape:hover {
    fill: var(--travel-land-hover);
    stroke: var(--travel-province-stroke-hover);
  }
  .map-route {
    fill: none;
    stroke: var(--travel-route);
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 7 11;
    opacity: 0.68;
  }
  .map-sea-label {
    fill: var(--travel-sea-label);
    font-size: 15px;
    letter-spacing: 0.16em;
  }

  .map-pin {
    cursor: pointer;
    outline: none;
    pointer-events: all;
    transition: filter 0.18s ease;
  }
  .map-pin:hover,
  .map-pin:focus-visible,
  .map-pin.is-active {
    filter: drop-shadow(0 5px 4px rgba(35, 62, 44, 0.34));
  }
  .pin-needle {
    fill: url(#pin-metal-gradient);
    stroke: none;
    vector-effect: non-scaling-stroke;
  }
  .pin-ball {
    stroke: none;
    vector-effect: non-scaling-stroke;
  }
  .pin-highlight {
    fill: rgba(255, 255, 255, 0.26);
    stroke: none;
    vector-effect: non-scaling-stroke;
  }
  .pin--home .pin-ball { fill: url(#pin-home-gradient); }
  .pin--school .pin-ball { fill: url(#pin-school-gradient); }
  .pin--trip .pin-ball { fill: url(#pin-trip-gradient); }

  .pin-callout {
    pointer-events: none;
  }

  .pin-callout-line {
    fill: none;
    stroke: var(--travel-callout-ink);
    stroke-width: 1.4;
    vector-effect: non-scaling-stroke;
  }

  .pin-callout-box {
    fill: var(--travel-callout-surface);
    stroke: var(--travel-callout-ink);
    stroke-width: 1.4;
    vector-effect: non-scaling-stroke;
  }

  .pin-callout-city {
    fill: var(--travel-callout-ink);
    font-size: 18px;
    font-weight: 700;
  }

  .pin-callout-meta {
    fill: var(--travel-callout-muted);
    font-size: 13px;
  }

  .travel-map-note {
    margin: 0;
    padding: 0.15rem 1.1rem 0.85rem;
    color: var(--travel-muted);
    font-size: 0.73rem;
  }

  .map-annotations {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin: 0 0.65rem 1.1rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--travel-border);
  }

  .map-annotation {
    display: inline-flex;
    align-items: center;
    width: auto;
    padding: 4px 12px;
    border: 1.5px solid var(--travel-control-ink);
    border-radius: 4px;
    background: transparent;
    color: var(--travel-control-ink);
    cursor: pointer;
    font: inherit;
    font-size: 1em;
    line-height: 1.35;
    text-align: left;
    transition: background 0.18s ease, color 0.18s ease;
  }

  .map-annotation:hover,
  .map-annotation:focus-visible,
  .map-annotation.is-active {
    border-color: var(--travel-control-ink);
    background: var(--travel-control-hover);
    color: var(--travel-control-ink);
    outline: none;
  }

  .map-annotation .annotation-mark {
    display: none;
  }

  .map-annotation strong,
  .map-annotation small {
    display: inline;
    overflow: visible;
    white-space: normal;
  }

  .map-annotation small::before { content: "："; }

  .travel-itinerary {
    display: none;
    margin-top: 1.25rem;
    padding: 1.05rem 1.1rem 1.15rem;
  }

  .travel-itinerary > header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
    padding-bottom: 0.85rem;
    border-bottom: 1px solid var(--travel-border);
  }

  .travel-itinerary h3 {
    margin: 0;
    color: var(--travel-ink);
    font-size: 1.05rem;
  }

  .travel-itinerary > header span {
    color: var(--travel-muted);
    font-size: 0.72rem;
  }

  .travel-section {
    padding: 1rem 0 0.2rem;
  }

  .travel-section + .travel-section {
    border-top: 1px solid var(--travel-border);
  }

  .travel-section h4 {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0 0 0.55rem;
    color: var(--travel-muted);
    font-size: 0.72rem;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .travel-section h4::before {
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: var(--travel-trip);
    content: "";
  }

  .travel-section--home h4::before { background: var(--travel-home); }
  .travel-section--school h4::before { background: var(--travel-school); }

  .travel-stop {
    display: inline-block;
    width: auto;
    margin: 0 0.4rem 0.5rem 0;
    padding: 4px 12px;
    border: 1.5px solid var(--travel-control-ink);
    border-radius: 4px;
    background: transparent;
    color: var(--travel-control-ink);
    cursor: pointer;
    font: inherit;
    font-size: 1em;
    line-height: 1.35;
    text-align: left;
    transition: background 0.18s ease, color 0.18s ease;
  }

  .travel-stop:hover,
  .travel-stop:focus-visible,
  .travel-stop.is-active {
    border-color: var(--travel-control-ink);
    background: var(--travel-control-hover);
    color: var(--travel-control-ink);
    outline: none;
  }

  .travel-stop time {
    order: 2;
    color: inherit;
    font-size: inherit;
  }

  .travel-stop time::after { content: " · "; }

  .travel-stop span { display: contents; }

  .travel-stop strong {
    order: 1;
    display: inline;
    color: inherit;
    font-size: inherit;
  }

  .travel-stop strong::after { content: "："; }

  .travel-stop small {
    order: 3;
    display: inline;
    margin: 0;
    color: inherit;
    font-size: inherit;
  }

  .travel-stop .stop-mark { display: none; order: 4; }

  @media (max-width: 900px) {
    .travel-intro {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .travel-stats {
      align-items: flex-start;
    }
    .travel-layout {
      display: block;
    }
  }

  @media (max-width: 560px) {
    .travel-intro h2 { font-size: 1.9rem; }
    .travel-page[lang="zh-CN"] .travel-intro h2 { font-size: 1.42rem; }
    .travel-stats { gap: 0.7rem; }
    .travel-stat { min-width: 0; padding-left: 0.7rem; }
    .travel-stat strong { font-size: 1.25rem; }
    .travel-map-header { align-items: flex-start; flex-direction: column; gap: 0.25rem; }
    .travel-map svg { aspect-ratio: 1.35 / 1; }
    .travel-map-note { padding-left: 0.8rem; padding-right: 0.8rem; }
    .map-annotations { gap: 0.45rem; }
  }

  html[data-theme="dark"] .travel-page {
    --travel-ink: #e8eee8;
    --travel-muted: #c1c9c3;
    --travel-surface: #414141;
    --travel-surface-strong: #3d3d3d;
    --travel-border: #686868;
    --travel-ocean: #26363d;
    --travel-land: #476251;
    --travel-land-shadow: #35493c;
    --travel-route: #f0a27a;
    --travel-home: #66bc95;
    --travel-school: #b2a1e1;
    --travel-trip: #ef8a76;
    --travel-land-alt-a: #526f5c;
    --travel-land-alt-b: #3e5949;
    --travel-land-hover: #63836c;
    --travel-province-stroke: #7f9886;
    --travel-province-stroke-hover: #bdd0c1;
    --travel-grid-line: #718783;
    --travel-sea-label: #a5b9ba;
    --travel-control-ink: #f3f3f3;
    --travel-control-hover: #555555;
    --travel-callout-surface: #353b37;
    --travel-callout-ink: #f5f7f5;
    --travel-callout-muted: #c5cec7;
    --travel-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
  }
</style>

<div class="travel-page">
  <div class="travel-language-switch" role="group" aria-label="Language">
    <button class="travel-language-button is-active" type="button" data-language="en" aria-pressed="true">EN</button>
    <button class="travel-language-button" type="button" data-language="zh" aria-pressed="false">中</button>
  </div>

  <section class="travel-intro" aria-labelledby="travel-heading">
    <div>
      <p class="travel-eyebrow">A map of places that shaped my year</p>
      <h2 id="travel-heading">把走过的地方，留在地图上</h2>
      <p>常住杭州，在香港上学；2026 年沿着东南海岸线与山城继续向外走。</p>
    </div>
    <div class="travel-stats" aria-label="足迹统计">
      <div class="travel-stat"><strong>13</strong><span>个地点</span></div>
      <div class="travel-stat"><strong>27</strong><span>次动线停留</span></div>
      <div class="travel-stat"><strong>2026</strong><span>旅行年份</span></div>
    </div>
  </section>

  <div class="travel-layout">
    <section class="travel-map-card" aria-labelledby="map-title">
      <header class="travel-map-header">
        <strong id="map-title">中国 · 足迹图</strong>
        <span>每一枚大头针，都是一段真实的停留</span>
      </header>
      <div class="travel-legend" aria-label="地点类型">
        <span><i class="legend-home"></i>常住地</span>
        <span><i class="legend-school"></i>上学地</span>
        <span><i class="legend-trip"></i>旅行地</span>
      </div>
      <div class="travel-map">
        <svg id="china-map" class="accurate-map" viewBox="0 0 1000 560" role="img" aria-labelledby="accurate-map-title accurate-map-desc">
          <title id="accurate-map-title">真实中国省级边界足迹地图</title>
          <desc id="accurate-map-desc">基于省级 GeoJSON 边界绘制，标记杭州、香港、常州、台州、宁波、深圳、广州、南京、南充、重庆、烟台、威海和澳门。</desc>
          <defs>
            <pattern id="accurate-grid" width="54" height="54" patternUnits="userSpaceOnUse">
              <path d="M 54 0 L 0 0 0 54" fill="none" stroke="#9eb8b2" stroke-width="1" opacity="0.22" />
            </pattern>
            <linearGradient id="pin-metal-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#edf1f3" />
              <stop offset="0.28" stop-color="#9ca7af" />
              <stop offset="0.58" stop-color="#59636b" />
              <stop offset="0.82" stop-color="#c8d0d5" />
              <stop offset="1" stop-color="#6d7780" />
            </linearGradient>
            <linearGradient id="pin-trip-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#f58c7b" />
              <stop offset="0.52" stop-color="#dc5f54" />
              <stop offset="1" stop-color="#b83e3d" />
            </linearGradient>
            <linearGradient id="pin-home-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#6bc39a" />
              <stop offset="0.55" stop-color="#35936f" />
              <stop offset="1" stop-color="#23654f" />
            </linearGradient>
            <linearGradient id="pin-school-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#b6a3e4" />
              <stop offset="0.55" stop-color="#7b65b0" />
              <stop offset="1" stop-color="#51417b" />
            </linearGradient>
          </defs>
          <rect class="map-ocean" x="0" y="0" width="1000" height="560" rx="12" />
          <rect class="map-grid" fill="url(#accurate-grid)" x="0" y="0" width="1000" height="560" rx="12" />
          <text id="map-status" class="map-status" x="500" y="280">正在加载真实省级边界…</text>
          <g id="province-layer" aria-label="中国省级边界"></g>
          <path id="accurate-route" class="map-route" d="" />
          <g id="accurate-pin-layer" aria-label="旅行地点"></g>
          <g id="pin-callout" class="pin-callout" role="status" aria-live="polite" visibility="hidden">
            <path class="pin-callout-line" d="" />
            <rect class="pin-callout-box" x="0" y="0" width="220" height="58" rx="6" />
            <text class="pin-callout-city" x="0" y="0"></text>
            <text class="pin-callout-meta" x="0" y="0"></text>
          </g>
        </svg>
        <svg class="legacy-map" viewBox="0 0 1000 640" aria-hidden="true">
          <title id="china-map-title">中国旅游足迹地图</title>
          <desc id="china-map-desc">地图标记了杭州、香港、常州、台州、深圳、广州、重庆、烟台和威海。</desc>
          <defs>
            <pattern id="travel-grid" width="54" height="54" patternUnits="userSpaceOnUse">
              <path d="M 54 0 L 0 0 0 54" fill="none" stroke="#9eb8b2" stroke-width="1" opacity="0.22" />
            </pattern>
          </defs>
          <rect class="map-ocean" x="0" y="0" width="1000" height="640" rx="12" />
          <rect class="map-grid" x="0" y="0" width="1000" height="640" rx="12" />
          <path class="map-land-shadow" d="M 135 190 L 200 148 L 232 120 L 300 126 L 338 95 L 395 108 L 441 91 L 492 99 L 522 129 L 560 118 L 607 133 L 633 153 L 681 148 L 722 161 L 764 188 L 802 189 L 812 216 L 844 234 L 857 263 L 889 275 L 881 305 L 902 322 L 888 347 L 920 361 L 899 388 L 871 397 L 874 428 L 847 441 L 821 465 L 791 471 L 780 503 L 746 517 L 719 507 L 701 523 L 663 523 L 631 503 L 602 513 L 571 497 L 546 503 L 521 480 L 491 481 L 463 465 L 436 478 L 409 458 L 382 465 L 357 445 L 331 452 L 309 431 L 286 433 L 273 410 L 249 400 L 241 373 L 213 363 L 209 336 L 182 326 L 178 300 L 153 284 L 148 258 L 125 245 L 126 220 L 144 207 Z" transform="translate(7 11)" />
          <path class="map-land" d="M 135 190 L 200 148 L 232 120 L 300 126 L 338 95 L 395 108 L 441 91 L 492 99 L 522 129 L 560 118 L 607 133 L 633 153 L 681 148 L 722 161 L 764 188 L 802 189 L 812 216 L 844 234 L 857 263 L 889 275 L 881 305 L 902 322 L 888 347 L 920 361 L 899 388 L 871 397 L 874 428 L 847 441 L 821 465 L 791 471 L 780 503 L 746 517 L 719 507 L 701 523 L 663 523 L 631 503 L 602 513 L 571 497 L 546 503 L 521 480 L 491 481 L 463 465 L 436 478 L 409 458 L 382 465 L 357 445 L 331 452 L 309 431 L 286 433 L 273 410 L 249 400 L 241 373 L 213 363 L 209 336 L 182 326 L 178 300 L 153 284 L 148 258 L 125 245 L 126 220 L 144 207 Z" />
          <path class="map-route" d="M 731 350 L 752 394 L 646 479 L 633 470 L 536 381 L 753 271 L 762 270" />
          <text class="map-title" x="93" y="97">CHINA</text>
          <text class="map-sea-label" x="841" y="448">东海 · 南海</text>
          <text class="map-sea-label" x="845" y="211">黄海</text>

          <g class="map-label" transform="translate(706 341)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">常州</text></g>
          <g class="map-label" transform="translate(707 405)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">杭州</text></g>
          <g class="map-label" transform="translate(778 420)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">台州</text></g>
          <g class="map-label" transform="translate(588 404)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">重庆</text></g>
          <g class="map-label" transform="translate(610 447)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">广州</text></g>
          <g class="map-label" transform="translate(605 516)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">深圳</text></g>
          <g class="map-label" transform="translate(719 235)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">烟台</text></g>
          <g class="map-label" transform="translate(804 235)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">威海</text></g>
          <g class="map-label" transform="translate(686 531)"><rect x="-23" y="-14" width="46" height="28" /><text x="0" y="1">香港</text></g>

          <g class="map-pin pin--trip" data-location="changzhou" tabindex="0" role="button" aria-label="常州，2026 年 1 月旅行地" transform="translate(732 348)"><title>常州 · 2026 年 1 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--home" data-location="hangzhou" tabindex="0" role="button" aria-label="杭州，常住地" transform="translate(685 369)"><title>杭州 · 常住地</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--trip" data-location="taizhou" tabindex="0" role="button" aria-label="台州，2026 年 4 月旅行地" transform="translate(752 392)"><title>台州 · 2026 年 4 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--trip" data-location="chongqing" tabindex="0" role="button" aria-label="重庆，2026 年 7 月旅行地" transform="translate(536 380)"><title>重庆 · 2026 年 7 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--trip" data-location="guangzhou" tabindex="0" role="button" aria-label="广州，2026 年 4 月旅行地" transform="translate(633 469)"><title>广州 · 2026 年 4 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--trip" data-location="shenzhen" tabindex="0" role="button" aria-label="深圳，2026 年 4 月旅行地" transform="translate(646 477)"><title>深圳 · 2026 年 4 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--trip" data-location="yantai" tabindex="0" role="button" aria-label="烟台，2026 年 8 月旅行地" transform="translate(753 270)"><title>烟台 · 2026 年 8 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--trip" data-location="weihai" tabindex="0" role="button" aria-label="威海，2026 年 8 月旅行地" transform="translate(762 270)"><title>威海 · 2026 年 8 月</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
          <g class="map-pin pin--school" data-location="hong-kong" tabindex="0" role="button" aria-label="香港，上学地" transform="translate(648 480)"><title>香港 · 上学地</title><path class="pin-shape" d="M0 22 C-16 8-18-5 0-16 C18-5 16 8 0 22Z" /><circle class="pin-core" cx="0" cy="-3" r="5" /></g>
        </svg>
      </div>
      <p class="travel-map-note">虚线按今年 9 月前的实际顺序连接；点击大头针或下方地点，可查看对应足迹。</p>
    </section>

      <div class="map-annotations" aria-label="Map location notes">
        <button class="map-annotation map-annotation--home" type="button" data-location="hangzhou"><i class="annotation-mark" aria-hidden="true"></i><span><strong>杭州</strong><small>常住地 · 浙江</small></span></button>
        <button class="map-annotation map-annotation--school" type="button" data-location="hong-kong"><i class="annotation-mark" aria-hidden="true"></i><span><strong>香港</strong><small>上学地 · HKUST</small></span></button>
        <button class="map-annotation" type="button" data-location="changzhou"><i class="annotation-mark" aria-hidden="true"></i><span><strong>常州</strong><small>2026.01 · 江苏</small></span></button>
        <button class="map-annotation" type="button" data-location="taizhou"><i class="annotation-mark" aria-hidden="true"></i><span><strong>台州</strong><small>2026.04 · 浙江</small></span></button>
        <button class="map-annotation" type="button" data-location="ningbo"><i class="annotation-mark" aria-hidden="true"></i><span><strong>宁波</strong><small>2026.04 · 浙江</small></span></button>
        <button class="map-annotation" type="button" data-location="shenzhen"><i class="annotation-mark" aria-hidden="true"></i><span><strong>深圳</strong><small>2026.04 · 广东</small></span></button>
        <button class="map-annotation" type="button" data-location="guangzhou"><i class="annotation-mark" aria-hidden="true"></i><span><strong>广州</strong><small>2026.04 · 广东</small></span></button>
        <button class="map-annotation" type="button" data-location="nanjing"><i class="annotation-mark" aria-hidden="true"></i><span><strong>南京</strong><small>2026.07 · 江苏</small></span></button>
        <button class="map-annotation" type="button" data-location="nanchong"><i class="annotation-mark" aria-hidden="true"></i><span><strong>南充</strong><small>2026.07 · 四川</small></span></button>
        <button class="map-annotation" type="button" data-location="chongqing"><i class="annotation-mark" aria-hidden="true"></i><span><strong>重庆</strong><small>2026.07 · 山城</small></span></button>
        <button class="map-annotation" type="button" data-location="yantai"><i class="annotation-mark" aria-hidden="true"></i><span><strong>烟台</strong><small>2026.08 · 山东</small></span></button>
        <button class="map-annotation" type="button" data-location="weihai"><i class="annotation-mark" aria-hidden="true"></i><span><strong>威海</strong><small>2026.08 · 山东</small></span></button>
        <button class="map-annotation" type="button" data-location="macau"><i class="annotation-mark" aria-hidden="true"></i><span><strong>澳门</strong><small>2026 · 9 月前</small></span></button>
      </div>

    <aside class="travel-itinerary" aria-labelledby="itinerary-title">
      <header>
        <h3 id="itinerary-title">地点记录</h3>
        <span>2026 · 行走中</span>
      </header>

      <section class="travel-section travel-section--home">
        <h4>常住地</h4>
        <button class="travel-stop" type="button" data-location="hangzhou">
          <time>现在</time>
          <span><strong>杭州</strong><small>浙江 · 日常生活</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
      </section>

      <section class="travel-section travel-section--school">
        <h4>上学地</h4>
        <button class="travel-stop" type="button" data-location="hong-kong">
          <time>常驻</time>
          <span><strong>香港</strong><small>特别行政区 · HKUST</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
      </section>

      <section class="travel-section travel-section--trips">
        <h4>旅行记录</h4>
        <button class="travel-stop" type="button" data-location="changzhou">
          <time>2026.01</time>
          <span><strong>常州</strong><small>江苏 · 冬日短途</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="taizhou">
          <time>2026.04</time>
          <span><strong>台州</strong><small>浙江 · 海风与山路</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="ningbo">
          <time>2026.04</time>
          <span><strong>宁波</strong><small>浙江 · 港口一站</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="shenzhen">
          <time>2026.04</time>
          <span><strong>深圳</strong><small>广东 · 城市漫游</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="guangzhou">
          <time>2026.04</time>
          <span><strong>广州</strong><small>广东 · 岭南一站</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="nanjing">
          <time>2026.07</time>
          <span><strong>南京</strong><small>江苏 · 城市回望</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="nanchong">
          <time>2026.07</time>
          <span><strong>南充</strong><small>四川 · 嘉陵江畔</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="chongqing">
          <time>2026.07</time>
          <span><strong>重庆</strong><small>山城 · 夏日夜景</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="yantai">
          <time>2026.08</time>
          <span><strong>烟台</strong><small>山东 · 海岸线</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="weihai">
          <time>2026.08</time>
          <span><strong>威海</strong><small>山东 · 北纬海风</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
        <button class="travel-stop" type="button" data-location="macau">
          <time>9 月前</time>
          <span><strong>澳门</strong><small>特别行政区 · 海湾一站</small></span>
          <i class="stop-mark" aria-hidden="true"></i>
        </button>
      </section>
    </aside>
  </div>
</div>

<script>
  (function () {
    var stops = Array.prototype.slice.call(document.querySelectorAll('.travel-page .travel-stop'));
    var annotations = Array.prototype.slice.call(document.querySelectorAll('.travel-page .map-annotation'));
    var pins = [];
    var svgNS = 'http://www.w3.org/2000/svg';
    var mapSvg = document.getElementById('china-map');
    var provinceLayer = document.getElementById('province-layer');
    var pinLayer = document.getElementById('accurate-pin-layer');
    var pinCallout = document.getElementById('pin-callout');
    var calloutLine = pinCallout.querySelector('.pin-callout-line');
    var calloutBox = pinCallout.querySelector('.pin-callout-box');
    var calloutCity = pinCallout.querySelector('.pin-callout-city');
    var calloutMeta = pinCallout.querySelector('.pin-callout-meta');
    var routePath = document.getElementById('accurate-route');
    var mapStatus = document.getElementById('map-status');
    var mapWidth = 1000;
    var mapHeight = 560;
    var mapBounds = { minLon: 72, maxLon: 136, minLat: 18, maxLat: 54.5, padding: 26 };
    var places = [
      { id: 'hangzhou', name: '杭州', lon: 120.1551, lat: 30.2741, kind: 'home', period: '常住地' },
      { id: 'hong-kong', name: '香港', lon: 114.1694, lat: 22.3193, kind: 'school', period: '上学地' },
      { id: 'changzhou', name: '常州', lon: 119.9741, lat: 31.8107, kind: 'trip', period: '2026 年 1 月' },
      { id: 'taizhou', name: '台州', lon: 121.4208, lat: 28.6564, kind: 'trip', period: '2026 年 4 月' },
      { id: 'ningbo', name: '宁波', lon: 121.544, lat: 29.8683, kind: 'trip', period: '2026 年 4 月' },
      { id: 'shenzhen', name: '深圳', lon: 114.0579, lat: 22.5431, kind: 'trip', period: '2026 年 4 月' },
      { id: 'guangzhou', name: '广州', lon: 113.2644, lat: 23.1291, kind: 'trip', period: '2026 年 4 月' },
      { id: 'nanjing', name: '南京', lon: 118.7969, lat: 32.0603, kind: 'trip', period: '2026 年 7 月' },
      { id: 'nanchong', name: '南充', lon: 106.1107, lat: 30.8378, kind: 'trip', period: '2026 年 7 月' },
      { id: 'chongqing', name: '重庆', lon: 106.5516, lat: 29.563, kind: 'trip', period: '2026 年 7 月' },
      { id: 'yantai', name: '烟台', lon: 121.4479, lat: 37.4638, kind: 'trip', period: '2026 年 8 月' },
      { id: 'weihai', name: '威海', lon: 122.1204, lat: 37.5131, kind: 'trip', period: '2026 年 8 月' },
      { id: 'macau', name: '澳门', lon: 113.5439, lat: 22.1987, kind: 'trip', period: '2026 · 9 月前' }
    ];
    var routeIds = [
      'hangzhou', 'changzhou', 'hangzhou', 'hong-kong', 'shenzhen', 'hong-kong', 'hangzhou',
      'taizhou', 'ningbo', 'hangzhou', 'hong-kong', 'guangzhou', 'hong-kong', 'shenzhen',
      'hong-kong', 'hangzhou', 'nanjing', 'hangzhou', 'nanchong', 'chongqing', 'hangzhou',
      'yantai', 'weihai', 'hangzhou', 'shenzhen', 'macau', 'hong-kong'
    ];
    var languageButtons = Array.prototype.slice.call(document.querySelectorAll('.travel-language-button'));
    var currentLanguage = 'en';
    var activeLocation = null;
    var languageCopy = {
      en: {
        pageTitle: 'Travel',
        eyebrow: 'A map of places that shaped my year',
        heading: 'Travel footprint',
        intro: 'Based in Hangzhou and studying in Hong Kong, with 27 route stops across China before September 2026.',
        stats: ['places', 'route stops', 'year'],
        mapTitle: 'China · Travel map',
        mapSubtitle: 'Every pin marks a real stop',
        legend: ['Home', 'School', 'Travel'],
        mapNote: 'The dashed line follows the actual route before September 2026. Select a pin or city button to highlight a place.',
        records: 'Place records',
        status: 'Before Sep 2026',
        sections: ['Home', 'School', 'Travel']
      },
      zh: {
        pageTitle: '旅行',
        eyebrow: '记录这一年的行走',
        heading: '把走过的地方，留在地图上',
        intro: '常住杭州，在香港上学；记录 2026 年 9 月前的 27 次动线停留。',
        stats: ['个地点', '次动线停留', '旅行年份'],
        mapTitle: '中国 · 足迹图',
        mapSubtitle: '每一枚大头针，都是一段真实的停留',
        legend: ['常住地', '上学地', '旅行地'],
        mapNote: '虚线按今年 9 月前的实际顺序连接；点击大头针或下方地点，可查看对应足迹。',
        records: '地点记录',
        status: '2026 · 9 月前',
        sections: ['常住地', '上学地', '旅行记录']
      }
    };
    var locationLabels = {
      hangzhou: { en: 'Hangzhou: Home · Zhejiang', zh: '杭州：常住地 · 浙江' },
      'hong-kong': { en: 'Hong Kong: School · HKUST', zh: '香港：上学地 · HKUST' },
      changzhou: { en: 'Changzhou: 2026.01 · Jiangsu', zh: '常州：2026.01 · 江苏' },
      taizhou: { en: 'Taizhou: 2026.04 · Zhejiang', zh: '台州：2026.04 · 浙江' },
      ningbo: { en: 'Ningbo: 2026.04 · Zhejiang', zh: '宁波：2026.04 · 浙江' },
      shenzhen: { en: 'Shenzhen: 2026.04 · Guangdong', zh: '深圳：2026.04 · 广东' },
      guangzhou: { en: 'Guangzhou: 2026.04 · Guangdong', zh: '广州：2026.04 · 广东' },
      nanjing: { en: 'Nanjing: 2026.07 · Jiangsu', zh: '南京：2026.07 · 江苏' },
      nanchong: { en: 'Nanchong: 2026.07 · Sichuan', zh: '南充：2026.07 · 四川' },
      chongqing: { en: 'Chongqing: 2026.07', zh: '重庆：2026.07' },
      yantai: { en: 'Yantai: 2026.08 · Shandong', zh: '烟台：2026.08 · 山东' },
      weihai: { en: 'Weihai: 2026.08 · Shandong', zh: '威海：2026.08 · 山东' },
      macau: { en: 'Macau: 2026 · Before Sep', zh: '澳门：2026 · 9 月前' }
    };

    function setLanguage(language) {
      var copy = languageCopy[language];
      var introParagraphs = document.querySelectorAll('.travel-intro > div:first-child p');
      var statLabels = document.querySelectorAll('.travel-stat span');
      var legendLabels = document.querySelectorAll('.travel-legend span');
      var sectionLabels = document.querySelectorAll('.travel-section h4');
      currentLanguage = language;

      document.querySelector('.page__title').textContent = copy.pageTitle;
      introParagraphs[0].textContent = copy.eyebrow;
      document.getElementById('travel-heading').textContent = copy.heading;
      introParagraphs[1].textContent = copy.intro;
      statLabels.forEach(function (label, index) { label.textContent = copy.stats[index]; });
      document.querySelector('.travel-map-header strong').textContent = copy.mapTitle;
      document.querySelector('.travel-map-header span').textContent = copy.mapSubtitle;
      legendLabels.forEach(function (label, index) { label.lastChild.nodeValue = copy.legend[index]; });
      document.querySelector('.travel-map-note').textContent = copy.mapNote;
      document.querySelector('.travel-itinerary > header h3').textContent = copy.records;
      document.querySelector('.travel-itinerary > header span').textContent = copy.status;
      sectionLabels.forEach(function (label, index) { label.textContent = copy.sections[index]; });
      document.querySelector('.travel-page').setAttribute('lang', language === 'zh' ? 'zh-CN' : 'en');

      annotations.concat(stops).forEach(function (button) {
        var location = button.getAttribute('data-location');
        button.textContent = locationLabels[location][language];
      });
      pins.forEach(function (pin) {
        var location = pin.getAttribute('data-location');
        var label = locationLabels[location][language];
        pin.setAttribute('aria-label', label);
        pin.querySelector('title').textContent = label;
      });
      languageButtons.forEach(function (button) {
        var active = button.getAttribute('data-language') === language;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      if (activeLocation) showPinCallout(activeLocation);
    }

    function setActive(location) {
      pins.forEach(function (pin) {
        pin.classList.toggle('is-active', pin.getAttribute('data-location') === location);
      });
      stops.forEach(function (stop) {
        stop.classList.toggle('is-active', stop.getAttribute('data-location') === location);
      });
      annotations.forEach(function (annotation) {
        annotation.classList.toggle('is-active', annotation.getAttribute('data-location') === location);
      });
      showPinCallout(location);
    }

    function project(lon, lat) {
      var usableWidth = mapWidth - mapBounds.padding * 2;
      var usableHeight = mapHeight - mapBounds.padding * 2;
      return [
        mapBounds.padding + ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * usableWidth,
        mapBounds.padding + ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * usableHeight
      ];
    }

    function splitLocationLabel(label) {
      var separator = label.indexOf('：') !== -1 ? '：' : ':';
      var parts = label.split(separator);
      return {
        city: parts.shift(),
        meta: parts.join(separator).trim()
      };
    }

    function showPinCallout(location) {
      var place = places.filter(function (candidate) { return candidate.id === location; })[0];
      if (!place) return;

      var point = project(place.lon, place.lat);
      var label = locationLabels[location][currentLanguage];
      var content = splitLocationLabel(label);
      var boxWidth = currentLanguage === 'zh' ? 190 : 230;
      var boxHeight = 58;
      var gap = 24;
      var isRight = point[0] + gap + boxWidth <= mapWidth - 12;
      var boxX = isRight ? point[0] + gap : point[0] - gap - boxWidth;
      var boxY = Math.max(12, Math.min(point[1] - boxHeight / 2, mapHeight - boxHeight - 12));
      var lineEndX = isRight ? boxX : boxX + boxWidth;
      var lineEndY = boxY + boxHeight / 2;

      calloutLine.setAttribute('d', 'M ' + point[0].toFixed(2) + ' ' + (point[1] - 31).toFixed(2) + ' L ' + lineEndX.toFixed(2) + ' ' + lineEndY.toFixed(2));
      calloutBox.setAttribute('x', boxX.toFixed(2));
      calloutBox.setAttribute('y', boxY.toFixed(2));
      calloutBox.setAttribute('width', boxWidth);
      calloutBox.setAttribute('height', boxHeight);
      calloutCity.setAttribute('x', (boxX + 14).toFixed(2));
      calloutCity.setAttribute('y', (boxY + 23).toFixed(2));
      calloutMeta.setAttribute('x', (boxX + 14).toFixed(2));
      calloutMeta.setAttribute('y', (boxY + 43).toFixed(2));
      calloutCity.textContent = content.city;
      calloutMeta.textContent = content.meta;
      pinCallout.setAttribute('aria-label', label);
      pinCallout.setAttribute('visibility', 'visible');
      activeLocation = location;
    }

    function ringPath(ring) {
      return ring.map(function (coordinate, index) {
        var point = project(coordinate[0], coordinate[1]);
        return (index === 0 ? 'M' : 'L') + point[0].toFixed(2) + ' ' + point[1].toFixed(2);
      }).join(' ') + ' Z';
    }

    function geometryPath(geometry) {
      var rings = geometry.type === 'Polygon'
        ? geometry.coordinates
        : geometry.coordinates.reduce(function (all, polygon) { return all.concat(polygon); }, []);
      return rings.filter(function (ring) {
        return ring.some(function (coordinate) {
          return coordinate[0] >= mapBounds.minLon && coordinate[0] <= mapBounds.maxLon && coordinate[1] >= mapBounds.minLat && coordinate[1] <= mapBounds.maxLat;
        });
      }).map(ringPath).join(' ');
    }

    function addPin(place) {
      var point = project(place.lon, place.lat);
      var pin = document.createElementNS(svgNS, 'g');
      pin.setAttribute('class', 'map-pin pin--' + place.kind);
      pin.setAttribute('data-location', place.id);
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('role', 'button');
      pin.setAttribute('aria-label', locationLabels[place.id][currentLanguage]);
      pin.setAttribute('transform', 'translate(' + point[0].toFixed(2) + ' ' + (point[1] - 31).toFixed(2) + ')');

      var title = document.createElementNS(svgNS, 'title');
      title.textContent = locationLabels[place.id][currentLanguage];
      var needle = document.createElementNS(svgNS, 'path');
      needle.setAttribute('class', 'pin-needle');
      needle.setAttribute('d', 'M-3 -1 L3 -1 L0 31 Z');
      var ball = document.createElementNS(svgNS, 'circle');
      ball.setAttribute('class', 'pin-ball');
      ball.setAttribute('cx', '0');
      ball.setAttribute('cy', '-14');
      ball.setAttribute('r', '14');
      var highlight = document.createElementNS(svgNS, 'ellipse');
      highlight.setAttribute('class', 'pin-highlight');
      highlight.setAttribute('cx', '-5');
      highlight.setAttribute('cy', '-21');
      highlight.setAttribute('rx', '3');
      highlight.setAttribute('ry', '5');

      pin.appendChild(title);
      pin.appendChild(needle);
      pin.appendChild(ball);
      pin.appendChild(highlight);
      pin.addEventListener('click', function () { setActive(place.id); });
      pin.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setActive(place.id);
        }
      });
      pinLayer.appendChild(pin);
      pins.push(pin);
    }

    languageButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setLanguage(button.getAttribute('data-language'));
      });
    });

    setLanguage('en');

    stops.forEach(function (stop) {
      stop.addEventListener('click', function () {
        setActive(stop.getAttribute('data-location'));
      });
    });

    annotations.forEach(function (annotation) {
      annotation.addEventListener('click', function () {
        setActive(annotation.getAttribute('data-location'));
      });
    });

    fetch('/assets/data/china-provinces.json')
      .then(function (response) {
        if (!response.ok) throw new Error('Map data request failed');
        return response.json();
      })
      .then(function (geojson) {
        geojson.features.forEach(function (feature, index) {
          if (feature.properties && feature.properties.adcode === '100000_JD') return;
          var province = document.createElementNS(svgNS, 'path');
          province.setAttribute('class', 'province-shape province-' + index);
          province.setAttribute('d', geometryPath(feature.geometry));
          province.setAttribute('data-province', feature.properties && feature.properties.name ? feature.properties.name : '');
          var title = document.createElementNS(svgNS, 'title');
          title.textContent = feature.properties && feature.properties.name ? feature.properties.name : '中国';
          province.appendChild(title);
          provinceLayer.appendChild(province);
        });

        routePath.setAttribute('d', routeIds.map(function (id, index) {
          var place = places.find(function (item) { return item.id === id; });
          var point = project(place.lon, place.lat);
          return (index === 0 ? 'M' : 'L') + point[0].toFixed(2) + ' ' + point[1].toFixed(2);
        }).join(' '));

        places.forEach(addPin);
        if (mapStatus) mapStatus.remove();
      })
      .catch(function () {
        if (mapStatus) mapStatus.textContent = '地图数据暂时无法加载';
      });
  }());
</script>
