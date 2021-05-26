from datetime import datetime


def helperUser(Data):
    return {
        "displayName" : Data["displayName"],
        "email": Data["email"],
        "password": Data["password"],
        "emailVerified": False,
        "phoneNumber": (Data["phoneNumber"] if "phoneNumber" in Data else "https://www.seekpng.com/png/small/39-397336_user-android-user-icon.png"), 
        "photoURL": (Data["photoURL"] if "photoURL" in Data else ""), 
        "helpful": 0,
        "unhelpful": 0,
        "createdAt": datetime.now(),
    }

def helperUserDisplay(Data):
    return {
        "id" : str(Data["_id"]),
        "displayName" : Data["displayName"],
        "email": Data["email"],
        # "password": Data["password"],
        "emailVerified": False,
        "phoneNumber": Data["phoneNumber"],
        "photoURL": (Data["photoURL"] if Data["photoURL"] else 'https://www.seekpng.com/png/small/39-397336_user-android-user-icon.png'),
        "helpful": (Data["helpful"] if "helpful" in Data else 0),
        "unhelpful": (Data["unhelpful"] if "unhelpful" in Data else 0),
        "createdAt": str(Data["createdAt"]),
    }