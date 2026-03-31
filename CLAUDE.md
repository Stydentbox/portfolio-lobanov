# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static portfolio site for Lobanov Albert Nikolaevich, computer science teacher. No build system — pure HTML/CSS/JS files opened directly in a browser or served via any static file server (e.g. GitHub Pages).

**To preview locally:** open any `.html` file in a browser, or run `python -m http.server 8000` from the project root.

## File Structure

```
Portfolio/
├── index.html, achievements.html, education.html,
│   publications.html, gallery.html, contact.html   # Public pages
├── admin.html, admin-guide.html                     # Admin/content management (not linked from nav)
├── css/
│   ├── style.css          # Global styles (all public pages)
│   ├── gallery.css        # Gallery page specifics
│   ├── admin.css          # Admin panel styles
│   └── admin-gallery.css  # Admin gallery management styles
├── js/
│   ├── theme.js           # Dark/light toggle (used on every page)
│   ├── gallery.js         # Gallery rendering from JSON
│   ├── filters.js         # Publication/achievement filtering
│   ├── stats-counter.js   # Animated counters on index
│   ├── statistics.js      # Stats calculations
│   ├── progress-bar.js    # Scroll progress bar
│   ├── admin.js           # Admin panel CRUD for JSON data
│   └── admin-gallery.js   # Gallery image management in admin
├── data/
│   ├── gallery-data.json        # Gallery images metadata
│   ├── achievements-data.json   # Student achievements
│   ├── publications-data.json   # Publications list
│   └── education-data.json      # Education/qualifications
└── Images/
    ├── Lobanov_AN.png     # Profile photo
    ├── favicon*           # Favicon set + site.webmanifest
    └── Gallery/           # Gallery photos
```

## Architecture

**Theme system:** Dark theme is default. `theme.js` reads/writes `localStorage('theme')` and sets `data-theme` attribute on `<html>`. Light theme CSS variables are defined under `[data-theme="light"]` in `style.css`. Every page must include `<button id="theme-toggle">` and load `theme.js`.

**Data-driven pages:** Gallery, achievements, publications, and education pages load content from `data/*.json` files via `fetch()` in their respective JS files. The admin panel (`admin.html` + `admin.js`) edits these JSON files and saves them back. This is a client-side-only admin — changes only persist if the JSON files are actually written (works locally; on GitHub Pages, the admin is read-only).

**CSS conventions:** All CSS custom properties (variables) are defined in `:root` in `style.css`. Font is Times New Roman (ГОСТ academic style). Container max-width is 900px. The `.card` class is the main content block.

**Navigation:** Every public page has the same `<header>` with the same nav links. Add `class="active"` to the current page's nav link. The admin page is intentionally excluded from the nav.

## Design Constraints

- Academic ГОСТ style — Times New Roman font, minimal decoration, dark background `#1a1a1a`
- Keep JavaScript minimal; new interactive features should be added to `js/` as separate files
- Publications must follow ГОСТ citation format
- All text content is in Russian
