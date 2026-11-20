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
- Reintroducing **rejected sky-blue BOUNDARY chips** (Prompt 046 reverted them). The new File category DOES use saturated sky blue for its actual file chips.
- Keeping green chips on blank/comment/docstring lines inside a selected class/method/block/nested/file/package/module. Newer Prompts 048–050 require **every** in-scope source line to inherit the selected category color; unmatched source lines should be neutral, and fake gap rows are forbidden.
- Treating Python triple-quoted docstrings as ordinary code when Comments is selected, or incorrectly treating assigned triple-quoted strings as comment-only rows.
- Huge unwieldy row of commit buttons instead of compact stepper plus jump/range.
- Assuming package/module semantics when the project language or directory does not support them.
- Approximating Git history or hallucinating real code lines.

## Output contract
Provide a working file link (and Pages link only if configured/confirmed), code source, commit SHA(s), count of inspected snapshots, count of source lines, ID coverage, clear known limitations, and a QA report. If the next project has 100k+ lines, use virtualized rendering and data chunking while retaining natural document/page navigation. Verify on mobile.

## Reuse existing version
Reference implementation: [reference/LATEST-30-COMMITS.html](reference/LATEST-30-COMMITS.html), including category-consistent blank/documentation chips, high-saturation sky-blue File chips, conditional green code dividers and Python docstrings. Treat this as a working design example and a historical artifact, not an infallible general-purpose implementation. It indexes only an append-only Python file and hardcodes a limited commit range. Replace its hardcoded data and assumptions when adapting. 

## Explicit latest override (Prompts 048–050)

Selecting a hierarchy colors **all** code rows within each selected scope, including the real blank lines, standalone comments and docstrings. Unmatched chips use neutral charcoal; do not paint them green. When adjacent, nonoverlapping sibling groups of that SAME selected category meet, draw a single thin green separator in the CODE region, not the ID chip column and not as a synthetic extra row. Original code line IDs remain unchanged. File category alternates vivid sky blue shades #00BFFF and #008CFF. Do not use sky-blue boundary chips; those were separately rejected.

## Scaling override after Prompt 055

Do not extrapolate the original 30-commit single-HTML prototype to 100,000 or more source lines. Read the new [modular nanoGPT Batch 01 implementation](../nanogpt-modular-viewer/README.md), [chunked data manifest](../nanogpt-modular-viewer/data/manifest.json), [SourceStore](../nanogpt-modular-viewer/assets/store.js) and [virtual DOM renderer](../nanogpt-modular-viewer/assets/virtual.js). The code is organized so future work can add data chunks without copying huge source arrays into index.html. The first batch indexes nanoGPT commits 001–015 and stops at 76 physical lines; later batches are **not already completed**. Scope is 235 reconstructed nanoGPT source commits only. Preserve the original 30-commit HTML as an untouched reference. For a new DIFFERENT project, follow its actual commit history and use the modular architecture instead of copying hardcoded nanoGPT data. Real browser and huge-scale benchmarks remain necessary.
