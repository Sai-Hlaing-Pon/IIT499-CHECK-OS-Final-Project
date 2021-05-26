# from typing import Optional, List

from pydantic import BaseModel, Field, EmailStr

# from datetime import datetime

# from enum import Enum


class Login(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)


class User(BaseModel):
    displayName : str  = Field(...)
    email: EmailStr  = Field(...)
    password: str = Field(...)
    photoURL: str = Field(...)

# class UserUpdate(BaseModel):
#     displayName : str  = Field(...)
#     email: EmailStr  = Field(...)
#     password: str = Field(...)
#     photoURL: str = Field(...)

    


