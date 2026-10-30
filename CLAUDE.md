# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static portfolio site for Lobanov Albert Nikolaevich, computer science teacher. No build system — pure HTML/CSS/JS files opened directly in a browser or served via any static file server. Published on GitHub Pages: https://stydentbox.github.io/portfolio-lobanov/ (deploys automatically from `main`).

**To preview locally:** open any `.html` file in a browser, or run `python -m http.server 8000` from the project root.

## File Structure

```
Portfolio/
├── index.html, achievements.html, education.html,
│   publications.html, evidence.html, gallery.html,
│   contact.html                                     # Public pages
├── admin.html, admin-guide.html                     # Admin/content management — local only, excluded from GitHub Pages in _config.yml
├── _config.yml            # GitHub Pages (Jekyll) excludes: admin pages, admin docs, CLAUDE.md, .claude
├── README.md, ADMIN_README.md, CHANGELOG_ADMIN.md,
│   GALLERY_ADMIN_GUIDE.md, LOGOS_SETUP_GUIDE.md,
│   QUICK_START.txt        # Docs (Russian); all but README.md are excluded from Pages
├── css/
│   ├── style.css          # Global styles (all public pages)
│   ├── gallery.css        # Gallery page specifics
│   ├── admin.css          # Admin panel styles
│   └── admin-gallery.css  # Admin gallery management styles
├── js/
│   ├── theme.js           # Dark/light toggle (used on every page)
│   ├── progress-bar.js    # Scroll progress bar (all public pages)
│   ├── achievements.js    # Renders data/achievements-data.json on achievements.html
│   ├── stats-counter.js   # Animated counters on achievements.html
│   ├── statistics.js      # Animated counters on index.html
│   ├── filters.js         # Search/filter on publications.html
│   ├── gallery.js         # Gallery rendering from data/gallery-data.json
│   ├── admin.js           # Admin panel (localStorage + JSON export)
│   └── admin-gallery.js   # Gallery image management in admin
├── data/
│   ├── gallery-data.json        # Gallery images metadata
│   ├── achievements-data.json   # Student achievements
│   ├── publications-data.json   # Publications (admin data; publications.html is static)
│   ├── education-data.json      # Courses (admin data; education.html is static)
│   └── EXAMPLES.json            # Sample records for each data type
└── Images/
    ├── Lobanov_AN.png     # Profile photo (index.html)
    ├── favicon.svg        # Main favicon — «АЛ» monogram
    ├── favicon.ico, favicon-*.png, apple-touch-icon.png,
    │   android-chrome-*.png, site.webmanifest  # Raster fallbacks / PWA icons
    ├── Logos/             # University logos for education.html
    └── Gallery/           # Gallery photos
```

## Architecture

**Theme system:** Dark theme is default. `theme.js` reads/writes `localStorage('theme')` and sets `data-theme` attribute on `<html>`. Base styles in `style.css` are the dark theme; light theme overrides (variables and component tweaks) go under `[data-theme="light"]`. There is no `[data-theme="dark"]` selector. Every page must include `<button id="theme-toggle">` and load `theme.js`.

**Content sources:** `gallery.html` and the dynamic part of `achievements.html` load `data/*.json` via `fetch()`. `achievements.html` also has a static timeline in HTML; `education.html`, `publications.html` and `evidence.html` are static HTML — edit the page itself to change content.

**Admin:** `admin.html` + `admin.js` keep data in browser `localStorage` (gallery is read from `data/gallery-data.json`). To publish changes: export JSON from the admin, replace the file in `data/`, commit. Admin pages are not deployed to GitHub Pages.

**CSS conventions:** All CSS custom properties (variables) are defined in `:root` in `style.css`. Font is Times New Roman (ГОСТ academic style). Container max-width is 900px. The `.card` class is the main content block. Breakpoints: 768px and 480px.

**Navigation / header:** Every page has the same `<header>`: an «АЛ» monogram badge (`a.logo.header-brand-badge` > `span.header-brand-initials`, linking to `index.html`, or `#` on index/gallery) and the same nav links (Главная, Достижения, Образование, Публикации, Источники, Галерея, Контакты). Add `class="active"` to the current page's nav link. Admin pages are intentionally excluded from the nav. Every page `<head>` links `Images/favicon.svg` with `Images/favicon.ico` as fallback.

**Index intro:** `.intro-layout` is a two-column grid (text + `.profile-photo-container`). At ≤768px it becomes one column with `.intro-content { display: contents }` and `order` so the mobile order is: name (h1) → photo → description card.

## Design Constraints

- Academic ГОСТ style — Times New Roman font, minimal decoration, dark background `#1a1a1a`
- Keep JavaScript minimal; new interactive features should be added to `js/` as separate files
- Publications must follow ГОСТ citation format
- All text content is in Russian
