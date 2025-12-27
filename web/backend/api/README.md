River Health & Trash FastAPI

Endpoints

- POST /api/water/image
  - Input: multipart/form-data with `file` (image)
  - Output JSON:
    - `discoloration_class` (string)
    - `discoloration_probs` (object of class->prob)
    - `turbidity` (float)
    - `turbidity_std` (float)
    - `color_stats` (mean_rgb, std_rgb)

- POST /api/water/numeric
  - Input JSON: {"rainfall": float(mm), "discharge": float, "water_level": float, "month": int}
  - Output JSON: {"pollution_score": float(0-100), "pollution_level": string}
  - Note: This endpoint currently uses a heuristic; you can replace with a trained model later.

- POST /api/trash/image
  - Input: multipart/form-data with `file` (image)
  - Optional query param: `conf` (confidence threshold, default 0.25)
  - Output JSON: {"detections": [{class, name, conf, bbox}], "num_detections": int, "top_class": {...}}

Run locally (from repository root):

1) Create virtual env and install requirements:
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r backend/api/requirements.txt

2) Adjust `backend/api/config.py` to point `WATER_MODEL_PATH` and `TRASH_MODEL_PATH` to your trained weights if different from defaults.

3) Start the API:
   uvicorn backend.api.main:app --reload --port 8000

Example cURL for water image:

curl -X POST "http://127.0.0.1:8000/api/water/image" -F "file=@/path/to/image.jpg" 

Example JSON for numeric pollution:

curl -X POST "http://127.0.0.1:8000/api/water/numeric" -H "Content-Type: application/json" -d '{"rainfall":10, "discharge":300, "water_level":2.4, "month":7}'

Notes
- The code uses the project's existing model definitions when possible (e.g., `models/water_color/model.py` and ultralytics for trash detection). Ensure your weights exist at the paths configured in `config.py` or set env vars `WATER_MODEL_PATH` and `TRASH_MODEL_PATH`.
- The numeric pollution endpoint is a placeholder heuristic. Replace with a machine-learned model when available.
