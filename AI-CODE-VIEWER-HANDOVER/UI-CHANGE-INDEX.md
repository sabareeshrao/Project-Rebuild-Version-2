# UI Change Prompts — Curated Index

This is the **UI-specific view** of the larger [chronological full prompt record](PROMPT-INDEX.md). It includes original design requests, bug reports, rejected visual experiments, and implementation approvals. Non-UI conversation prompts (such as source batch counting, architecture plans, and status questions) remain available in the full archive and are **not** listed here.

**40 UI-related prompts** are linked below, in their original chronological order. An inclusion here does not assert that every idea was accepted or committed.

| Prompt | UI request or issue | Record |
|---:|---|---|
| 011 | Green STM chip | [View prompt](prompts/011.md) |
| 012 | Ten source ID chips | [View prompt](prompts/012.md) |
| 013 | Nested blocks yellow | [View prompt](prompts/013.md) |
| 014 | Outer block early color | [View prompt](prompts/014.md) |
| 015 | Restore missing green line chips | [View prompt](prompts/015.md) |
| 017 | Method-level color | [View prompt](prompts/017.md) |
| 018 | Class red, Method blue, Block orange | [View prompt](prompts/018.md) |
| 019 | Full source code lines | [View prompt](prompts/019.md) |
| 020 | Screenshot: broken missing-code UI | [View prompt](prompts/020.md) |
| 023 | Dark background and fonts | [View prompt](prompts/023.md) |
| 025 | Centered chips and natural page | [View prompt](prompts/025.md) |
| 026 | Two colors per high-level group | [View prompt](prompts/026.md) |
| 027 | Reject similar file/module colors | [View prompt](prompts/027.md) |
| 028 | Reject amber near orange | [View prompt](prompts/028.md) |
| 029 | Reject purple/lime | [View prompt](prompts/029.md) |
| 030 | Compact commit stepper proposal | [View prompt](prompts/030.md) |
| 032 | Comment vs executable line bug | [View prompt](prompts/032.md) |
| 034 | Blank and comment chip behavior | [View prompt](prompts/034.md) |
| 035 | Code wrap and line-chip height | [View prompt](prompts/035.md) |
| 036 | Commit range UI filter | [View prompt](prompts/036.md) |
| 043 | Confusing green blanks screenshot | [View prompt](prompts/043.md) |
| 044 | Sky-blue boundary proposal | [View prompt](prompts/044.md) |
| 045 | Triple-quote docstring highlighting | [View prompt](prompts/045.md) |
| 046 | Revert rejected sky-blue chips | [View prompt](prompts/046.md) |
| 048 | Scope colors and code-only green sibling divider | [View prompt](prompts/048.md) |
| 049 | Saturated sky-blue File category | [View prompt](prompts/049.md) |
| 050 | Scope-colored original blanks | [View prompt](prompts/050.md) |
| 056 | Compact sticky header design feedback | [View prompt](prompts/056.md) |
| 057 | Implement compact header and two-chip row | [View prompt](prompts/057.md) |
| 059 | Swap source row chip columns: File first, STM second | [View prompt](prompts/059.md) |
| 063 | Screenshot: remove redundant category/structural labels from colored chips | [View prompt](prompts/063.md) |
| 064 | Approve compact STM-only chip UI, implementation and prompt-history commit | [View prompt](prompts/064.md) |
| 065 | Make Comments a toggle within any selected category, retaining hierarchy colors | [View prompt](prompts/065.md) |
| 069 | Proposal: original Git changes with category-colored chips and struck-through deleted code | [View prompt](prompts/069.md) |
| 073 | Report original-history UI corruption: changed-only default, lost source styling | [View prompt](prompts/073.md) |
| 074 | Restore original UI and default complete 159-commit history source view | [View prompt](prompts/074.md) |
| 075 | Fix deployed restored viewer appearing as unstyled HTML due to wrong CSS path | [View prompt](prompts/075.md) |
| 076 | Preserve all viewing modes/filters on navigation and activate File + Comments together | [View prompt](prompts/076.md) |
| 077 | Add historical Class and Method coloring; File filename-only toggle; wider filename chips | [View prompt](prompts/077.md) |
| 078 | Full file displays all original source lines regardless of active hierarchy/color scope | [View prompt](prompts/078.md) |

