# Why This Exists and How to Maintain It

This handover represents the user's iterative design process, not a generic ChatGPT template.

- **Original prompts:** `prompts/001.md` ... `prompts/042.md`.
- **Narrated outcomes:** in each prompt record. These are faithfully written summaries, **not full verbatim assistant response exports**.
- **Actual code:** `reference/*.html` exact GitHub-sourced revisions; canonical `../commit-id-demo/index.html`.
- **Actual implementation history:** `GIT-PROVENANCE.md` with SHA links.
- **Accepted UI:** `DESIGN-SPEC.md`, superseding rejected variants.
- **Do-this-next:** `START-NEW-PROJECT.md` and `NEXT-AI-INSTRUCTIONS.md`.
- **Quality rules:** `QUALITY-GATES.md`.

## How new learning is added
1. Append the user's exact prompt (one new `prompts/043.md` etc.).
2. Document assistant output as verbatim **only if actually captured**, otherwise label it as a summary.
3. Link the actual code commit and include real code before/after revisions when saved.
4. Capture what failed, how it was fixed, and the regressions that were tested.
5. Add one documentation commit per prompt. Never erase rejected history, and never change the original user wording when preserving a raw transcript.
6. Advance the prompt index and approved design spec.

## Why different Git commits matter
Documentation commits show the *human requirements chronology*. Implementation Git commits show *working code evolution*. They do **not** have to share commit IDs. Links tie them together without falsifying the history.

## Unresolved work for next project
Multi-file/module color alternation is specified but cannot be visually demonstrated within the first 30 source commits (all one `model.py`). General-purpose edit/rename/merge provenance is not implemented by the small nanoGPT demo; a new AI must implement and test it for an actual varied project.
