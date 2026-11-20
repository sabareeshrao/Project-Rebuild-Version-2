# QA — Persistent Viewing Modes, File Coloring and Independent Comments Overlay

**Source**: real [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT) original-first-parent commit viewer in this directory. **Target**: user's mobile screenshot and request that choosing `Added only` and changing the commit number must not revert to `Full file`. The File category button and independent Comments toggle must work together, without changing the existing UI geometry or the underlying source/STM IDs.

## Regression cause

The former original-history `assets/app.js` had two places that silently changed the user's selected mode:

- `selectCommit()` changed `All commits` into `Full file`.
- Jump submission assigned `state.mode=selected.start===selected.end?'full':'selected'` even if `Added only` or another mode was currently active.

It also had no category button handler, and File and Comments were both disabled. The historical line source and stylesheet were not at fault.

## Fixed contract

- **Navigation preserves the current view mode**: `Full file`, `Added only`, `Selected`, or `All commits`, including previous/next, single-number Go, and range Go.
- In `Added only`, changing the number displays **only additions at the new original commit**. Ranges (e.g. `5-7`) show additions across all commits in the range. In `Selected`, the range continues to display true adds/deletions. `Full file` continues to display all source surviving at the focused commit.
- In `All commits`, changing the number **keeps All commits** and scrolls to the original event for that commit instead of changing modes or truncating the global history.
- **File filter** is independent of view mode and color category. It survives navigation and switching to All commits; it is reset only when the user explicitly selects `All files`.
- **File hierarchy category** is now functional: chips for rows of the same real source file receive a consistent saturated sky-blue file color, alternating between the two original File palette shades across first appearances. Per-row filename stays gray. `Lines` remains green.
- **Comments** works as an independent ON/OFF overlay with either `File` or `Lines`. Both active controls remain visually pressed and their filled colors retained. Genuine standalone Python `#` comment rows and standalone/multiline triple-quoted documentation lines become pink on their STM chips; executable lines, inline trailing comments, and non-Python README headings retain the base category color.
- Deleted original historical comment/docstring lines are classified using the **pre-edit Git source snapshot**; additions use post-edit snapshot. A strike-through remains on the deleted code **only**. Original code text and STM IDs are never changed to recolor a line.
- Category/Comments changes repaint existing virtual source rows **in place** without rebuilding measured row elements, changing source filters, or resetting the page scroll.
- The browser stores the current `mode`, `commit`, `selected range`, `file filter`, `File/Lines category`, and `Comments enabled` state in localStorage, restoring it after reload when storage is permitted. Invalid saved state is ignored safely. Nothing is written to the source manifest or historical commits.
- Commit-step navigation synchronizes the saved range with the focused commit across modes; changing only the category or viewing mode does not erase the user's selected range. The File category and independent Comments overlay are intentionally the only additional categories enabled in this phase; deeper method/class scopes remain disabled until historically classified.

## Verification

**21/21 controlled handler and state-transition assertions passed** using the published app controller against original commit 1–24 Git patches and a mocked DOM:

- Added-only commit 2 returns 7 true added lines.
- Single commit Go 3 retains Added-only and returns the true 96 original added lines.
- Next/Previous preserve Added-only.
- Range Go 5–7 retains Added-only and returns 79 true added lines.
- File filter `train.py` restricts only file scope and does not change the mode/range.
- File category enables blue chips; Comments toggles pink for documentation while File remains selected and pressed.
- Inline trailing executable comments do not recolor the whole source row pink.
- Mode, category, comment overlay and filename preferences restore from mock browser storage.
- All commits retains file/category/comment state and Jump 2 remains in All while requesting a scroll to commit 2.
- Selected mode retains independent filter and category choices.

**12/12 source-replay and classification assertions passed** after reading **all 14 real Git diff chunks**, replaying all 159 first-parent commits and evaluating the actual revised history/annotation code:

| Verified property | Result |
|---|---:|
| Original first-parent commits replayed | 159 |
| All verified historical text line events | 3,533 |
| Historical additions (STM introductions) | 2,729 |
| Historical deletions (same STM IDs) | 804 |
| Final surviving Python source | 1,220 / 1,220 |
| Final surviving non-notebook text source | 1,523 / 1,523 |
| Identified original comment events | 410 |
| Identified triple-quoted documentation events | 99 |
| Historically deleted comment/docstring events available for pink overlay | 113 |
| Original files with displayable line changes | 23 |

**12/12 static source/interface checks passed** confirming correct stylesheet URL, genuine Comments/File enabled controls, independent overlay handler, persistent preferences, chip color variables for deletions, category changes repainting existing DOM and no implicit Full file reset.

**Limits:** These tests used original source replay, source-level checks and mocked DOM; not a live Android browser interaction or screenshot. The source data limitation from an oversized `scaling_laws.ipynb` historical patch remains unchanged. Classifying triple-quote documentation uses a lightweight static parser; this is not a complete Python AST parser, and unusual standalone multi-line strings may need later review.

## Changed files and protected files

- `assets/app.js`: mode persistence, independent category/file/filter state, commit jump logic, localStorage and in-place recoloring.
- `assets/syntax.js`: source-snapshot-aware comment/docstring classification (includes deleted history).
- `index.html`: File and Comments buttons enabled; other categories remain future-only.
- `assets/style.css`: remove hardcoded green from deleted STM chips so File and Comments colors compose correctly.

**Unchanged**: all original Git data, the 159-commit manifest and 14 diff chunks, `history.js`, and the separate `nanogpt-modular-viewer/` and `commit-id-demo/` original design/prototype.
