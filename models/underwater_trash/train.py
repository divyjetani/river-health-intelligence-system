# for underwater trash detection using YOLOv8
from ultralytics import YOLO
import os

def main():
    data_yaml = os.path.join("data/raw unfiltered/underwater_plastics", "data.yaml") 
    model_name = "yolov8n.pt"
    epochs = 20
    imgsz = 640
    batch = 8

    model = YOLO(model_name)

    model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        name="river_pollution_yolo",
        project="runs/train",
        augment=True
    )

if __name__ == "__main__":
    main()
