"""Quick fine-tune - Only trains classifier layer (fast + accurate)"""
import torch, torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms, datasets, models
import os
from tqdm import tqdm

DATA_DIR = 'dataset'
NUM_CLASSES = 15
DEVICE = torch.device('cpu')

print("Fine-tuning classifier (5 min)...")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

train_data = datasets.ImageFolder(os.path.join(DATA_DIR, 'train'), transform=transform)
val_data = datasets.ImageFolder(os.path.join(DATA_DIR, 'val'), transform=transform)

# Use small subset for speed
from torch.utils.data import Subset
import random
indices = random.sample(range(len(train_data)), min(2000, len(train_data)))
train_subset = Subset(train_data, indices)

train_loader = DataLoader(train_subset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_data, batch_size=32)

# Load pre-trained
model = models.efficientnet_b0(weights='IMAGENET1K_V1')

# Freeze base
for param in model.features.parameters():
    param.requires_grad = False

# New classifier
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
model = model.to(DEVICE)

optimizer = torch.optim.Adam(model.classifier.parameters(), lr=0.01)
criterion = nn.CrossEntropyLoss()

best_acc = 0
for epoch in range(3):
    model.train()
    correct, total = 0, 0
    
    pbar = tqdm(train_loader, desc=f'Epoch {epoch+1}/3')
    for images, labels in pbar:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()
        loss = criterion(model(images), labels)
        loss.backward()
        optimizer.step()
        
        _, predicted = model(images).max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
        pbar.set_postfix({'Acc': f'{100.*correct/total:.1f}%'})
    
    # Validate
    model.eval()
    val_correct, val_total = 0, 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            _, predicted = model(images).max(1)
            val_total += labels.size(0)
            val_correct += predicted.eq(labels).sum().item()
    
    val_acc = 100. * val_correct / val_total
    print(f'Epoch {epoch+1}: Val Acc: {val_acc:.1f}%')
    
    if val_acc > best_acc:
        best_acc = val_acc
        torch.save(model.state_dict(), 'saved_models/efficientnetb4_plantvillage.pth')

print(f'\n✅ Fine-tuning complete! Best Val Acc: {best_acc:.1f}%')
print('Restart API!')