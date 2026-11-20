# Modular nanoGPT Viewer — Sticky Controls and Stable-Scroll QA

**Applies to the modular viewer only.** This is an interface regression pass, not an additional nanoGPT source batch.

## Implementation

GitHub commit: https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/8b12df7ed3c438438896f09ce0cb52a66d15dee4

Files changed:
- index.html — reorganized compact toolbar, added an explicit All commits button, kept a horizontally swipeable category strip.
- assets/viewer.css — sticky toolbar with compact padding, all category chips persistently filled, active outline without layout change, reserved chip metadata height, separate neutral filename chip, status/meta text fixed to single-line heights.
- assets/app.js — All commits reset, range filter exit, active state and in-place category switching.
- assets/view.js — short visual STM ID, original full ID retained as source attribute, distinct filename chip, style updates on existing source rows.
- assets/virtual.js — source-range snapshots and in-place recoloring without DOM replacement/recalculating row heights; height-only mobile URL-bar resizes no longer invalidate row measurements.

## Checked (controlled unit/integration harness) — PASS

1. Original source manifest still indexes **15 nanoGPT commits / 76 physical model.py lines**. Source JSON and the existing 30-commit HTML reference are untouched.
2. Every changed JavaScript module parsed successfully. The new HTML has one All commits control and nine hierarchy categories; CSS has a sticky toolbar and all category colors filled.
3. Simulated first render mounted **32 nearby code rows**, not all 76.
4. Source row 20 visibly renders short ID **STM-020** plus separate filename chip **model.py**. Its preserved backing identifier is **STM-020-FIL-001-model.py**.
5. Switching from Lines to Class in the mounted viewer preserved the EXACT existing row objects, same virtual height index, same mounted source window, same DOM replacement counter, and same scroll position. No new source-chunk fetch was triggered by category-only selection.
6. The blank line 20 and documentation line 19 inside LayerNorm both adopted Class red #DC2626; outside-Class line 17 remained neutral charcoal #232323.
7. After Jump **5-10**, Selected mode showed **26** added source lines. Full file at commit 10 showed **50** cumulative lines. All commits reset the view to cumulative commit 15 with **76** lines, cleared the selection and jump input, and marked the All commits control pressed.
8. Conditional green source-area group dividers, comments/docstring classification, source IDs and historical raw data were not modified. Row metadata keeps a fixed one-line height during category changes.

## Known limits

- This test includes **static source checks and mocked DOM/scroll integration**, not a real Android Chrome or desktop Chromium screenshot/interaction run. Mobile sticky placement, category swipe ergonomics, and actual browser-height behavior should be checked interactively before considering mobile QA complete.
- The category strip uses horizontal swiping intentionally on narrow screens; **this is not code-area horizontal scrolling**.
- All commits currently means **all 15 indexed nanoGPT commits**. It will grow when source batches 02–16 are added; it does not falsely claim the full 235 are implemented.
- Large-file scroll-height segmentation, multifile swaps and non-append historical edits are not addressed by this UI-only change.
