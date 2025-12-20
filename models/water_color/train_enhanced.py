"""
Ready-to-run training script for the enhanced water-color multi-task model.
Usage example:
  python train_enhanced.py --train_csv data/train.csv --val_csv data/val.csv --img_dir data/images --epochs 20 --batch_size 16

The script trains turbidity regression and discoloration classification jointly.
It saves best model checkpoint to `best_model.pth`.
"""

import argparse
import os
import time
import math
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from dataset_enhanced import WaterDatasetMultiTask
from model_enhanced import MultiTaskWaterNet, heteroscedastic_loss


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--train_csv', required=True)
    p.add_argument('--val_csv', required=True)
    p.add_argument('--img_dir', required=True)
    p.add_argument('--backbone', default='resnet18')
    p.add_argument('--epochs', type=int, default=10)
    p.add_argument('--batch_size', type=int, default=16)
    p.add_argument('--lr', type=float, default=1e-4)
    p.add_argument('--weight_decay', type=float, default=1e-5)
    p.add_argument('--num_classes', type=int, default=3)
    p.add_argument('--device', default='cuda' if torch.cuda.is_available() else 'cpu')
    p.add_argument('--out', default='best_model.pth')
    return p.parse_args()


def mae(a, b):
    return float(torch.abs(a - b).mean().item())


def rmse(a, b):
    return float(torch.sqrt(((a - b) ** 2).mean()).item())


def train_one_epoch(model, loader, opt, device, w_turb=1.0, w_disc=1.0):
    model.train()
    running_loss = 0.0
    total = 0
    for images, turb, disc, _ in loader:
        images = images.to(device)
        turb = turb.to(device)
        disc = disc.to(device)

        out = model(images)
        turb_pred = out['turbidity']
        logvar = out['turbidity_logvar']
        disc_logits = out['discolor_logits']

        loss_turb = heteroscedastic_loss(turb_pred, logvar, turb).mean()
        loss_disc = nn.functional.cross_entropy(disc_logits, disc)
        loss = w_turb * loss_turb + w_disc * loss_disc

        opt.zero_grad()
        loss.backward()
        opt.step()

        running_loss += loss.item() * images.size(0)
        total += images.size(0)

    return running_loss / (total + 1e-8)


@torch.no_grad()
def validate(model, loader, device):
    model.eval()
    turb_preds = []
    turb_trues = []
    disc_preds = []
    disc_trues = []

    for images, turb, disc, _ in loader:
        images = images.to(device)
        turb = turb.to(device)
        disc = disc.to(device)

        out = model(images)
        turb_pred = out['turbidity']
        disc_logits = out['discolor_logits']
        disc_pred = disc_logits.argmax(dim=1)

        turb_preds.append(turb_pred.cpu())
        turb_trues.append(turb.cpu())
        disc_preds.append(disc_pred.cpu())
        disc_trues.append(disc.cpu())

    turb_preds = torch.cat(turb_preds)
    turb_trues = torch.cat(turb_trues)
    disc_preds = torch.cat(disc_preds)
    disc_trues = torch.cat(disc_trues)

    return {
        'turb_mae': mae(turb_preds, turb_trues),
        'turb_rmse': rmse(turb_preds, turb_trues),
        'disc_acc': float((disc_preds == disc_trues).float().mean().item())
    }


def main():
    args = parse_args()
    device = torch.device(args.device)

    train_ds = WaterDatasetMultiTask(args.train_csv, args.img_dir, augment=True)
    val_ds = WaterDatasetMultiTask(args.val_csv, args.img_dir, augment=False)

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size * 2, shuffle=False, num_workers=2)

    model = MultiTaskWaterNet(backbone_name=args.backbone, pretrained=True, n_classes=args.num_classes)
    model.to(device)

    opt = optim.AdamW(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(opt, patience=3, factor=0.5, verbose=True)

    best_score = math.inf
    for epoch in range(1, args.epochs + 1):
        t0 = time.time()
        train_loss = train_one_epoch(model, train_loader, opt, device)
        val_metrics = validate(model, val_loader, device)
        scheduler.step(val_metrics['turb_mae'])

        elapsed = time.time() - t0
        print(f"Epoch {epoch}/{args.epochs}  loss={train_loss:.4f}  val_mae={val_metrics['turb_mae']:.3f}  val_rmse={val_metrics['turb_rmse']:.3f}  val_acc={val_metrics['disc_acc']:.3f}  time={elapsed:.1f}s")

        # monitor by turbidity MAE (lower is better)
        if val_metrics['turb_mae'] < best_score:
            best_score = val_metrics['turb_mae']
            torch.save({
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': opt.state_dict(),
                'epoch': epoch,
                'val_metrics': val_metrics
            }, args.out)
            print('Saved best model ->', args.out)


if __name__ == '__main__':
    main()
