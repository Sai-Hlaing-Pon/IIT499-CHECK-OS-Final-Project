from datetime import timedelta
from .. import hashing, connection, settings
from fastapi import APIRouter, Depends, status, HTTPException, Body
from fastapi.security import OAuth2PasswordRequestForm
from ..Schemas import userschemas
from ..modelhelper import userhelper
from ..controllers import tokencontroller
from jose import JWTError, jwt
# from pydantic import BaseModel, Field, EmailStr


router = APIRouter(tags=['Authentication'])


def helperUserDisplay(Data):
    return {
        "id" : str(Data["_id"]),
        "displayName" : Data["displayName"],
        "email": Data["email"],
        # "password": Data["password"],
        "emailVerified": False,
        "phoneNumber": Data["phoneNumber"],
        "photoURL": "", 
        "createdAt": str(Data["createdAt"]),
    }


@router.post('/login')
async def login(request: userschemas.Login = Body(...)):
# def login(request: OAuth2PasswordRequestForm = Depends()):
    user = await connection.user_collection.find_one({"email":request.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email:{request.email} not exist.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not hashing.Hash.verify(user["password"], request.password):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Incorrect password",
            headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = tokencontroller.create_access_token(
        data=userhelper.helperUserDisplay(user), expires_delta=access_token_expires
    )
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # username: str = payload.get("user")
        if payload is None:
            raise credentials_exception
        # token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    # user = get_user(fake_users_db, username=token_data.username)
    # if user is None:
    #     raise credentials_exception
    # return payload
    return {"access_token": access_token, "token_type": "bearer", "user_data": payload}
    

@router.get("/users/me/")
async def read_users_me(current_user = Depends(tokencontroller.get_current_active_user)):
    return current_user
