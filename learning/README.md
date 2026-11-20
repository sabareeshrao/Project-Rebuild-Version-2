# Learn to build nanoGPT — from zero

This `learning/` folder teaches **one continuously evolving project**, not one standalone lesson per Git commit.

The original model, data preparation, training, sampling and config files stay in their original locations. Lessons may group multiple commits or return to earlier commits when prerequisites make the code understandable.

## Start here

1. **[Lesson 01 — From Text to Your First Python Code](lessons/01-first-python/index.html)** (38 mobile-friendly screens, 10 interactive questions, one Python practice challenge)
2. **[Runnable first Python exercise](lessons/01-first-python/practice.py)**
3. **[Every original source line tracked](tracker/source-lines.json)**
4. **[Knowledge and attempt record](progress.json)**

To use Lesson 01, **download `index.html` and open it in your browser**. GitHub's normal code preview will display HTML source rather than run the lesson. The HTML is a standalone file with embedded styling, content and JavaScript, so it works offline.

The lesson's **LINES** button opens an original-source inventory (17 files, 1,627 tracked units). Gold source-line chips mean **scheduled for explanation**, never automatically mastered.

## What we are learning to build

```text
Shakespeare text
      ↓
data/shakespeare_char/prepare.py   ← read characters, make token IDs
      ↓
data/shakespeare_char/train.bin     ← prepared data
      ↓
train.py + model.py                 ← train a GPT model
      ↓
Saved checkpoint
      ↓
sample.py                           ← generate new text
```

This is a conceptual map of the existing source. Running the full system requires Python, PyTorch and the needed data; the first practice file needs only Python.

## Roadmap

| Phase | Connected learning milestone | Main source |
|---|---|---|
| 1 | Read text, use Python variables, print and string positions | `data/shakespeare_char/prepare.py` |
| 2 | Find characters, build a vocabulary, encode and decode text | `data/shakespeare_char/prepare.py` |
| 3 | Create training pairs and understand PyTorch tensors | `data/*/prepare.py`, `train.py` |
| 4 | Understand Python classes and build LayerNorm and model components | `model.py` |
| 5 | Build attention, feed-forward layers and the complete GPT | `model.py` |
| 6 | Connect data, loss, optimizer, evaluation and checkpoints | `train.py`, `configurator.py`, `config/` |
| 7 | Generate text, load models and tokenize prompts | `sample.py`, `model.py` |
| 8 | Read benchmarks, experiments and scaling notebooks | `bench.py`, `*.ipynb` |

This sequence is learning-driven, not a claim that the developer authored files in this order. The reconstructed repository's commit history is still evidence for how each component evolved.

## How knowledge is remembered

- GitHub stores `progress.json` for **what you have demonstrated**, not simply what appears in a lesson.
- Each interactive HTML lesson stores draft answers locally in your browser.
- Use **EXPORT** to save an attempt JSON and share it with ChatGPT after finishing.
- ChatGPT can then review answers and your independently run Python code before deliberately updating `progress.json` and source-line evidence.
- Merely opening a lesson does **not** sync any answers to GitHub. The HTML contains **no GitHub credentials or automatic GitHub writes**.
- A later lesson should skip a concept when mastery is evidenced, and provide short revision only where needed.

## Source-line tracker rules

The tracker is pinned to original source commit `97e264126419dd66e9cd70d7e31f4e1dd1c5fdc3`. It includes **15 Python files** with **1,220 physical lines** (including comments and blank lines) and **2 notebooks** with **407 code-cell lines** — **1,627 addressable source units**.

Every line defaults to `not_started`; exceptions, when verified, will be recorded as per-line overrides rather than generating 1,627 duplicate status records. Notebook locations are tracked by (cell number, line within cell), not raw notebook JSON line numbers. If original source changes, reconcile the tracked blob hashes and line ranges before applying new evidence.

**No code from the original project has been changed to create this educational system.**
