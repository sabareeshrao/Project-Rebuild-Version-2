# Prompt Coverage Audit — Whole Project Conversation vs UI-only Changes

This audit is a **scope and fidelity check**, not a claim that a complete lossless export of ChatGPT exists.

As of Prompt 060, the handover has **60 numbered user-prompt records**, each stored as a distinct Markdown file. Every file from 001.md through 060.md is present in the repository. The complete index is [PROMPT-INDEX.md](PROMPT-INDEX.md). The UI-only subset is [UI-CHANGE-INDEX.md](UI-CHANGE-INDEX.md).

## Coverage by topic

| Domain | Record count | What it includes |
|---|---:|---|
| Architecture, source IDs and Git design | 16 | Hierarchy and STM identity conventions, historical commit ordering, modularization, complete-code expectations and archiving requirements |
| UI and visual feedback | 30 | Color chips, screenshots, rejected layouts, wrapping, sticky controls, comment rendering, sibling dividers and filename chips |
| Project execution and source commits | 5 | Creating historical HTML demos, choosing nanoGPT-only batches, checking original commit counts and implementing modular Batch 01 |
| Audit, links, status and handover | 8 | Hierarchy follow-ups, exhaustive source audits, working-file links, status verification, project handover and confirmation of documentation commits |
| Documentation-scope correction | 1 | Clarifying the difference between an all-prompts conversation archive and a UI-change-only index |
| **Total** | **60** | **60 unique prompt IDs, no gaps or duplicates** |

These are **topic classifications**; an individual prompt can affect several areas. The table assigns each prompt to one primary group to make audit counts unambiguous.

## Full topic inventory

### Architecture, source IDs and Git design (16)

[001](prompts/001.md) · [002](prompts/002.md) · [003](prompts/003.md) · [004](prompts/004.md) · [005](prompts/005.md) · [006](prompts/006.md) · [007](prompts/007.md) · [008](prompts/008.md) · [009](prompts/009.md) · [010](prompts/010.md) · [021](prompts/021.md) · [022](prompts/022.md) · [038](prompts/038.md) · [040](prompts/040.md) · [041](prompts/041.md) · [052](prompts/052.md)

### UI and visual feedback (30)

[011](prompts/011.md) · [012](prompts/012.md) · [013](prompts/013.md) · [014](prompts/014.md) · [015](prompts/015.md) · [017](prompts/017.md) · [018](prompts/018.md) · [019](prompts/019.md) · [020](prompts/020.md) · [023](prompts/023.md) · [025](prompts/025.md) · [026](prompts/026.md) · [027](prompts/027.md) · [028](prompts/028.md) · [029](prompts/029.md) · [030](prompts/030.md) · [032](prompts/032.md) · [034](prompts/034.md) · [035](prompts/035.md) · [036](prompts/036.md) · [043](prompts/043.md) · [044](prompts/044.md) · [045](prompts/045.md) · [046](prompts/046.md) · [048](prompts/048.md) · [049](prompts/049.md) · [050](prompts/050.md) · [056](prompts/056.md) · [057](prompts/057.md) · [059](prompts/059.md)

### Project execution and source commits (5)

[024](prompts/024.md) · [031](prompts/031.md) · [053](prompts/053.md) · [054](prompts/054.md) · [055](prompts/055.md)

### Audit, links, status and handover (8)

[016](prompts/016.md) · [033](prompts/033.md) · [037](prompts/037.md) · [039](prompts/039.md) · [042](prompts/042.md) · [047](prompts/047.md) · [051](prompts/051.md) · [060](prompts/060.md)

### Documentation-scope correction (1)

[058](prompts/058.md)


## What the records DO preserve

- Historical user prompt text **where it was accessible** when documentation was written, including original spelling where possible.
- Notes describing what the assistant produced, with accepted, rejected or corrected requirements.
- Links to real GitHub source files, original source-history commits, and concrete viewer implementation SHAs when applicable.
- Rejected UI proposals, source-data validation steps, implementation problems, test evidence, architecture changes, batch planning and status follow-ups.
- Chronological record numbering and individual documentation commits.

## What the records DO NOT prove

- They are **not verbatim complete assistant transcripts**. Many `ASSISTANT-RESPONSE` sections are authored *summaries*, not literal full ChatGPT replies.
- They do not include every original ephemeral chat-rendered UI element, inline screenshot, transient unsaved code snippet, or private tool execution.
- Verifying `001.md` through `058.md` are sequential proves numbering completeness **inside this archive**, not that every turn from every original or branched conversation was accessible when the archive was constructed.
- The exact full historical HTML **does** exist where actual GitHub commits are linked; do not confuse that with unsaved intermediate UI mockups.
- No new source/HTML code change is implied by a status or planning prompt. A documentation commit is distinct from an implementation commit.

## How to maintain both views

1. Record each new user prompt in the complete chronological archive, clearly separating exact text from response summaries and linking real implementation commits.
2. Add UI-related prompt records also to the curated UI index. Keep irrelevant status, repository-source and batching prompts out of that narrower index.
3. Use [GIT-PROVENANCE.md](GIT-PROVENANCE.md) for actual implementation SHA provenance, [BATCH_TRACKER.md](../nanogpt-modular-viewer/BATCH_TRACKER.md) for nanoGPT source batches, and [DESIGN-SPEC.md](DESIGN-SPEC.md) for the latest accepted UI contract.
4. If a true lossless transcript is later supplied or exported, distinguish it as a separate verbatim source and reconcile the summaries against it; never invent missing wording.
