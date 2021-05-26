from .. import connection

from ..modelhelper import replyhelper

from bson.objectid import ObjectId

from datetime import datetime


async def add_reply(review):
    new_review = await connection.reply_collection.insert_one(replyhelper.helperReply(review))
    review_data = await connection.reply_collection.find_one({"_id":new_review.inserted_id})
    return replyhelper.helperReplyDisplay(review_data)

async def get_reply(id):
    reply = await connection.reply_collection.find_one({"_id": ObjectId(id)})
    if reply:
        return replyhelper.helperReplyDisplay(reply)

async def get_related_replies(id) -> list:
    replies = []
    async for reply in connection.reply_collection.find({"parent_id": ObjectId(id)}):
        replies.append(replyhelper.helperReplyDisplay(reply))
    return replies

async def delete_reply(id):
    reply = await connection.reply_collection.find_one({"_id": ObjectId(id)})
    if reply:
        await connection.reply_collection.delete_one({"_id": ObjectId(id)})
        return True

async def update_reply(id, data):
    reply = await connection.reply_collection.find_one({"_id": ObjectId(id)})
    if reply:
        update_reply = await connection.reply_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if update_reply:
            update2_reply = await connection.reply_collection.update_one(
                {"_id": ObjectId(id)}, {"$set": {"isupdated": True, "createdAt": datetime.now()}}
            )
            if update2_reply:
                return True
        return False