import cv2
import os
import numpy as np

# ============================
# CONFIG
# ============================
IMAGE_DIR = "C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\Images_Dataset\\PlasticBottles_Garbage\\images"
MASK_DIR = "C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\Images_Dataset\\PlasticBottles_Garbage\\masks"
LABEL_DIR = "C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\Images_Dataset\\PlasticBottles_Garbage\\labels"

CLASS_ID = 0  # single class
MIN_AREA = 100  # ignore very small noise

# Create labels folder if not exists
os.makedirs(LABEL_DIR, exist_ok=True)


def mask_to_yolo(mask_path, image_path, label_path):
    # Load image and mask
    image = cv2.imread(image_path)
    mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)

    if image is None or mask is None:
        print(f"Skipping {mask_path} (missing image or mask)")
        return

    h, w = image.shape[:2]

    # Ensure binary mask
    _, binary_mask = cv2.threshold(mask, 1, 255, cv2.THRESH_BINARY)

    # Find contours (each contour = one object)
    contours, _ = cv2.findContours(
        binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    yolo_lines = []

    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < MIN_AREA:
            continue  # remove noise

        x, y, bw, bh = cv2.boundingRect(cnt)

        # Convert to YOLO format (normalized)
        x_center = (x + bw / 2) / w
        y_center = (y + bh / 2) / h
        bw /= w
        bh /= h

        yolo_lines.append(
            f"{CLASS_ID} {x_center:.6f} {y_center:.6f} {bw:.6f} {bh:.6f}"
        )

    # Save label file
    with open(label_path, "w") as f:
        f.write("\n".join(yolo_lines))


# ============================
# PROCESS ALL MASKS
# ============================
mask_files = sorted(os.listdir(MASK_DIR))

for mask_file in mask_files:
    mask_path = os.path.join(MASK_DIR, mask_file)

    name, _ = os.path.splitext(mask_file)

    # Match image file (jpg/png/jpeg)
    image_path = None
    for ext in [".jpg", ".png", ".jpeg"]:
        candidate = os.path.join(IMAGE_DIR, name + ext)
        if os.path.exists(candidate):
            image_path = candidate
            break

    if image_path is None:
        print(f"No matching image for mask: {mask_file}")
        continue

    label_path = os.path.join(LABEL_DIR, name + ".txt")

    mask_to_yolo(mask_path, image_path, label_path)

print("✅ Conversion completed!")
