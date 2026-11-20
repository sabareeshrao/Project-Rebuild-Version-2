# nanoGPT — Original Git History Viewer (Green STM Phase 1)

[**Open the standalone HTML source**](index.html) · [Source repository: karpathy/nanoGPT](https://github.com/karpathy/nanoGPT/commits/master/) · [Original-history QA](QA.md)

**Intended GitHub Pages path (once the repository's Pages source is enabled and published):**
[https://sabareeshrao.github.io/Project-Rebuild-Version-2/nanogpt-original-history/](https://sabareeshrao.github.io/Project-Rebuild-Version-2/nanogpt-original-history/)

This viewer was built **in a separate folder from scratch**. It does not modify `nanogpt-modular-viewer/`, `commit-id-demo/`, the user's original 235 learning commits, their recorded order, or existing STM identities.

## What changed in the learning experience?

The 235 pedagogical commits gradually complete `model.py`, then other files. They are **not** Andrej's original historical chronology. This new viewer uses actual original nanoGPT `master` first-parent Git commit SHAs and their real diffs. The source-file label on the left is selected **per original source row**, allowing real switches from `model.py` to `train.py`, `sample.py`, data files, README, and back again. A single Git commit can show multiple filenames.

**One category only, initially: green Lines.** Every physical text source line with available original patch history gets a separate short, permanent `STM-NNNNN` chip (including comments and blanks). The green category does not classify code by Class/Method/Block yet. A later phase may recolor chips by hierarchy **without reassigning historical STM IDs**.

## Viewer controls

- **Previous / Next / Jump** through the original chronological **159 first-parent commits** from 2022-12-28 through 2025-11-12. Full original Git SHA and original author/date/message are linked. Left/right keyboard arrows also navigate when not typing.
- **Changes:** lines added by a commit are normal; deleted/replaced old code has a strikethrough on **the code side only**, with its existing green STM chip. File names match their real changed file.
- **Snapshot:** reconstruct all surviving source lines *at that selected original commit* from the historic patches. Lines deleted in prior commits do not remain part of the active file. Missing large/binary historical patches are explicitly reported instead of fabricated.
- **File:** defaults to All files; filtering to an individual path is optional. No single file is forced across the commit's multi-file changes. The code uses natural page scrolling, not a fixed-height nested code scroll box.

## Original Git chronology and data provenance

Original repository: [karpathy/nanoGPT](https://github.com/karpathy/nanoGPT). Original `master` head inspected: `3adf61e154c3fe3fca428ad6bc3818b27a3b8291`.

GitHub reported **210 reachable commits**, of which **159** lie on the current head's **first-parent mainline**. The viewer follows those 159 authentic first-parent commits (including merged changes once) in their parent order. **159 is not a claim that Andrej personally authored all 159 commits**; the repository includes contributors and merges.

- [Historical commit manifest](data/manifest.json): all 159 authentic SHA/parent metadata records, 14 sequential diff chunks of 12 original commits (last chunk 3).
- [Actual original diffs](data/diffs/): static GitHub REST commit patches, not generated sample code. Sources retain the original file path and original patch additions/deletions.
- [Lineage engine](assets/history.js): applies authentic hunks to immutable prior-state source rows. Additions get stable new STM IDs, deletions retain their old chip ID in Changes mode, untouched context carries the existing identity. File renames retain previous line identity. A separate original-history ID registry is used so the existing teaching viewer's STM IDs never change.
- [Viewer controller](assets/app.js): loads chunks on demand and shows a real per-file diff or cumulative source snapshot, with HTML-safe source text.
- [Compact styling](assets/style.css): filename → green STM → real source code, dark GitHub-style layout and struck-through deleted code.

The actual first Git commit [`fe804286`](https://github.com/karpathy/nanoGPT/commit/fe8042867ca499aef1df0d6c2606aabae3124b26) introduces **628 physical lines across six original files**; no fabricated microcommits were introduced.

## Verified source coverage and the notebook limitation

The 159 recorded commit patches were replayed from scratch. The latest reconstructed Python source is **1,220 lines**, exactly matching all original `.py` files, including `model.py` 330, `train.py` 336, and `sample.py` 89. All non-notebook text source also reconciles exactly to **1,523 lines**.

Original notebook `transformer_sizing.ipynb` is reconstructed as 402 raw JSON lines. The large `scaling_laws.ipynb` remains incomplete: GitHub omitted an oversized patch at original commit 30, so later notebook hunks cannot be safely applied. Its **792 raw JSON text lines are unavailable in the reconstructed latest snapshot**. The viewer **persistently warns about this file** in Snapshot mode; it does not create invented lines. Binary image files appear in changed-file summaries but do not have source text lines.

In aggregate, the original Git history has 1,824 Python addition events, 604 Python deletion events, and 1,220 surviving lines. This viewer preserves the genuine Git data; deletion events are not interchangeable with the number of unique permanently removed lines.

## Publishing with GitHub Pages

The exact HTML file is [`index.html`](index.html). The repository is public on `main`. If the Pages link does not load, open **Repository → Settings → Pages**, choose **Deploy from a branch → main → /(root)**, then Save. This preserves existing repository files and makes this folder addressable at the path above. The deployment was **not independently verified** by the tools available during creation, so a reachable live page is not claimed here.

## Current phase

- Full original mainline Git chronology and 14 diff chunks: **complete**.
- Green category, real filename per row, code deletions, snapshot mode, source IDs: **implemented**.
- Original Python + non-notebook text reconstruction: **reconciled**.
- Incomplete oversized notebook diff: **explicitly disclosed**.
- Additional Class/Method/Block/Comments colors: **deliberately not added yet**.
- Device/browser screenshot testing and GitHub Pages availability: **not independently confirmed**.

See [QA.md](QA.md) for precise controlled test results and limitations.
