"""Ultra-fast training - 1 epoch, smaller images"""
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import transforms, datasets, models
import os
from tqdm import tqdm

DATA_DIR = 'dataset'
BATCH_SIZE = 16
NUM_EPOCHS = 1
NUM_CLASSES = 15
DEVICE = torch.device('cpu')

print("Fast training mode - 1 epoch only")

# Smaller images for speed
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Smaller = faster
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Use only training data (skip val for speed)
train_data = datasets.ImageFolder(os.path.join(DATA_DIR, 'train'), transform=transform)
train_loader = DataLoader(train_data, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)

print(f"Training images: {len(train_data)}")
print(f"Estimated time: 10-20 minutes\n")

# Smaller model
model = models.efficientnet_b0(weights=None)  # B0 is smaller than B4
num_ftrs = model.classifier[1].in_features
model.classifier = nn.Linear(num_ftrs, NUM_CLASSES)
model = model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(NUM_EPOCHS):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    pbar = tqdm(train_loader, desc='Training')
    for images, labels in pbar:
        images, labels = images.to(DEVICE), labels.to(DEVICE)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
        
        pbar.set_postfix({'Loss': f'{running_loss/len(pbar):.3f}', 'Acc': f'{100.*correct/total:.1f}%'})

os.makedirs('saved_models', exist_ok=True)
torch.save(model.state_dict(), 'saved_models/efficientnetb4_plantvillage.pth')
print(f'\n✅ Model saved! Accuracy: {100.*correct/total:.1f}%')
print('Restart API: python -m app.main')