# AI Code Viewer — Complete Replication Handover

> **START HERE — FOR THE NEXT AI.** This folder records how the user iteratively designed a commit-driven, source-faithful HTML code explorer. Your task is to reproduce and improve the system for **a NEW PROJECT** supplied by the user. Do not mistake the nanoGPT sample for their next target.

## Immediate reading order

1. [NEXT-AI-INSTRUCTIONS.md](NEXT-AI-INSTRUCTIONS.md) — nonnegotiable contract.
2. [DESIGN-SPEC.md](DESIGN-SPEC.md) — UI, IDs, colors and behavior.
3. [GIT-PROVENANCE.md](GIT-PROVENANCE.md) — original implementation commits and precise evidence.
4. [PROMPT-INDEX.md](PROMPT-INDEX.md) — all **42 user prompts** in sequence (the last is the request that created this handover).
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