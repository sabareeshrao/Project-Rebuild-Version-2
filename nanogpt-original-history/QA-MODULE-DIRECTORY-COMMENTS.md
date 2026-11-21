# QA — Module / Directory activation and full pink Comments overlay

## Files and scope

- UI: `index.html` activates two existing category buttons; original layout and CSS remain unchanged.
- Behavior: `assets/app.js` selects actual Python modules, actual parent directories, alternating visual group runs, independent pink documentation, and persistent hierarchy state.
- No changes: `assets/syntax.js`, `assets/history.js`, `data/manifest.json`, `data/diffs/`, historical STM IDs, or other viewers.
- Source limitation: `scaling_laws.ipynb` contains a missing oversized historical patch; no missing source was fabricated.

## Executed code-level checks against actual historical data

Loaded all 14 original diff JSON chunks, reconstructed all 159 authentic first-parent snapshots with the committed `OriginalHistory` implementation, then used the committed `classifyFileLines`, `classifyFileScopes`, `collectAllEvents`, `getRows`, and `chipPaint` functions.

| Check | Result |
|---|---:|
| All original source events | **3,533 / 3,533** |
| Additions | **2,729 / 2,729** |
| Deletions | **804 / 804** |
| Surviving latest Python lines | **1,220 / 1,220** |
| Latest Full File at original commit #159 | **1,925 source rows** |
| Full File source-row count under each of 7 primary views | **1,925 in every view** |
| Pink recognized docs in Full File with Comments ON | **283 in every primary view** |

### Exact source lines from the user's screenshot

Under Code Block orange with Comments ON, the following original `train.py` source IDs each paint `#db2777` pink:

- `STM-00971` — `# init these up here...` (outside a code-block scope in the old implementation)
- `STM-02603` — `# attempt to derive vocab_size from the dataset` (outside)
- `STM-02614` — `# model init` (outside)
- `STM-02954` — `# pin arrays x,y...` (inside)
- `STM-00507` — `# init a new model from scratch` (inside)

These were verified as `lineKind: comment` using original **historical** snapshots, rather than guessed from the screenshot.

### Module/Directory grouping fixtures

Sample row sequence `train.py → train.py → model.py → README.md → config/train_gpt2.py → data/shakespeare/prepare.py` produced:
- Python module run indices `0, 0, 1, null, 2, 3`: Module paints only actual `.py` lines; `README.md` remains neutral.
- Directory run indices `0, 0, 0, 0, 1, 2`: root brown, config silver, data/shakespeare brown.
- File run indices `0, 0, 1, 2, 3, 4`: two blue filename-chip shades alternate between consecutive file runs.
- With Comments ON and primary Class/Block/Nested/Module/Directory/Lines, standalone comments/docstrings paint pink independently of active scope.
- The existing file/color controls remain separate. Text/IDs were not modified.

## Still to verify visually

Live GitHub Pages and actual Android Chrome rendering were **not independently tested** here. Reopen the public URL after deployment, ensure the two buttons respond, enable Code Block + Comments, and inspect the exact STM IDs above. Use an ordinary browser hard refresh if Pages serves a cached file. The viewer's synthetic Python parsing heuristics should be evaluated separately if new Python syntax or source history is introduced; this change does not claim a complete Python AST parser.
