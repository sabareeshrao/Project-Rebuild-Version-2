# nanoGPT — Source-Commit Batch Tracker

**235 reconstructed nanoGPT source commits. 16 batches: 15 commits each, except final batch with 10.** Exclude viewer, handover prompts, learning and other non-nanoGPT commits.

| Batch | Original nanoGPT source commits | Status |
|---:|---|---|
| 01 | 001–015 | **Complete, 76 original physical lines, model.py** |
| 02 | 016–030 | Planned |
| 03 | 031–045 | Planned |
| 04 | 046–060 | Planned |
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

After Batch 01, the modular viewer received a compact sticky toolbar, persistent colored hierarchy buttons, Full/Added/Selected/**All commits** controls, short STM plus separate filename chips, and DOM-in-place category recoloring to avoid page shaking. The first-batch source data and old prototype are unchanged; **Batch 02 (nanoGPT 016–030) is still planned**.

- [Implementation commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/8b12df7ed3c438438896f09ce0cb52a66d15dee4)
- [UI QA report](QA-UI-REFINEMENT.md)
