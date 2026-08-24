import os
import requests
import time
from PIL import Image

# 1. Create a dummy test image
img_path = "e2e_test_image.jpg"
img = Image.new('RGB', (800, 600), color = 'blue')
img.save(img_path)

BASE_URL = "http://localhost:8000/api"

print("--- DEEPTRACE E2E INTEGRATION TEST ---")

try:
    # 2. Register
    email = f"test_{int(time.time())}@example.com"
    print(f"1. Registering user {email}...")
    reg_res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "E2E Tester",
        "email": email,
        "password": "password123"
    })
    if reg_res.status_code != 200: raise Exception(f"Registration failed: {reg_res.text}")
    token = reg_res.json()["token"]
    print("   ✅ Registration successful (Saved to MongoDB Atlas)")

    # 3. Login
    print("2. Logging in with new account...")
    login_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "password123"
    })
    if login_res.status_code != 200: raise Exception(f"Login failed: {login_res.text}")
    print("   ✅ Login successful (JWT Token generated)")

    # 4. Auth Me
    print("3. Validating JWT Token...")
    me_res = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token}"})
    if me_res.status_code != 200: raise Exception(f"Auth Me failed: {me_res.text}")
    print("   ✅ Token verified perfectly")

    # 5. Upload Image
    print("4. Uploading image to ML Pipeline (Testing HuggingFace + Cloudinary)...")
    with open(img_path, "rb") as f:
        files = {"file": ("e2e_test_image.jpg", f, "image/jpeg")}
        headers = {"Authorization": f"Bearer {token}"}
        analyze_res = requests.post(f"{BASE_URL}/analyze", files=files, headers=headers)
    
    if analyze_res.status_code != 200: raise Exception(f"Analysis failed: {analyze_res.text}")
    analysis_data = analyze_res.json()
    aid = analysis_data["id"]
    print(f"   ✅ ML Pipeline finished. Analysis ID: {aid}")
    print(f"   ✅ Cloudinary Upload successful! URL: {analysis_data['images'].get('original')}")

    # 6. Check History
    print("5. Fetching History Dashboard (Testing MongoDB Atlas sync)...")
    hist_res = requests.get(f"{BASE_URL}/history", headers={"Authorization": f"Bearer {token}"})
    if hist_res.status_code != 200: raise Exception(f"History failed: {hist_res.text}")
    hist_data = hist_res.json()
    if hist_data["stats"]["total"] >= 1:
        print("   ✅ Analysis successfully persisted to Atlas history")
    else:
        raise Exception("History not found in Atlas")

    # 7. Check PDF Report
    print("6. Generating Forensic PDF Report...")
    report_res = requests.get(f"{BASE_URL}/report/{aid}")
    if report_res.status_code != 200: raise Exception(f"PDF Generation failed: {report_res.text}")
    print(f"   ✅ PDF Report generated successfully (Size: {len(report_res.content)} bytes)")
    
    print("\n🎉 ALL TESTS PASSED SUCCESSFULLY! The entire stack is working end-to-end.")

except Exception as e:
    print(f"\n❌ TEST FAILED: {str(e)}")

finally:
    if os.path.exists(img_path):
        os.remove(img_path)
