# QA — Historical Class and Method, Independent File Toggle, Wider Filename Chip, Full File Semantics

## Original requests (Prompts 077–078)

Prompt 077 asks for Class and Method category colors, moves File from the structural STM chip to an **independent filename-chip-only toggle**, and rebalances filename/STM width by borrowing approximately 30% of the STM chip's prior share.

Prompt 078 adds an explicit non-negotiable rule: **Full file means all source lines in the historical snapshot, regardless of which structure category is active**. A Class/Method selection must never hide the rest of the source.

## Source UI contract

No redesign: original dark theme, original toolbar shape, syntax-highlighted code, historical Git order, deletion-code strikethrough, natural document scrolling and virtualized rows are preserved.

| Control | STM chip | Filename chip |
|---|---|---|
| Lines primary | Green `#15803d` across all lines | Neutral gray when File OFF |
| Class primary | Red `#dc2626` inside a Python `class` scope; out-of-scope neutral `#232323` | Unchanged |
| Method primary | Blue `#2563eb` inside `def` / `async def` (including free functions); out-of-scope neutral | Unchanged |
| Comments toggle ON | Pink `#db2777` only for standalone comments/multiline docstrings **within the selected structural scope** | Unchanged |
| File toggle ON | No effect on STM chip colors | Original file-dependent sky blues, alternating `#00bfff` / `#008cff` |
| File toggle OFF | No effect on STM chip colors | Original neutral gray |

The File and Comments toggles can both be ON simultaneously with Lines, Class or Method. The three relevant buttons remain pressed. Deleted source lines retain their **pre-edit structural scope**, colored ID, and struck-through code. Comments and documentation classification still comes from the proper historical Git source snapshot, not the final source file.

**Filename/STM split**: previously approximately 38% / 62% within the existing left-hand column; now **57% filename / 43% STM**. This transfers about 30% of the former STM share to File (0.30 × 62 ≈ 18.6 percentage points). Overall left/code column widths and responsive toolbar are unchanged.

**Persistent state**: The saved primary category can now be `line`, `class` or `method`; File and Comments booleans persist independently, alongside commit, mode, selected range and file dropdown. Legacy browser preferences with `category: 'file'` migrate to `category: 'line', fileOverlay: true`. Toggling colors repaints existing mounted rows without remounting or repositioning them.

## Full file invariant

`getRows()` in Full file mode iterates every `snapshot.files[path]` source line for the focused original Git commit, creates a code row for each, and only applies the **explicit file dropdown** filter, if any. No Class, Method, Comments, File or Lines category filters that list; they change appearance only. Blanks, comments, docstrings and all executable lines are retained. Deleted historical lines are excluded from the current historical snapshot (but remain visible in all-commit and selected-changes history modes).

If the dropdown is `All files`, Full file shows all text source files as they existed at that commit. If `model.py` is selected, it shows all of `model.py` **at the selected original commit**, which may naturally be shorter than `model.py` at the repository's current head. This is intentional and historically accurate.

## Tests performed

- **18/18 targeted Python fixture and UI checks passed**: Class header membership, class docstrings, method declarations and decorators, nested method+class membership, both kinds of comments, top-level function membership, dedent behavior, non-Python neutrality, enabled controls and 57/43 CSS width.
- **14/14 full-history structural replay checks passed**, rebuilding all 159 original nanoGPT first-parent commits from unchanged 14 Git patch chunks and verifying exact 3,533 original text change events (2,729 added and 804 deleted), all 1,220 latest Python source lines, and all 1,925 verified current snapshot text lines (the unavailable oversized notebook patch is still excluded).
- **23/23 controlled interaction checks passed**: independent File, Comments, Class, Method and Lines toggle states and visible chip colors; persistence across numeric Jump, stepper, file dropdown, All commits, and browser storage; separate filename/STM coloring; original code column geometry untouched.
- **9/9 focused persistence/migration checks passed**, including a previous saved File primary mode migrating into the independent File toggle.
- **57/57 Full file invariance checks passed** across original commits 1, 2, 11 and 24, for every combination of Lines/Class/Method primary, Comments ON/OFF and File ON/OFF. Every combination yielded the **identical ordered STM ID list and identical full physical line counts** at each commit. Checked file-filtered `model.py` in Full file with Method+File+Comments, nonmember rows, no deleted lines, and another file filter.

### Real source classification audit

Across all 3,533 original history events: **579 Class-scope**, **697 Method-scope**, **548 in both**; **133 deleted Class-scope**, **170 deleted Method-scope**, and **113 deleted documentation** events. The original live `model.py` snapshot places `class CausalSelfAttention`, `class GPT`, `def forward`, etc. in expected structural scopes.

These scope colors use a lightweight static Python line/indentation/declaration classifier. It is not a full AST parser; tricky multiline Python syntax may need later refinement. No source text, original patch chunks, STM line identities or commits were rewritten.

## Protected assets and deployment caveat

The changes are limited to `nanogpt-original-history/assets/syntax.js`, `assets/app.js`, `index.html`, `assets/style.css`, and accompanying README/QA/handover files. The original `history.js`, original Git manifest/diff chunks, old `nanogpt-modular-viewer/`, old `commit-id-demo/`, and existing 235 teaching commits remain untouched.

Live GitHub Pages delivery and an Android browser screenshot after this change were **not independently verified**; tests relied on checked repository contents, original Git history replay and controlled handlers.
