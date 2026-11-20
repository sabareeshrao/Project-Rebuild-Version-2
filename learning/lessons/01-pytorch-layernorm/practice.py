"""Chapter 01 — use nanoGPT's real LayerNorm.

This is an educational test harness, not a change to model.py.
Run from the repository root after installing PyTorch:

    python learning/lessons/01-pytorch-layernorm/practice.py

Expected: shape (2, 4, 8); bias=False has only weight; bias=True
has weight and bias. The deliberately incorrect configuration is rejected.
"""
from pathlib import Path
import sys
import torch

# This practice file lives three folders below the repository root.
# Add that root to Python's import search path, so we can import the real model.py.
REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT))

from model import LayerNorm  # noqa: E402 — the project's actual class


def main():
    torch.manual_seed(7)

    # B=2 sequences, T=4 positions, C=8 features per token.
    x = torch.randn(2, 4, 8)
    layer = LayerNorm(ndim=8, bias=False)
    y = layer(x)

    print("input shape:", tuple(x.shape))
    print("output shape:", tuple(y.shape))
    print("registered parameters:", list(dict(layer.named_parameters())))
    print("bias:", layer.bias)

    assert y.shape == x.shape
    assert layer.bias is None
    assert list(dict(layer.named_parameters())) == ["weight"]
    assert torch.allclose(y.mean(dim=-1), torch.zeros_like(y.mean(dim=-1)), atol=1e-5)
    assert torch.allclose(y.var(dim=-1, unbiased=False), torch.ones_like(y.var(dim=-1, unbiased=False)), atol=1e-3)

    layer_with_bias = LayerNorm(ndim=8, bias=True)
    assert list(dict(layer_with_bias.named_parameters())) == ["weight", "bias"]
    print("bias=True parameters:", list(dict(layer_with_bias.named_parameters())))

    # An intentionally bad configuration: normalized shape must match C=8.
    try:
        LayerNorm(ndim=4, bias=True)(x)
    except RuntimeError:
        print("mismatched normalized shape: rejected as expected")
    else:
        raise AssertionError("Expected LayerNorm(4) to reject x with C=8")

    print("PASS — nanoGPT LayerNorm experiment")

    # NEXT: change B, T and C together, and see which dimension the
    # LayerNorm constructor must match. Keep model.py unchanged.


if __name__ == "__main__":
    main()
