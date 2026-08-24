import os
import cloudinary
import cloudinary.uploader

# Cloudinary automatically configures itself if the CLOUDINARY_URL environment variable is set.
# Example: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config(secure=True)

def upload_images_to_cloudinary(analysis_dict, output_dir):
    """
    Uploads the generated forensic images to Cloudinary.
    Replaces the local URLs in the analysis dictionary with the remote Cloudinary URLs.
    If no Cloudinary credentials are provided, it silently falls back to local URLs.
    """
    if not os.environ.get('CLOUDINARY_URL'):
        print("[DeepTrace] No CLOUDINARY_URL found. Using local image hosting.")
        return analysis_dict
        
    print(f"[DeepTrace] Uploading images to Cloudinary for analysis {analysis_dict['id']}...")
    try:
        aid = analysis_dict["id"]
        
        # Upload original
        orig_path = os.path.join(output_dir, f"{aid}_original.jpg")
        if os.path.exists(orig_path):
            orig_res = cloudinary.uploader.upload(orig_path, folder="deeptrace")
            analysis_dict["images"]["original"] = orig_res["secure_url"]
        
        # Upload heatmap
        heat_path = os.path.join(output_dir, f"{aid}_heatmap.jpg")
        if os.path.exists(heat_path):
            heat_res = cloudinary.uploader.upload(heat_path, folder="deeptrace")
            analysis_dict["images"]["heatmap"] = heat_res["secure_url"]
        
        # Upload ela
        ela_path = os.path.join(output_dir, f"{aid}_ela.jpg")
        if os.path.exists(ela_path):
            ela_res = cloudinary.uploader.upload(ela_path, folder="deeptrace")
            analysis_dict["images"]["ela"] = ela_res["secure_url"]
        
        # Upload face detection
        face_path = os.path.join(output_dir, f"{aid}_face.jpg")
        if os.path.exists(face_path):
            face_res = cloudinary.uploader.upload(face_path, folder="deeptrace")
            analysis_dict["images"]["face_detection"] = face_res["secure_url"]
            
        print("[DeepTrace] Cloudinary upload successful ✓")
        return analysis_dict
    except Exception as e:
        print(f"[DeepTrace] Cloudinary upload failed: {e}. Falling back to local URLs.")
        return analysis_dict
