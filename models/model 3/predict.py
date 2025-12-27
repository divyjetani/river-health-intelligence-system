"""Simple wrapper for the numeric pollution model in models/model 3.

Exposes predict_stat(rainfall_mm, discharge, water_level, month)
which should return a dict containing at least 'pollution_score' (0-100).

This file is intentionally defensive: if a trained pickle is present it will try to
use it, otherwise it falls back to a simple heuristic similar to the one in utils.
"""
import os
import math
import pickle

MODEL_FILES = [
    "riversight_numeric_model.pkl",
    "riversight_model.pkl"
]

HERE = os.path.dirname(os.path.abspath(__file__))
_model = None

# Attempt to load the first available model
for fname in MODEL_FILES:
    path = os.path.join(HERE, fname)
    if os.path.exists(path):
        try:
            with open(path, "rb") as fh:
                _model = pickle.load(fh)
            break
        except Exception as e:
            # if loading fails, continue to fallback
            _model = None
            break


def predict_stat(rainfall_mm: float, discharge: float, water_level: float, month: int = 0):
    """Return dict with pollution_score 0-100 and optional fields.

    If a model is available, an attempt is made to call it. If it returns
    a numeric value, we map it to 0-100 by clipping. If it returns a dict
    we forward it (ensuring 'pollution_score' exists). Otherwise fall back
    to a heuristic.
    """
    # Try to use model if available
    if _model is not None:
        try:
            features = [[float(rainfall_mm), float(discharge), float(water_level), int(month)]]
            # many sklearn-style models implement predict or predict_proba
            if hasattr(_model, "predict_proba"):
                probs = _model.predict_proba(features)
                # If binary, take probability of positive class
                if probs is not None:
                    if hasattr(probs, "shape") and probs.shape[1] >= 2:
                        val = float(probs[0, 1]) * 100.0
                        return {"pollution_score": round(max(0.0, min(100.0, val)), 2)}
            if hasattr(_model, "predict"):
                pred = _model.predict(features)
                if isinstance(pred, (list, tuple,)):
                    pred = pred[0]
                try:
                    val = float(pred)
                    # If model outputs small range, scale heuristically
                    if val <= 1.0:
                        val = val * 100.0
                    return {"pollution_score": round(max(0.0, min(100.0, val)), 2)}
                except Exception:
                    pass
            # as a fallback, if the model provides a transform function
            if hasattr(_model, "transform"):
                # can't reliably map to score; fallthrough to heuristic
                pass
        except Exception:
            # If model fails, continue to heuristic
            pass

    # Heuristic fallback (same logic as utils fallback)
    r = max(0.0, float(rainfall_mm))
    d = max(0.0, float(discharge))
    wl = max(0.0, float(water_level))

    r_ref = 200.0
    d_ref = 2000.0
    wl_ref = 10.0

    rn = min(1.0, r / r_ref)
    dn = min(1.0, d / d_ref)
    wln = min(1.0, wl / wl_ref)

    m = (month % 12) / 12.0
    season = 0.5 * (1 + math.sin(2 * math.pi * m))

    score = (0.45 * rn + 0.25 * (1 - dn) + 0.20 * wln + 0.10 * season) * 100.0
    score = float(max(0.0, min(100.0, round(score, 2))))

    if score < 10:
        level = "Clean 🟢"
    elif score < 30:
        level = "Moderate 🟡"
    elif score < 60:
        level = "Polluted 🟠"
    else:
        level = "Critical 🔴"

    return {"pollution_score": score, "pollution_level": level}
