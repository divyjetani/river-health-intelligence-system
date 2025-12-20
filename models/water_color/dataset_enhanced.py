"""
Enhanced dataset for multi-task water-color model.
Expected CSV columns: filename,turbidity_NTU,discolor_label (integer 0..N-1)
Optional columns: secchi_m, tss_mg_l, chl_a_ug_l, latitude, longitude

Returns (image_tensor, turbidity_tensor, discolor_label_tensor, metadata_tensor)
"""

import os
import pandas as pd
from PIL import Image
import numpy as np
import colorsys
from torch.utils.data import Dataset
from torchvision import transforms
import torch


class WaterDatasetMultiTask(Dataset):
    def __init__(self, csv_file, img_dir, image_size=224, augment=False):
        self.data = pd.read_csv(csv_file)
        self.img_dir = img_dir
        self.augment = augment

        base_transforms = [
            transforms.Resize((image_size, image_size)),
        ]

        if self.augment:
            base_transforms += [
                transforms.RandomHorizontalFlip(0.5),
                transforms.RandomRotation(10),
                transforms.ColorJitter(0.2, 0.2, 0.2, 0.05)
            ]

        base_transforms += [
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ]

        self.transform = transforms.Compose(base_transforms)

    def __len__(self):
        return len(self.data)

    def _compute_simple_color_stats(self, pil_img):
        # quick, efficient summary: compute per-channel mean and std on small thumbnail
        thumb = pil_img.copy()
        thumb.thumbnail((64, 64))
        arr = np.asarray(thumb).astype(np.float32) / 255.0
        if arr.ndim == 2:
            arr = np.stack([arr, arr, arr], axis=-1)
        mean = arr.mean(axis=(0, 1))  # r,g,b
        std = arr.std(axis=(0, 1))
        # hue from mean rgb (colorsys expects 0..1)
        h, s, v = colorsys.rgb_to_hsv(float(mean[0]), float(mean[1]), float(mean[2]))
        stats = np.concatenate([mean, std, [h]])  # length 7 (matches model color_feat_dim)
        return stats.astype(np.float32)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        img_path = os.path.join(self.img_dir, row['filename'])
        image = Image.open(img_path).convert('RGB')
        turbidity = float(row['turbidity_NTU'])
        discolor_label = int(row['discolor_label'])

        # compute color stats optionally (for analysis); model also computes color stats from tensor
        color_stats = self._compute_simple_color_stats(image)

        image_tensor = self.transform(image)

        return image_tensor, torch.tensor(turbidity, dtype=torch.float32), torch.tensor(discolor_label, dtype=torch.long), torch.tensor(color_stats, dtype=torch.float32)


if __name__ == '__main__':
    # quick smoke test
    ds = WaterDatasetMultiTask(csv_file='examples/sample.csv', img_dir='examples/images', augment=True)
    print('len', len(ds))
    sample = ds[0]
    print([s.shape if hasattr(s, 'shape') else type(s) for s in sample])
