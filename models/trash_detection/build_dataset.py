"""
Build combined dataset manifests (train/val/test) and a combined data.yaml for YOLOv8 training.

This script combines images and labels from:
 - Images_Dataset/Algae (uses its train/val/test splits)
 - Images_Dataset/underwater_garbage (uses its train/val/test splits and names from its data.yaml)
 - Images_Dataset/PlasticBottles_Garbage (no splits; will be randomly split into train/val/test)

Output:
 - datasets/train.txt, val.txt, test.txt (absolute image paths)
 - data.yaml (references the above lists and uses names/nc from underwater_garbage/data.yaml)

Usage:
    python build_dataset.py --out-dir models/trash_detection --seed 42 --pb-train-ratio 0.8 --pb-val-ratio 0.1

"""
import argparse
import os
import random
import yaml
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1].parent  # repo root
IMAGES_ROOT = ROOT / "Images_Dataset"

def read_underwater_names(uw_data_yaml_path):
    with open(uw_data_yaml_path, "r") as f:
        d = yaml.safe_load(f)
    names = d.get("names", {})
    # names might be mapping of indices -> names; convert to list
    max_idx = max(int(k) for k in names.keys()) if isinstance(names, dict) and names else -1
    names_list = [names.get(i, names.get(str(i), f"cls{i}")) for i in range(max_idx + 1)]
    return names_list


def collect_images_labels_from_split(base_path):
    # base_path should contain images/ and labels/ or be a dataset folder with train/val/test
    images_dir = base_path
    if (images_dir / "images").exists():
        # structured (images/train, images/val...)
        out = {split: list((images_dir / "images" / split).rglob("*.jpg")) + list((images_dir / "images" / split).rglob("*.jpeg")) + list((images_dir / "images" / split).rglob("*.png")) for split in ["train","val","test"]}
    else:
        # base_path itself is images folder
        out = {"all": list(images_dir.rglob("*.jpg")) + list(images_dir.rglob("*.jpeg")) + list(images_dir.rglob("*.png"))}
    return out


def match_label_for_image(image_path):
    # for a given image path like .../images/train/img.jpg, label should be in .../labels/train/img.txt
    image_path = Path(image_path)
    parts = image_path.parts
    # replace 'images' with 'labels' in path
    try:
        idx = list(parts).index('images')
    except ValueError:
        # fallback: replace suffix with .txt in same folder
        label = image_path.with_suffix('.txt')
        return label
    new_parts = list(parts)
    new_parts[idx] = 'labels'
    # change extension to .txt
    new_path = Path(Path(*new_parts)).with_suffix('.txt')
    return new_path


def write_list_file(paths, path_out):
    path_out.parent.mkdir(parents=True, exist_ok=True)
    with open(path_out, "w") as f:
        for p in paths:
            f.write(str(p.resolve()).replace('\\\\','\\') + os.linesep)


def main(out_dir, seed=42, pb_train_ratio=0.8, pb_val_ratio=0.1):
    out_dir = Path(out_dir)
    datasets_dir = out_dir / "datasets"
    datasets_dir.mkdir(parents=True, exist_ok=True)

    # 1) read underwater names and base data.yaml
    uw_yaml = IMAGES_ROOT / "underwater_garbage" / "data.yaml"
    if not uw_yaml.exists():
        raise FileNotFoundError(f"Expected {uw_yaml} to exist")
    names = read_underwater_names(uw_yaml)

    # 2) collect images from Algae and Underwater (they have train/val/test)
    train_images = []
    val_images = []
    test_images = []

    # Algae
    algae_base = IMAGES_ROOT / "Algae"
    for split in ["train","valid","test"]:
        split_dir = algae_base / split / "images"
        if split_dir.exists():
            imgs = sorted(split_dir.rglob("*.jpg")) + sorted(split_dir.rglob("*.png"))
            if split == "train":
                train_images += imgs
            elif split == "valid":
                val_images += imgs
            elif split == "test":
                test_images += imgs

    # Underwater
    uw_base = IMAGES_ROOT / "underwater_garbage"
    for split in ["train","val","test"]:
        split_dir = uw_base / "images" / split
        if split_dir.exists():
            imgs = sorted(split_dir.rglob("*.jpg")) + sorted(split_dir.rglob("*.png"))
            if split == "train":
                train_images += imgs
            elif split == "val":
                val_images += imgs
            elif split == "test":
                test_images += imgs

    # PlasticBottles_Garbage - single folder images/
    pb_base = IMAGES_ROOT / "PlasticBottles_Garbage"
    pb_images_dir = pb_base / "images"
    pb_imgs = sorted(pb_images_dir.rglob("*.jpg")) + sorted(pb_images_dir.rglob("*.png"))

    # split pb images
    random.Random(seed).shuffle(pb_imgs)
    n = len(pb_imgs)
    n_train = int(n * pb_train_ratio)
    n_val = int(n * pb_val_ratio)
    pb_train = pb_imgs[:n_train]
    pb_val = pb_imgs[n_train:n_train + n_val]
    pb_test = pb_imgs[n_train + n_val:]

    train_images += pb_train
    val_images += pb_val
    test_images += pb_test

    # filter images to those that have corresponding label files
    def filter_with_label(paths):
        ok = []
        for p in paths:
            label = match_label_for_image(p)
            if label.exists():
                ok.append(p)
            else:
                # skip images without labels
                pass
        return ok

    train_images = filter_with_label(train_images)
    val_images = filter_with_label(val_images)
    test_images = filter_with_label(test_images)

    # write lists
    train_list = datasets_dir / "train.txt"
    val_list = datasets_dir / "val.txt"
    test_list = datasets_dir / "test.txt"

    write_list_file(train_images, train_list)
    write_list_file(val_images, val_list)
    write_list_file(test_images, test_list)

    # write combined data.yaml
    combined_yaml = out_dir / "data.yaml"
    # compute nc as len(names) or max index + 1
    nc = len(names)
    data = {
        'train': str(train_list.resolve()),
        'val': str(val_list.resolve()),
        'test': str(test_list.resolve()),
        'nc': nc,
        'names': names
    }
    with open(combined_yaml, 'w') as f:
        yaml.dump(data, f)

    print(f"Wrote: {train_list}, {val_list}, {test_list}, {combined_yaml}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--out-dir', default='models/trash_detection', help='output folder for lists and data.yaml')
    parser.add_argument('--seed', type=int, default=42)
    parser.add_argument('--pb-train-ratio', type=float, default=0.8)
    parser.add_argument('--pb-val-ratio', type=float, default=0.1)
    args = parser.parse_args()
    main(args.out_dir, args.seed, args.pb_train_ratio, args.pb_val_ratio)
