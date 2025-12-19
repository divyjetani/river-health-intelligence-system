import cv2
import numpy as np
import sys

# -------------------------------
# Color constancy (Gray World)
# -------------------------------
def color_constancy(img):
    img = img.astype(np.float32)

    avg_b = np.mean(img[:, :, 0])
    avg_g = np.mean(img[:, :, 1])
    avg_r = np.mean(img[:, :, 2])

    avg_gray = (avg_b + avg_g + avg_r) / 3.0

    img[:, :, 0] *= avg_gray / (avg_b + 1e-6)
    img[:, :, 1] *= avg_gray / (avg_g + 1e-6)
    img[:, :, 2] *= avg_gray / (avg_r + 1e-6)

    return np.clip(img, 0, 255).astype(np.uint8)

# -------------------------------
# Extract water region mask
# -------------------------------
def extract_water_region(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Broad water range (camera-independent)
    lower = np.array([70, 20, 50])
    upper = np.array([140, 255, 255])

    mask = cv2.inRange(hsv, lower, upper)

    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

    return mask

# -------------------------------
# Advanced water color analysis
# -------------------------------
def water_color_detect_advanced(image):
    # 1. Remove camera color bias
    image_cc = color_constancy(image)

    # 2. Water-only mask
    water_mask = extract_water_region(image_cc)
    water_pixels = image_cc[water_mask > 0]

    if len(water_pixels) < 500:
        return {
            "condition": "insufficient_water_region",
            "confidence": 0.0,
            "pollution_score": 25
        }

    # 3. Convert to HSV & LAB
    hsv = cv2.cvtColor(water_pixels.reshape(-1, 1, 3), cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(water_pixels.reshape(-1, 1, 3), cv2.COLOR_BGR2LAB)

    h = hsv[:, :, 0].flatten()
    s = hsv[:, :, 1].flatten()
    v = hsv[:, :, 2].flatten()

    l = lab[:, :, 0].flatten()
    a = lab[:, :, 1].flatten()
    b = lab[:, :, 2].flatten()

    # 4. Robust statistics
    stats = {
        "h_median": float(np.median(h)),
        "s_90": float(np.percentile(s, 90)),
        "v_median": float(np.median(v)),
        "v_10": float(np.percentile(v, 10)),
        "a_mean": float(np.mean(a)),
        "b_mean": float(np.mean(b))
    }

    # 5. Decision logic
    condition = "unknown"
    confidence = 0.4
    score = 20

    if 90 < stats["h_median"] < 130 and stats["s_90"] < 80 and stats["v_median"] > 120:
        condition = "clean_water"
        score = 5
        confidence = 0.9

    elif 10 < stats["h_median"] < 35 and stats["s_90"] > 90:
        condition = "muddy_water"
        score = 45
        confidence = 0.8

    elif 35 < stats["h_median"] < 85 and stats["s_90"] > 100:
        condition = "algae_bloom"
        score = 65
        confidence = 0.85

    elif stats["v_10"] < 70 and abs(stats["a_mean"] - 128) > 10:
        condition = "chemical_pollution"
        score = 85
        confidence = 0.75

    return {
        "condition": condition,
        "confidence": round(confidence, 2),
        "pollution_score": score,
        "stats": stats
    }

# -------------------------------
# MAIN
# -------------------------------
def main():
    if len(sys.argv) < 2:
        print("Usage: python water_analysis.py path/to/image.jpg")
        return

    image_path = sys.argv[1]
    image = cv2.imread(image_path)

    if image is None:
        print("❌ Failed to load image")
        return

    result = water_color_detect_advanced(image)

    print("\n🌊 WATER QUALITY ANALYSIS")
    print("-" * 40)
    for k, v in result.items():
        print(f"{k}: {v}")

    # Visualize water mask
    mask = extract_water_region(color_constancy(image))
    overlay = image.copy()
    overlay[mask > 0] = (0, 255, 0)

    blended = cv2.addWeighted(image, 0.7, overlay, 0.3, 0)
    cv2.imshow("Water Region Detection", blended)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
