# Mandatory Quality Gates — Zero Compromise on Source Fidelity

## Repository and history
- [ ] Confirm exact repository, default branch, oldest→newest ordering, and parent chains.
- [ ] For each selected commit, compare reconstructed snapshot bytes/lines with the real committed file (including indentation, empty lines and comments). Count **every** actual file, not just Python/Java code.
- [ ] Preserve file paths and file IDs across renames with explicit policy; do not silently reuse one file ID for multiple unrelated files.
- [ ] Document merges, deletions, moves and edits; don't claim stable line identity from Git alone in ambiguous cases.
- [ ] Validate IDs unique, correctly formatted and monotonic by introduction order. Every physical line including blanks and comments has exactly one ID.
- [ ] Validate scope ranges (class, method, nested blocks), including incomplete snippets in early commits. Never invent a full method or closing brace not present yet.
- [ ] When a commit range is selected, show **only its additions**, not all cumulative earlier code. Test 1, 5, 5-10, 1-N, N, invalid 0, >N, reversed ranges.
- [ ] Distinguish standalone `#` comments, standalone triple-quoted Python documentation, statements with inline comments, and assigned string literals. Only standalone comments/documentation become pink in Comments mode.
- [ ] Every original source blank line remains in the viewer with its genuine STM ID and takes the selected enclosing hierarchy's chip color, remaining green in default Lines/Comments mode or outside selected scopes.
- [ ] New structural scope starts have **high-contrast sky-blue `#38BDF8` boundary rows** (no STM IDs, no change to source line count). Never simulate them with all-green gaps or hide original blanks.
- [ ] Python triple-quoted documentation (`"""`, `'''`) becomes pink in Comments mode including multiline interiors; triple-quoted assigned values and regular inline comments stay code/green.

## Layout
- [ ] All visible original source lines appear and source text is readable, with syntax colors, indentation and no truncation.
- [ ] Left chips perfectly aligned with corresponding code rows, centered vertically; height increases with wrapped source.
- [ ] Wrapping keeps continuation aligned under statement indentation, never resets at left edge.
- [ ] No horizontal overflow at widths 320, 360, 390, 430, 768, 1200 and 1440 pixels.
- [ ] Entire page scrolls naturally; no fixed-height internal vertical code scroll region.
- [ ] No nested visual bounding boxes for scopes; scope selected via colored chips.
- [ ] File/package/module view alternates assigned A/B colors when consecutive displayed grouping changes.
- [ ] No unreadable chip text, overlap, unstable layout or unwanted hover popups.
- [ ] Keyboard navigation must not hijack normal vertical page scroll (use explicit controls).

## Publication and verification
- [ ] Parse/validate generated JS and HTML.
- [ ] Browser-run and screenshot-test the actual saved HTML (not only an approximation/fixture); verify both narrow and desktop.
- [ ] Perform negative-case tests: empty file, README-only commit, non-source commit, multi-line expressions, comment-only commit, rename, deleted lines, multiple files in same commit.
- [ ] Keep original project source unchanged; place viewer in a separate destination.
- [ ] Re-fetch committed artifact from GitHub and verify it matches the tested output.
- [ ] Return exact commit/file URL and Pages link only after checking deployment state; disclose anything unverified.
- [ ] Never falsely claim audits or screenshot tests that did not actually run.

## Continuous improvement protocol
When user rejects an implementation: capture exact complaint, identify failure mode, update accepted design rules, implement a focused fix, run regression tests for ALL existing accepted behavior, add before/after evidence, and record Git commit SHA. Next AI starts from the latest accepted version, **never from the rejected prototype**.
