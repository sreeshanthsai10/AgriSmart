"""Split real dataset into train/val"""
import os
import shutil
from sklearn.model_selection import train_test_split

DATA_DIR = 'dataset'
RAW_DIR = os.path.join(DATA_DIR, 'raw')
TRAIN_DIR = os.path.join(DATA_DIR, 'train')
VAL_DIR = os.path.join(DATA_DIR, 'val')

# Get all class folders
classes = [d for d in os.listdir(RAW_DIR) if os.path.isdir(os.path.join(RAW_DIR, d))]
print(f"Found {len(classes)} classes:")
for c in classes:
    print(f"  - {c}")

# Split each class
for class_name in classes:
    class_path = os.path.join(RAW_DIR, class_name)
    images = [f for f in os.listdir(class_path) if f.endswith(('.jpg','.jpeg','.png','.JPG','.JPEG','.PNG'))]
    
    if len(images) == 0:
        continue
    
    # Split 80/20
    train_imgs, val_imgs = train_test_split(images, test_size=0.2, random_state=42)
    
    # Create class folders
    train_class_dir = os.path.join(TRAIN_DIR, class_name)
    val_class_dir = os.path.join(VAL_DIR, class_name)
    os.makedirs(train_class_dir, exist_ok=True)
    os.makedirs(val_class_dir, exist_ok=True)
    
    # Copy training images
    for img in train_imgs:
        shutil.copy2(os.path.join(class_path, img), os.path.join(train_class_dir, img))
    
    # Copy validation images
    for img in val_imgs:
        shutil.copy2(os.path.join(class_path, img), os.path.join(val_class_dir, img))
    
    print(f"  {class_name}: {len(train_imgs)} train, {len(val_imgs)} val")

print("\n✅ Split complete!")