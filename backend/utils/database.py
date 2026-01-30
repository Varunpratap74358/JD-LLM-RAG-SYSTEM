import motor.motor_asyncio
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend/ or current dir
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

class MongoDatabase:
    def __init__(self):
        self.client = None
        self.db = None
        self.uri = os.getenv("MONGODB_URI")
        
    async def connect(self):
        if not self.client:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(self.uri)
            self.db = self.client.get_default_database()
            print("Connected to MongoDB Atlas")

    async def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB Atlas")

    async def insert_document(self, collection_name, data):
        collection = self.db[collection_name]
        result = await collection.insert_one(data)
        return str(result.inserted_id)

    async def get_document(self, collection_name, query):
        collection = self.db[collection_name]
        return await collection.find_one(query)

mongo_db = MongoDatabase()
