from .. import connection

from ..modelhelper import shophelpers

from bson.objectid import ObjectId

from .reviewcontroller import get_shop_reviews

from .issuecontroller import get_shop_issues


async def add_shop(shop):
    print("at shop: ", shop)
    new_shop = await connection.shop_collection.insert_one(shophelpers.helperShop(shop))
    shop_data = await connection.shop_collection.find_one({"_id":new_shop.inserted_id})
    return shophelpers.helperShopDisplay(shop_data)

async def get_shop(id):
    shop = await connection.shop_collection.find_one({"_id": ObjectId(id)})
    if shop:
        shop["shop_reviews"] = await get_shop_reviews(id)
        shop["shop_issues"] = await get_shop_issues(id)
        return shophelpers.helperShopDisplay(shop)

async def get_shops() -> list:
    someshops = []
    async for shop in connection.shop_collection.find():
        shop["shop_reviews"] = await get_shop_reviews(str(shop["_id"]))
        shop["shop_issues"] = await get_shop_issues(str(shop["_id"]))
        someshops.append(shophelpers.helperShopDisplay(shop))
    return someshops

async def update_shop(id, data):
    shop = await connection.shop_collection.find_one({"_id": ObjectId(id)})
    if shop:
        update_shop = await connection.shop_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if update_shop:
            return True
        return False