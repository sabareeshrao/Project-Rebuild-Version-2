# nanoGPT Batch 04 — Source-Commit QA (046–060)

**Status: PASS for Git source fidelity, multi-file lineage and controlled regression checks.**

## Historic source commits inspected

- Commit 46: `253519d20b472ec231f0afe6283311fc58d9a732`.
- Commit 60: `3ad5fad8988a76d177b26c29b181bd57cf6e138f`.
- **12 successive model.py snapshots** (source commits 46–57), compared line by line against commit 45 and each predecessor; no edit/deletion/reordering was observed.
- **3 independently read, new-file snapshots** at commits 58–60; the final commit-60 versions of all four source files were also compared exactly with the seven indexed chunks.
- Original model.py grows from **261 to 330** lines, adding **69**.
- Three real root files appear after model.py: `LICENSE` (21 lines, commit 58), `.gitignore` (12, commit 59), `.gitattributes` (3, commit 60).
- Source commits 46–57 add model.py lines: **6, 8, 4, 6, 2, 8, 8, 8, 7, 4, 6, 2**.
- Across Batch 04: **105 new physical lines**, four files and **366 total indexed physical lines**.

## Stable IDs / chunks

- model.py: `FIL-001`, **STM-262–330** in [046-060.json](data/batches/046-060.json).
- LICENSE: `FIL-002`, **STM-331–351** in [046-060-license.json](data/batches/046-060-license.json).
- .gitignore: `FIL-003`, **STM-352–363** in [046-060-gitignore.json](data/batches/046-060-gitignore.json).
- .gitattributes: `FIL-004`, **STM-364–366** in [046-060-gitattributes.json](data/batches/046-060-gitattributes.json).
- Each record includes the actual path and permanent full STM ID. `n` remains a local physical line number for each file, not a reused global identity.
- New license text is classified as plain text, not misleading Python syntax. The original source itself was not modified.

## Controlled regression verification — PASS

A combined manifest/source audit performed **35 controlled checks** plus an additional mocked-DOM virtualizer check:
- 60 contiguous original source commits, 366 distinct STM IDs, seven valid chunks, four files, and 62 structural scopes.
- Batch ranges: 16–30 = 92, 31–45 = 93, 46–60 = 69 model.py + 36 root metadata lines.
- File introduction correctly yields 0 rows before creation, and 21/12/3 rows at source commits 58/59/60.
- SourceStore loads cross-batch windows, reuses cached JSON without redundant fetches, and preserves source-order alignment.
- Red Class and Blue Method / Orange Block / Yellow Nested colors, including true blanks and documentation; neutral outside scopes; pink docs; saturated two-tone File colors.
- Conditional green divider only between consecutive distinct groups; no divider between nonconsecutive rows or in Lines mode.
- Filename chip **first**, colored STM chip second, code third; full source ID remains unchanged.
- Simulated category change reused original DOM rows, scroll offset, virtual height index and request ID without replacing the row tree.
- `view.js`, `virtual.js` and `app.js` parsed successfully in the controlled harness.

## Verified limitations

- This was **source-by-source GitHub verification plus a mocked runtime/DOM test**. It was NOT a real Android Chrome or desktop browser run, a screenshot audit, or a verified deployed GitHub Pages visit.
- Not a measured 100k-line/1M-line performance test. The code retains the bounded-cache/windowed-rendering architecture.
- All 60 source commits checked so far are append-only; versioned edits/renames in later batches will need a separate, explicit lineage policy before being indexed.
