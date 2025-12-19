# train.py
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from model import TurbidityCNN
from dataset import WaterDataset

device = "cuda" if torch.cuda.is_available() else "cpu"

dataset = WaterDataset(
    "labels.csv",
    "images/"
)

loader = DataLoader(dataset, batch_size=16, shuffle=True)

model = TurbidityCNN().to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
criterion = nn.MSELoss()

for epoch in range(30):
    model.train()
    total_loss = 0

    for imgs, y in loader:
        imgs = imgs.to(device)
        y = y.to(device).unsqueeze(1)

        preds = model(imgs)
        loss = criterion(preds, y)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}, Loss: {total_loss/len(loader):.4f}")

torch.save(model.state_dict(), "turbidity_model.pt")
