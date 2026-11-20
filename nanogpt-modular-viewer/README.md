# nanoGPT — Modular Commit-First Code Viewer

**Batches 01–04 of 16 are implemented for original nanoGPT source commits 1–60.** The modular explorer now covers **four original files, 366 physical source lines and seven JSON chunks**. It remains in a separate folder; the accepted 30-commit reference at ../commit-id-demo/index.html is NOT modified.

## Entry points

- [Open the viewer](index.html)
- [Source history manifest](data/manifest.json)
- [All seven batch source chunks](data/batches/)
- [Batch 01 source lines](data/batches/001-015.json)
- [Batch 02 source lines](data/batches/016-030.json)
- [Batch 03 source lines](data/batches/031-045.json)
- [Batch 04 model.py lines](data/batches/046-060.json)
- [Full batch tracker](BATCH_TRACKER.md)
- [Batch 01 QA](QA-BATCH-001.md)
- [Batch 02 QA](QA-BATCH-002.md)
- [Batch 03 QA](QA-BATCH-003.md)
- [Batch 04 QA](QA-BATCH-004.md)
- [Compact sticky-toolbar / stable-scroll QA](QA-UI-REFINEMENT.md)
- [Prior viewer design handover](../AI-CODE-VIEWER-HANDOVER/README.md)

Expected GitHub Pages address (depends on repository Pages configuration): https://sabareeshrao.github.io/Project-Rebuild-Version-2/nanogpt-modular-viewer/

## Source coverage

These are the first **60 reconstructed nanoGPT source commits**, NOT the repository's newer HTML, learning, handover or prompt-history commits. First original source SHA: `cac2c626c007c5a5bb298f001a9efa7091a313ca`; latest indexed original source SHA: `3ad5fad8988a76d177b26c29b181bd57cf6e138f`. All 60 source commits were checked against their real chronological history. At commit 60: `model.py` has **330** physical lines, `LICENSE` **21**, `.gitignore` **12** and `.gitattributes` **3**. The first 15 commits remain historically documented in [Batch 01 QA](QA-BATCH-001.md).

The historical series starts with model.py headers, imports, LayerNorm and CausalSelfAttention; builds MLP, Block, GPTConfig and GPT; then introduces generation and optimizer logic, before adding three actual root metadata/license files. Earlier snapshots are intentionally incomplete code; source is never invented merely to make an intermediate commit runnable.

## Modular folder architecture

