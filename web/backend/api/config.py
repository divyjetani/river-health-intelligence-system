import os

# Change these paths to point at your trained weights on disk
WATER_MODEL_PATH = os.environ.get("WATER_MODEL_PATH", "C:/Users/divyj/Desktop/hackathons/hackVeda iilm/models/water_color_prediction/water_quality_mobilenet.keras")

TRASH_MODEL_PATH = os.environ.get("TRASH_MODEL_PATH", "C:/Users/divyj/Desktop/hackathons/hackVeda iilm/models/trash_detection/runs/best.pt")

WATER_CLASS_NAMES = ['brown_muddy_water', 
    'clean blue lake water texture', 
    'clear_clean_water', 
    'dark_black_water', 
    'foam_froth', 
    'green_algae_water'
    ]

# CORS
ALLOWED_ORIGINS = ["*"]
