# src/pollution_score.py
import numpy as np

# Map class index -> weight (tune these based on domain knowledge)
# Higher weight = more harmful
CLASS_WEIGHTS = {
    0: 0.5,   # Mask (light)
    1: 1.5,   # can
    2: 0.5,   # cellphone (not water pollutant but solid waste)
    3: 1.0,   # electronics
    4: 1.0,   # gbottle (glass bottle)
    5: 0.7,   # glove
    6: 1.2,   # metal
    7: 0.8,   # misc
    8: 1.8,   # net (can entangle wildlife)
    9: 0.9,   # pbag (plastic bag)
    10: 1.2,  # pbottle (plastic bottle)
    11: 2.0,  # plastic (general - heavy weight)
    12: 0.8,  # rod
    13: 0.6,  # sunglasses
    14: 1.0   # tire
}

def compute_pollution_score(detections, conf_threshold=0.25):
    """
    detections: list of dicts with keys: 'class', 'conf', 'bbox' (optional)
    Returns a pollution score (0 - ~100).
    """
    if not detections:
        return 0.0

    score = 0.0
    for det in detections:
        cls = int(det['class'])
        conf = float(det['conf'])
        if conf < conf_threshold:
            continue
        weight = CLASS_WEIGHTS.get(cls, 0.5)
        score += weight * conf

    # scale/normalize: you can tune this normalization
    # Example scale factor to bring typical scores to 0-100
    normalized = np.clip(score * 15.0, 0, 100)
    return float(normalized)

def pollution_level(score):
    if score < 5:
        return "Clean 🟢"
    elif score < 15:
        return "Moderate 🟡"
    elif score < 30:
        return "Polluted 🟠"
    else:
        return "Critical 🔴"
