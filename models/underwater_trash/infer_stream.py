# src/infer_stream.py
import cv2
from ultralytics import YOLO
from utils.pollution_score import compute_pollution_score
import time
import requests  # optional: to POST results to your backend

def main():
    # Change to your RTSP URL, or use 0 for default webcam
    stream_source = 0  # or "rtsp://user:pass@ip:554/stream"
    model_path = "models/best.pt"

    if os.path.exists(model_path := "models/best.pt"):
        model = YOLO(model_path)
    else:
        model = YOLO("yolov8n.pt")

    cap = cv2.VideoCapture(stream_source)
    if not cap.isOpened():
        print("Failed to open stream:", stream_source)
        return

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Frame grab failed, retrying in 1s...")
                time.sleep(1)
                continue

            results = model(frame)[0]
            score = compute_pollution_score(results)

            annotated = results.plot()
            cv2.putText(
                annotated,
                f"Score: {score:.1f}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.0,
                (0, 0, 255),
                2,
                cv2.LINE_AA,
            )

            cv2.imshow("River Monitor", annotated)
            print("Score:", score)

            # Example: send to backend (uncomment and change url)
            # try:
            #     requests.post("http://your-backend/ingest", json={"score": score, "camera_id": "cam1"})
            # except:
            #     pass

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    import os
    main()
