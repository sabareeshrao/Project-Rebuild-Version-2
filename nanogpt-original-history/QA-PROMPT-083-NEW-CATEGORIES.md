# QA — Prompt 083 new category colors and historical source integrity

## Scope

Only `nanogpt-original-history/index.html`, `assets/style.css`, `assets/app.js` and `assets/syntax.js` implement new UI/category logic. Do not alter any original history JSON, snapshot lineage, source file, STM identity or legacy viewer.

## Actual original Git history replay (executed)

Executed the committed original `OriginalHistory`, `classifyFileLines`, `classifyFileScopes`, `classifyStatementTypes`, `collectAllEvents`, `getRows` and `chipPaint` functions against **all 14 authentic diff chunks**, producing all **159 original first-parent snapshots**.

| Test | Verified result |
|---|---:|
| Original available chronological events | 3,533 |
| Real additions | 2,729 |
| Real deletions | 804 |
| Surviving Python source at commit #159 | 1,220 physical lines |
| All surviving text in latest Full File | 1,925 physical source rows |
| All existing 159 Full File snapshots, every one of 12 primary categories | **1,908 / 1,908 row-ID-and-order invariant variants passed** |
| Sum of source rows across 159 historical Full File snapshots (one category each) | 222,240 |
| Changed line-ID/order tests | 0 |
| Invalid chip-color values checked | 0 |
| Recognized documentation painted pink in every category at latest Full File | 283 rows |
| Recognized historical documentation painted pink in every category in All commits | 509 line events |

The 12 primary categories are Project, Module, Directory, Global, Class, Method, Code Block, Nested Block, Imports, Assignments, Expressions and Lines; File and Comments are independent overlays (14 total active category buttons). All source rows stay present, even when a scope does not match.

## Observed classifications at latest commit #159

| Python statement type | Lines classified |
|---|---:|
| Imports | 46 |
| Assignments | 468 |
| Expressions / Calls | 106 |
| Other (declarations, comments, blanks, non-Python or conservatively unmatched) | 1,305 |

These are **physical row counts across all 1,925 latest source rows**. A continued multiline statement counts each matching physical row, not one AST statement. With Comments ON, pink overlays may add unrelated documentation rows to the count of non-neutral chips for any category.

## Original source examples

- `model.py` `import torch` → Imports cyan `#0E7490`
- `train.py` `iter_num = 0` (`STM-00972`) → Assignments gold `#A16207`
- `train.py` `best_val_loss = 1e9` (`STM-00973`) → Assignments gold `#A16207`
- `train.py` `model.to(device)` (`STM-00525`) → Expressions ruby `#BE123C`
- Every Python row outside Class and Method — including top-level script control-flow — receives Global slate `#475569`
- Every verified source line, including Markdown and notebook JSON where available, receives Project teal `#0D9488` unless Comments overlays it pink.

## Focused classifier fixtures and regression checks

Passed 26 synthetic Python-line fixtures covering imports, continued imports, simple and augmented assignments, type annotations, comparison operators, keyword arguments inside calls, standalone calls, declarations, control-flow headers, decorators, and parenthesized multiline assignments. Verified that source declarations and control-flow keywords are not incorrectly tagged as assignments or standalone expressions in snapshots 1, 15, 30, 60, 90, 120 and 159.

Verified preference restoration with `category='assignments'`, `mode='added'`, `commit=52`, selected range 50–52, file filter `train.py`, File ON and Comments ON; all persisted values recovered.

Verified same source IDs in Project/Module/Directory/Global/Class/Method/Code Block/Nested Block/Imports/Assignments/Expressions/Lines views. Existing 2px green source-code-only dividers are unchanged. The original HTML/CSS layout geometry, UI structure, file/STM chips and sticky header were not redesigned.

## Known limits

- This syntax scanner is conservative JavaScript source classification, **not** a complete Python AST or semantic analysis; complex Python may be neutral. Non-Python notebook/Markdown content is not mislabeled as imports/assignments/expressions.
- Original source is only what GitHub supplied. The preexisting missing oversized `scaling_laws.ipynb` patch remains unavailable. No fabricated lines are added.
- Actual public GitHub Pages rendering and Android visual/gesture behavior were **not** directly verified. Verify the published page after Pages deployment and refresh cached assets if required.
