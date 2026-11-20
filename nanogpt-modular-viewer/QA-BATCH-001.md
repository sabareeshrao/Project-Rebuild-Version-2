# Batch 01 QA — Original nanoGPT source commits 001–015

## Original GitHub snapshot verification: PASS

Every original model.py file was fetched separately at its exact source commit SHA; the full physical source-line sequence was compared to the corresponding saved STM records. All 15 matched character-for-character per line, including indentation, comments and blank lines. Each snapshot ends with a final newline terminator, which is not counted as an extra source line.

| Original commit | Source lines | Source equality |
|---:|---:|---|
| 01 | 8 | PASS |
| 02 | 16 | PASS |
| 03 | 20 | PASS |
| 04 | 24 | PASS |
| 05 | 27 | PASS |
| 06 | 33 | PASS |
| 07 | 37 | PASS |
| 08 | 43 | PASS |
| 09 | 45 | PASS |
| 10 | 50 | PASS |
| 11 | 54 | PASS |
| 12 | 60 | PASS |
| 13 | 64 | PASS |
| 14 | 71 | PASS |
| 15 | 76 | PASS |

- First actual source SHA: cac2c626c007c5a5bb298f001a9efa7091a313ca.
- Last actual source SHA: af0f71fda3840a543379f9e075d032a77d5380f1.
- One original file in these 15 commits: model.py.
- Classification: **76 lines = 11 blank + 9 docstring + 10 standalone # comment + 46 code**.
- STM IDs preserved in sequence from STM-001-FIL-001-model.py through STM-076-FIL-001-model.py.
- No changes were made to original Python code or to the accepted commit-id-demo/index.html.

## Modular architecture checks

The HTML shell contains no original source lines. Four JavaScript modules and one CSS file are independently stored and use a manifest plus a separate 76-line source data chunk. Source chunks are fetched on demand and cached with an LRU limit. The code-area virtualizer uses normal window scrolling, not a fixed-height nested code container. It estimates variable row heights, updates measurements with ResizeObserver and mounts a near-viewport subset of source rows. Scope-color logic is independent of source content and preserves original STM IDs.

## Verification limits

Data parity and JavaScript syntax were checked during authoring. A further runtime/browser visual smoke test and public GitHub Pages availability check are separate tasks; this document does **not** claim those have passed. Current historical data is append-only; later edits/renames require explicit provenance-aware handling rather than assuming all history is append-only.

## Post-publication implementation tests — PASS

- Re-fetched all **11 created files** from GitHub; every file was readable and the versioned HTML contained no original source JSON.
- All four JavaScript modules parsed successfully after removing ESM import/export statements for a controlled syntax check.
- Manifest indexes exactly **15 source commits**, 76 physical model.py rows and 13 beginning structural scopes; all 76 STM IDs match the original numbered registry.
- Commit window checks: Full commit 15 → 76 lines; Added commit 5 → 3; Only commit 5 → 3; Selected commits 5–10 → 26; Selected commits 1–15 → 76; Added commit 15 → 5.
- Lazy SourceStore test loaded two non-overlapping windows but fetched the underlying JSON chunk only **once**, reusing cached data.
- 15 selected-chip cases (including blanks and documentation) and 10 same-category-divider cases passed in a controlled renderer test.
- A lightweight mocked DOM test executed the actual virtual-renderer class: it mounted **31 nearby rows out of 76**, maintained a positive lower spacer for the other rows, attached observers, and passed a variable-height Fenwick update/search check.
- The original 30-commit HTML remains at ../commit-id-demo/index.html; it was not changed by the modular viewer commit.
- Modular implementation GitHub commit: https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/b9873f09edf42c197a6002d42a3bf943c7ac3ac3

**Still unverified:** true rendering/scroll performance in Android Chrome or desktop Chromium, live Pages deployment, and behavior with 100,000+ indexed lines. A mocked DOM unit test is not a substitute for a real browser test.
