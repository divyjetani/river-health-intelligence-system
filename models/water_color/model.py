# model.py
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models

class ColorStats(nn.Module):
    """Extract simple color statistics from image tensor (B,C,H,W)."""
    def __init__(self, eps=1e-6):
        super().__init__()
        self.eps = eps

    def forward(self, x):
        # x: (B,3,H,W) in [0,1] (after transforms)
        B = x.shape[0]
        mean = x.mean(dim=[2,3])          # (B,3)
        std = x.std(dim=[2,3]) + self.eps # (B,3)
        # convert to HSV-like approximations using RGB channels (simple proxies)
        # more advanced: convert to LAB/HSV with torchvision or cv2 in dataset stage
        stats = torch.cat([mean, std], dim=1)  # (B,6)
        return stats

class MultiTaskWaterNet(nn.Module):
    def __init__(self, backbone_name='resnet50', pretrained=True,
                 n_classes=3, color_feat_dim=6, dropout=0.3):
        super().__init__()
        # Backbone
        if backbone_name.startswith('resnet'):
            self.backbone = getattr(models, backbone_name)(pretrained=pretrained)
            in_feats = self.backbone.fc.in_features
            self.backbone.fc = nn.Identity()
        else:
            raise ValueError("Backbone only supports resnet* names in this example")

        # color feature extractor
        self.color_stats = ColorStats()
        # MLP to embed color stats
        self.color_mlp = nn.Sequential(
            nn.Linear(color_feat_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU()
        )

        # Fusion + heads
        fused_dim = in_feats + 64
        self.shared_fc = nn.Sequential(
            nn.Linear(fused_dim, 512),
            nn.ReLU(),
            nn.Dropout(dropout)
        )

        # Turbidity regression (predict mean)
        self.turbidity_head = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )
        # Optional log-variance head for uncertainty (heteroscedastic)
        self.turbidity_logvar = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )

        # Discoloration classification head
        self.discoloration_head = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, n_classes)
        )

    def forward(self, x):
        # x: (B,3,H,W), expected normalized
        feat = self.backbone(x)             # (B, in_feats)
        cstats = self.color_stats(x)        # (B,6)
        cembed = self.color_mlp(cstats)     # (B,64)
        fused = torch.cat([feat, cembed], dim=1)
        shared = self.shared_fc(fused)

        turbidity = self.turbidity_head(shared).squeeze(1)       # (B,)
        turbidity_logvar = self.turbidity_logvar(shared).squeeze(1)  # (B,)
        discolor_logits = self.discoloration_head(shared)       # (B, n_classes)

        return {
            'turbidity': turbidity,
            'turbidity_logvar': turbidity_logvar,  # use for hetero loss if you like
            'discolor_logits': discolor_logits
        }

# Example heteroscedastic loss for turbidity:
def heteroscedastic_loss(pred, logvar, target):
    # Negative log-likelihood: 0.5 * exp(-logvar) * (pred-target)^2 + 0.5*logvar
    precision = torch.exp(-logvar)
    return 0.5 * precision * (pred - target).pow(2) + 0.5 * logvar
