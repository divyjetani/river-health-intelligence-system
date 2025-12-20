"""
Enhanced multi-task model for water turbidity (regression) and discoloration (classification).
- Shared backbone (ResNet family)
- Color-statistics fusion (simple RGB/Hue stats)
- Turbidity heteroscedastic head (predict mean + log-variance)
- Discoloration classification head

Usage:
  from model_enhanced import MultiTaskWaterNet, heteroscedastic_loss

"""

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
        # x: (B,3,H,W) expected in [0,1] or normalized; using raw moments is OK
        mean = x.mean(dim=[2, 3])
        std = x.std(dim=[2, 3]) + self.eps
        # Compute a single-channel hue-like proxy using arctan combination (cheap proxy)
        r, g, b = mean[:, 0:1], mean[:, 1:2], mean[:, 2:3]
        hue_proxy = torch.atan2(torch.sqrt(3.) * (g - b), 2 * r - g - b)
        hue_proxy = hue_proxy / 3.14159  # scale to roughly [-1,1]
        stats = torch.cat([mean, std, hue_proxy], dim=1)  # (B,7)
        return stats


class MultiTaskWaterNet(nn.Module):
    def __init__(self, backbone_name='resnet50', pretrained=True,
                 n_classes=3, color_feat_dim=7, dropout=0.3):
        super().__init__()
        # Backbone
        if not hasattr(models, backbone_name):
            raise ValueError(f"Backbone {backbone_name} not found in torchvision.models")

        self.backbone = getattr(models, backbone_name)(pretrained=pretrained)
        if hasattr(self.backbone, 'fc'):
            in_feats = self.backbone.fc.in_features
            self.backbone.fc = nn.Identity()
        elif hasattr(self.backbone, 'classifier'):
            # handle alternative model definitions (not exhaustive)
            in_feats = self.backbone.classifier.in_features
            self.backbone.classifier = nn.Identity()
        else:
            raise RuntimeError('Unhandled backbone head replacement - please adapt the code')

        # color feature extractor
        self.color_stats = ColorStats()
        self.color_mlp = nn.Sequential(
            nn.Linear(color_feat_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU()
        )

        # Fusion and shared head
        fused_dim = in_feats + 64
        self.shared_fc = nn.Sequential(
            nn.Linear(fused_dim, 512),
            nn.ReLU(),
            nn.Dropout(dropout)
        )

        # Turbidity regression head (mean)
        self.turbidity_head = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )
        # Turbidity log-variance head
        self.turbidity_logvar = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, 1)
        )

        # Discoloration classification
        self.discoloration_head = nn.Sequential(
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, n_classes)
        )

    def forward(self, x):
        # x: (B,3,H,W)
        feat = self.backbone(x)
        cstats = self.color_stats(x)
        cembed = self.color_mlp(cstats)
        fused = torch.cat([feat, cembed], dim=1)
        shared = self.shared_fc(fused)

        turbidity = self.turbidity_head(shared).squeeze(1)
        turbidity_logvar = self.turbidity_logvar(shared).squeeze(1)
        discolor_logits = self.discoloration_head(shared)

        return {
            'turbidity': turbidity,
            'turbidity_logvar': turbidity_logvar,
            'discolor_logits': discolor_logits
        }


def heteroscedastic_loss(pred, logvar, target):
    """Negative log-likelihood for Gaussian with predicted mean and log-variance.
    pred, logvar, target: tensors (B,)
    returns tensor loss (B,)
    """
    precision = torch.exp(-logvar)
    return 0.5 * precision * (pred - target).pow(2) + 0.5 * logvar


if __name__ == '__main__':
    # quick smoke test
    model = MultiTaskWaterNet(backbone_name='resnet18', pretrained=False, n_classes=4)
    x = torch.randn(2, 3, 224, 224)
    out = model(x)
    print({k: v.shape for k, v in out.items()})
