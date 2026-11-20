# nanoGPT — Modular Commit-First Code Viewer

**Batch 01 of 16 is implemented for original nanoGPT source commits 1–15.** It is in a separate folder. The accepted 30-commit prototype at ../commit-id-demo/index.html is NOT modified.

## Entry points

- [Open the viewer](index.html)
- [Source history manifest](data/manifest.json)
- [Batch 01 source lines](data/batches/001-015.json)
- [Full batch tracker](BATCH_TRACKER.md)
- [Batch 01 QA](QA-BATCH-001.md)
- [Prior viewer design handover](../AI-CODE-VIEWER-HANDOVER/README.md)

Expected GitHub Pages address (depends on repository Pages configuration): https://sabareeshrao.github.io/Project-Rebuild-Version-2/nanogpt-modular-viewer/

## Source coverage

These are the first 15 *reconstructed nanoGPT* commits, NOT the more recent HTML, learning, handover or prompt-history commits. First original source SHA: cac2c626c007c5a5bb298f001a9efa7091a313ca. Last original source SHA: af0f71fda3840a543379f9e075d032a77d5380f1. The original model.py source at the 15th commit has **76 physical lines**, including 11 genuine blank lines. Every source snapshot was compared against the exact original GitHub model.py version at that SHA.

The 15 commits gradually add the file header/imports, the optional-bias LayerNorm class, and most of CausalSelfAttention. Earlier snapshots are intentionally incomplete source; code is never invented merely to make an intermediate commit runnable.

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
| data/batches/001-015.json | 76 exact original source-line records introduced in source commits 1–15 |

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

## Continue with Batch 02 (original source commits 16–30)

1. Resolve their 15 authentic source SHAs from the same repository, oldest to newest, ignoring HTML and learning/history commits.
2. Independently fetch each GitHub source snapshot and verify every physical line, comment, indentation, blank and original STM identity.
3. Append only new lines to data/batches/016-030.json, update per-file chunk pointers, per-source-commit totals and structural scope metadata in data/manifest.json.
4. Verify Full file, Added only and range filters on each commit. Do not fake missing intermediate code or manufacture extra rows.
5. Update BATCH_TRACKER.md and QA evidence. Keep the earlier viewer intact.

## Limitations

The first 15 reconstructed commits are verified as append-only in model.py. If later commits edit/delete/rename older lines, the data model must be expanded to versioned line events; do not silently treat them as append-only. Multiple files need new stable file IDs and independently verified per-file cumulative line totals. Very large repositories may need paged scope metadata and browser scroll-height segmentation in addition to windowed DOM rendering. No claim of Android visual testing or completed GitHub Pages deployment is made in this document.
