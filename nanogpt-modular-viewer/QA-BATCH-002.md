# nanoGPT Batch 02 — Source-Commit QA (016–030)

**Status: PASS for historical source, indexing and controlled viewer regressions.**

## Authentic Git source

- First original source SHA: `af508e60e993883b8991763ab189fa9743b2ef68` (commit 16).
- Last original source SHA: `5f05102b47878b6f367b648613a5aef68f14122f` (commit 30).
- Inspected **all 15 original model.py snapshots** plus the original commit-15 baseline, matching every existing prefix line before taking the appended suffix.
- The 15 original commits add **92 physical lines** to `model.py`, from 76 to **168**.
- No historical edits, deletions, moves or renames appeared in this range.
- **STM-077 through STM-168**, preserving existing **STM-001 through STM-076**. Full identities retain `-FIL-001-model.py`.
- Exact additions by commit 16–30: **6, 3, 7, 7, 7, 10, 8, 8, 6, 7, 3, 8, 4, 6, 2**.

## Source classifications and data

- 92 added physical lines: **14 blank, 65 code, 7 standalone comments, 6 docstring**.
- Source text, trailing newlines, indentation and source kinds checked against the real commit-30 file and Batch 01 registry.
- [New modular source chunk](data/batches/016-030.json) committed as [`3815399`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/38153999679a41c8b4ec0617957b6c49b1bb7e36).
- [Manifest integration](data/manifest.json) is included in the cumulative Batches 02–04 [manifest commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/820e9a7aec59253748c2b473efb9735de06be6e8).

## Controlled regression checks

- Full file at commit 30 → 168 lines.
- Selected commits 16–30 inclusive → 92 newly introduced lines.
- Cross-chunk read over 168→169 returned each physical line exactly once.
- The previous 76 original IDs and text did not change.
- Existing category, blank/comment/docstring, divider and stable-scroll rules were tested again in the combined 60-commit manifest verification.

**Limits:** No Android/desktop real-browser screenshots and no independent live GitHub Pages deployment confirmation. All performance claims remain limited to the actual implemented virtualized architecture and controlled checks.
