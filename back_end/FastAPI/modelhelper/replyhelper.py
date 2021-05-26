from datetime import datetime

from bson.errors import BSONError
from bson.objectid import ObjectId
    
def helperReply(reply):
    return {
        "parent_id" : ObjectId(reply["parent_id"]),
        "reply_description" : reply["reply_description"],
        "photo_path": reply["photo_path"],
        "isupdated": False,
        "createdAt" : datetime.now(),
        "createdBy": ObjectId(reply["createdBy"])
    }

def helperReplyDisplay(reply):
    return {
        "id" : str(reply["_id"]),
        "parent_id" : str(reply["parent_id"]),
        "reply_description" : reply["reply_description"],
        "photo_path": reply["photo_path"],
        "isupdated": reply["isupdated"],
        "createdAt" : reply["createdAt"],
        "createdBy": str(reply["createdBy"])
    }