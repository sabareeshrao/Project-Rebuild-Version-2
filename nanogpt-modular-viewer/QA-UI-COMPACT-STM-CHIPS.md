# nanoGPT Modular Viewer — Compact Single-Line STM Chip QA

## Scope and accepted design

This **UI-only** change follows the user's screenshot feedback in Prompt 063 and approval in Prompt 064. The color already identifies the category, so the source chip must display **only the short STM ID**, not a second line such as `NESTED · NBL-001 · if not self.flash`, a class/method name or a commit marker.

The source row stays **neutral filename chip → colored STM chip → original source text**. All original STM IDs, source text, scope IDs, historical commit data, comment/documentation classifications and lazy chunks remain unchanged.

## Implementation — GitHub commits

- [Renderer: `e514141`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/e514141bb688f04fcb03f8de0a3363926aa3b02b) — removed the visible `.chip-meta` child and text updates from `assets/view.js`; each chip now has exactly one visible `.line-id`. The complete STM name and structural/commit details stay in `row.dataset.stmId` and accessible `aria-label` values.
- [Stylesheet: `edcbc56`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/edcbc56f818dc87c13bdfcad64c1b968abf2fc81) — removed reserved metadata-line height, centered the single STM label and reduced minimum chip/row height for a compact flat viewer. Row size remains independent of the currently selected category.

## Controlled regression checks — PASS (24)

The current committed renderer, stylesheet, virtualizer, application module, manifest and original source records were reopened from GitHub and exercised with a JavaScript mocked-DOM harness.

1. `view.js`, `virtual.js` and `app.js` parse successfully when ESM declarations are removed in the controlled harness.
2. No visible `.chip-meta` element or CSS selector remains.
3. Filename is the first chip; the second colored chip contains exactly one visible child (`.line-id`).
4. Nested-category source line 46 displays exactly **STM-046** with yellow `#FACC15`, not `NESTED · NBL-001 · if not self.flash`.
5. `STM-046-FIL-001-model.py` remains unchanged in `row.dataset.stmId`; the original `NBL-001` structural identity is still available in the chip's accessible label.
6. Switching Class, Method, Code Block, Nested Block and Lines colors preserves the original chip node and its single STM text without inserting or removing DOM nodes.
7. Standalone comments remain pink in Comments mode; genuine source blanks inside Class scope follow red.
8. The source virtualizer's category-only transition preserved mounted row instances, virtual height index, DOM replacement counter and simulated page scroll position.
9. Original indexed history stays **60 source commits**; prior source chunks and classifications were not edited.

The 24 checks include these cases and associated parsing, CSS and source assertions. Existing Full file, Added only, Selected range, All commits, conditional code-area dividers, sticky toolbar and filename-first chip architecture were not intentionally changed.

## Browser verification boundary

**No independent Android Chrome or desktop Chromium rendering/screenshot test was performed**. CSS compaction was checked statically and the UI updates were tested with mocked DOM/scroll objects; this is not a real-device pixel/layout audit. Live GitHub Pages deployment was not independently confirmed. No large-codebase performance benchmark was run.

## Later-work rule

Do not reintroduce a category/name/commit metadata line in source chips. A single short STM label is the only visible chip text; detailed IDs and provenance belong in the manifest, record fields and accessible attributes. If commit grouping needs a visible UI affordance later, design it **outside** these chips and obtain user approval first.
