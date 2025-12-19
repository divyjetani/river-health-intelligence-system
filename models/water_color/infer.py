# infer.py
import torch
from PIL import Image
from torchvision import transforms
from model import TurbidityCNN

device = "cuda" if torch.cuda.is_available() else "cpu"

model = TurbidityCNN().to(device)
model.load_state_dict(torch.load("turbidity_model.pt", map_location=device))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict_turbidity(image_path):
    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        turbidity = model(img).item()

    return turbidity

t = predict_turbidity("sample_water.jpg")
print("Predicted turbidity:", round(t, 2))
