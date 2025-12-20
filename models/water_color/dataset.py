# dataset.py
import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms
import torch

class WaterDataset(Dataset):
    def __init__(self, csv_file, img_dir):
        self.data = pd.read_csv(csv_file)
        self.img_dir = img_dir

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),

            # Camera & lighting robustness
            transforms.ColorJitter(
                brightness=0.3,
                contrast=0.3,
                saturation=0.3,
                hue=0.05
            ),
            transforms.RandomGaussianBlur(3),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_path = os.path.join(
            self.img_dir,
            self.data.iloc[idx, 0]
        )
        image = Image.open(img_path).convert("RGB")
        # apply transforms (resize, augment, normalize)
        torch_img = self.transform(image)  # (3,H,W), normalized to ImageNet means
        # compute color stats here or in model (faster done in model if GPU)
        discolor_label = int(self.data.iloc[idx]['discolor_label'])
        turbidity = float(self.data.iloc[idx]['turbidity_NTU'])
        aux = torch.tensor([...], dtype=torch.float32)  # optional metadata

        return torch_img, turbidity, discolor_label, aux
