# Actual Implementation and Bug-Fix Provenance

Source: https://github.com/sabareeshrao/Project-Rebuild-Version-2

The next AI should consult the **real Git diffs**, not a prose reconstruction, before changing code. GitHub contains the actual full-file historical versions.

| Phase | Commit SHA | Exact result |
|---|---|---|
| Initial 10-commit viewer | `633b4ffebdbe53e9397eaf8560c8b135ef226114` | First HTML version, 50 indexed lines |
| Fix syntax | `95f1c9af1bc397230a4904a754eea25fe7362f79` | Corrected JS status text |
| 30 commits & hierarchy palettes | `c950d23e10401de282714ab9b225ec6c1640eb0d` | Indexed 168 original lines |
| Default Commit 30 | `3e7be40109f1cf0afbeebd0c5d348335cfcf5bcd` | Initial view changed |
| Fix comment vs inline statement | `6ee2228cdfadc3f06f0f4732b96b22a984a1aad0` | Comment-only and inline comment differentiated |
| Green blanks + display-only gaps | `ed1f2ec3c1d49e51053c8efc09010234f7fc7a0a` | Default comments/blank lines green and gaps |
| Hide labels on view-only gaps | `aa1b77535bca1771e7464fda713e7f47764b5b0a` | Green gap remains no source ID |
| Hanging indent & no side-scroll | `a64886932d2d5fe604eeece0a9256ec92ca5204e` | Wrapped code + expanding chips |
| Single/range filters | `27ffbd66ebd717bc832a6c85fe94a06fffe60d54` | Jump accepts 5 and 5-10 |
| Sky-blue structural boundaries | `3c8deb32eaca72b9b25bcd5c9f3c17c5ec4cbee7` | Synthetic scope-start boundary rows with no STM ID; genuine blanks inherit selected hierarchy colors |
| Python docstrings in Comments mode | `e629d7c677ea5289412a01e0109dd6a11f2842e5` | Standalone triple-quoted document blocks recognized while assigned triple strings remain code |

Each commit above: `https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/<SHA>`

### Actual versioned HTML
- `reference/INITIAL-10-COMMITS.html`: complete HTML after the first JS fix (10 commits / 50 lines)
- `reference/EXTENDED-30-BEFORE-COMMENT-FIX.html`: complete HTML at Commit 30 before comment classification repair
- `reference/COMMENT-FIXED.html`: complete HTML after standalone vs inline comment correction
- `reference/BEFORE-SKY-BLUE-BOUNDARIES.html`: previous all-green blank-line view
- `reference/SKY-BLUE-BEFORE-DOCSTRINGS.html`: blue structural boundaries with `#`-only comments mode
- `reference/LATEST-30-COMMITS.html`: complete current implementation including selection ranges, structural boundaries and triple-quoted Python docstring detection

Original canonical file: `../commit-id-demo/index.html`. Reference copies are intentionally included so the next AI can inspect versions side-by-side, even when it hasn't checked out individual historical refs.

### Historical data QA
For source-data generation, the first 30 nanoGPT build commits (starting SHA `cac2c626c007c5a5bb298f001a9efa7091a313ca` and ending SHA `5f05102b47878b6f367b648613a5aef68f14122f`) were checked individually against their file snapshots. The final file contained 168 physical lines, 25 genuinely blank lines, 17 standalone `#` comment lines and 9 executable lines containing inline `#` explanations. Avoid counting display-only gap rows as real source lines.

### Limits
- Only first 30 **build commits** were processed in this viewer, and they all added lines to `model.py`. Real-project edits, deletes, renames, branches and multi-file alternating colors still need robust implementation and QA.
- The first 30 commits were initially derived by reading Git commit diffs. The demo's embedded source database is tied to the last of those commits; do not reuse source IDs unchanged for another project.
- A GitHub Pages URL is given as a target; deployment availability is independent of creating a public GitHub repository.
