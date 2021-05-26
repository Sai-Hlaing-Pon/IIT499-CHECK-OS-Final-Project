from typing import Optional

from fastapi import APIRouter, Body, status, Response

from fastapi.encoders import jsonable_encoder

from pydantic import BaseModel

from datetime import datetime

from .. import Schemas.schemas as Schemas

# from .Schemas import schemas

from .. import modelhelper.shophelpers as shophelpers

# from .modelhelper import shophelpers

from .. import controllers.shopcontroller as shopcontroller

# from .controllers import shopcontroller

import json
from .. import connection
from bson.objectid import ObjectId
from schematics.models import Model 
from schematics.types import StringType, EmailType, IntType, FloatType, BooleanType


class User(Model):
    user_id = ObjectId()
    user_name = StringType(required=True)
    email = EmailType(required=True)
    password = StringType(required=True)

def create_user(name, email, username, password):
    newuser.user_id = ObjectId()
    newuser.user_name = name
    newuser.email = email
    newuser.password = password

def email_exixts(email):
    user_exist = True

    if connection.user_collection.find(
        {'email' : email}
    ).count() == 0:
        user_exist = False
        return user_exist

def check_login_creds(email,password):
    if not email_exixts(email):
        activeuser = connection.user_collection.find(
            {'email' : email}
        )
        for user in activeuser:
            user = dict(user)

# async def add_shop(shop):
#     new_shop = await connection.shop_collection.insert_one(shophelpers.helperShop(shop))
#     shop_data = await connection.shop_collection.find_one({"_id":new_shop.inserted_id})
#     return shophelpers.helperShop(shop_data)

# async def get_shops(id) -> list:
#     someshops = []
#     async for shop in connection.shop_collection.find({"_id": ObjectId(id)}):
#         someshops.append(shophelpers.helperShop(shop))
#     return someshops

# app = FastAPI()
router = APIRouter()

@router.post("/shop",response_description="Shop data added into the database", status_code=status.HTTP_201_CREATED)
async def create_shop(req: schemas.Shop = Body(...)):
    shop = jsonable_encoder(req)
    shop_data = await shopcontroller.add_shop(shop)
    return shop_data


@router.get("/shop/{id}", status_code=status.HTTP_200_OK)
async def get_shop(id, response: Response):
    shop = await shopcontroller.get_shops(id)
    # someshops = []
    # async for shop in connection.shop_collection.find({"_id": ObjectId(id)}):
    #     someshops.append(shophelpers.helperShop(shop))
    # return someshops

    # shop_data = await connection.shop_collection.find({"_id": id})
    # if not shop_data:
    #     response.status_code = status.HTTP_404_NOT_FOUND
    #     return {"detail":f"data not found for shop id {id}"}
    # print("ld: ",shop_data)
    return shop