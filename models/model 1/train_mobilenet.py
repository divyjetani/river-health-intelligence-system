import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image_dataset_from_directory
import os

# --- CONFIGURATION ---
DATASET_PATH = 'dataset'  # Folder containing your class folders
IMG_SIZE = (180, 180)     # Standard size for MobileNet
BATCH_SIZE = 32
EPOCHS = 20               # MobileNet learns fast, 20 is usually enough

# 1. LOAD DATA
print("🚀 Loading Data...")
train_ds = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
print(f"✅ Classes found: {class_names}")

# 2. OPTIMIZE FOR PERFORMANCE
AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# 3. BUILD MODEL (MobileNetV2)
print("🏗️ Building MobileNetV2 Model...")

# Load pre-trained base model (without the top "head")
base_model = MobileNetV2(input_shape=IMG_SIZE + (3,),
                         include_top=False,
                         weights='imagenet')

# Freeze the base model (so we don't ruin its pre-learned knowledge)
base_model.trainable = False

# Add new layers on top for YOUR classes
model = models.Sequential([
    layers.Rescaling(1./127.5, offset=-1, input_shape=IMG_SIZE + (3,)), # MobileNet specific preprocessing
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.2),
    layers.Dense(len(class_names), activation='softmax') # Final output layer
])

# 4. COMPILE
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 5. TRAIN
print("⏳ Training...")
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# 6. SAVE
model.save('water_quality_mobilenet.keras')
print("🏆 Model Saved as 'water_quality_mobilenet.keras'")