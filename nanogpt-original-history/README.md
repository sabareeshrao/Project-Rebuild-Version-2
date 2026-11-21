# nanoGPT Original Git History Viewer — Restored Original UI

[**Open the viewer's HTML source**](index.html) · [**Original nanoGPT commit history**](https://github.com/karpathy/nanoGPT/commits/master/) · [**Original-UI restoration QA**](QA-RESTORED-UI-ALL-LINES.md)

**GitHub Pages path (public deployment not independently confirmed):**  
https://sabareeshrao.github.io/Project-Rebuild-Version-2/nanogpt-original-history/

This page follows the **real original** `karpathy/nanoGPT` repository history, not the user's 235 artificial file-by-file teaching commits. It is isolated in `nanogpt-original-history/`, preserving the existing `nanogpt-modular-viewer/` and `commit-id-demo/`.

## Original UI restored

The first prototype of this original-history viewer had a redesigned blue-gray Git-diff UI, unlike the existing modular viewer. That was not the requested visual change. This version restores the established modular viewer's original HTML layout, black GitHub-style colors, compact sticky toolbar, original source-side typography and syntax highlighting, and the **filename → green STM → actual code** row layout.

There are **no + / − prefixes** beside code and no Git diff file cards. Deleted source lines are struck through **in the code column only**; their green STM chips and original filename labels stay visible.

**Lines** (green), **Class** (red), **Method** (blue), **Code Block** (orange) and **Nested Block** (yellow) are selectable STM hierarchy modes. **File** independently colors filename chips; **Comments** independently overlays pink on genuine documentation inside the chosen structural category. Module and Directory remain disabled. No synthetic source code is inserted.

## All lines in one go — default

The new viewer now opens with **All commits selected**. This shows **all 3,533 verified historical line events** (2,729 additions plus 804 deletions), in original 159-commit first-parent chronological order across files. File labels switch when the actual original Git history switches files; files are **not** artificially completed one by one.

The entire historical timeline is one continuous document scroll, with no per-commit pagination or default single-commit diff filter. To keep mobile scrolling usable, a natural-page **windowed renderer** mounts nearby rows while preserving the whole logical list.

| Original-style control | Behavior |
|---|---|
| **All commits** | Default. All verified historical additions and deletions across original commits 1–159, with authentic file switching. Clears file filter when activated. |
| **Full file** | **Every surviving source line**, including blanks, comments, and code outside the selected Class or Method hierarchy, at the selected original Git commit; all source files unless dropdown filters a file. Category buttons only recolor, never hide source. |
| **Added only** | Only additions in the selected original commit. |
| **Selected** | Additions and struck-through deletions of the selected commit or selected inclusive range. |
| **Previous / Next** | Move to adjacent real Git commits. |
| **Jump** | One number or range changes the focused commit(s) **without changing the selected viewing mode**. In Full file, show the surviving snapshot at the selected final commit; in Added only, show only additions; in Selected, show adds/deletions; in All commits, keep the full timeline and scroll to the requested commit. |
| **File** | Optional filter; **All files** is default. |
| **Lines / Class / Method / Code Block / Nested Block** | Exclusive primary STM colors: green lines, red classes, blue methods/functions, orange compound-statement blocks, and yellow blocks nested within another control-flow block. Out-of-scope rows stay visible in neutral gray. |
| **File** | Independent ON/OFF coloring of the *filename chip only* in alternating sky blues; no STM recoloring. |
| **Comments** | Independent pink overlay for genuine documentation within whichever Lines/Class/Method/Code Block/Nested Block category is selected. |

The original historical source rows use stable `STM-NNNNN` IDs. Each addition receives a permanent identifier; when later removed, the deleted source line uses the same green STM chip with a strike through on its original code. Switching modes never reassigns STM IDs.

## Persistent view settings and File + Comments overlay

The viewer now **preserves the selected viewing mode** (`Full file`, `Added only`, `Selected`, or `All commits`) when using Previous / Next or entering another number/range and pressing Go. For example, **Added only + Jump 5** stays in Added only and shows only real additions at original commit 5. If a range is entered in Added only, additions across that range are shown. **All commits** remains All commits on a numeric jump and scrolls to the chosen original commit in the continuous history.

The file dropdown stays selected across mode/commit changes. The `All commits` button no longer silently clears it; choose `All files` explicitly to clear the filter.

`Lines` (green), `Class` (red), `Method` (blue), `Code Block` (orange), and `Nested Block` (yellow) are selectable STM hierarchy colors. **File** independently recolors only filename chips (two sky-blue shades), while **Comments** independently colors documentation pink within the selected hierarchy. All three controls may be active simultaneously. Out-of-scope code remains present and neutral, including in Full file. Module and Directory are still inactive.

The current mode, commit, selected range, file filter, primary STM color, independent File toggle and independent Comments toggle are stored in browser localStorage and restored on reload when available. Category-only toggling recolors mounted rows in place, without rebuilding the source window or resetting scroll measurements.

[Verified persistence and File+Comments QA](QA-STATE-PERSISTENCE-OVERLAY.md): **21 mode/interaction checks**, **12 full-history replay checks**, **12 static contract checks**, all passed in controlled tests. No live Android visual test was performed.

## Class and Method, independent File toggle, and balanced source chips

The STM column now represents structural hierarchy only. Select **Lines** (green), **Class** (red) or **Method** (blue). The original Python source is classified **at each actual historical commit snapshot**, and removed lines retain pre-removal scope colors. Method includes both member methods and top-level Python functions. Lines outside the selected scope remain visible in neutral gray.

The **File** button is now an independent ON/OFF toggle, just like Comments. It colors only the dedicated filename chip sky blue while preserving whichever red/blue/green/pink category is active on the STM chip. **Comments** remains independent, turning qualifying standalone Python comments and triple-quoted documentation lines pink within the active scope. File + Method + Comments can all be ON simultaneously.

The former left-column filename/STM split (approximately **38% / 62%**) is now **57% filename / 43% STM**: about 30% of the STM chip's former share was transferred to make long filenames easier to read. The code column width, original dark theme, sticky toolbar and original row geometry remain unchanged.

**Full file shows ALL source lines regardless of what hierarchy level is selected.** Selecting Class, Method, Code Block, or Nested Block never filters Full file down to just its members; the dropdown's explicit file filter and the chosen historical Git commit are the only constraints. Historically later code remains absent in earlier snapshots.

[QA: historical Class/Method, File toggle, wider chips and Full file invariance](QA-CLASS-METHOD-FILE-WIDTH.md) documents 18 structural/fixture checks, 14 complete history replay checks, 23 interaction checks, 9 persistence checks, and 57 Full file invariance checks.

## Thin green horizontal dividers — real adjacent siblings

The original viewer's **thin 2px green divider** is restored in the authentic Git-history viewer. It is drawn **only at the top of the right-side source-code column**, not across the gray filename chip, the colored STM chip, the whole row, or an inserted/spacer source line.

A divider appears only when **two different, non-overlapping sibling scopes touch in the actual original source**, in the currently selected primary category: Class, Method, Code Block, or Nested Block. For example, in the first original `model.py` snapshot, a blank line is still inside `CausalSelfAttention`, immediately followed by `class MLP(nn.Module)`; **Class view displays the green code-area boundary above the MLP declaration**. Adjacent Methods, orange Blocks, and yellow Nested Blocks follow the same rule. Lines mode does not add dividers.

To avoid inventing adjacency, the viewer checks the **actual original file path, commit snapshot, pre/post-edit side and consecutive physical source positions**. Separate commits, different files, unrelated scopes, and a parent/child overlap do not get a false divider. File and Comments toggle colors cannot introduce a divider. Green divider classes are recalculated on existing visible source rows without replacing the row or altering scroll height.

Code Block recognizes Python compound control-flow statements such as `if`, `else`, `elif`, `for`, `while`, `try`, `except`, `with`, `match`, and `case`. Nested Block applies when such a control statement is inside another compound control block. Structural identities are computed from each original Git source snapshot, including the pre-deletion version of historically removed lines, without editing the source or permanent STM IDs.

[**Verified green-divider, Code Block and Nested Block QA**](QA-GREEN-SIBLING-DIVIDERS.md): 27 targeted structural/renderer assertions and 164 complete-history / full-source invariance assertions passed. A browser screenshot of the newly deployed version was not independently verified.

## Authentic historical scope

Original source: https://github.com/karpathy/nanoGPT

- Current original `master` head indexed: `3adf61e154c3fe3fca428ad6bc3818b27a3b8291`.
- Git history listing has **210 reachable commits**, while the original `master` **first-parent path has 159 commits** (including merged changes once). The viewer follows those real 159 snapshots in Git parent order. Not all were personally authored by Andrej.
- [Historical manifest](data/manifest.json): 159 original SHAs, original author/date/message/parents.
- [Original Git diff data](data/diffs/): 14 static original diff chunks, not invented step-by-step source edits.
- [History replay engine](assets/history.js): reconstructs source snapshots and immutable original-history STM lineage.
- [View controller](assets/app.js), [original UI CSS](assets/style.css), [original-style syntax renderer](assets/syntax.js): render real code, not a GitHub diff panel.

The first authentic commit [`fe804286`](https://github.com/karpathy/nanoGPT/commit/fe8042867ca499aef1df0d6c2606aabae3124b26) introduced 628 actual source lines across six files, including `model.py`, `train.py`, and `sample.py`. Those source lines are displayed together in their real commit, not converted to synthetic micro-commits.

## Verified counts and the unavoidable missing notebook patch

The original Python source is **complete: 1,220 / 1,220 latest lines**. All non-notebook text reconciles to **1,523 / 1,523 lines**. The final available snapshot also includes 402 original raw JSON lines from `transformer_sizing.ipynb`.

GitHub did **not** return the original oversized patch for `scaling_laws.ipynb` at commit #30. Later dependent notebook hunks cannot be safely reconstructed. That missing historical notebook text is explicitly flagged, not silently fabricated; the viewer therefore displays **3,533 verified events** rather than falsely claiming all historical 3,783 text additions. The mainline's original 604 Python deletion events are included in this verified history.

## Publishing and validation

[**Restoration QA: All-Commits Viewer**](QA-RESTORED-UI-ALL-LINES.md) details 18 focused passed UI/data tests, all 159 original commits replayed, cross-file transitions, and the known notebook limitation. [**Initial source-replay QA**](QA.md) documents earlier engine validation.

The public Pages link above is the **intended URL**. The repository is public and GitHub reports Pages enabled, but a successful live HTTP load or Android screenshot could not be independently established in the model's environment. If the page is inaccessible, verify **Repository Settings → Pages** deployment source (`main`, `/(root)`), or open the HTML source on GitHub.

The separate 235-commit teaching history, its viewer, and the original prototype were not changed.
