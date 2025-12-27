import os

# Change these paths to point at your trained weights on disk
# Model 1: water color classification (Keras MobileNet file)
WATER_MODEL_PATH = os.environ.get("WATER_MODEL_PATH", "C:/Users/divyj/Desktop/hackathons/hackVeda iilm/models/model 1/water_quality_mobilenet.keras")

# Model 2: trash detection (Ultralytics/YOLO weights)
TRASH_MODEL_PATH = os.environ.get("TRASH_MODEL_PATH", "C:/Users/divyj/Desktop/hackathons/hackVeda iilm/models/model 2/runs/weights/best.pt")

# Model 3 
DATA_MODEL_PATH = os.environ.get("DATA_MODEL_PATH", "C:/Users/divyj/Desktop/hackathons/hackVeda iilm/models/model 3/predict.py")

WATER_CLASS_NAMES = ['brown_muddy_water', 
    'clean blue lake water texture', 
    'clear_clean_water', 
    'dark_black_water', 
    'foam_froth', 
    'green_algae_water'
]

# CORS
ALLOWED_ORIGINS = ["*"]
