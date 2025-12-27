import os
import math
import numpy as np
import torch
from torchvision import transforms
from PIL import Image

# Import config robustly so the module works when run as a package or directly
try:
    from . import config
except Exception:
    import sys
    here = os.path.dirname(os.path.abspath(__file__))
    if here not in sys.path:
        sys.path.insert(0, here)
    import config

# Water model lazy loader (supports Keras MobileNet in `models/model 1` and PyTorch fallback)
_water_model = None
_water_keras_model = None
_water_backend = None  # 'keras' or 'torch'
_water_device = "cuda" if torch.cuda.is_available() else "cpu"

# Transforms used for PyTorch water model
_water_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


def _load_water_model():
    """Try to load a Keras MobileNet model first (from `config.WATER_MODEL_PATH`).
    If the path doesn't point to a Keras file, fall back to the PyTorch MultiTaskWaterNet
    that older code uses.
    """
    global _water_model, _water_keras_model, _water_backend

    if _water_keras_model is not None:
        _water_backend = 'keras'
        return _water_keras_model
    if _water_model is not None:
        _water_backend = 'torch'
        return _water_model

    model_path = config.WATER_MODEL_PATH

    # Keras model path detection (common extensions)
    if model_path and os.path.exists(model_path) and model_path.lower().endswith(('.keras', '.h5')):
        try:
            import tensorflow as tf
        except Exception as e:
            raise RuntimeError(f"TensorFlow is required to load Keras water model at {model_path}: {e}")

        try:
            print(f"Loading Keras water model from {model_path}...")
            keras_model = tf.keras.models.load_model(model_path)
            _water_keras_model = keras_model
            _water_backend = 'keras'
            return _water_keras_model
        except Exception as e:
            raise RuntimeError(f"Failed to load Keras water model: {e}")

    # Otherwise, fall back to the PyTorch MultiTaskWaterNet implementation (if available)
    try:
        from models.water_color.model import MultiTaskWaterNet
    except Exception as e:
        raise RuntimeError(f"Unable to import water model definition and no Keras model found: {e}")

    model = MultiTaskWaterNet(n_classes=len(config.WATER_CLASS_NAMES))
    if os.path.exists(model_path):
        state = torch.load(model_path, map_location=_water_device)
        model.load_state_dict(state)
    else:
        # fallback: try turbidity_model.pt used by earlier scripts
        alt = os.path.join(os.path.dirname(model_path), "turbidity_model.pt")
        if os.path.exists(alt):
            state = torch.load(alt, map_location=_water_device)
            model.load_state_dict(state)
        else:
            print(f"Warning: no water model weights found at {model_path} or {alt}; returning untrained model")

    model.to(_water_device)
    model.eval()

    _water_model = model
    _water_backend = 'torch'
    return _water_model


def predict_water_image(pil_image: Image.Image):
    """Run model on PIL image and return JSON-friendly dict with:
       - discoloration_class, discoloration_probs, turbidity, turbidity_std, color_stats

    The implementation will use the Keras MobileNet model if available (returns color class probs)
    or the PyTorch multitask model (returns turbidity and more). If Keras is used, turbidity fields
    are returned as None so the frontend can handle that gracefully.
    """
    model = _load_water_model()

    # If Keras backend
    if _water_backend == 'keras' and _water_keras_model is not None:
        try:
            import numpy as _np
            from PIL import Image as _Image
            # Most MobileNet training used 180x180 in the repo; resize accordingly
            img_resized = pil_image.resize((180, 180))
            arr = _np.array(img_resized).astype('float32')
            # Expand dims to (1, H, W, C)
            if arr.ndim == 2:
                arr = _np.stack([arr, arr, arr], axis=-1)
            batch = _np.expand_dims(arr, 0)

            # Use TF to predict and softmax
            try:
                import tensorflow as _tf
                preds = _water_keras_model.predict(batch)
                probs = _tf.nn.softmax(preds[0]).numpy().tolist() if preds is not None else []
            except Exception as e:
                raise RuntimeError(f"Error running Keras water model: {e}")

            idx = int(_np.argmax(probs)) if probs else 0
            class_name = config.WATER_CLASS_NAMES[idx]

            # compute color stats from raw PIL image
            img_np = _np.array(pil_image).astype(_np.float32) / 255.0
            means = list(_np.mean(img_np, axis=(0, 1)).round(4).tolist())
            stds = list(_np.std(img_np, axis=(0, 1)).round(4).tolist())

            return {
                "discoloration_class": class_name,
                "discoloration_probs": {name: float(p) for name, p in zip(config.WATER_CLASS_NAMES, probs)},
                "turbidity": None,
                "turbidity_std": None,
                "color_stats": {"mean_rgb": means, "std_rgb": stds}
            }
        except Exception as e:
            raise RuntimeError(f"Keras water model prediction failed: {e}")

    # Else, assume PyTorch multitask model
    img_t = _water_transform(pil_image).unsqueeze(0).to(_water_device)

    with torch.no_grad():
        out = model(img_t)

    turbidity = float(out.get("turbidity", torch.tensor([float('nan')]).to(_water_device)).cpu().numpy().item()) if out.get("turbidity") is not None else None
    logvar = float(out.get("turbidity_logvar", torch.zeros(1)).cpu().numpy().item()) if out.get("turbidity_logvar") is not None else 0.0
    turbidity_std = float(math.exp(0.5 * logvar)) if logvar is not None else None

    # Discoloration classification
    logits = out["discolor_logits"].cpu()
    probs = torch.softmax(logits, dim=1).squeeze(0).numpy().tolist()
    idx = int(np.argmax(probs))
    class_name = config.WATER_CLASS_NAMES[idx]

    # simple RGB means (un-normalized) as color stats for returning
    img_np = np.array(pil_image).astype(np.float32) / 255.0
    means = list(np.mean(img_np, axis=(0, 1)).round(4).tolist())  # R,G,B
    stds = list(np.std(img_np, axis=(0, 1)).round(4).tolist())

    return {
        "discoloration_class": class_name,
        "discoloration_probs": {name: float(p) for name, p in zip(config.WATER_CLASS_NAMES, probs)},
        "turbidity": turbidity,
        "turbidity_std": turbidity_std,
        "color_stats": {"mean_rgb": means, "std_rgb": stds}
    }


