from typing import List

from pydantic import BaseModel, Field 


class Reply(BaseModel):
    parent_id : str  = Field(...)
    reply_description : str = Field(None)
    photo_path : List[str]
    createdBy : str  = Field(...)
    
class ReplyUpdate(BaseModel):
    reply_description: str = Field(...)
    photo_path : List[str]
