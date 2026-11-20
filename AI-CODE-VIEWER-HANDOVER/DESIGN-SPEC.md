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
- **Never use sky-blue boundary chips.** User rejected them in Prompt 046 and asked to revert.
- Every original empty source line stays visible with its true STM ID and a **green `#15803D` chip in every view**, even if it belongs to a selected class/method/block/file.
- At a group transition with no actual source blank, the viewer can add an unobtrusive, **unlabeled green display-only gap** without an STM ID. These are not source lines.
- Default screen is **Lines**, so ALL physical source lines start green including comments.
- **Comments mode** turns standalone `#` comment lines and standalone Python triple-quoted documentation blocks (`"""` or `'''`) pink, including multiline documentation content. An executable statement with an inline `#` stays green. Ordinary triple-quoted values assigned to variables or passed as arguments remain code, not documentation. A Python docstring is technically a string literal, but the UI groups it with comment-like documentation. Comments and docstrings stay green in default Lines mode. Syntax coloring is independent of chip colors.

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
| Lines (default, including original blank lines) | Green `#15803D` |
| Original blank lines in any mode | Green `#15803D` |
| Synthetic unlabeled group-transition gap (no STM ID) | Green `#15803D` |
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

## Rejected history

Sky-blue structural separators and scope-colored original blank lines were attempted in Prompts 043–044. They are **not accepted rules** after Prompt 046's explicit revert. Retain previous errors in prompt history, but use the current green-gap HTML. Python docstring recognition (Prompt 045) remains accepted.
