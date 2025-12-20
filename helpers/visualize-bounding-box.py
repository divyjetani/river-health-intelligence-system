import cv2

# ============================
# CONFIG
# ============================
image_path = "C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\Images_Dataset\\PlasticBottles_Garbage\\images\\img_001_aug0.jpg"
label_path = "C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\Images_Dataset\\PlasticBottles_Garbage\\labels\\img_001_aug0.txt"

BOX_COLOR = (0, 255, 0)
TEXT_COLOR = (0, 0, 255)

# ============================
# LOAD IMAGE
# ============================
image = cv2.imread(image_path)
if image is None:
    raise FileNotFoundError("Image not found")

h, w = image.shape[:2]

# ============================
# READ YOLO LABELS
# ============================
with open(label_path, "r") as f:
    lines = f.readlines()

# ============================
# DRAW BOXES
# ============================
for line in lines:
    parts = line.strip().split()
    if len(parts) != 5:
        continue

    class_id, x_c, y_c, bw, bh = map(float, parts)

    # YOLO → pixel coordinates
    x_c *= w
    y_c *= h
    bw *= w
    bh *= h

    x1 = int(x_c - bw / 2)
    y1 = int(y_c - bh / 2)
    x2 = int(x_c + bw / 2)
    y2 = int(y_c + bh / 2)

    # Draw bounding box
    cv2.rectangle(image, (x1, y1), (x2, y2), BOX_COLOR, 2)

    # Draw class id
    cv2.putText(
        image,
        f"ID {int(class_id)}",
        (x1, max(y1 - 5, 15)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        TEXT_COLOR,
        2,
    )

# ============================
# SHOW IMAGE
# ============================
cv2.imshow("YOLO Bounding Box", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