| File | Responsibility |
|---|---|
| index.html | Lightweight semantic viewer shell; no embedded source records |
| assets/viewer.css | Colors, responsive layout, code wrapping |
| assets/app.js | Category selection, file chooser, commit/range navigation |
| assets/store.js | Lazy source-chunk fetching, per-file counts, 10-chunk LRU |
| assets/view.js | Original STM chips, syntax, hierarchy scopes and conditional dividers |
| assets/virtual.js | Natural page-scroll virtualization with measured variable-height code rows |
| data/manifest.json | Source commit SHAs, per-file indexes, scopes and chunk pointers |
| data/batches/*.json | Seven original source-data chunks, indexed in commit-introduction order across four files |

The browser loads code data on demand and mounts only nearby visible rows, rather than creating DOM elements for all source lines. This is the modular foundation for bigger repositories, not a claim that the full 235-commit or million-line build is complete or benchmarked.

## Selected design rules

1. **Lines** category: original lines all green.
2. **Class, Method, Code Block, Nested Block, File, Directory, Module**: every line inside the selected group, including blank lines and comments/docstrings, adopts the selected category chip color. Unmatched lines use neutral charcoal.
3. **File** category: alternate saturated sky blue shades #00BFFF and #008CFF when different files appear.
4. **Comments**: Python standalone # comments and triple-quoted documentation pink, other chips neutral; executable inline comments remain part of code.
5. **Green boundary rule**: a thin green line in the CODE pane only when adjacent, distinct non-overlapping groups of the SAME currently selected category meet. No fake blank rows or STM IDs. The rejected sky-blue boundary chips stay rejected.
6. Commit jump **5** filters lines introduced at source commit 5. Jump **5-10** filters introductions over the inclusive range. Full file shows the source snapshot through the selected commit. Added only shows additions from the selected commit.
7. Original indentation, exact source line text, IDs, no horizontal scrollbar, and natural page scroll are preserved.

## Run the modular viewer

Use GitHub Pages, or serve the checked-out folder with a local HTTP server. Do **not** open a downloaded index.html by file:// because JavaScript modules and JSON fetches need HTTP(S).

For a local checkout: change directory to nanogpt-modular-viewer, run **python3 -m http.server 8000**, then visit http://localhost:8000.

## Continue with Batch 05 (original source commits 61–75)

1. Identify the authentic source commits 61–75, excluding viewer/docs commits.
2. Fetch and compare all historical source files and snapshots. Source editing, deletion, renaming or moving must be modeled explicitly; do not assume the next batch stays append-only.
3. Create the next verified modular JSON chunk(s), extending global STM IDs without altering older IDs; update source lineage and manifest totals/scopes.
4. Regression-test Full file, Added only, Selected ranges, All commits reset, category colors and conditional code-only dividers, comments/docstrings and virtual scroll stability.
5. Publish QA and tracker evidence in separate commits; record every user prompt in the historical prompt index. Keep the original single-file prototype intact.

## Limitations

Through the first **60 source commits**, source histories were verified as append-only; later commits may require versioned edit, deletion, move and rename events. Four original files now have independent IDs, per-file line counts and chunk references. Very large projects may need paged scope metadata and browser scroll-height segmentation in addition to windowed DOM rendering. **Android/desktop visual QA, verified live Pages deployment and high-line-count performance benchmarks have not been completed.**


## UI refinement after the initial Batch 01 — latest accepted version

This is a **viewer-interface change only**; the 15 historical nanoGPT source commits, 76 exact model.py source lines, original STM IDs, JSON data chunks and old single-file prototype remain untouched.

- Compact dark **sticky toolbar** keeps commit navigation, jump input, four view controls and category selection available while scrolling to the bottom of a long file. The title/statistics scroll away.
- Category buttons are always **filled with their identity colors** (red Class, blue Method, orange Code Block, yellow Nested, green Lines, pink Comments, sky-blue File, etc.), regardless of selection. The active category has a white outline, not a different size.
- Narrow screens can swipe the **category strip horizontally**; the CODE area still wraps without a horizontal scrollbar.
- The explicit **All commits** control clears a selected commit/range and shows the cumulative file through the **latest indexed commit** (15 at Batch 01, eventually 235). **Full file** instead means the cumulative file through the currently selected commit.
- The source ID column now has two adjacent chips: short visual ID such as **STM-029**, and the actual filename **model.py**. The original complete ID (STM-029-FIL-001-model.py) remains unchanged in JSON, the row DOM data attribute and accessibility text. The filename is a neutral chip so the selected hierarchy remains the only active category color.
- On changing **only the hierarchy category**, the viewer recolors the existing DOM rows **in place**, without replacing rows, resetting measured heights or jumping page position. A fixed-height line of chip metadata, fixed-height source status/hints, and width-only remeasurement further reduce layout jitter.
- The conditional green divider remains a thin CSS line in the code area only when consecutive, nonoverlapping sibling groups of the same selected category meet.

[Implementation commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/8b12df7ed3c438438896f09ce0cb52a66d15dee4) · [Focused tests and limitations](QA-UI-REFINEMENT.md).

**Verification boundary:** The source-control and DOM behavior passed static and mocked-DOM tests; actual Android/desktop browser visual rendering and live Pages deployment remain separate checks, not verified in this test report.

## Current Batch 04 milestone — source commits 01–60

- [Verified source manifest](data/manifest.json): **60 commits**, four files, **366 physical lines**, 62 structural scopes, seven independently loadable JSON chunks.
- [Batch 02 QA](QA-BATCH-002.md), [Batch 03 QA](QA-BATCH-003.md), [Batch 04 QA](QA-BATCH-004.md): real historical snapshot comparisons, introduction-order STM IDs and controlled regression evidence.
- Viewer shell metadata (title, batch label, file counts) now derives the current batch from the manifest instead of showing stale Batch 01 text. `LICENSE` displays as plain text instead of false Python syntax highlights.
- The previously accepted palette, sticky controls, filename → STM → code order, in-place category updates, scroll virtualization and the untouched old prototype remain intact.

**Latest implementation QA boundary:** 35 controlled assertions plus mocked DOM identity/scroll preservation checks passed. No independent Android/browser screenshot or published Pages visit was verified.

## Latest accepted UI — compact STM-only chips (Prompts 063–064)

The color-coded source chip now shows **only** `STM-NNN`. Color conveys Class, Method, Block, Nested Block, Lines, Comments, Module, Directory or File; do not repeat category names, scope IDs, code text or commit markers inside visible chips. The previously accepted extra first-row labels are superseded.

Rows still show **neutral filename → colored STM number → original source code** with preserved indentation. Full historical STM IDs and scope provenance stay in source JSON, row attributes and accessible labels; changing category recolors existing mounted rows without redrawing or changing their heights. The second chip-metadata line and its reserved vertical space were removed.

- [Renderer implementation](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/e514141bb688f04fcb03f8de0a3363926aa3b02b)
- [Compact CSS implementation](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/edcbc56f818dc87c13bdfcad64c1b968abf2fc81)
- [Focused QA — 24 controlled passing checks](QA-UI-COMPACT-STM-CHIPS.md)
- [Original prompt 063](../AI-CODE-VIEWER-HANDOVER/prompts/063.md) and [approval 064](../AI-CODE-VIEWER-HANDOVER/prompts/064.md)

The 60-commit source manifest and all 366 original source-line IDs were untouched. Live browser visual testing and GitHub Pages deployment remain unverified.

## Independent Comments overlay — latest accepted UI (Prompt 065)

**Comments is now an ON/OFF overlay, independent of the selected hierarchy.** Select Class, Method, Code Block, Nested Block, Lines, File, Directory or Module, then tap the pink **Comments** button. Both buttons can be active simultaneously. Genuine standalone `#` comments and Python docstring rows within the currently selected group become pink `#DB2777`; the remaining member lines retain their original category color. Comments **outside** the selected Class/Method/Block/Nested scopes remain neutral, not pink. Lines + Comments highlights documented rows across the active file.

Toggling Comments OFF restores the selected category's colors; changing the selected hierarchy keeps the Comments toggle state. The source STM IDs, two-chip filename-first ordering, single-line STM visible text, original source code/indentation, conditional sibling dividers and in-place virtual row recoloring are preserved.

- [Implementation record (Prompt 065)](../AI-CODE-VIEWER-HANDOVER/prompts/065.md)
- [Controlled 41-check QA report](QA-UI-COMMENTS-OVERLAY.md)
- Primary implementation commits: [viewer coloring](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/c31bed795239800888ec3f47104caeda080fc7ac), [independent control state](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/c1b0f00c1b94d5b194a09478b5a8c88dfba9fbd8), [virtual scroll preservation](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/6a20111cb2cfbb12962436be3b8e8628fae2c429).

Source history remains **60 of 235** reconstructed nanoGPT commits / **366 physical lines** across **four original files**. No Android Chrome/desktop screenshot audit or verified GitHub Pages launch was performed during this change.
