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

    result = utils.predict_water_image(img)
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


if __name__ == "__main__":
    try:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except Exception:
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
