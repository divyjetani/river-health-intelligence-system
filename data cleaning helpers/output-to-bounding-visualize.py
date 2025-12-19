import json
import cv2
import matplotlib.pyplot as plt

# Path to your image and JSON file
image_path = 'C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\model my\\data\\test.jpg'  # Replace with your image path
json_path = 'C:\\Users\\divyj\\Desktop\\hackathons\\hackVeda iilm\\model my\\data\\a.json' 

# Load the image
image = cv2.imread(image_path)

# Load the JSON data from file
with open(json_path, 'r') as json_file:
    data = json.load(json_file)

# Extract detections from the JSON data
detections = data['detections']

# Loop through each detection and draw the bounding boxes
for detection in detections:
    # Extract the bounding box coordinates
    x_min, y_min, x_max, y_max = map(int, detection['bbox'])
    
    # Draw the bounding box (green color, thickness of 2)
    image = cv2.rectangle(image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
    
    # Optionally, display the class and confidence
    class_name = str(detection['class'])  # Use class id (you can replace with actual class names)
    confidence = round(detection['conf'], 2)
    label = f"Class: {class_name} Conf: {confidence}"
    font = cv2.FONT_HERSHEY_SIMPLEX
    image = cv2.putText(image, label, (x_min, y_min - 10), font, 0.5, (0, 255, 0), 2)

# Convert the image to RGB for displaying with Matplotlib
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Display the image with bounding boxes using matplotlib
plt.imshow(image_rgb)
plt.axis('off')  # Hide axes
plt.show()
