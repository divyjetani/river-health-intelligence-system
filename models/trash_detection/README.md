# Trash Detection (combined dataset)

This folder contains helpers to build and train a combined trash detection model using:
- `Images_Dataset/Algae` (split-aware: train/valid/test)
- `Images_Dataset/underwater_garbage` (split-aware; names are read from `data.yaml`)
- `Images_Dataset/PlasticBottles_Garbage` (no splits; will be split randomly into train/val/test)

Steps
1. Build dataset manifests:

   ```bash
   python build_dataset.py --out-dir models/trash_detection
   ```

   This writes:
   - `models/trash_detection/datasets/train.txt`
   - `models/trash_detection/datasets/val.txt`
   - `models/trash_detection/datasets/test.txt`
   - `models/trash_detection/data.yaml`

2. Train the model:

   ```bash
   python train.py --data models/trash_detection/data.yaml --epochs 30 --img 640 --batch 8
   ```

3. Inference:

   ```bash
   python infer.py --weights runs/trash/trash_detector/weights/best.pt --source path/to/image_or_dir --save
   ```

Notes
- The build script uses class names from `Images_Dataset/underwater_garbage/data.yaml` to form `names` and `nc`.
- `PlasticBottles_Garbage` images are split randomly (seedable) into train/val/test. You can change the proportions with `--pb-train-ratio` and `--pb-val-ratio`.
- Make sure labels exist beside images in the expected `labels/...` folders; the script skips images without matching label `.txt` files.
