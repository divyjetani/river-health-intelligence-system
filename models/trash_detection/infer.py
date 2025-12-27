"""
Run inference using a trained weights file on one or more images.

Usage:
    python infer.py --weights runs/trash/trash_detector/weights/best.pt --source path/to/image_or_dir
"""
from ultralytics import YOLO
import argparse
from pathlib import Path

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', required=True)
    parser.add_argument('--source', required=True)
    parser.add_argument('--save', action='store_true', help='save annotated results')
    args = parser.parse_args()

    model = YOLO(args.weights)
    results = model.predict(source=args.source, save=args.save)
    print('Done. Results saved.' if args.save else 'Done.')
