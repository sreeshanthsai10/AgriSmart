"""
Download PlantVillage dataset using kagglehub
"""
import kagglehub
import os
import shutil

print("="*50)
print("Downloading PlantVillage Dataset")
print("="*50)
print("\nDownloading... (~342MB, please wait)\n")

# Download latest version
path = kagglehub.dataset_download("emmarex/plantdisease")

print(f"\n✅ Downloaded to: {path}")

# Show what's inside
print("\nDataset contents:")
folders = [f for f in os.listdir(path) if os.path.isdir(os.path.join(path, f))]
for folder in sorted(folders):
    files = len(os.listdir(os.path.join(path, folder)))
    print(f"  📁 {folder} ({files} images)")

# Copy to your ml-service dataset folder
dest = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'dataset', 'raw'
)

print(f"\nCopying to: {dest}")
os.makedirs(dest, exist_ok=True)

for folder in folders:
    src_folder = os.path.join(path, folder)
    dst_folder = os.path.join(dest, folder)
    if not os.path.exists(dst_folder):
        shutil.copytree(src_folder, dst_folder)
        print(f"  ✅ {folder}")

print("\n" + "="*50)
print("✅ Dataset ready!")
print(f"Location: {dest}")
print("="*50)
print("\nNext: python scripts/prepare_data.py")