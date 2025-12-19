# train_algae.py
from ultralytics import YOLO

def main():
    # Load pretrained YOLO model
    model = YOLO("yolov8n.pt")

    # Train
    model.train(
        data="algae/algae.yaml",
        epochs=50,
        imgsz=640,
        batch=8,
        device="cpu", # change to "0" or "0,1" for GPU training
        project="runs/algae",
        name="algae_detector",
        workers=4,
        patience=10
    )

if __name__ == "__main__":
    main()
