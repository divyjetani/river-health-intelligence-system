"""
Train a YOLOv8 model on the combined trash dataset built by `build_dataset.py`.

Usage:
  1) Build dataset manifests (one-time):
     python build_dataset.py --out-dir models/trash_detection
  2) Train:
     python train.py --data models/trash_detection/data.yaml --epochs 30 --img 640 --batch 8
"""
from ultralytics import YOLO
import argparse
import os
from pathlib import Path

DEFAULT_DATA = Path(__file__).resolve().parent / 'data.yaml'


def main(data, model_name='yolov8n.pt', epochs=30, imgsz=640, batch=8, project='runs/trash', name='trash_detector', device=None):
    if not Path(data).exists():
        raise FileNotFoundError(f"Data yaml not found: {data}. Run build_dataset.py first to create it.")

    model = YOLO(model_name)

    model.train(
        data=str(data),
        epochs=epochs,
        imgsz=imgsz,
        batch=batch,
        name=name,
        project=project,
        device=device,
        workers=4,
        augment=True
    )


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', default=str(DEFAULT_DATA), help='path to data.yaml (produced by build_dataset.py)')
    parser.add_argument('--model', default='yolov8n.pt', help='base model (pretrained)')
    parser.add_argument('--epochs', type=int, default=30)
    parser.add_argument('--img', type=int, default=640)
    parser.add_argument('--batch', type=int, default=8)
    parser.add_argument('--project', default='runs/trash')
    parser.add_argument('--name', default='trash_detector')
    parser.add_argument('--device', default=None, help='device spec for YOLO, e.g., "0" for GPU')
    args = parser.parse_args()
    main(args.data, args.model, args.epochs, args.img, args.batch, args.project, args.name, args.device)
