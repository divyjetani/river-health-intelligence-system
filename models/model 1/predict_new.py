import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

# DEFINE YOUR CLASSES MANUALLY TO BE SAFE
# (Ensure this order matches what you see in the training logs!)
class_names = [
    'brown_muddy_water', 
    'clean blue lake water texture', 
    'clear_clean_water', 
    'dark_black_water', 
    'foam_froth', 
    'green_algae_water'
]

print("⏳ Loading MobileNet model...")
model = tf.keras.models.load_model('water_quality_mobilenet.keras')
print("✅ Model loaded!")

def predict_image(image_path):
    try:
        # Load image with the same size as training (180x180)
        img = image.load_img(image_path, target_size=(180, 180))
        img_array = image.img_to_array(img)
        img_array = tf.expand_dims(img_array, 0) # Create a batch

        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])

        # Get top 3 predictions
        top_k_values, top_k_indices = tf.nn.top_k(score, k=3)

        print("------------------------------------------------")
        print(f"🖼️  Image: {image_path}")
        
        # Best guess
        best_idx = top_k_indices[0]
        confidence = 100 * top_k_values[0]
        print(f"🏆 RESULT: {class_names[best_idx]}")
        print(f"🔥 Confidence: {confidence:.2f}%")
        
        print("\n🥈 Other possibilities:")
        for i in range(1, 3):
            idx = top_k_indices[i]
            val = 100 * top_k_values[i]
            print(f"   - {class_names[idx]}: {val:.2f}%")
        print("------------------------------------------------")

    except Exception as e:
        print(f"Error: {e}")

# --- CHANGE THIS TO YOUR IMAGE NAME ---
predict_image("test_image.jpg")