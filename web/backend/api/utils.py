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

# Water model lazy loader
_water_model = None
_water_device = "cuda" if torch.cuda.is_available() else "cpu"

# Transforms used for water model
_water_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])


def _load_water_model():
    global _water_model
    if _water_model is not None:
        return _water_model

    try:
        # import model definition from project
        from models.water_color.model import MultiTaskWaterNet
    except Exception as e:
        raise RuntimeError(f"Unable to import water model definition: {e}")

    model = MultiTaskWaterNet(n_classes=len(config.WATER_CLASS_NAMES))
    model_path = config.WATER_MODEL_PATH
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
            # model file missing; we still return the architecture (untrained)
            print(f"Warning: no water model weights found at {model_path} or {alt}; returning untrained model")

    model.to(_water_device)
    model.eval()

    _water_model = model
    return _water_model


def predict_water_image(pil_image: Image.Image):
    """Run model on PIL image and return JSON-friendly dict with:
       - discoloration_class, discoloration_probs, turbidity, turbidity_std, color_stats
    """
    model = _load_water_model()

    img_t = _water_transform(pil_image).unsqueeze(0).to(_water_device)

    with torch.no_grad():
        out = model(img_t)

    turbidity = float(out["turbidity"].cpu().numpy().item()) if out.get("turbidity") is not None else None
    logvar = float(out.get("turbidity_logvar", torch.zeros(1)).cpu().numpy().item()) if out.get("turbidity_logvar") is not None else 0.0
    turbidity_std = float(math.exp(0.5 * logvar)) if logvar is not None else None

    # Discoloration classification
    logits = out["discolor_logits"].cpu()
    probs = torch.softmax(logits, dim=1).squeeze(0).numpy().tolist()
    idx = int(np.argmax(probs))
    class_name = config.WATER_CLASS_NAMES[idx]

    # simple RGB means (un-normalized) as color stats for returning
    # We compute from the raw PIL image
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


# Numeric pollution heuristic model (placeholder). Replace with trained model later.
def predict_pollution_from_stat(rainfall_mm: float, discharge: float, water_level: float, month: int = 0):
    """Compute a pollution score and category from simple heuristics.
    - rainfall_mm: rainfall in mm
    - discharge: river discharge (m3/s) or similar
    - water_level: meters
    - month: 1-12 (optional)

    Returns: {pollution_score, pollution_level}
    """
    # safety checks & simple normalizations (tunable constants)
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

    model = YOLO(model_path)
    _trash_model = model
    return _trash_model


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
        best = max(detections, key=lambda d: d["conf"])  # highest conf
        top_class = {"class": best["class"], "name": best["name"], "conf": best["conf"]}

    return {"detections": detections, "num_detections": len(detections), "top_class": top_class}
