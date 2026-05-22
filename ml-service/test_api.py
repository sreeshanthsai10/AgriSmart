"""
Test script for AGRISMART ML Service
Tests all API endpoints
"""
import requests
import os
import json

BASE_URL = "http://localhost:8001"
API_URL = f"{BASE_URL}/api/v1"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health():
    """Test health endpoint"""
    print_section("TESTING HEALTH ENDPOINT")
    
    response = requests.get(f"{API_URL}/health")
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(data, indent=2)}")
    
    assert response.status_code == 200
    assert data['status'] == 'healthy'
    print("✅ Health check passed!")

def test_plants():
    """Test plants endpoint"""
    print_section("TESTING PLANTS ENDPOINT")
    
    response = requests.get(f"{API_URL}/plants")
    data = response.json()
    
    print(f"Total plants: {data['total']}")
    print(f"Plants: {', '.join(data['plants'][:5])}...")
    
    assert response.status_code == 200
    assert data['total'] == 14
    print("✅ Plants endpoint passed!")

def test_diseases():
    """Test diseases endpoint"""
    print_section("TESTING DISEASES ENDPOINT")
    
    response = requests.get(f"{API_URL}/diseases")
    data = response.json()
    
    print(f"Total diseases: {data['total']}")
    print(f"First 3 diseases:")
    for d in data['diseases'][:3]:
        print(f"  - {d['plant']}: {d['disease']} ({d['severity']})")
    
    assert response.status_code == 200
    assert data['total'] == 38
    print("✅ Diseases endpoint passed!")

def test_disease_detail():
    """Test disease detail endpoint"""
    print_section("TESTING DISEASE DETAIL")
    
    class_name = "Tomato___Late_blight"
    response = requests.get(f"{API_URL}/diseases/{class_name}")
    data = response.json()
    
    print(f"Disease: {data['disease']}")
    print(f"Plant: {data['plant']}")
    print(f"Pathogen: {data['pathogen']}")
    print(f"Severity: {data['severity']}")
    print(f"Symptoms: {data['symptoms'][:100]}...")
    print(f"Treatment: {data['treatment'][:100]}...")
    
    assert response.status_code == 200
    assert data['disease'] == 'Late Blight'
    print("✅ Disease detail passed!")

def test_model_info():
    """Test model info endpoint"""
    print_section("TESTING MODEL INFO")
    
    response = requests.get(f"{API_URL}/model-info")
    data = response.json()
    
    print(f"Architecture: {data['architecture']}")
    print(f"Device: {data['device']}")
    print(f"Classes: {data['num_classes']}")
    print(f"Model Loaded: {data['model_loaded']}")
    
    assert response.status_code == 200
    print("✅ Model info passed!")

def test_predict():
    """Test prediction endpoint"""
    print_section("TESTING PREDICTION")
    
    # Use a sample image from dataset
    image_path = "dataset/train/Apple___healthy/0000.jpg"
    
    if not os.path.exists(image_path):
        print("⚠️  No test image found. Skipping prediction test.")
        return
    
    with open(image_path, 'rb') as f:
        files = {'file': ('test.jpg', f, 'image/jpeg')}
        response = requests.post(f"{API_URL}/predict", files=files)
    
    data = response.json()
    
    print(f"Success: {data['success']}")
    print(f"\nTop Prediction:")
    print(f"  Class: {data['top_prediction']['class_name']}")
    print(f"  Confidence: {data['top_prediction']['confidence']}%")
    print(f"\nProcessing Time: {data['processing_time']}s")
    
    if data.get('disease_info'):
        print(f"\nDisease Info:")
        print(f"  Plant: {data['disease_info']['plant']}")
        print(f"  Disease: {data['disease_info']['disease']}")
        print(f"  Severity: {data['disease_info']['severity']}")
    
    assert response.status_code == 200
    assert data['success'] == True
    print("✅ Prediction test passed!")

def test_search():
    """Test search endpoint"""
    print_section("TESTING SEARCH")
    
    response = requests.get(f"{API_URL}/search?q=blight")
    data = response.json()
    
    print(f"Search query: {data['query']}")
    print(f"Results found: {data['results_count']}")
    for r in data['results'][:3]:
        print(f"  - {r['plant']}: {r['disease']} ({r['severity']})")
    
    assert response.status_code == 200
    print("✅ Search test passed!")

def test_stats():
    """Test stats endpoint"""
    print_section("TESTING STATS")
    
    response = requests.get(f"{API_URL}/stats")
    data = response.json()
    
    print(f"Total Classes: {data['total_classes']}")
    print(f"Healthy Classes: {data['healthy_classes']}")
    print(f"Disease Classes: {data['disease_classes']}")
    print(f"Plants: {len(data['plants'])}")
    
    assert response.status_code == 200
    print("✅ Stats test passed!")

if __name__ == "__main__":
    print("\n" + "🌿"*20)
    print("  AGRISMART API TEST SUITE")
    print("🌿"*20)
    
    try:
        # Test basic endpoints
        test_health()
        test_plants()
        test_diseases()
        test_disease_detail()
        test_model_info()
        test_search()
        test_stats()
        
        # Test prediction (needs running server)
        print_section("TESTING PREDICTION")
        print("Make sure server is running on http://localhost:8001")
        test_predict()
        
        print("\n" + "="*60)
        print("  🎉 ALL TESTS PASSED! API IS WORKING PERFECTLY!")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to server!")
        print("Start the server first: python -m app.main")
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")