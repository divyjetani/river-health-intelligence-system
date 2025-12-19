# src/infer_image_api.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import uvicorn
import numpy as np
import io
from PIL import Image
import cv2
from pollution_score import compute_pollution_score, pollution_level

app = FastAPI(title="River Pollution YOLO Inference")

# load pretrained model (point to your best weights)
MODEL_PATH = "C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\model my\\runs\\train\\river_pollution_yolo\\weights\\best.pt" 
model = YOLO(MODEL_PATH)

def pil_to_bgr(pil_image):
    # Convert PIL to OpenCV BGR
    rgb = np.array(pil_image)
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    return bgr

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...), conf: float = 0.25):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    frame = pil_to_bgr(image)

    # Run inference (returns list-like of Results; take first)
    results = model(frame, conf=conf)[0]

    detections = []
    if hasattr(results, "boxes") and results.boxes is not None:
        boxes = results.boxes
        # boxes.xyxy, boxes.conf, boxes.cls
        xyxy = boxes.xyxy.cpu().numpy() if boxes.xyxy is not None else []
        confs = boxes.conf.cpu().numpy() if boxes.conf is not None else []
        classes = boxes.cls.cpu().numpy() if boxes.cls is not None else []

        for bbox, c, cf in zip(xyxy, classes, confs):
            x1, y1, x2, y2 = map(float, bbox)
            detections.append({
                "class": int(c),
                "conf": float(cf),
                "bbox": [x1, y1, x2, y2]
            })

    score = compute_pollution_score(detections, conf_threshold=conf)

    return JSONResponse({
        "pollution_score": score,
        "detections": detections,
        "num_detections": len(detections),
        "pollution_level": pollution_level(score)
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
