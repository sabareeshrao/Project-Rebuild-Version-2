# Chronological Prompt Index — 42 User Turns

Each file below has the **user's prompt**, the assistant's observable outcome (a summary, not verbatim chat export), the accepted or rejected design decision, and when possible a verified GitHub implementation link. These **42 files were each committed separately** to document improvement history; actual UI implementation commits precede these retrospective documentation commits.

**Read them in this order**. For fast replication, read [NEXT-AI-INSTRUCTIONS.md](NEXT-AI-INSTRUCTIONS.md) and [DESIGN-SPEC.md](DESIGN-SPEC.md) first, then browse the 42 records.

| # | Prompt focus | Historical record |
|---:|---|---|
| 001 | Hierarchy depth and bottom-level statements | [Prompt 001](prompts/001.md) |
| 002 | Hierarchy as plain sequence | [Prompt 002](prompts/002.md) |
| 003 | Numbered hierarchy | [Prompt 003](prompts/003.md) |
| 004 | Nine levels with code examples | [Prompt 004](prompts/004.md) |
| 005 | Complete code required at every scope | [Prompt 005](prompts/005.md) |
| 006 | Assign IDs at every hierarchy level | [Prompt 006](prompts/006.md) |
| 007 | Line-level STM plus file IDs | [Prompt 007](prompts/007.md) |
| 008 | Include filename in IDs | [Prompt 008](prompts/008.md) |
| 009 | Git chronology suggests tagging | [Prompt 009](prompts/009.md) |
| 010 | Correction: never put commit IDs in STM | [Prompt 010](prompts/010.md) |
| 011 | Single green STM chip | [Prompt 011](prompts/011.md) |
| 012 | Ten visible green line chips | [Prompt 012](prompts/012.md) |
| 013 | Nested block: yellow | [Prompt 013](prompts/013.md) |
| 014 | Outer code block (early blue) | [Prompt 014](prompts/014.md) |
| 015 | Fix missing green lines | [Prompt 015](prompts/015.md) |
| 016 | Next level is Method | [Prompt 016](prompts/016.md) |
| 017 | Method scope demo (early purple) | [Prompt 017](prompts/017.md) |
| 018 | Class red, Method blue, Block orange | [Prompt 018](prompts/018.md) |
| 019 | Show complete code lines | [Prompt 019](prompts/019.md) |
| 020 | Screenshot showing broken missing code | [Prompt 020](prompts/020.md) |
| 021 | Flat modular HTML viewer design | [Prompt 021](prompts/021.md) |
| 022 | Scaling to 100,000+ lines | [Prompt 022](prompts/022.md) |
| 023 | ChatGPT-like dark palette and code fonts | [Prompt 023](prompts/023.md) |
| 024 | Build first ten real Git commits | [Prompt 024](prompts/024.md) |
| 025 | Centered chips, endless page, alternating groups | [Prompt 025](prompts/025.md) |
| 026 | Select two colors for each high-level group | [Prompt 026](prompts/026.md) |
| 027 | Reject similar File and Module colors | [Prompt 027](prompts/027.md) |
| 028 | Reject Amber near Orange | [Prompt 028](prompts/028.md) |
| 029 | Reject Purple and Lime; finalize pairs | [Prompt 029](prompts/029.md) |
| 030 | Extend to 30 commits; numeric stepper | [Prompt 030](prompts/030.md) |
| 031 | Implement the 30-commit demo | [Prompt 031](prompts/031.md) |
| 032 | Fix pink inline-code statements | [Prompt 032](prompts/032.md) |
| 033 | Audit every line | [Prompt 033](prompts/033.md) |
| 034 | Green blanks, default green comments, gap rows | [Prompt 034](prompts/034.md) |
| 035 | No horizontal scroll; hanging wrapping | [Prompt 035](prompts/035.md) |
| 036 | Show only one commit or inclusive range | [Prompt 036](prompts/036.md) |
| 037 | Request HTML file link | [Prompt 037](prompts/037.md) |
| 038 | Retain whole prompt/output/change history as commits | [Prompt 038](prompts/038.md) |
| 039 | List original 39 prompts | [Prompt 039](prompts/039.md) |
| 040 | Include actual HTML/CSS/JS and diffs | [Prompt 040](prompts/040.md) |
| 041 | Continuous improvement principle | [Prompt 041](prompts/041.md) |
| 042 | Create this reusable handover folder for new project | [Prompt 042](prompts/042.md) |

## Milestones to inspect while replaying

- **001–010:** hierarchy, complete code, namespaced STM IDs, Git commit order; rejection of commit tags within IDs.
- **011–020:** chip colors and the critical missing-code visual regression.
- **021–023:** flat HTML viewer and performance approach, black ChatGPT-style palette.
- **024–025:** actual ten-commit implementation and growing natural page design.
- **026–029:** color-pair experiments and final palette (reject similar colors, purple, lime, amber).
- **030–031:** expansion to 30 real commits (168 physical lines), stepper instead of button row.
- **032–035:** comment bug, exhaustive audit, green blank lines, no horizontal scroll, hanging indentation.
- **036–037:** single/inclusive-range commit filtering and HTML link.
- **038–042:** preserve the conversation and code revisions as a self-explaining Git handover to a new AI.

## Verification and limitations

The user prompts are drawn from the currently visible conversation. Embedded screenshot markers are only attachment descriptions; no screenshot pixels were invented or silently reconstructed. **Assistant outcomes are summaries**, because a lossless export of every ChatGPT UI-rendered message is not included. For actual original HTML source code, open the complete versioned files in [reference/](reference/) and inspect the linked Git implementation SHAs in [GIT-PROVENANCE.md](GIT-PROVENANCE.md).

If a new AI finds a conflict between an earlier and a later prompt, the later explicitly accepted correction wins. Never erase the earlier error: it teaches what not to repeat.