# AI Code Viewer — Complete Replication Handover

> **START HERE — FOR THE NEXT AI.** This folder records how the user iteratively designed a commit-driven, source-faithful HTML code explorer. Your task is to reproduce and improve the system for **a NEW PROJECT** supplied by the user. Do not mistake the nanoGPT sample for their next target.

## Immediate reading order

1. [NEXT-AI-INSTRUCTIONS.md](NEXT-AI-INSTRUCTIONS.md) — nonnegotiable contract.
2. [DESIGN-SPEC.md](DESIGN-SPEC.md) — UI, IDs, colors and behavior.
3. [GIT-PROVENANCE.md](GIT-PROVENANCE.md) — original implementation commits and precise evidence.
4. [PROMPT-INDEX.md](PROMPT-INDEX.md) — all **58 numbered user prompts** in this project's recorded sequence, including the newest exclusive category colors and conditional green code dividers.
5. [prompts/](prompts/) — one historical user prompt plus assistant-outcome notes per numbered file; **one Git documentation commit per prompt**, preserving continuous improvement.
6. [reference/](reference/) — real, complete historical HTML snapshots, with the latest demo to copy and modify.
7. [QUALITY-GATES.md](QUALITY-GATES.md) — audit checklist before shipping to the user.

## Production example

- Live example (subject to GitHub Pages being configured): https://sabareeshrao.github.io/Project-Rebuild-Version-2/commit-id-demo/
- Exact original HTML: https://github.com/sabareeshrao/Project-Rebuild-Version-2/blob/main/commit-id-demo/index.html
- Source repo: https://github.com/sabareeshrao/Project-Rebuild-Version-2

## Mission

For a new repository: study commits **oldest → newest**, assign stable IDs to every source line by first introduction, associate lines with their file and structural ancestors, and provide a standalone modular HTML viewer with color-coded LEFT IDs, real source code RIGHT, preserved indentation, commit navigation and single/range filtering. It must remain fast for large projects and should be deployable to GitHub Pages. The original code must **not** be altered just to inject IDs.

## Fidelity policy

- User prompts in the prompt files are transcribed from the visible conversation, including spelling, and are quoted as user speech.
- Assistant outcomes are **summaries** of the original responses, *not* a claim that all ChatGPT message text, UI internals, screenshots or transient code is recoverable word-for-word.
- Actual code artifacts are the real **GitHub HTML files** copied at historical commit refs. Those are authoritative for implementation.
- Where the original demo used a shortcut, the handover explicitly calls it out. Never invent a vanished source version.
- The source sample contains Python in `model.py`; a different repository/language requires proper language-aware parsing and file handling.

## User's overriding direction

**Improve continuously, preserve all accepted behavior, review every line, and avoid repeating mistakes.** Before writing code, explain the planned change only when clarification is genuinely necessary. After a change, audit all affected commit snapshots, test mobile rendering and provide the exact GitHub link.
## Historical experiments — Prompts 043–045 (sky-blue rejected in Prompt 046)

- Prompts [043](prompts/043.md) and [044](prompts/044.md) experimented with sky-blue boundaries and differently colored blanks. **Both changes were rejected in Prompt 046**; they remain as historical lessons only.
- Prompt [045](prompts/045.md): the **Comments** selector colors both standalone `#` comment lines and standalone Python triple-quoted documentation (`"""` and `'''`) pink. In default Lines mode they remain green. Assigned triple-quoted *values* are not comments; Python docstrings are technically strings, and the viewer groups them as documentation.
- [Latest complete HTML](reference/LATEST-30-COMMITS.html) is updated after both refinements. [Prior versions](reference/) preserve before/after evidence.

## Current accepted visual rules — Prompt 046

[Prompt 046](prompts/046.md) rejects sky-blue **BOUNDARY chips**. Prompts [048](prompts/048.md), [049](prompts/049.md), and [050](prompts/050.md) supersede the temporary all-green-gap fallback: every line inside a selected scope inherits that scope color, nonmember rows are neutral, File chips use vivid sky blues, and ONLY a thin conditional green line in the code pane distinguishes adjoining same-category groups. [Current complete HTML](reference/LATEST-30-COMMITS.html) · [Revert commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/d8d12d2a15b69e6612e5c2b78425111021b68aba).

## Current accepted version (Prompts 048–050)

Read [DESIGN-SPEC.md](DESIGN-SPEC.md) for the exact rules and [reference/LATEST-30-COMMITS.html](reference/LATEST-30-COMMITS.html) for working code. The reverted sky-blue boundary chips remain historical only. **Sky blue is accepted for File chips**, not boundary markers. Original blank rows are preserved but now take the selected scope's color; other unmatched code chips become neutral charcoal; a thin green divider appears only in the code area at consecutive same-category group transitions. No synthetic gaps are inserted.

## New scalable nanoGPT implementation — Prompts 051–055

The earlier 30-commit all-in-one HTML is now an **untouched visual reference**. The **new modular nanoGPT build** is at [../nanogpt-modular-viewer/](../nanogpt-modular-viewer/README.md). Batch 01 indexes the first 15 real reconstructed nanoGPT source commits with 76 source lines independently compared against all 15 GitHub snapshots. It separates HTML, CSS, four JavaScript modules, a source metadata manifest and a lazy-loaded batch chunk; it renders windowed rows with natural page scrolling. [Implementation commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/b9873f09edf42c197a6002d42a3bf943c7ac3ac3) · [Batch QA](../nanogpt-modular-viewer/QA-BATCH-001.md) · [16-batch plan](../nanogpt-modular-viewer/BATCH_TRACKER.md).

**Scope:** Only the 235 reconstructed nanoGPT source commits are counted. This excludes GitHub demo, prompt handover and separate learning commits. Preserve the existing STM IDs and selected-color/green-divider design contract. Large-scale performance and Android rendering still need browser verification.

## Latest UI (Prompts 056–057)

The separate [modular nanoGPT viewer](../nanogpt-modular-viewer/index.html) now has a **compact sticky controls-only header**, colored category buttons even when unselected, a one-click **All commits** reset from range filters, and short STM IDs plus a **separate filename chip**. Switching category recolors mounted rows in place without resetting scroll/measurements. [Implementation](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/8b12df7ed3c438438896f09ce0cb52a66d15dee4) · [QA](../nanogpt-modular-viewer/QA-UI-REFINEMENT.md). Source remains Batch 01 (15/235 indexed, 76 lines); original 30-commit prototype untouched. Android live visual rendering remains unverified.

## Full prompt history versus UI-only change log

[**Complete chronological prompt index**](PROMPT-INDEX.md) is the default: it includes architecture, source-commit history, code implementation, batch planning, visual feedback, audits, status questions, and handover discussions—not only UI changes. [**UI-specific prompts**](UI-CHANGE-INDEX.md) provide a filtered view of the visual work. [**Coverage audit**](PROMPT-COVERAGE-AUDIT.md) shows the categories and limits of what the archive actually preserves.

**Critical limitation:** the user prompt text is preserved where it was available, but assistant outputs are usually **summaries**, not word-for-word ChatGPT conversation exports. Every available project turn was intended for documentation, but sequential filenames alone cannot establish that no branch conversation or inaccessible earlier message was missed. Actual GitHub HTML/code history is linked independently in [GIT-PROVENANCE.md](GIT-PROVENANCE.md).
