# QA — Restored Green Sibling Dividers and Active Code Block / Nested Block

## User evidence and requested corrections

Three consecutive requests established the expected behavior:

1. The thin **green horizontal line** separating genuine neighboring hierarchy groups was missing from the new original-history viewer.
2. A mobile screenshot in **Class** mode explicitly showed `CausalSelfAttention` ending, a physical blank source line, and `class MLP(nn.Module)` beginning immediately afterward, with **no green code-area divider**.
3. The user also requested enabling **Code Block** and **Nested Block** hierarchy controls.

The earlier `nanogpt-modular-viewer` already had the accepted source-column-only green divider rule (`needsDivider` + `.code-cell.category-divider::before`), but the new genuine-history viewer used only the source-row category chip color and never toggled the divider CSS class. The new original-history viewer's CSS already contained the **2px green code-column pseudo-element**; the missing piece was historical sibling detection and applying that class to code cells.

## Implemented viewer contract

- The original viewer's CSS `.code-cell.category-divider::before` draws a **thin 2px green `#15803d` top border only inside the code cell** (`left:8px; right:8px`; responsive `5px` padding). Never spans filename/STM chips and never generates synthetic rows, spaces, extra IDs, text, source lines or added height.
- The divider activates in **Class**, **Method**, **Code Block**, and **Nested Block** modes only when the previous and current displayed rows belong to **two distinct directly adjacent sibling scopes** in the actual source.
- The rule requires the **same original file path, same authentic Git commit snapshot, same pre/post-edit side, and consecutive original physical source indexes**. The groups must have distinct original STM-derived scope IDs and the **same immediate parent**. An outer block → its own child is *not* a sibling boundary.
- **Lines mode** never draws a green divider. Independently toggling sky-blue **File** or pink **Comments** cannot add or remove a divider because colors and group boundaries are separate concepts.
- The original `model.py` **CausalSelfAttention → MLP** Class boundary is explicitly confirmed: the last blank line retains CausalSelfAttention membership, and the next `class MLP(nn.Module):` declaration starts another sibling Class group. A divider is drawn at the top of the MLP **code cell**, not in STM or filename columns.
- Class and Method continue to use their original red/blue STM colors, and Code Block / Nested Block buttons are now **enabled** (orange `#ea580c` and yellow `#facc15` STM chips; nested ink `#302400`).
- Code Block scopes come from real original Python source compound statements: `if`, `elif`, `else`, `for`, `while`, `try`, `except`, `finally`, `with`, `match`, `case` and supported `async` prefixes; Nested Block identifies an inner compound group inside another. A block's scope includes its subordinate source statements, comments and blank lines until actual dedentation.
- Historical deleted lines receive scopes from the **pre-edit original Git file**, and inserted lines from the post-edit file. Each actual source line has a source-position index relative to its proper pre/post file snapshot; no false boundaries between a removed and replacement line or between edits from different Git commits.
- Changing the category calls `HistoryWindow.recolor()` on **mounted existing rows** and toggles only the CSS class and chip colors; scroll heights, source text, statement IDs, left-column 57/43 width split, and row DOM identities are unchanged.
- **Full file retains all surviving source lines** at the selected authentic commit, including lines outside the active hierarchy; all previous viewing mode and independent File/Comments persistence rules remain in effect.
- Other hierarchy buttons **Module** and **Directory** remain disabled: not part of this change.

## Verification evidence

### 27 / 27 targeted fixture and renderer checks passed

Using a multi-class Python fixture with two methods, `if`/`else`, `for` containing `if`/`elif`/`else`, and `try`/`except`:

- Green line at two adjacent sibling class declarations, two sibling method declarations, a primary Code Block `if`/ `else` pair, and two Nested Block `if`/`elif`/`else` transitions.
- No green divider from Lines, File, overlapping Class/Method boundaries, missing source positions, changes to filename, different commit snapshots, or mixing pre/post diff sides.
- Correct original source membership of trailing blank lines before new sibling classes.
- Correct scope IDs and same-parent requirements for nested siblings.
- Actual renderer applied `category-divider` **only on `.code-cell`**, with Class red, Block orange and Nested yellow chips; category changes cleared previously applied dividers without touching the source rows. File ON colored only filename chips.

### 164 / 164 full-history/source-invariance checks passed

Replayed **all 159 original first-parent Git commits** using the same unchanged `data/manifest.json` and 14 original patch chunks. Verified:

| Measure | Reconciled |
|---|---:|
| First-parent original Git commits | **159 / 159** |
| Displayable real historical line-change events | **3,533** |
| Addition events | **2,729** |
| Deletion events with authentic old STM IDs | **804** |
| Final surviving Python source lines | **1,220 / 1,220** |
| Final surviving non-notebook text lines | **1,523 / 1,523** |
| Full-file permutations, seven authentic commits × five categories × File ON/OFF × Comments ON/OFF | **140 / 140** |
| Real sibling Code Block boundaries found in current original source | **17** |
| Real sibling Nested Block boundaries found in current original source | **5** |
| Real block-member lines in final original source | **488** |
| Real nested-block-member lines in final original source | **197** |

Tested historical snapshots at original commits **1, 2, 11, 30, 60, 120, 159**. The **same complete original line counts and ordered STM identities** remained visible in Full file under every combination of Lines / Class / Method / Code Block / Nested Block and independent File/Comments toggles. The latest original `model.py` still has all **330** lines when selected in Full file. Original blank lines, external-to-scope code and real historical deletions retained the proper semantics.

Confirmed the screenshot's exact Class boundary and that adjacent displayed change events from different original commits never receive a mistaken green divider. The original `model.py` example includes a Code Block boundary at `else:`; the latest original `train.py` contains real nested sibling-block boundaries.

### Source limits and testing environment

This work reused actual GitHub source snapshots and the original historical STM registry. The existing missing large `scaling_laws.ipynb` Git patch is still reported rather than invented. Structural parsing is a lightweight Python source/indentation classifier, not a full parser for every exotic multiline syntax. Backend code and controlled display tests passed, but a **live deployed GitHub Pages Android screenshot was not independently verified**.

The separate `nanogpt-modular-viewer/`, old `commit-id-demo/`, all 235 synthetic learning commits, the authentic Git manifest/14 patch chunks, and `assets/history.js` have not been modified by this feature.