# Numeric pollution model (tries to delegate to a user-provided module in models/model 3 if present,
# otherwise falls back to a simple heuristic)
def predict_pollution_from_stat(rainfall_mm: float, discharge: float, water_level: float, month: int = 0):
    """Compute a pollution score and category. If a user-provided data model exists at
    `config.DATA_MODEL_PATH` and exposes a function `predict_stat(rainfall, discharge, water_level, month)`
    (or `predict`), that will be called and its dict result returned. Otherwise, a heuristic
    is used as a graceful fallback.

    Returns a dict like: {pollution_score, pollution_level, [other fields...]}
    """
    # Try dynamic import of a data model implementation if available
    model_path = getattr(config, 'DATA_MODEL_PATH', None)
    if model_path and os.path.exists(model_path):
        try:
            import importlib.util as _il
            spec = _il.spec_from_file_location("data_model_impl", model_path)
            module = _il.module_from_spec(spec)
            spec.loader.exec_module(module)

            # Prefer predict_stat, fallback to predict
            fn = None
            if hasattr(module, 'predict_stat'):
                fn = module.predict_stat
            elif hasattr(module, 'predict'):
                fn = module.predict

            if fn is not None:
                try:
                    out = fn(rainfall_mm, discharge, water_level, month)
                    if isinstance(out, dict):
                        return out
                    else:
                        # be tolerant: accept simple numeric outputs
                        return {"pollution_score": float(out)}
                except Exception as e:
                    # If calling the user model fails, continue to heuristic
                    print(f"Data model at {model_path} failed to produce result: {e}")
        except Exception as e:
            print(f"Could not import data model at {model_path}: {e}")

    # Heuristic fallback (previous behavior)
    r = max(0.0, rainfall_mm)
    d = max(0.0, discharge)
    wl = max(0.0, water_level)

    # reference scales (adjust to your data ranges)
    r_ref = 200.0  # mm
    d_ref = 2000.0
    wl_ref = 10.0

    rn = min(1.0, r / r_ref)
    dn = min(1.0, d / d_ref)
    wln = min(1.0, wl / wl_ref)

    # month seasonality (sine transform)
    m = (month % 12) / 12.0
    season = 0.5 * (1 + math.sin(2 * math.pi * m))  # 0-1

    # heuristic: heavy rainfall -> more runoff -> more pollution (increase)
    # high discharge tends to dilute -> reduces pollution, so use (1 - dn)
    score = (0.45 * rn + 0.25 * (1 - dn) + 0.20 * wln + 0.10 * season) * 100.0

    score = float(np.clip(score, 0.0, 100.0))

    if score < 10:
        level = "Clean 🟢"
    elif score < 30:
        level = "Moderate 🟡"
    elif score < 60:
        level = "Polluted 🟠"
    else:
        level = "Critical 🔴"

    return {"pollution_score": round(score, 2), "pollution_level": level}


# Trash model lazy loader using ultralytics YOLO
_trash_model = None


