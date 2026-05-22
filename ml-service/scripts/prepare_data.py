"""
Dataset preparation script for PlantVillage dataset
"""
import os
import numpy as np
from PIL import Image
import random

# Define all 38 PlantVillage classes
CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry___Powdery_mildew', 'Cherry___healthy',
    'Corn___Cercospora_leaf_spot', 'Corn___Common_rust', 'Corn___Northern_Leaf_Blight', 'Corn___healthy',
    'Grape___Black_rot', 'Grape___Esca', 'Grape___Leaf_blight', 'Grape___healthy',
    'Orange___Haunglongbing', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper_bell___Bacterial_spot', 'Pepper_bell___healthy',
    'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites',
    'Tomato___Target_Spot', 'Tomato___Yellow_Leaf_Curl_Virus', 'Tomato___mosaic_virus',
    'Tomato___healthy'
]

def create_sample_dataset():
    """Create sample dataset with colored images"""
    
    base_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dataset')
    raw_path = os.path.join(base_path, 'raw')
    train_path = os.path.join(base_path, 'train')
    val_path = os.path.join(base_path, 'val')
    
    # Create directories
    for path in [raw_path, train_path, val_path]:
        os.makedirs(path, exist_ok=True)
    
    samples_per_class = 50
    print(f"Creating sample dataset...")
    print(f"Classes: {len(CLASSES)}")
    print(f"Samples per class: {samples_per_class}")
    print(f"Total images: {len(CLASSES) * samples_per_class}")
    print("-" * 50)
    
    for class_name in CLASSES:
        # Create class directories
        raw_class_dir = os.path.join(raw_path, class_name)
        train_class_dir = os.path.join(train_path, class_name)
        val_class_dir = os.path.join(val_path, class_name)
        
        os.makedirs(raw_class_dir, exist_ok=True)
        os.makedirs(train_class_dir, exist_ok=True)
        os.makedirs(val_class_dir, exist_ok=True)
        
        for i in range(samples_per_class):
            # Create image with class-specific color
            if 'healthy' in class_name.lower():
                # Green for healthy plants
                img_array = np.random.randint(100, 200, (256, 256, 3), dtype=np.uint8)
                img_array[:, :, 1] = np.clip(img_array[:, :, 1] + 40, 0, 255)
            else:
                # Brown spots for diseased plants
                img_array = np.random.randint(50, 180, (256, 256, 3), dtype=np.uint8)
                # Add random disease spots
                for _ in range(5):
                    x, y = random.randint(0, 200), random.randint(0, 200)
                    img_array[x:x+50, y:y+50] = [139, 69, 19]
            
            img = Image.fromarray(img_array)
            
            # Save to raw
            img.save(os.path.join(raw_class_dir, f'{i:04d}.jpg'))
            
            # Split into train/val (80/20)
            if i < int(samples_per_class * 0.8):
                img.save(os.path.join(train_class_dir, f'{i:04d}.jpg'))
            else:
                img.save(os.path.join(val_class_dir, f'{i:04d}.jpg'))
        
        print(f"✓ {class_name}")
    
    print("-" * 50)
    print("✅ Dataset created successfully!")
    print(f"\nLocations:")
    print(f"  Raw: {raw_path}")
    print(f"  Train: {train_path}")
    print(f"  Val: {val_path}")

if __name__ == "__main__":
    create_sample_dataset()