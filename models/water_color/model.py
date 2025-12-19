# model.py
import torch
import torch.nn as nn
from torchvision import models

class TurbidityCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = models.resnet18(pretrained=True)

        # Replace classifier
        self.model.fc = nn.Linear(
            self.model.fc.in_features, 1
        )

    def forward(self, x):
        return self.model(x)
