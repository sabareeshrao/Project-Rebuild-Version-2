# AI Code Viewer — Complete Replication Handover

> **START HERE — FOR THE NEXT AI.** This folder records how the user iteratively designed a commit-driven, source-faithful HTML code explorer. Your task is to reproduce and improve the system for **a NEW PROJECT** supplied by the user. Do not mistake the nanoGPT sample for their next target.

## Immediate reading order

1. [NEXT-AI-INSTRUCTIONS.md](NEXT-AI-INSTRUCTIONS.md) — nonnegotiable contract.
2. [DESIGN-SPEC.md](DESIGN-SPEC.md) — UI, IDs, colors and behavior.
3. [GIT-PROVENANCE.md](GIT-PROVENANCE.md) — original implementation commits and precise evidence.
4. [PROMPT-INDEX.md](PROMPT-INDEX.md) — all **46 user prompts** in sequence, including the rejection of sky-blue boundaries.
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

[Prompt 046](prompts/046.md) explicitly **rejects sky-blue boundary chips**. The viewer is back to green original blank-line chips (with STM IDs) in *every* hierarchy view, plus subtle unlabeled **green display-only gap rows** where needed (no STM ID). Python triple-quoted documentation support from Prompt 045 is retained. [Current complete HTML](reference/LATEST-30-COMMITS.html) · [Revert commit](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/d8d12d2a15b69e6612e5c2b78425111021b68aba).
