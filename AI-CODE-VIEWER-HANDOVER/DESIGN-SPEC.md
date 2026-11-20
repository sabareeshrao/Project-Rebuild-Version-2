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
- **Never use sky-blue BOUNDARY chips.** Rejected in Prompt 046. Sky blue is now intentionally used for the FILE category only (Prompts 048–050).
- Every genuine empty source line stays visible with its original STM ID. In **Lines** mode it is green. In Class/Method/Block/Nested/File/Package/Module mode it **inherits its selected enclosing category color**. Source lines outside that category have neutral charcoal chips, not green.
- **No fake empty rows or colored boundary chips.** If two distinct nonoverlapping groups of the **currently selected same category** touch directly in original source, draw a thin **green `#15803D` horizontal line in the CODE area only** at their transition. No chip, synthetic row, or STM ID; do not draw between overlapping parent/child scopes or when there is no neighboring group.
- Default screen is **Lines**, so ALL physical source lines start green including comments.
- **Comments mode** colors standalone `#` comments and Python triple-quoted documentation blocks (`"""` or `'''`) pink, including multiline interiors. All nonmatching lines—including statements with inline `#`, assigned triple-quoted strings and blanks—have neutral chips in Comments mode. In default Lines mode all original source lines, including comments and docstrings, are green. In Class/Method/Block/Nested/File/Package/Module modes, comments and docstrings *inside the selected scope* take that category's color. Python docstrings are technically strings; this is a documentation-view grouping.

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
| Original blank lines | Selected enclosing category color; default Lines green; otherwise neutral |
| Thin divider in code area between adjacent same-category groups | Green `#15803D` (no chip, row or STM ID) |
| Comments (only when selected) | Pink `#DB2777` |
| File A/B | Saturated sky blue `#00BFFF` / `#008CFF` (dark foreground) |
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

Sky-blue *boundary chips* from Prompts 043–044 were rejected in Prompt 046. The **newer** accepted design in Prompts 048–050 instead uses scope-colored original blanks and a *conditional thin green code-only divider*, with neutral chips outside the selected category. Do not conflate sky-blue FILE chips with the rejected sky-blue BOUNDARY chips. Python docstrings in Comments mode remain supported.

## Latest accepted interaction: Prompts 048–050

Selecting a category must not leave green blank/comment/docstring chips inside that category's spans. For example, in Class view every physical source line inside LayerNorm and GPT is **red**, including source blanks and standalone comments. Unscoped imports/header lines are neutral charcoal (`#232323`) rather than green. Method view colors member lines blue, Code Block orange, Nested Block yellow. File view uses saturated sky blues `#00BFFF` and `#008CFF`. A green horizontal CSS divider appears **only in the source-code area** when two distinct non-overlapping scopes of the currently selected category have consecutive physical line numbers. No extra chip/row is created. Range filtering must not add dividers between unrelated, nonconsecutive source lines.

## Latest accepted compact modular UI — Prompts 056–057

Only the compact commit/range, Full/Added/Selected/**All commits**, and category controls are sticky; title/statistics scroll away. Keep every category button saturated/fill-colored even while inactive, with a white active outline that does not resize buttons. On category changes, update the mounted source rows **in place**: never replace DOM rows, reset their measured heights, or move page position; reserve fixed metadata space. On narrow screens the control strip can swipe horizontally, but CODE must still wrap without horizontal scrolling. **Full file** shows source through selected commit, while **All commits** clears range selection and shows the last *indexed* cumulative source (15 after Batch 01, not yet 235). Display the category-colored short chip **STM-029** alongside a separate neutral **model.py** chip, but retain full **STM-029-FIL-001-model.py** in data and accessible DOM. Do not resurrect sky-blue boundary chips or fake source rows. See [modular implementation](../nanogpt-modular-viewer/index.html) and [QA](../nanogpt-modular-viewer/QA-UI-REFINEMENT.md).
