# nanoGPT — Source-Commit Batch Tracker

**235 reconstructed nanoGPT source commits. 16 batches: 15 commits each, except final batch with 10.** Exclude viewer, handover prompts, learning and other non-nanoGPT commits.

| Batch | Original nanoGPT source commits | Status |
|---:|---|---|
| 01 | 001–015 | **Complete, 76 original physical lines, model.py** |
| 02 | 016–030 | **Complete, model.py now 168 lines** |
| 03 | 031–045 | **Complete, model.py now 261 lines** |
| 04 | 046–060 | **Complete, four files / 366 lines total** |
| 05 | 061–075 | Planned |
| 06 | 076–090 | Planned |
| 07 | 091–105 | Planned |
| 08 | 106–120 | Planned |
| 09 | 121–135 | Planned |
| 10 | 136–150 | Planned |
| 11 | 151–165 | Planned |
| 12 | 166–180 | Planned |
| 13 | 181–195 | Planned |
| 14 | 196–210 | Planned |
| 15 | 211–225 | Planned |
| 16 | 226–235 | Planned (10 source commits) |

## Batch 01 evidence

- Original source SHA range: cac2c626c007c5a5bb298f001a9efa7091a313ca through af0f71fda3840a543379f9e075d032a77d5380f1.
- Fifteen authentic historical model.py snapshots read and checked against indexed original source lines; all match.
- Source line counts after each source commit: **8, 16, 20, 24, 27, 33, 37, 43, 45, 50, 54, 60, 64, 71, 76**.
- At Batch 01 end: 76 physical lines; 11 blank, 9 docstring, 10 standalone # comment and 46 code.
- Stable STM IDs retained; original 30-commit HTML prototype untouched.

## Definition of Done for future batches

Archive original SHAs and source file list; verify every new file/line across all 15 snapshots, including whitespace and blank lines; assign new stable file and STM IDs only for truly introduced source lines; append metadata/chunks; audit category colors and green same-category dividers; test inclusive range and single-commit navigation; update QA and tracker before marking complete.


## Viewer-only UI refinement (no source batch advanced)

After Batch 01, the modular viewer received a compact sticky toolbar, persistent colored hierarchy buttons, Full/Added/Selected/**All commits** controls, short STM plus separate filename chips, and DOM-in-place category recoloring to avoid page shaking. The first-batch source data and old prototype remain unchanged. **This sentence originally described the UI-only milestone; subsequent source Batches 02–04 are now complete.**

- [Implementation commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/8b12df7ed3c438438896f09ce0cb52a66d15dee4)
- [UI QA report](QA-UI-REFINEMENT.md)

## Batches 02–04 — completed and verified

**Current index: 60 of 235 source commits; 4 original files; 366 original physical lines; 7 JSON source chunks.** No historical source was rewritten and no STM IDs were changed.

| Batch | Original commit SHAs | New lines | Verified cumulative state | QA |
|---|---|---:|---|---|
| 02 (16–30) | `af508e60` → `5f05102b` | 92 | model.py 168 lines | [Batch 02](QA-BATCH-002.md) |
| 03 (31–45) | `a493dda8` → `8abb79a4` | 93 | model.py 261 lines | [Batch 03](QA-BATCH-003.md) |
| 04 (46–60) | `253519d2` → `3ad5fad8` | 105 | model.py 330, LICENSE 21, .gitignore 12, .gitattributes 3 | [Batch 04](QA-BATCH-004.md) |

The 45 additional source commits were individually matched to original Git history. For the model.py additions, every intermediate snapshot preserved all prior physical lines byte-for-byte; the original new-file snapshots were also inspected at commits 58–60. Final per-file snapshots at commit 60 exactly matched concatenated source JSON records. All 366 permanent STM IDs were validated for uniqueness and chronological introduction; 62 manifest structural scopes are indexed.

[Manifest integration implementation commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/820e9a7aec59253748c2b473efb9735de06be6e8) · [Source chunk directory](data/batches/) · [Latest viewer](index.html).

Additional controlled regression checks: **35 passing assertions** across cumulative/selected ranges, file introductions, chunk boundary fetches and LRU reuse, hierarchy colors, comment/docstring classification, green dividers and filename-first chips; a mocked-DOM check independently validated in-place category recoloring, retained row objects, virtual scroll measurements and scroll offset. Actual Android/desktop visual tests, live Pages availability, and 100k+ line performance benchmarks remain unverified.

**Next source batch: 05, commits 061–075.** Before indexing, recheck authentic snapshots and handle any new edits, deletions, moves or renames explicitly rather than assuming all later commits append.
