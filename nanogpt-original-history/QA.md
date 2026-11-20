# Original nanoGPT Green STM Viewer — Controlled QA

**Source of truth:** [original `karpathy/nanoGPT` Git mainline](https://github.com/karpathy/nanoGPT/commits/master/). Tests executed against the **exact new repository files** reopened through the connected GitHub tools, not invented sample project code.

## 1. Verified original Git sequence

- Original nanoGPT `master` head: `3adf61e154c3fe3fca428ad6bc3818b27a3b8291`.
- All **159 first-parent original commit SHAs** checked against the 159 archived diff records. There are **210 total reachable repository commits** including merged branch history, so these numbers refer to different Git graph traversals. Original merge commits appear once at their real mainline position.
- The exact historical commit metadata is stored in [manifest.json](data/manifest.json) and diff patches in **14** ordered [chunks](data/diffs/): 001–012 through 157–159.
- Real initial commit `fe8042867ca499aef1df0d6c2606aabae3124b26` reconstructed as **628 original lines in six different files**: `README.md`, `data/openwebtext/prepare.py`, its README, `model.py`, `sample.py`, and `train.py`.
- The real commit #17 changed `README.md`, `bench.py`, `sample.py`, and `train.py` **in one original commit**. The viewer maintains each changed source line's original file association.
- There are **33 first-parent mainline commits affecting two or more files**, illustrating real source evolution and return visits instead of the reconstruction's one-file-at-a-time schedule.

## 2. Historical source reconstruction and permanent IDs

Replayed all 159 commits in verified first-parent order through [`assets/history.js`](assets/history.js) from an empty source repository. Source hunks were compared against the exact prior-state code text instead of blindly applying inaccurate line positions.

| Verification | Result |
|---|---:|
| Final `model.py` physical lines | 330 / 330 |
| Final `train.py` physical lines | 336 / 336 |
| Final `sample.py` physical lines | 89 / 89 |
| Final `README.md` physical lines | 234 / 234 |
| **All original Python source lines** | **1,220 / 1,220** |
| **All non-notebook original text lines** | **1,523 / 1,523** |
| Reconstructed `transformer_sizing.ipynb` raw JSON lines | 402 / 402 |
| Original `scaling_laws.ipynb` notebook | **Incomplete (792 raw JSON lines)** |

The original GitHub API did not provide the large `scaling_laws.ipynb` patch at commit #30, preventing safe replay of its later changes. Snapshot mode therefore **continues to warn** about the missing historical text on all later commits; source records are **not invented**. Binary asset patches are also explicitly unavailable.

- The viewer currently renders **2,729 authentic added-line events** and **804 authentic deleted-line events**, plus file-change summaries for missing binary/oversized patches.
- Original full history has **3,783 text addition events**, **1,066 text deletion events**, and **2,717 surviving raw text lines including both notebooks**. The differences correspond to unavailable oversized notebook patches; not an assertion that the notebook data was reconstructed.
- Stable original-history STM IDs were assigned to every verified introduced physical source line. The registry reserves missing introduction positions and has reached `STM-03783`. Tested: **2,729 distinct displayed addition IDs**, all **804** displayed deletion IDs refer to previously introduced IDs, and **1,925** available final snapshot rows retain their introduction IDs. **Zero identity mismatches**.
- Deleted lines use their **old** STM ID and only the source code receives strikethrough. Snapshot excludes deletions. The notebook limitation is not concealed by this fact.

## 3. Controlled interface regression checks

**15 mocked-DOM interaction assertions passed** against the published [HTML](index.html), [JavaScript](assets/app.js) and [CSS](assets/style.css):

1. Original commit #1 displays 628 verified rows and exactly six file associations.
2. Every original row's filename chip matches its own actual source file (not a global selected filename).
3. Green STM chip IDs are unique within the first commit and are the only hierarchy category.
4. Commit #2 correctly displays **7 additions and 5 deleted source lines**, totaling 12 changed rows.
5. Deleted rows' code displays strikethrough; their green STM chip remains unstruck.
6. Switching to Snapshot at commit #2 displays exactly **630 surviving lines**, no deletion rows, and six actual files.
7. Mode control state, HTML source text safety (`textContent`), and CSS selectors match the expected behavior.

Additional source-engine tests verified all 159 original commit SHAs/chunks, verified source counts, missing oversized-source warnings, and cross-commit STM identity invariants.

**Verification limits:** These were data replay and **mocked-DOM**, not a real Android Chrome/desktop Chromium screenshot test; scroll stability/responsiveness should be visually checked on deployed GitHub Pages. This audit did **not** verify that GitHub Pages was publicly serving the new URL. Do not claim complete notebook source coverage or a verified deployment.

## 4. No destructive changes

The original 235-commit pedagogical Git history, its `nanogpt-modular-viewer/` files, the older prototype `commit-id-demo/`, and prior permanent STM registries were not edited. The new viewer lives **only** under `nanogpt-original-history/` plus its separately recorded AI handover prompt.

## 5. Next phase

Add class/method/block/comment overlays **later** using the original-history green-STM IDs and actual snapshot scopes. Do not retroactively rewrite original Git SHAs, hunks or introduced-line identities. Resolve the missing notebook patch only from authentic original snapshots, with explicit source provenance and audit.
