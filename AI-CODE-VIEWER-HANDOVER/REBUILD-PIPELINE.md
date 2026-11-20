# Reproduction Pipeline (Engine & Data Contract)

This is the implementation plan for other projects; it is **not a claim** that the current nanoGPT HTML supports every case.

## Inputs and immutable evidence
- Target repo + default branch + requested historical commit range.
- Git commit graph, parent tree snapshots, patch hunks, rename/copy metadata.
- Language-specific AST parser for classes/methods/blocks and lexical tokenizer for source comment detection.
- Filesystem paths and line endings.

## Order of operations
1. Walk the chosen branch from root to target **by parents**, oldest first. Git timestamp-only ordering is not reliable; handle merges.
2. Materialize each commit's exact file snapshots and verify byte-for-byte if possible; avoid trusting summary patches as the sole source for huge files.
3. Match lines across snapshots with robust diff provenance. On additions, assign next monotonic STM identifier and stable file identity. Record edits/deletes/moves as events and carry identities where unambiguous.
4. Maintain a separate registry. Example (schematic):

```json
{
  "id": "STM-005-FIL-001-model.py",
  "fileId": "FIL-001",
  "path": "model.py",
  "introducedAt": "sha-of-source-commit",
  "sourceText": "    def forward(self, x):",
  "status": "live",
  "ancestorScopes": ["CLS-001", "MTH-002"],
  "sourcePositionsByCommit": { "5": 12, "6": 12 }
}
```

5. Use a language-aware AST (not naive regex alone) to map class/method/blocks to full source spans; incomplete early-commit files should be displayed as historical partial sources, not repaired with imagined syntax.
6. Serialize source snapshots, per-line provenance, scopes, and commit statistics as independently loadable data files or compressed chunks. Keep the viewer reusable: the new repo changes the data, not the UI shape.
7. Render only visible rows for large codebases; preserve natural page scrolling and stable top controls. Avoid rendering hundreds of thousands of elements at once.
8. Compute chip color independently from syntax highlight. The precedence is **default Lines mode green for all source rows; Comments mode pink for standalone `#`/docstrings and neutral charcoal otherwise; selected hierarchy colors EVERY member physical line including blanks and comments/docstrings, with neutral charcoal outside that category**. No other active chip colors.
9. Alternate module/package/file A/B colors by **consecutive visible runs**. If A, B, A appear as three consecutive groups, show Color1, Color2, Color1 regardless of file name uniqueness.
10. Do NOT insert synthetic source/blank rows or sky-blue boundary chips. Draw a thin #15803D horizontal line in the CODE area only when the current selected structural category changes between two adjacent, distinct, non-overlapping groups. Never draw between parent/child scopes, for every commit addition, or across nonconsecutive source rows.
11. Filter source IDs by commit history: Full file = cumulative snapshot through selected commit; Added only = additions of selected commit; Selected = union of additions in inclusive N..M. Clarify what to show for edited/deleted lines in new projects and test that policy. Never pretend a source snippet from a deleted file is present in the final snapshot.
12. Run the independent exhaustive audit and responsive-browser tests. Only then push.

## Data/HTML design
```
new-project/
  code-id-viewer/
    index.html            # reusable layout + compact navigator
    assets/               # CSS/JS separated as needed
    data/
      commits.json        # immutable hash, parent, order, stats
      files.json          # persistent file identities
      id-registry.json    # STM provenance; can be split
      scopes/             # AST span maps indexed by commit/file
      source/             # lazy-loaded per-commit/file chunks
    qa/
      audit.json          # completeness and regression evidence
```

The current example is one self-contained HTML file with embedded 30-commit data. It is useful to study and visually clone, but not scalable as-is to millions of lines. **Do not copy its small-data shortcuts as a universal history engine.**

## Reference source versions

Complete code is already archived in [reference/](reference/). These show what changed between actual versions: initial ten commits, pre-comment-fix thirty commits, corrected comments, and final inclusive-range UI. For syntax highlighting and precise indentation, inspect the current source, not a static screenshot.

## Boundaries
Avoid changing original code to attach IDs. Preserve whitespace, tabs, Unicode, trailing comments, blanks, and file contents. For languages such as Java, explicit braces are physical lines too. Use path-aware parsing, not assumptions that every `model.py` corresponds to an actual declared Python package.

## Incremental improvement rule
When user requests a change: capture the prompt verbatim, link implementation SHA, show before/after code, test previous rules on all relevant snapshots, add new regression tests, and commit the new artifact.
## Python documentation classification

A triple-quoted standalone Python literal, such as a module header or method docstring (`"""..."""` or `'''...'''`), is technically a string literal. Users want these included as comment-like documentation in the viewer's Comments selector. Scan multi-line quote state and maintain per-physical-line membership. Do not classify `my_query = """..."""` or `call("""...""")` as a comment. Language-aware tokenization/AST parsing is preferable to simple regex for complex cases. Preserve IDs, exact text and internal boundaries.

## Selected-hierarchy color discipline (Prompts 048–050)

Default Lines mode uses green for all source chips. When Class, Method, Code Block, Nested Block, File, Package or Module is selected, ALL matching source lines—including blank lines and documentation—use the selected category color. Nonmatching lines get neutral charcoal #232323. In Comments mode, only standalone `#` comments and triple-quoted documentation are pink; nonmatching lines are neutral. No fake gap rows. Use a thin green line in the code pane at the boundary between consecutive, nonoverlapping sibling groups of the **same currently selected** category. File A/B colors are now #00BFFF and #008CFF (saturated sky blues). The source data and STM IDs are unchanged.
