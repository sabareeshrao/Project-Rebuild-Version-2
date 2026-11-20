# Instructions to the Next AI — Read Before Coding

## Most recent accepted UI rule — Prompt 065

The Comments button is an **independent pink toggle**, not a replacement for the selected hierarchy category. Class + Comments, Method + Comments, Nested + Comments, etc. can be active concurrently. Only standalone `#` comments and actual docstring physical lines *inside* the current category's members turn pink; all other members keep their base category color, and comments outside class/method/block/nested scopes stay neutral. Switching the primary hierarchy keeps Comments ON/OFF; toggling Comments OFF restores the category color without changing scroll position or row elements. Lines + Comments highlights comments throughout the selected file. Preserve the prior Prompt 063–064 **STM-only chip text** rule, full IDs, natural scrolling, filename-first order and conditional code-only green sibling dividers.

[Prompt 065](prompts/065.md) · [Current viewer](../nanogpt-modular-viewer/index.html) · [41 controlled QA checks](../nanogpt-modular-viewer/QA-UI-COMMENTS-OVERLAY.md). No independent browser screenshot/Pages verification was performed. Next historical batch remains 061–075; current coverage is 60 / 235 commits.

## Critical latest rule — Prompts 063–064 (supersedes earlier first-chip scope label)

In the modular nanoGPT viewer, every colored source chip visibly contains **only its short STM number**, e.g. `STM-046`. The selected **color** identifies the hierarchy. **Never** add a second label row (`NESTED · NBL-001 · if not self.flash`, class/method names, or `COMMIT · +N` markers) inside the chip. Keep complete STM and structural identity/provenance in the registry, DOM attributes and accessible labels.

Preserve **filename → STM → original code** order. The chip is a single compact line, even for the first row of each class/method/block. Category switching recolors existing mounted rows in place without changing their heights or scroll positions. This supersedes older instructions below that had the "first chip names scope" layout or reserved second metadata line.

Read [Prompt 063](prompts/063.md), [Prompt 064](prompts/064.md), [current renderer](../nanogpt-modular-viewer/assets/view.js), [compact CSS](../nanogpt-modular-viewer/assets/viewer.css), [focused QA](../nanogpt-modular-viewer/QA-UI-COMPACT-STM-CHIPS.md). Current source coverage remains **60 of 235** authentic nanoGPT commits; next source batch is **061–075**.

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

## New modular viewer baseline — after Prompt 057

Before adding new source commits, preserve the latest [modular viewer](../nanogpt-modular-viewer/index.html) and [UI QA checks](../nanogpt-modular-viewer/QA-UI-REFINEMENT.md). Keep the compact sticky toolbar (not the large masthead) while allowing titles/stats to scroll away. Do not make inactive category buttons gray again: keep their own filled colors. A category-only change must update existing rendered rows in place and preserve page position and virtual measurements; avoid layout-height shifts and mobile browser height-only remeasurement. All commits must clear a jump range and show the latest indexed cumulative source; Full file is tied to the currently selected commit. Display STM-NNN and filename in separate aligned chips, while preserving full STM-NNN-FIL-NNN-filename identity in the immutable source data and DOM attributes. The new modular viewer currently covers 15 actual nanoGPT source commits; the single-HTML 30-commit sample remains an untouched reference.

## Current modular viewer continuation — after Prompt 062 / Batch 04

**The latest canonical modular viewer now indexes 60 of 235 reconstructed nanoGPT original source commits.** It contains 366 genuine physical source lines across `model.py`, `LICENSE`, `.gitignore` and `.gitattributes`, with 7 JSON chunks, 4 file IDs, and 62 structural scopes.

Read these *current* files before starting the next batch:
- [Modular viewer README](../nanogpt-modular-viewer/README.md)
- [Manifest with 60 authentic source commits](../nanogpt-modular-viewer/data/manifest.json)
- [Batches 01–04 tracker](../nanogpt-modular-viewer/BATCH_TRACKER.md)
- [Batch 02 QA](../nanogpt-modular-viewer/QA-BATCH-002.md)
- [Batch 03 QA](../nanogpt-modular-viewer/QA-BATCH-003.md)
- [Batch 04 QA](../nanogpt-modular-viewer/QA-BATCH-004.md)
- [Prompt 061](prompts/061.md) and [Prompt 062](prompts/062.md)

**Next actual source range:** Batch 05, source commits **061–075**. Do not confuse source commit 61 with Prompt 061 or repository GitHub commit count. The earlier single-HTML reference still indexes only 30 source commits and remains untouched.

From Batch 02 through Batch 04 the original changes were verified to be append-only; this is **not a guarantee** that source commits 61–235 will be. The per-file SourceStore currently uses append-only source-line ranges, so adding an edit/deletion/rename must begin with an explicit versioned line-history data-model extension, not a silent inaccurate append.

Later UI refinements must preserve the filename-first chips, full permanent STM IDs, source code fidelity, the compact sticky toolbar, all color categories, in-place recoloring and natural page virtual scrolling. The user rejected synthetic boundary chips and any project-wide giant HTML. Batch 04 introduced LICENSE: its source must render as plain text rather than falsely highlighted as Python code.

Prompts **061–062** are now recorded in the [62-turn full index](PROMPT-INDEX.md). Record every additional user prompt, not only UI prompts. The 60-prompt coverage audit is a historical snapshot, not the current archive count.

**Verification boundary:** The implementation passed source-snapshot equality tests and 35 controlled regression assertions plus a mocked-DOM scroll-preservation check. Live Android/desktop visual tests, Pages deployment and 100k+ line performance remain unverified.
