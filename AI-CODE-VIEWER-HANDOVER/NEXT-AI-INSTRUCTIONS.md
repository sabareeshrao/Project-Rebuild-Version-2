# Instructions to the Next AI — Read Before Coding

## Your job
The user will hand you a NEW GitHub repository. Replicate the evolving code-ID HTML viewer, not the nanoGPT project itself. The source of truth is the NEW repo's code, commits and actual Git diffs. Do not inject metadata comments into the source. Build in a separate folder and leave original code intact unless explicitly instructed otherwise.

## Sequential workflow
1. Verify repo access and determine default branch, first/oldest commits, directories, file types and desired commit range.
2. Read `DESIGN-SPEC.md`, `QUALITY-GATES.md`, this README and several actual reference HTML snapshots. Read prompt files for rejected attempts.
3. Reconstruct historical snapshots by following parent relationships in chronological order, not by sorting commit timestamps. Handle merges and rename history explicitly. If the first N commits are append-only, report that, but do not assume it for other repos.
4. Give each file a stable `FIL-###`; create a stable, monotonic `STM-###-FIL-###-filename` ID for **each original physical code line**, including comments, blank lines, braces, imports and decorators. Never restart numbering based on current line positions. Do not embed commit IDs inside STM names.
5. Track provenance in separate structured data: `id`, `fileId`, `path`, `firstIntroducedCommit`, `lineage`, `text`, `sourcePositionPerCommit`, `kind`, and parent scope IDs. Track deletions, edits, splits and moves without silently changing existing identities. An edit's identity policy must be documented; Git's patch alone may be ambiguous.
6. Generate a viewer (GitHub Pages-compatible standalone HTML/CSS/JS + lazy-loaded data chunks for large repos) using the exact design contract.
7. Navigators must distinguish a cumulative snapshot from additions in a single commit and additions across an inclusive range. E.g. entering `5` displays only lines introduced in commit 5, entering `5-10` displays only introductions in commits 5..10. Keep Full file, Added only, Selected commits controls.
8. For selecting a Class, Method, Block etc., recolor the relevant consecutive physical lines rather than drawing nested containers. All lines remain in their original source order. The first chip in the group names its scope; child lines continue with STM IDs.
9. Run independent source-diff audits, syntax validation, breakpoint visual checks, accessibility and overflow tests. Fix defects before publication.
10. Publish implementation changes as coherent Git commits and link to exact HTML and Pages paths.

## Do NOT repeat rejected mistakes
- Single-line `class X {` examples when the user wants complete classes/methods.
- Stacked nesting boxes consuming screen space.
- Missing green STM chips or missing code.
- Commit SHA inside STM ID.
- Rendering only labels while hiding actual syntax-colored source.
- A fixed-height scroll box or horizontal scrolling.
- Wrapped continuation starting at column zero; hanging indentation required.
- Green source comments turning pink by default.
- Treating a Python assignment with trailing `# explanation` as a comment-only line.
- Using all-green visual gap rows for structural changes. Instead, use **sky-blue `#38BDF8` boundary rows** only at real file/class/method/block/nested scope starts. They have no STM IDs. Never suppress a genuine blank source line or its ID.
- Keeping original blank lines green inside a selected class/method/block/nested/file/package/module: blanks should inherit that selected scope color. In default Lines mode blanks and comments remain green.
- Treating Python triple-quoted docstrings as ordinary code when Comments is selected, or incorrectly treating assigned triple-quoted strings as comment-only rows.
- Huge unwieldy row of commit buttons instead of compact stepper plus jump/range.
- Assuming package/module semantics when the project language or directory does not support them.
- Approximating Git history or hallucinating real code lines.

## Output contract
Provide a working file link (and Pages link only if configured/confirmed), code source, commit SHA(s), count of inspected snapshots, count of source lines, ID coverage, clear known limitations, and a QA report. If the next project has 100k+ lines, use virtualized rendering and data chunking while retaining natural document/page navigation. Verify on mobile.

## Reuse existing version
Reference implementation: [reference/LATEST-30-COMMITS.html](reference/LATEST-30-COMMITS.html), including sky-blue structural-start boundaries and Python docstring detection. Treat this as a working design example and a historical artifact, not an infallible general-purpose implementation. It indexes only an append-only Python file and hardcodes a limited commit range. Replace its hardcoded data and assumptions when adapting. 
