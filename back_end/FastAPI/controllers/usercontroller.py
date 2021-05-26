from .. import connection, hashing

from ..modelhelper import userhelper

from bson.objectid import ObjectId

from datetime import datetime

from passlib.context import CryptContext



pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def email_exixts(email):
    user_exist = True
    test = await connection.user_collection.count_documents({'email' : email})
    if await connection.user_collection.count_documents({'email' : email}) == 0:
        print("passed")
        user_exist = False
    return user_exist

async def add_user(data):
    hashedPassword = hashing.Hash.bcrypt(data["password"]) # pwd_cxt.hash(data["password"])    
    data["password"] = hashedPassword
    print("data: ", data)
    new_data = await connection.user_collection.insert_one(userhelper.helperUser(data))
    user_data = await connection.user_collection.find_one({"_id":new_data.inserted_id})
    return userhelper.helperUserDisplay(user_data)

async def get_user(id):
    reply = await connection.user_collection.find_one({"_id": ObjectId(id)})
    if reply:
        return userhelper.helperUserDisplay(reply)

async def delete_user(id):
    reply = await connection.user_collection.find_one({"_id": ObjectId(id)})
    if reply:
        await connection.user_collection.delete_one({"_id": ObjectId(id)})
        return True

async def update_user(id, data):
    reply = await connection.user_collection.find_one({"_id": ObjectId(id)})
    if reply:
        update_reply = await connection.user_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        return True
    return False