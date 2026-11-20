# Mandatory Quality Gates — Zero Compromise on Source Fidelity

## Repository and history
- [ ] Confirm exact repository, default branch, oldest→newest ordering, and parent chains.
- [ ] For each selected commit, compare reconstructed snapshot bytes/lines with the real committed file (including indentation, empty lines and comments). Count **every** actual file, not just Python/Java code.
- [ ] Preserve file paths and file IDs across renames with explicit policy; do not silently reuse one file ID for multiple unrelated files.
- [ ] Document merges, deletions, moves and edits; don't claim stable line identity from Git alone in ambiguous cases.
- [ ] Validate IDs unique, correctly formatted and monotonic by introduction order. Every physical line including blanks and comments has exactly one ID.
- [ ] Validate scope ranges (class, method, nested blocks), including incomplete snippets in early commits. Never invent a full method or closing brace not present yet.
- [ ] When a commit range is selected, show **only its additions**, not all cumulative earlier code. Test 1, 5, 5-10, 1-N, N, invalid 0, >N, reversed ranges.
- [ ] Distinguish standalone `#` comments, standalone triple-quoted Python documentation, statements with inline comments, and assigned string literals. Only standalone comments/documentation become pink in Comments mode.
- [ ] Every source blank line remains visible with its unchanged STM ID, and inherits the selected category's color when in scope. Default Lines view uses green; unselected-category/nonmember chips are neutral charcoal.
- [ ] No sky-blue structural boundary chips or fake green gap rows. A thin #15803D line is allowed in the CODE area only when two distinct adjacent groups of the selected same category touch; no fake STM ID.
- [ ] Python triple-quoted documentation (`"""`, `'''`) becomes pink in Comments mode including multiline interiors; triple-quoted assigned values and regular inline comments stay code/green.

## Layout
- [ ] All visible original source lines appear and source text is readable, with syntax colors, indentation and no truncation.
- [ ] Left chips perfectly aligned with corresponding code rows, centered vertically; height increases with wrapped source.
- [ ] Wrapping keeps continuation aligned under statement indentation, never resets at left edge.
- [ ] No horizontal overflow at widths 320, 360, 390, 430, 768, 1200 and 1440 pixels.
- [ ] Entire page scrolls naturally; no fixed-height internal vertical code scroll region.
- [ ] No nested visual bounding boxes for scopes; scope selected via colored chips.
- [ ] File/package/module view alternates assigned A/B colors when consecutive displayed grouping changes.
- [ ] No unreadable chip text, overlap, unstable layout or unwanted hover popups.
- [ ] Keyboard navigation must not hijack normal vertical page scroll (use explicit controls).

## Publication and verification
- [ ] Parse/validate generated JS and HTML.
- [ ] Browser-run and screenshot-test the actual saved HTML (not only an approximation/fixture); verify both narrow and desktop.
- [ ] Perform negative-case tests: empty file, README-only commit, non-source commit, multi-line expressions, comment-only commit, rename, deleted lines, multiple files in same commit.
- [ ] Keep original project source unchanged; place viewer in a separate destination.
- [ ] Re-fetch committed artifact from GitHub and verify it matches the tested output.
- [ ] Return exact commit/file URL and Pages link only after checking deployment state; disclose anything unverified.
- [ ] Never falsely claim audits or screenshot tests that did not actually run.

## Continuous improvement protocol
When user rejects an implementation: capture exact complaint, identify failure mode, update accepted design rules, implement a focused fix, run regression tests for ALL existing accepted behavior, add before/after evidence, and record Git commit SHA. Next AI starts from the latest accepted version, **never from the rejected prototype**.

## Regressions from Prompts 048–050
- [ ] In Class/Method/Block/Nested/File/Package/Module views, ALL member lines share their category chip color regardless of blank/comment/docstring status; outside groups have neutral charcoal chips, NOT green.
- [ ] No green CSS `box-shadow` accent appears on every newly added code line; green code dividers are only conditional same-category group boundaries.
- [ ] Two sibling adjacent class/method groups produce one thin green line **in the code area**; no divider between overlapping outer and inner nested blocks.
- [ ] No dividers in default Lines and Comments modes, between unrelated groups, or between nonconsecutive lines after commit filtering.
- [ ] File category uses alternating saturated sky blue `#00BFFF` and `#008CFF`, not the old Cream/Cyan.
- [ ] All 168 sample source IDs and 30 commit filters remain unchanged; inspect affected styles at mobile and desktop widths.

