# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build   # Regenerate dist/ (deletes existing dist/ first)
npm run server  # Serve dist/ at http://localhost:8080
```

There is no linter or test suite. After any change to source files, run `npm run build` and verify with `npm run server`.

## Architecture

This is a static site generator for a GitHub Pages site (`md-ndv356.github.io`). The entry point `index.js` reads source data/templates and writes everything into `dist/`, which is what gets deployed.

### Sub-projects

| Directory | Purpose |
|---|---|
| `genshin-rmm/` | Genshin Impact score viewer — the main complex sub-project (see below) |
| `bm2dx/` | beatmania IIDX FFmpeg web converter tool |
| `taiko/` | Taiko no Tatsujin battle page |
| `ndv-tickers/` | Version manifest JSON consumed by an external app/extension update checker |
| `quakemap-v2/` | Earthquake map viewer |
| `library/` | Shared client-side JS (animation, events, prototype extensions) |

All sub-projects except `genshin-rmm/` are copied into `dist/` verbatim. Only `genshin-rmm/` goes through the build step.

### genshin-rmm: Static Site Generator

`index.js` generates a multilingual static site for 15 language codes (`zh_cn`, `zh_tw`, `en_us`, `ko_kr`, `ja_jp`, `es_es`, `fr_fr`, `ru_ru`, `th_th`, `vi_vn`, `de_de`, `id_id`, `pt_pt`, `tr_tr`, `it_it`).

**Template syntax** (two distinct systems used together):
- `{{{id}}}` — content placeholder replaced by `contentReplacement()` in `index.js`. Used for data blobs and structural HTML.
- `{[{key:str}]}` / `{[{key:html}]}` — i18n placeholder replaced by `translateTemplate()`. Keys are looked up in `genshin-rmm/i18n-v2.json`. `str` escapes for JS string context; `html` escapes for HTML attribute context.

**Templates** are in `genshin-rmm/template/`:
- `index.html` → generates `dist/genshin-rmm/{lang}/index.html` (one per language)
- `songdetail/difficulty/index.html` → generates `dist/genshin-rmm/{lang}/{musicId}/{difficulty}/index.html`
- `about-bpmchange.html` → generates `dist/genshin-rmm/{lang}/about-bpmchange.html`

**Data files** (source of truth, edited by hand):
- `genshin-rmm/musictable-v2.json` — top-level metadata for each song (album, BPM, duration, etc.)
- `genshin-rmm/scorelist-v2.json` — per-song difficulty presence flags: `{ "_GMusic22": [easyLevel, normalLevel, hardLevel, legendLevel, "English Title"] }`. A value of `0` means that difficulty does not exist; non-zero is the difficulty level.
- `genshin-rmm/albumlist.json` — album list
- `genshin-rmm/history.json` — site update history shown on top page
- `genshin-rmm/i18n-v2.json` — all UI string translations keyed by ID and language code

**Per-song score data**: `genshin-rmm/music/_GMusic{id}.{difficultyIndex}.json` where difficultyIndex is 0–3 (easy/normal/hard/legend). Each file contains multilingual title/country/album, BPM info, duration, level (1–10 stars), and the `score` array (custom compact note format). Only create this file if `scorelist-v2.json` marks that difficulty as present.

**Adding a new song**: requires updating `musictable-v2.json`, `scorelist-v2.json`, and creating `music/_GMusic{id}.{n}.json` for each difficulty that exists.

**Data embedding**: large JSON blobs (score data, music table, score list, album list) are gzip-compressed and base64-encoded via `encodeBase64GzipUnicode()` before being embedded into HTML. Client-side JS decompresses them at runtime.

### ndv-tickers/version-list.json

This JSON file is consumed by an external app/extension. Timestamps (`last_update`, `date`) are Unix epoch seconds. The `extension.list` array is ordered newest-first.
