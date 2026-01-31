import cv2

# ============================
# CONFIG
# ============================
image_path = "C:\\Users\\divyj\\Desktop\\hackathons\\IIT bombay Crackathon\\data\\raw\\test\\images\\000842.jpg"
label_path = "C:\\Users\\divyj\\Desktop\\hackathons\\IIT bombay Crackathon\\predictions\\temp_labels\\labels\\000842.txt"

BOX_COLOR = (0, 255, 0)
TEXT_COLOR = (0, 0, 255)

# Class ID → Name mapping
CLASS_NAMES = {
    0: "longitudinal_crack",
    1: "transverse_crack",
    2: "alligator_crack",
    3: "other_corruption",
    4: "pothole",
}

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
    if len(parts) < 5:
        continue

    class_id = int(float(parts[0]))
    x_c, y_c, bw, bh = map(float, parts[1:5])

    # Convert normalized → pixel if needed
    if x_c <= 1 and y_c <= 1:
        x_c *= w
        y_c *= h
        bw *= w
        bh *= h

    # Bounding box corners
    x1 = max(0, int(x_c - bw / 2))
    y1 = max(0, int(y_c - bh / 2))
    x2 = min(w - 1, int(x_c + bw / 2))
    y2 = min(h - 1, int(y_c + bh / 2))

    # Draw rectangle
    cv2.rectangle(image, (x1, y1), (x2, y2), BOX_COLOR, 1)

    # Label text
    label = CLASS_NAMES.get(class_id, f"ID {class_id}")

    cv2.putText(
        image,
        label,
        (x1, max(y1 - 8, 15)),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        TEXT_COLOR,
        1,
    )

# ============================
# SHOW IMAGE
# ============================
cv2.imshow("YOLO Bounding Boxes", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
