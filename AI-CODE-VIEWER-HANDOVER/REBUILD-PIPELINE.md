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
8. Compute chip color independently from syntax highlight. The precedence is **blank always green; standalone comment pink only in Comments mode; selected-scope color for matching executable/nonblank lines; otherwise green**.
9. Alternate module/package/file A/B colors by **consecutive visible runs**. If A, B, A appear as three consecutive groups, show Color1, Color2, Color1 regardless of file name uniqueness.
10. Add a display-only green spacer when contiguous groups change without a source blank. It has a display flag but NO physical line ID. Do not use fake STM numbers.
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