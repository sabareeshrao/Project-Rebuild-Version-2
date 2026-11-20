# QA — Restored original UI and continuous All-Commits source view

## Requested correction

The earlier `nanogpt-original-history/` page incorrectly redesigned the black code viewer into blue-gray Git-diff panels and defaulted to **Changes** mode. This hid unchanged source lines unless the user switched views. The user explicitly requested the prior viewer's original layout restored and **all lines in one go**.

## Delivered implementation

- Copied the established `nanogpt-modular-viewer/index.html` HTML structure and `assets/viewer.css` visual styles into the independent original-history viewer. Original header, compact sticky toolbar, white active mode, color-chip row layout, original code column proportions, dark background, mobile breakpoints, and natural document scrolling are retained.
- The source row is **filename chip → green STM chip → syntax-colored source code**, using the established code highlighting palette (keywords purple, strings green, builtins blue, comments muted), indentation formatting and plain source characters.
- **Deleted source text only** receives a strikethrough, not the STM chip or filename. Git `+` / `-` prefixes and Git-style per-file change cards have been removed from the code view.
- **All commits** is the selected default, with **all verified historical additions and deletion events from 159 genuine original first-parent commits**, in chronological commit and actual file order, one continuous scrollable source timeline. When pressed, it clears any prior file filter/range; this is not a single-commit Git diff.
- The original top controls remain: Previous / Next, Jump (single commit or inclusive range), Full file, Added only, Selected, All commits, File, and the original colored hierarchy row. **Lines (green)** is the only active category; future structural categories remain visible but disabled until source classification is implemented. No misleading behavior claims.
- **Full file** shows all **surviving** source lines available in the selected original Git snapshot, across all files by default. A single-number Jump selects this source view instead of defaulting to changed lines.
- **Selected** and **Added only** are optional focused views; they do not restrict the default All commits.
- Source changes and exact STM lineage continue to come from the **unchanged** historical diff chunks, manifest, and immutable snapshot-replay engine. The old 235 teaching Git commits, original modular UI files, older prototype, and existing STM IDs were not modified.
- Multi-thousand-line pages use the original top-spacer/window/bottom-spacer virtualized row model with **native page scroll**. Virtualization is a performance technique: it does **not** truncate the logical list, paginate it, or limit historical commits displayed.

## Controlled verification

**18/18 focused checks passed** against the new committed HTML, CSS, app controller and syntax module. They covered:

1. Original toolbar/category bar/virtual-row HTML structure.
2. Default `state.mode==='all'`.
3. Full chronological row collection, without code-panel per-file diff cards.
4. Six distinct original file names across the very first Git commit.
5. Exactly 628 actual first-commit added lines.
6. Real deleted-line records present.
7. Source-file switching during the chronological stream.
8. Exact snapshot of second original commit: 630 surviving rows.
9. Selected second original commit: 12 changed rows.
10. Added-only second original commit: 7 additions.
11. Commit-range parsing.
12. Safe HTML escaping in Python source rendering.
13. No prefixed Git-style diff signs in code cells.
14. Same original `code-cell` syntax font and colors.
15. Strikethrough applied on code only, not the green chip.
16. Native document scrolling via original-style spacer/window virtualization.
17. Only green Lines category selected.
18. First original `model.py` commit has 267 real physical lines.

**159/159 authentic commits fully replayed** in a separate verification after this change against the exact archived 14 original Git diff chunks. The final retained statistics remain:

| Measure | Verified |
|---|---:|
| Original first-parent commits | 159 |
| All historical **displayable** line events in default All commits | **3,533** |
| Addition events | 2,729 |
| Deletion events (strikethrough) | 804 |
| Unique introduced STM identifiers displayed | 2,729 |
| Deletions referring to a prior STM introduction | 804 / 804 |
| Final surviving `.py` source lines | 1,220 / 1,220 |
| Final surviving all non-notebook text lines | 1,523 / 1,523 |
| Reconstructed surviving text including available `transformer_sizing.ipynb` raw JSON | 1,925 |

## Known source limitation — not a UI line cap

The original GitHub API omitted `scaling_laws.ipynb`'s oversized original patch at commit #30. This also prevents safely replaying later dependent hunks in commits #37, #38, #52, and #71. The unavailable notebook's raw JSON lines are **not** invented. Binary images do not have text line views. Therefore the default 3,533 displayed events are all *verified events with accessible patches*, not the original full 3,783 text addition/deletion events. **All 1,220 Python source lines are complete.**

## Verification limits

The source-count replay, static HTML/CSS contract, and scripted controller behavior were tested. **A live Android screenshot and a successful GitHub Pages HTTP load were not independently verified in this turn.** Repository publication is confirmed; website availability should not be overstated. The public intended Pages path is `https://sabareeshrao.github.io/Project-Rebuild-Version-2/nanogpt-original-history/`.

Updated assets: `index.html`, `assets/style.css`, `assets/app.js`, and new `assets/syntax.js`. No changes to the teaching viewer or prototype.