## Sticky viewer QA — Prompts 056–057
- [ ] Sticky toolbar remains compact, with title/stats scrolling away; category buttons remain fully color-filled in all pressed states.
- [ ] Category-only selection reuses row objects and height measurements; scroll position and visible source rows stay stable.
- [ ] A fixed-size chip metadata slot and status/hint rows prevent height changes when category text changes; mobile height-only resize does not reset the virtualizer.
- [ ] Each row displays short STM chip plus separate filename chip, with full STM ID unchanged in original source data and row attributes.
- [ ] After 5–10, Full file returns cumulative source through commit 10, while All commits clears selection and returns latest indexed commit 15 with 76 lines.
- [ ] Swipe is allowed for category CONTROLS on small screens, never for CODE lines. Browser visual testing required before claiming rendered Android layout verified.

## Latest source-chip regression gates — Prompts 063–064

- [ ] Colored STM chip has **exactly one visible text child**, the short `STM-NNN`. No second `.chip-meta` row, `NESTED · NBL-001 · ...`, class/method label or commit-marker text.
- [ ] Neutral filename chip remains first; STM ID chip second; real syntax-highlighted source third. Chip label never duplicates `filename`.
- [ ] Full permanent STM ID, source scope IDs and provenance remain in JSON/DOM attributes and accessible labels; their loss is a data regression.
- [ ] Category selections recolor the existing STM chip without replacing mounted row elements, varying row height or moving page scroll.
- [ ] Comments, genuine blanks, docstrings and out-of-scope lines still follow accepted category rules. No fake dividers/source rows; no edits to original source files or the old HTML prototype.
- [ ] Source-row compaction is checked across narrow and desktop viewport sizes when a real-browser test is available; mocked-DOM/JS checks alone do not count as real browser visual QA.

[24 focused controlled checks](../nanogpt-modular-viewer/QA-UI-COMPACT-STM-CHIPS.md) passed when the UI was updated, but real Android/desktop rendering and Pages deployment remain unverified.

## Comments overlay regression gates — Prompt 065

- [ ] **Comments is a toggle**, not an exclusive hierarchy category. Class + Comments and other category + Comments buttons may both be `aria-pressed=true`; toggling it OFF must preserve the base category.
- [ ] With Class selected and Comments ON: real standalone comments/docstrings inside the class are pink `#DB2777`; ordinary code, blank lines and inline trailing `#` source lines retain Class red `#DC2626`; comment/docstring rows outside all class scopes remain charcoal.
- [ ] Repeat for Method blue, Block orange and Nested yellow. Out-of-scope comments remain neutral.
- [ ] With Lines / File / Directory / Module selected, each matching standalone comment/docstring may become pink when Comments is ON; base member lines stay their original palette.
- [ ] Turning Comments OFF restores original hierarchy colors **without changing the row's STM ID or DOM node**. Switching Class→Method while Comments is ON keeps the toggle ON.
- [ ] The overlay does not introduce green boundary dividers, synthetic source rows, extra visible chip labels or edited source text.
- [ ] Scroll offsets, virtualized row measurements and existing mounted rows remain stable on toggling; unchanged commit/range selection still works, including All commits reset.
- [ ] Keep source identification based on original classification: standalone `#` comments and recognized true docstrings, not trailing inline `#` or ordinary assigned triple quotes.
- [ ] Browser visual checks must be reported separately from controlled DOM/mock assertions; do not claim Android/desktop screenshots without running them.

[41 passing targeted controlled checks](../nanogpt-modular-viewer/QA-UI-COMMENTS-OVERLAY.md) (33 renderer+virtualization and 8 toolbar interactions); real mobile/desktop and Pages status are not verified.
