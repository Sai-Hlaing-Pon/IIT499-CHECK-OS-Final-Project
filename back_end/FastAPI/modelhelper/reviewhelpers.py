from datetime import datetime
from bson.objectid import ObjectId

def id_to_string(uids):
    to_return = []
    for uid in uids:
        to_return.append(str(uid))
    return to_return


def helperReview(review):
    return {
        "shop_id" : ObjectId(review["shop_id"]),
        "rating": review["rating"],
        "review_description" : review["review_description"],
        "photo_path": (review["photo_path"] if "photo_path" in review else []),
        "helpful": [],
        "unhelpful": [],
        "isupdated": False,
        "createdByName": review["createdByName"],
        "createdBy": ObjectId(review["createdBy"]),
        "createdAt" : datetime.now(),
    }

def helperReviewDisplay(review):
    return {
        "id" : str(review["_id"]),
        "shop_id" : str(review["shop_id"]),
        "rating": review["rating"],
        "review_description" : review["review_description"],        
        "photo_path": review["photo_path"],
        "helpful": id_to_string(review["helpful"]),
        "unhelpful": id_to_string(review["unhelpful"]),
        "replies" : (review["replies"] if "replies" in review else []),
        "isupdated": review["isupdated"],
        "createdByName": (review["createdByName"] if "createdByName" in review else "unknown"),
        "createdBy": str(review["createdBy"]),
        "createdAt" : review["createdAt"],
    }