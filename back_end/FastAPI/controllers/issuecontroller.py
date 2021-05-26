from .. import connection

from ..modelhelper import issuehelper

from bson.objectid import ObjectId

from datetime import datetime

from .replycontroller import get_related_replies


async def add_issue(issue):
    new_issue = await connection.issue_collection.insert_one(issuehelper.helperIssue(issue))
    issue_data = await connection.issue_collection.find_one({"_id":new_issue.inserted_id})
    return issuehelper.helperIssueDisplay(issue_data)

async def get_issue(id):
    issue = await connection.issue_collection.find_one({"_id": ObjectId(id)})
    if issue:
        issue["replies"] = await get_related_replies(id)
        return issuehelper.helperIssueDisplay(issue)

async def get_shop_issues(id) -> list:
    issues = []
    async for issue in connection.issue_collection.find({"shop_id": ObjectId(id)}):
        issues.append(issuehelper.helperIssueDisplay(issue))
    return issues

async def delete_issue(id):
    issue = await connection.issue_collection.find_one({"_id": ObjectId(id)})
    if issue:
        await connection.issue_collection.delete_one({"_id": ObjectId(id)})
        return True

async def update_issue(id, data):
    issue = await connection.issue_collection.find_one({"_id": ObjectId(id)})
    if issue:
        update_issue = await connection.issue_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        if update_issue:
            update2_issue = await connection.issue_collection.update_one(
                {"_id": ObjectId(id)}, {"$set": {"isupdated": True, "createdAt": datetime.now()}}
            )
            if update2_issue:
                return True
        return False

async def rate_issue(iid, uid, rate_type):
    issue = await connection.issue_collection.find_one({"_id": ObjectId(iid)})
    if issue:
        issue_owner = await connection.user_collection.find_one({"_id": issue["createdBy"]}) 
        helpful_rate = issue["helpful"]
        unhelpful_rate = issue["unhelpful"]
        if ObjectId(uid) in helpful_rate:
            helpful_rate.remove(ObjectId(uid))
            issue_owner["helpful"] = issue_owner["helpful"] - 1
        elif ObjectId(uid) in unhelpful_rate:
            unhelpful_rate.remove(ObjectId(uid))
            issue_owner["unhelpful"] = issue_owner["unhelpful"] - 1
        
        if rate_type == "helpful":
            helpful_rate.append(ObjectId(uid))
            issue_owner["helpful"] = issue_owner["helpful"] + 1
        elif rate_type == "unhelpful":
            unhelpful_rate.append(ObjectId(uid))
            issue_owner["unhelpful"] = issue_owner["unhelpful"] + 1

        update_issue = await connection.issue_collection.update_one(
            {"_id": ObjectId(iid)}, {"$set": {"helpful": helpful_rate, "unhelpful": unhelpful_rate}}
        )
        update_owner_data = await connection.user_collection.update_one(
            {"_id": issue["createdBy"]}, {"$set": issue_owner}
        )
        if update_issue and update_owner_data:
            return True
    return False
