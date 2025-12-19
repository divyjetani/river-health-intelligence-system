# dataset.py
import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

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
        turbidity = self.data.iloc[idx, 1]

        image = self.transform(image)

        return image, float(turbidity)