def _load_trash_model():
    """Load the ultralytics YOLO model. If torch raises an UnpicklingError due to
    a custom class (DetectionModel), attempt to allowlist that class using
    torch.serialization.add_safe_globals or torch.serialization.safe_globals and retry.
    """
    global _trash_model
    if _trash_model is not None:
        return _trash_model

    try:
        from ultralytics import YOLO
    except Exception as e:
        raise RuntimeError(f"ultralytics is required for trash model: {e}")

    model_path = config.TRASH_MODEL_PATH
    if not os.path.exists(model_path):
        raise RuntimeError(f"Trash model weights not found at {model_path}; please set correct path in config")

    # First attempt: normal load
    try:
        model = YOLO(model_path)
        _trash_model = model
        return _trash_model
    except Exception as e:
        msg = str(e)
        # If loading failed due to pickling safety, attempt to allowlist reported globals
        if "Weights only load failed" in msg or "Unsupported global" in msg or "was not an allowed global" in msg:
            try:
                import re
                import importlib
                import torch

                # find all reported globals in the error message
                reported = set(re.findall(r"GLOBAL\s+([^\s]+)\s+was not an allowed global", msg))

                # always include common torch container as a fallback
                reported.add("torch.nn.modules.container.Sequential")

                resolved_classes = []
                for fullname in reported:
                    try:
                        module_path, cls_name = fullname.rsplit('.', 1)
                        mod = importlib.import_module(module_path)
                        cls = getattr(mod, cls_name, None)
                        if cls is not None:
                            resolved_classes.append(cls)
                    except Exception:
                        # ignore failures to resolve specific names
                        continue

                # Try to register the classes with torch.serialization helpers
                if resolved_classes:
                    add_safe = getattr(torch.serialization, "add_safe_globals", None)
                    if callable(add_safe):
                        try:
                            add_safe(resolved_classes)
                            model = YOLO(model_path)
                            _trash_model = model
                            return _trash_model
                        except Exception as inner:
                            # continue to try context manager approach
                            pass

                    safe_ctx = getattr(torch.serialization, "safe_globals", None)
                    if safe_ctx is not None:
                        try:
                            with safe_ctx(resolved_classes):
                                model = YOLO(model_path)
                                _trash_model = model
                                return _trash_model
                        except Exception as inner:
                            pass

                # As a last resort (only if the file is trusted), retry by temporarily
                # overriding torch.load to call with weights_only=False (this can execute
                # arbitrary code in the checkpoint). Proceed only if the file is local/trusted.
                try:
                    orig_torch_load = torch.load

                    def _torch_load_override(f, *args, **kwargs):
                        # ensure weights_only is False to allow full checkpoint loading
                        kwargs.setdefault('weights_only', False)
                        return orig_torch_load(f, *args, **kwargs)

                    torch.load = _torch_load_override
                    try:
                        model = YOLO(model_path)
                        _trash_model = model
                        return _trash_model
                    finally:
                        torch.load = orig_torch_load
                except Exception as inner:
                    raise RuntimeError(f"Retry with relaxed torch.load failed: {inner}") from inner

            except Exception as inner2:
                raise RuntimeError(f"Failed to load YOLO model at {model_path}: {inner2}") from inner2

        # If not a recognized pickling problem, re-raise with context
        raise RuntimeError(f"Failed to load YOLO model at {model_path}: {e}") from e

def predict_trash_image(pil_image: Image.Image, conf: float = 0.25):
    model = _load_trash_model()

    # convert to numpy BGR (YOLO expects array image)
    frame = np.array(pil_image)[..., ::-1]  # RGB->BGR

    results = model(frame, conf=conf)[0]

    detections = []
    if hasattr(results, "boxes") and results.boxes is not None:
        boxes = results.boxes
        xyxy = boxes.xyxy.cpu().numpy() if boxes.xyxy is not None else []
        confs = boxes.conf.cpu().numpy() if boxes.conf is not None else []
        classes = boxes.cls.cpu().numpy() if boxes.cls is not None else []

        for bbox, c, cf in zip(xyxy, classes, confs):
            x1, y1, x2, y2 = map(float, bbox)
            cls_idx = int(c)
            name = model.names.get(cls_idx, str(cls_idx)) if hasattr(model, 'names') else str(cls_idx)
            detections.append({
                "class": cls_idx,
                "name": name,
                "conf": float(cf),
                "bbox": [x1, y1, x2, y2]
            })

    top_class = None
    if detections:
        best = max(detections, key=lambda d: d["conf"])
        top_class = {"class": best["class"], "name": best["name"], "conf": best["conf"]}

    return {"detections": detections, "num_detections": len(detections), "top_class": top_class}
