# Learn to build nanoGPT — connected project course

This folder teaches one continuously evolving real-world **Python/PyTorch** project, based on the original source and reconstructive Git commit history.

**Starting point:** The learner has studied Python at college. The course therefore skips basic `print`, variables, loops and introductory classes, but introduces PyTorch, neural-network operations, tensor shapes and GPT internals as needed. Prior coursework is self-reported, not treated as verified mastery.

## Active Lesson 01 — PyTorch tensors and the first GPT component

- **[Open interactive HTML Lesson 01](lessons/01-pytorch-layernorm/index.html)** — 40 connected screens, 12 quiz questions, source-line references, exercise and progress export
- **[Inspect source-grounded lesson plan](lessons/01-pytorch-layernorm/lesson-data.json)**
- **[Run the actual model's LayerNorm lab](lessons/01-pytorch-layernorm/practice.py)** from repository root using `python learning/lessons/01-pytorch-layernorm/practice.py`
- **[Source-line tracker](tracker/source-lines.json)** — 15 Python files, 2 notebooks; 1,627 addressable code-line units
- **[Knowledge progress record](progress.json)** — evidence-based, no auto-mastering

Download the HTML and open it in a browser; GitHub's standard file preview shows source rather than running HTML. The standalone lesson works offline for reading and quiz interactions. Running the Python lab requires PyTorch and the repository source code.

## What Lesson 01 does

The lesson groups **five early related commits** from the project's reconstruction, which build the custom `LayerNorm` class inside `model.py`, and teaches:

1. How the project data flows from numeric token batches into embeddings and GPT hidden states.
2. PyTorch tensor shapes `[B,T]` → `[B,T,C]`, and what `n_embd` means.
3. Why LayerNorm normalizes each token's features, and which dimension it operates on.
4. `nn.Module`, registered `nn.Parameter` weights, optional bias, and `F.layer_norm`.
5. A runnable experiment importing the repository's actual `model.LayerNorm`.
6. Where the same component is reused inside `Block`, `GPT`, and the training configuration.

The course uses original source ranges as evidence and clearly marks later architectural code as **preview**, not already mastered. The original source remains unchanged.

## Project flow we will keep connecting

```text
Shakespeare source text
       ↓
data/shakespeare_char/prepare.py  →  tokenized train/val files
       ↓
train.py get_batch()             →  token IDs [B,T] and targets
       ↓
model.py GPT                     →  embeddings [B,T,C]
       ↓
transformer Blocks               →  LayerNorm, causal attention, MLP
       ↓
logits / cross-entropy           →  optimizer updates / checkpoint
       ↓
sample.py                        →  autoregressive text generation
```

## Roadmap

| Phase | Connected milestone | Code |
| --- | --- | --- |
| 01 | PyTorch tensors, embeddings, custom LayerNorm, model shape conventions | `model.py`, `train.py`, `data/shakespeare_char/prepare.py` |
| 02 | Causal attention from Q/K/V projections to the causal mask | `model.py` |
| 03 | Assemble attention, MLP, residual paths, and full GPT forward | `model.py` |
| 04 | Tokenization, contiguous context windows and next-token targets | `data/`, `train.py` |
| 05 | Training loop, optimizer, scheduler, checkpoint and evaluation | `train.py`, `config/` |
| 06 | Load a checkpoint and generate next-token samples | `sample.py`, `model.py` |
| 07+ | Distributed training, performance, benchmarks, optional finetuning, notebook experiments | Other original source files and notebooks |

The number of Git commits per lesson depends on meaningful feature and dependency boundaries, **not** a one-commit-one-lesson rule. The roadmap may be refined as learning evidence accumulates.

## Source-line and knowledge progress rules

The source-line tracker is pinned to the original project source revision `97e264126419dd66e9cd70d7e31f4e1dd1c5fdc3`: 1,220 physical Python lines (including blank/comment lines) plus 407 notebook code-cell source lines, totaling 1,627. Each source line starts `not_started`. A line tagged in a lesson as `architecture_preview` or `line_walkthrough` is **planned coverage**, not verified learning.

The interactive HTML saves local answers only in the learner's browser. Use its **EXPORT** button after studying and send the resulting JSON alongside the Python lab output for review. ChatGPT can then update `progress.json` and per-line learner evidence in GitHub. Merely viewing a lesson, passing a quiz or having prior coursework is never treated as independent coding mastery.

The previous `lessons/01-first-python/` absolute-zero draft remains in Git history for reference, but is **superseded** and is not the active Lesson 01.
