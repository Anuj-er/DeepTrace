import os
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId

# Database connection configuration
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017')
try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
    db = client['deeptrace']
except Exception as e:
    print(f"[DeepTrace] MongoDB connection initialization notice: {e}")
    client = None
    db = None

def get_db():
    """Returns the database instance."""
    return db

def init_db():
    """Creates necessary indexes for the database collections."""
    if db is not None:
        try:
            db.users.create_index('email', unique=True)
        except Exception as e:
            print(f"[DeepTrace] MongoDB index creation warning: {e}")

def create_user(name, email, hashed_password):
    """Inserts a new user and returns the user dict with a string ID."""
    user_doc = {
        'name': name,
        'email': email,
        'hashed_password': hashed_password,
        'created_at': datetime.utcnow()
    }
    result = db.users.insert_one(user_doc)
    user_doc['_id'] = str(result.inserted_id)
    return user_doc

def get_user_by_email(email):
    """Retrieves a user by email, converting the ObjectId to a string."""
    user = db.users.find_one({'email': email})
    if user:
        user['_id'] = str(user['_id'])
    return user

def get_user_by_id(user_id):
    """Retrieves a user by their ID, converting it back to a string."""
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        return None
        
    user = db.users.find_one({'_id': obj_id})
    if user:
        user['_id'] = str(user['_id'])
    return user

def save_analysis(analysis_data, user_id, file_name):
    """Saves a new analysis result to the database."""
    # Ensure analysis_id is provided, otherwise generate one
    analysis_id = analysis_data.get('id') or analysis_data.get('analysis_id')
    if not analysis_id:
        analysis_id = str(ObjectId())

    analysis_doc = {
        '_id': analysis_id,
        'user_id': user_id,
        'verdict': analysis_data.get('verdict'),
        'confidence': analysis_data.get('confidence'),
        'risk_level': analysis_data.get('risk_level'),
        'face_detection': analysis_data.get('face_detection', {}),
        'ela': analysis_data.get('ela', {}),
        'metadata': analysis_data.get('metadata', {}),
        'images': analysis_data.get('images', {}),
        'scores': analysis_data.get('scores', {}),
        'file_name': file_name,
        'created_at': datetime.utcnow()
    }
    db.analyses.insert_one(analysis_doc)
    return analysis_doc

def get_analyses_by_user(user_id, verdict_filter=None, sort='newest'):
    """Returns a list of analyses for a specific user, optionally filtered and sorted."""
    query = {'user_id': user_id}
    if verdict_filter:
        query['verdict'] = verdict_filter
        
    sort_order = -1 if sort == 'newest' else 1
    
    cursor = db.analyses.find(query).sort('created_at', sort_order)
    analyses = []
    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        analyses.append(doc)
    return analyses

def get_analysis_by_id(analysis_id):
    """Retrieves a specific analysis by its string ID."""
    doc = db.analyses.find_one({'_id': analysis_id})
    if not doc:
        # Fallback check just in case it was accidentally inserted as an ObjectId in the past
        try:
            doc = db.analyses.find_one({'_id': ObjectId(analysis_id)})
        except Exception:
            pass

    if doc:
        doc['_id'] = str(doc['_id'])
    return doc
