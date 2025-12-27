from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import io
from PIL import Image

try:
    from . import utils, config
except Exception:
    import sys, os
    here = os.path.dirname(os.path.abspath(__file__))
    if here not in sys.path:
        sys.path.insert(0, here)
    import utils, config

app = FastAPI(title="River Health Intelligence API")

# Allow cross-origin calls from frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"status": "ok", "service": "river-health-api"}

@app.post("/api/predict/color")
async def water_image(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    try:
        result = utils.predict_water_image(img)
    except Exception as e:
        # Ensure backend always returns a JSON error so frontend parsing won't fail
        raise HTTPException(status_code=500, detail=f"Water model error: {e}")

    return JSONResponse(result)


@app.post("/api/predict/data")
async def water_numeric(payload: dict):
    # payload: {rainfall, discharge, water_level, month}
    try:
        rainfall = float(payload["rainfall"])
        discharge = float(payload["discharge"])
        water_level = float(payload["water_level"])
        month = int(payload.get("month", 0))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")

    result = utils.predict_pollution_from_stat(rainfall, discharge, water_level, month)
    return JSONResponse(result)


@app.post("/api/predict/trash")
async def trash_image(file: UploadFile = File(...), conf: float = 0.25):
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    try:
        result = utils.predict_trash_image(img, conf=conf)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return JSONResponse(result)


@app.post("/api/predict/health")
async def river_health(payload: dict):
    """Aggregate outputs from the three models into a single river health score (0-100).

    Expected payload format (any subset allowed):
    {
      "color": {...},   # output from /api/predict/color
      "trash": {...},   # output from /api/predict/trash
      "data": {...}     # output from /api/predict/data
    }

    Returns a structure with per-component scores, breakdowns and a combined health_score
    where 0 = healthy, 100 = highly polluted.
    """
    color = payload.get("color")
    trash = payload.get("trash")
    data = payload.get("data")

    if color is None and trash is None and data is None:
        raise HTTPException(status_code=400, detail="Missing model outputs. Provide at least one of 'color', 'trash', or 'data'.")

    # --- Data score (pollution numeric model) ---
    data_score = None
    data_summary = None
    if isinstance(data, dict):
        if "pollution_score" in data:
            try:
                data_score = float(data["pollution_score"])
                data_summary = data
            except Exception:
                data_score = None

    # --- Color score (image water color model) ---
    color_score = None
    color_summary = None
    if isinstance(color, dict):
        # class-based scoring using heuristic weights (0..1)
        weights = {
            'clear_clean_water': 0.05,
            'clean blue lake water texture': 0.05,
            'foam_froth': 0.6,
            'brown_muddy_water': 0.7,
            'green_algae_water': 0.8,
            'dark_black_water': 0.9
        }
        probs = color.get("discoloration_probs") or {}
        # compute weighted score from class probabilities
        s = 0.0
        for cname, p in probs.items():
            w = weights.get(cname, 0.5)
            s += float(p) * w
        # incorporate turbidity if available (assume turbidity scale roughly 0..100)
        turb = color.get("turbidity")
        if turb is not None:
            try:
                turb_val = float(turb)
                turb_norm = max(0.0, min(1.0, turb_val / 100.0))
                s = 0.7 * s + 0.3 * turb_norm
            except Exception:
                pass
        color_score = float(max(0.0, min(100.0, round(s * 100.0, 2))))
        color_summary = {
            "color_score": color_score,
            "per_class_score": {k: round(float(v) * weights.get(k, 0.5), 4) for k, v in probs.items()},
            "turbidity": color.get("turbidity"),
            "raw": color
        }

    # --- Trash score (object detection results) ---
    trash_score = None
    trash_summary = None
    if isinstance(trash, dict):
        detections = trash.get("detections", [])
        per_trash = {}
        max_conf = 0.0
        # assign per-class score = confidence (0..1)
        for d in detections:
            name = d.get("name", str(d.get("class", "unknown")))
            conf = float(d.get("conf", 0.0))
            per_trash[name] = max(per_trash.get(name, 0.0), conf)
            if conf > max_conf:
                max_conf = conf
        # simple aggregate: use max_conf to reflect worst single item presence
        trash_score = float(round(max_conf * 100.0, 2))
        trash_summary = {"trash_score": trash_score, "per_trash_score": per_trash, "num_detections": int(trash.get("num_detections", 0)), "raw": trash}

    # --- Combine the scores with weights; re-normalize if some missing ---
    components = {}
    weights = {}
    if data_score is not None:
        components['data'] = data_score
        weights['data'] = 0.35
    if color_score is not None:
        components['color'] = color_score
        weights['color'] = 0.35
    if trash_score is not None:
        components['trash'] = trash_score
        weights['trash'] = 0.30

    if not components:
        raise HTTPException(status_code=400, detail="No valid component scores available to compute health")

    # re-normalize weight sum
    total_w = sum(weights.values())
    combined = 0.0
    for k, sc in components.items():
        w = weights.get(k, 0.0) / total_w
        combined += sc * w

    combined = float(round(max(0.0, min(100.0, combined)), 2))

    response = {
        "health_score": combined,
        "components": {
            "data": data_summary,
            "color": color_summary,
            "trash": trash_summary
        },
        "component_scores": components,
        "component_weights": weights
    }

    return JSONResponse(response)

if __name__ == "__main__":
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except Exception:
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
