# Why This Exists and How to Maintain It

This handover represents the user's iterative design process, not a generic ChatGPT template.

- **Original prompts:** `prompts/001.md` ... `prompts/058.md`.
- **Narrated outcomes:** in each prompt record. These are faithfully written summaries, **not full verbatim assistant response exports**.
- **Actual code:** `reference/*.html` exact GitHub-sourced revisions; canonical `../commit-id-demo/index.html`.
- **Actual implementation history:** `GIT-PROVENANCE.md` with SHA links.
- **Accepted UI:** `DESIGN-SPEC.md`, superseding rejected variants.
- **Do-this-next:** `START-NEW-PROJECT.md` and `NEXT-AI-INSTRUCTIONS.md`.
- **Quality rules:** `QUALITY-GATES.md`.

## How new learning is added
1. Append the user's exact prompt (one new `prompts/059.md` etc.).
2. Document assistant output as verbatim **only if actually captured**, otherwise label it as a summary.
3. Link the actual code commit and include real code before/after revisions when saved.
4. Capture what failed, how it was fixed, and the regressions that were tested.
5. Add one documentation commit per prompt. Never erase rejected history, and never change the original user wording when preserving a raw transcript.
6. Advance the prompt index and approved design spec.

## Why different Git commits matter
Documentation commits show the *human requirements chronology*. Implementation Git commits show *working code evolution*. They do **not** have to share commit IDs. Links tie them together without falsifying the history.

## Unresolved work for next project
Multi-file/module color alternation is specified but cannot be visually demonstrated within the first 30 source commits (all one `model.py`). General-purpose edit/rename/merge provenance is not implemented by the small nanoGPT demo; a new AI must implement and test it for an actual varied project.

## New visual and comment classification corrections (Prompts 043–045)

- Prompts 043–044 experimented with sky-blue structural boundaries and scope-colored blanks. Prompt 046 **rejected the sky-blue boundary chips**. Newer Prompts 048–050 accept scope-colored blank lines with neutral nonmember chips and thin green CODE-only dividers between adjacent same-category groups; there are no synthetic gap rows. File A/B now uses #00BFFF/#008CFF.
- A lone triple-quoted Python module/class/method documentation literal is a string, not a `#` comment, but Comments mode highlights its entire documentation block pink. Assigned triple-quoted values remain green.
- Exact before/after HTML revisions are retained in [reference/](reference/), with implementation SHA links in [GIT-PROVENANCE.md](GIT-PROVENANCE.md).

## Current canonical style (Prompt 050)

The current viewer is [../commit-id-demo/index.html](../commit-id-demo/index.html). Its exact GitHub-sourced copy lives in [reference/LATEST-30-COMMITS.html](reference/LATEST-30-COMMITS.html). Rejected sky-blue boundary chips and former green synthetic blank separators are historical prototypes only. No green chips inside active Class/Method/Block/Nested/File/Package/Module groups: all member source lines share the selected category color. Nonmember lines use neutral charcoal. Thin green line only in the code column between directly adjacent nonoverlapping groups of the same selected category. Preserve all historical data and STM IDs.

## Prompt 055 milestone — modular nanoGPT viewer

The accepted static demo at [../commit-id-demo/index.html](../commit-id-demo/index.html) remains unchanged. [../nanogpt-modular-viewer/](../nanogpt-modular-viewer/README.md) now holds a separate modular implementation with original nanoGPT commits 001–015, 76 verified model.py source lines, SourceStore, windowed DOM virtualization, a 15-commit data chunk and a tracker for the remaining 15 batches. Each new batch must append new verified source history while retaining existing STM IDs, user-selected hierarchy colors and conditional green dividers. Continue documenting prompts from 056 onward.

## Prompts 056–057 — latest modular UI

[Implementation](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/8b12df7ed3c438438896f09ce0cb52a66d15dee4) adds a compact sticky control deck, permanently filled category colors, All commits reset, source-row in-place category recoloring and a second filename chip alongside short STM ID. See [QA](../nanogpt-modular-viewer/QA-UI-REFINEMENT.md). Still only first 15 nanoGPT source commits; Batch 02 remains planned.

## Recording scope clarification (Prompt 058)

Maintain **two independent views of the same evidence**: (1) all chronological user prompts, including conceptual ideas, architecture, verification, nanoGPT source batches, questions, status and UI feedback; (2) a narrower UI-specific filtered index. Do not imply every prompt is a UI feature request or that every prompt produced a code change. Label assistant responses as summaries unless actual verbatim output is available. Never invent text/code/screenshot evidence. The [coverage audit](PROMPT-COVERAGE-AUDIT.md) and [UI-only subset](UI-CHANGE-INDEX.md) let the next AI choose the relevant perspective without losing history.
