# from pymongo import MongoClient
import motor.motor_asyncio
from . import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_DETAILS)

database = client.ReviewCollectionWebsite

shop_collection = database.get_collection("Shops")
review_collection = database.get_collection("Reviews")
issue_collection = database.get_collection("Issues")
reply_collection = database.get_collection("Replies")
user_collection = database.get_collection("Users")
