from .. import connection

from ..modelhelper import shophelpers, reviewhelpers

from bson.objectid import ObjectId

from datetime import datetime

from .replycontroller import get_related_replies


async def add_review(review):
    new_review = await connection.review_collection.insert_one(reviewhelpers.helperReview(review))
    shopRatingUpdate = await connection.shop_collection.find_one({"_id": ObjectId(review["shop_id"])})
    shopRatingUpdate["shop_rating"] = shopRatingUpdate["shop_rating"] + review["rating"]
    ratingUpdate = await connection.shop_collection.update_one(
        {"_id": ObjectId(review["shop_id"])}, {"$set": shopRatingUpdate}
    )
    if ratingUpdate:
        review_data = await connection.review_collection.find_one({"_id":new_review.inserted_id})
        return reviewhelpers.helperReviewDisplay(review_data)

async def get_review(id):
    review = await connection.review_collection.find_one({"_id": ObjectId(id)})
    if review:
        review["replies"] = await get_related_replies(id)
        print("review: ",review)
        return reviewhelpers.helperReviewDisplay(review)


async def get_shop_reviews(id) -> list:
    reviews = []
    async for review in connection.review_collection.find({"shop_id": ObjectId(id)}):
        print("here: ", review)
        reviews.append(reviewhelpers.helperReviewDisplay(review))
    return reviews

async def delete_review(id):
    review = await connection.review_collection.find_one({"_id": ObjectId(id)})
    if review:
        await connection.review_collection.delete_one({"_id": ObjectId(id)})
        return True

async def update_review(id, data):
    review = await connection.review_collection.find_one({"_id": ObjectId(id)})
    oldRating = review["rating"]
    if review:
        update_review = await connection.review_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        shopRatingUpdate = await connection.shop_collection.find_one({"_id": ObjectId(review["shop_id"])})
        shopRatingUpdate["shop_rating"] = shopRatingUpdate["shop_rating"] - oldRating + data["rating"]
        ratingUpdate = await connection.shop_collection.update_one(
            {"_id": ObjectId(review["shop_id"])}, {"$set": shopRatingUpdate}
        )
        if ratingUpdate:
            if update_review:
                update2_review = await connection.review_collection.update_one(
                    {"_id": ObjectId(id)}, {"$set": {"isupdated": True, "createdAt": datetime.now()}}
                )
                if update2_review:
                    return True
            return False

async def rate_review(rid, uid, rate_type):
    review = await connection.review_collection.find_one({"_id": ObjectId(rid)})
    if review:
        review_owner = await connection.user_collection.find_one({"_id": ObjectId(review["createdBy"])})        
        helpful_rate = review["helpful"]
        unhelpful_rate = review["unhelpful"]
        if ObjectId(uid) in helpful_rate:
            helpful_rate.remove(ObjectId(uid))
            review_owner["helpful"] = review_owner["helpful"] - 1
        elif ObjectId(uid) in unhelpful_rate:
            unhelpful_rate.remove(ObjectId(uid))
            review_owner["unhelpful"] = review_owner["unhelpful"] - 1
        print("review_owner: ", review_owner)
        if rate_type == "helpful":
            helpful_rate.append(ObjectId(uid))
            review_owner["helpful"] = review_owner["helpful"] + 1
        elif rate_type == "unhelpful":
            unhelpful_rate.append(ObjectId(uid))
            review_owner["unhelpful"] = review_owner["unhelpful"] + 1
        print("review_owner1: ", review_owner)
        update_review = await connection.review_collection.update_one(
            {"_id": ObjectId(rid)}, {"$set": {"helpful": helpful_rate, "unhelpful": unhelpful_rate}}
        )
        update_owner_data = await connection.user_collection.update_one(
            {"_id": review["createdBy"]}, {"$set": review_owner}
        )
        if update_review and update_owner_data:
            return True
    return False
        
        
        