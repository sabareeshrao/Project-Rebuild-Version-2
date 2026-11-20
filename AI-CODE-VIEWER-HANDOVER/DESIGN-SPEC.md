# Accepted UI and ID Contract

## Hierarchy (top to bottom)
1. Project (PRJ)
2. Module (MOD)
3. Package or directory (PKG/DIR; only claim actual package where valid)
4. File (FIL)
5. Class / Interface (CLS)
6. Method / Constructor (MTH)
7. Code Block (BLK)
8. Nested Code Block (NBL)
9. Physical Source Line (STM, user-preferred historical name)

**Technically STM here identifies a physical line**, not just an AST statement; a comment, blank line, brace or multiline statement segment can also get an STM ID. Distinguish the two concepts in documentation; do not change the user's accepted ID shape.

## Example
`STM-005-FIL-001-model.py`, no commit number. Git commits provide the numbering order only.
Scope IDs are separate, e.g. `CLS-001-FIL-001-model.py`, `MTH-001-FIL-001-model.py`, `BLK-001-FIL-001-model.py` and `NBL-001-FIL-001-model.py`. Group scope owns the full code range, not a single declaration.

## Flat two-column layout
- Left: one chip per actual source line, vertically centered and as tall as that line's wrapped code.
- Right: ORIGINAL source text; use monospace, syntax highlighting, and preserved leading indentation. Wrapped continuation stays under the code's indentation, not flush left. No horizontal scrolling. Full page flows vertically; no internal fixed-height scrollbar. Handle deeply indented long lines without clipping.
- Category selection is via compact top buttons. Rather than nesting layout boxes, change chip background across the selected category's whole range. The first colored chip shows `CLASS · CLS-001 · ClassName` or analogous group name; every line retains its original STM ID.
- A visible spacer may be inserted only at a class/method/file/package/module boundary lacking a real empty source line. It is always green and **has no STM ID**; never count it as original source or write it back into source.
- All real empty source lines must ALWAYS have green chips regardless of selected category.
- Default screen is **Lines**, so ALL physical source lines start green including comments.
- Comments turn pink only after clicking **Comments**, and only when the line is solely a comment (`^\s*#` in simple Python code). A code statement with a trailing `#` remains green. Syntax coloring of code/comments is separate from chip color.

## Colors, exact accepted hex values
| Category | Chip |
|---|---|
| Background | `#000000` |
| Interface panel | `#171717` |
| Button | `#303030` |
| Primary text | `#FFFFFF` |
| Muted text | `#A3A3A3` |
| Border | `#383838` |
| Class | Red `#DC2626` |
| Method | Blue `#2563EB` |
| Code Block | Orange `#EA580C` |
| Nested Block | Yellow `#FACC15`, dark foreground |
| Lines / blank lines | Green `#15803D` |
| Comments (only when selected) | Pink `#DB2777` |
| File A/B | Cream `#EAD7B7` / Cyan `#06B6D4` |
| Package or directory A/B | Brown `#78350F` / Silver `#94A3B8` |
| Module A/B | Burgundy `#881337` / Graphite `#52525B` |

File, package and module colors alternate **between consecutive groups in the current view: A → B → A → B**. Use actual consecutive run transitions, not an assumption that every file always appears once. Strongly distinguish palette colors, avoid purple/lime, and avoid confusion with the orange code-block chip.

Fonts: body `Roboto, Arial, sans-serif` practical match; code `JetBrains Mono, Fira Code, Consolas, monospace`. Exact proprietary ChatGPT app font cannot be established from screenshots. Source typography uses light text on black.

## Commit navigation
- Compact numeric current-commit indicator with up/down arrow buttons.
- Input allows `5` OR `5-10` (inclusive), validated against real available commit count.
- `5`: view ONLY added lines of commit 5, *not* the cumulative file through commit 5.
- `5-10`: ONLY additions introduced across commits 5 through 10, with boundaries indicated.
- `Full file`: cumulative historical file snapshot through selected commit.
- `Added only`: additions from selected commit.
- `Selected commits`: selected single/range.
- Commit number never gets inserted inside an STM ID. Display original GitHub commit links.

## Performance
For modest demos, one HTML page with embedded data can work. For 100k+ lines, code/data chunks per file or commit plus virtualization, incremental rendering and indexed lookups are essential; avoid adding 100k DOM rows. Maintain page-level scrolling, not a nested scroll container.

## Evidence and language awareness
The accepted demo used nanoGPT `model.py` with 30 append-only commits and 168 physical lines. Rebuild other repositories from REAL history, without copying the nanoGPT data. Use robust language parsing for classes/methods and source-aware comment detection; regexes for Python sample are not a reliable multi-language parser.
