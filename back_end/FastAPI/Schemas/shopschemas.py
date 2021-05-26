from typing import Optional, List

from pydantic import BaseModel, Field 

from datetime import datetime

from enum import Enum


class Shopcatagory(str, Enum):
    Clothing = "Clothing"
    Electronic = "Electronic"
    Shoes = "Shoes"
    Tools = "Tools"
    Cosmatic = "Cosmatic"
    Others = "Others"

class Shop(BaseModel):
    shop_name : str  = Field(...)
    shop_logo : str = Field(...)
    # shop_catagory: Shopcatagory  = Field(...)
    shop_description : str = Field(...)
    # shop_url : List[str]  = Field(...)
    createdBy : str  = Field(...)
    
class ShopUpdate(BaseModel):    
    shop_catagory: Shopcatagory
    shop_description: str = Field(...)
    shop_url : List[str]


