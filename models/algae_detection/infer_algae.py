# infer_algae.py
import cv2
from ultralytics import YOLO

def main():
    model = YOLO("runs/algae/algae_detector/weights/best.pt")

    img_path = "test_algae.jpg"
    img = cv2.imread(img_path)

    results = model(img)[0]

    algae_found = False
    total_area = 0

    for box in results.boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])

        if cls == 0 and conf > 0.4:
            algae_found = True
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            total_area += (x2 - x1) * (y2 - y1)

    annotated = results.plot()
    cv2.imshow("Algae Detection", annotated)
    cv2.waitKey(0)

    print("Algae detected:", algae_found)
    print("Estimated algae area:", total_area)

if __name__ == "__main__":
    main()