For **latest accepted design**, do not use old rejected prompts as specifications. Read [DESIGN-SPEC.md](DESIGN-SPEC.md), [the modular viewer](../nanogpt-modular-viewer/index.html), and [its verified UI QA](../nanogpt-modular-viewer/QA-UI-REFINEMENT.md). For implementation before/after evidence, inspect [GIT-PROVENANCE.md](GIT-PROVENANCE.md). The original screenshots that were only present in ChatGPT were not saved as verifiable files.

**Latest accepted override — Prompts 063–064:** Color already communicates the category. Source-line chips visibly contain **only the STM-NNN identifier**, never `NESTED · NBL-001 · ...` or a commit marker. Keep the full identifier, source-group detail and provenance inside data/accessibility metadata. See the [implemented renderer](../nanogpt-modular-viewer/assets/view.js), [compact CSS](../nanogpt-modular-viewer/assets/viewer.css) and [focused QA](../nanogpt-modular-viewer/QA-UI-COMPACT-STM-CHIPS.md).

**Latest overlay override — Prompt 065:** The pink **Comments** control is independent of category selection. It may be ON simultaneously with Class / Method / Block / Nested / Lines / File / Directory / Module. Comment/docstring physical lines inside the selected colored scope become pink; other in-scope lines retain category color and outside-scope lines stay neutral. Turning Comments OFF restores base colors. [Viewer QA](../nanogpt-modular-viewer/QA-UI-COMMENTS-OVERLAY.md).

**Proposed future view — Prompt 069 (not implemented):** Integrate original Karpathy nanoGPT commit chronology and show deleted/replaced source code struck through in a dedicated diff display, retaining the original category color on each line's chip. Exact historical snapshot mode must not show deleted lines as current code. Keep a separate lineage/ID registry from the existing 235-commit teaching reconstruction; original Git SHAs and source code must be preserved. User requested understanding of the idea, not immediate implementation. [Prompt 069](prompts/069.md).

**Accepted original-history correction — Prompts 073–074:** Keep the established modular viewer UI unchanged in appearance even when reading Andrej Karpathy's separate real Git source history. Restore its black theme, compact sticky controls, filename-first green STM chip, and Python syntax-highlighted code. **All commits is the default and displays every verified original source-line event** across 159 real first-parent commits (2,729 additions + 804 struck-through deletions) in a continuous native-page scroll. Don't revert to GitHub-style +/− diff rows or changed-only view. The full original-history snapshot remains accessible through Full file. Source data/IDs and legacy viewer remain unchanged. [QA and screenshots caveat](../nanogpt-original-history/QA-RESTORED-UI-ALL-LINES.md).

**Mobile styling fix — Prompt 075:** A real Android Chrome screenshot showed the restored history viewer HTML without CSS. The HTML linked `./assets/viewer.css`, but its actual stylesheet is `./assets/style.css`. Corrected the link without redesigning the page or changing source history. [Fix details](prompts/075.md).

**Accepted persistent-state/UI correction — Prompt 076:** No implicit mode reset on a numeric Jump, commit stepper, range, All commits, or file/category changes. Keep the selected mode, file filter, category and independent Comments overlay; persist them across reload via localStorage. File now actively colors its own original historical source lines sky-blue; Comments can be ON simultaneously with File or Lines, coloring standalone Python # comments and multiline docstrings pink, even on struck-through historical deletions. Recolor mounted source rows in place, preserving scroll/geometry and STM IDs. [Historical source and interaction QA](../nanogpt-original-history/QA-STATE-PERSISTENCE-OVERLAY.md).

**Accepted original-history hierarchy + layout refinement — Prompt 077:** Only STM chips represent structural categories: Lines (green), Class (red) and Method (blue). The File button is now a separate ON/OFF toggle for **filename chips only**; Comments remains another independent ON/OFF pink overlay within the current class/method/lines scope. File/Class/Comments or File/Method/Comments can be pressed together. Shift about 30% of the old STM chip's width to the filename: original left-column split ~38% filename / 62% STM becomes **57% filename / 43% STM**, without moving or shrinking the code column. Classify deleted code using its actual pre-edit original Git snapshot. [QA](../nanogpt-original-history/QA-CLASS-METHOD-FILE-WIDTH.md).

**Full file non-negotiable — Prompt 078:** Full file **never** filters by the active Class/Method/Lines category, File color toggle or Comments overlay. All surviving source rows, including blanks and out-of-scope code, remain visible at that authentic Git commit; optional actual filename dropdown can narrow the file, without filtering by hierarchy. [57/57 regression checks](../nanogpt-original-history/QA-CLASS-METHOD-FILE-WIDTH.md).
