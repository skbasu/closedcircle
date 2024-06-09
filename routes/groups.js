import express from "express";
import verify from "../verifyToken.js";
import Group from "../models/groupModel.js"
import GroupMessage from "../models/groupMessageModel.js";
import cron from "node-cron";

const router = express.Router();

router.post("/create", verify, async (req, res) => {
    const randNumber = Math.floor((Math.random() * 1000000000) + 1);
    try {
        const loggedInUserId = req.userExist._id;
        const groupname = req.body.groupname;
        const newGroup = new Group({
            groupname: groupname,
            groupPic: `https://api.multiavatar.com/${randNumber}.svg`,
            createdBy: loggedInUserId,
            members: [loggedInUserId],
        });
        await newGroup.save();
        res.status(200).json({status: "created", msg: newGroup});

    } catch (err) {
        res.status(500).json({ status: "notcreated", error: "Cannot Create Group" });
    }
});

router.post('/add/:grpId/:id', verify, async (req, res) => {
    try {
        const grpId = req.params.grpId;
        const id = req.params.id;

        await Group.findByIdAndUpdate(grpId, {
            $addToSet: { members: id }
        });
        res.status(200).json({ status: "added", msg: `${id} is added to the group` });
    } catch (err) {
        res.status(500).json({ status: "notadded", error: "Cannot Add to the Group" });
    }
});

router.get('/', verify, async (req, res) => {
    try {
        const loggedInUserId = req.userExist._id;
        const groupsOfLoggedInUser = await Group.find({ members: loggedInUserId })
            .populate("createdBy", "_id username");

        res.status(200).json(groupsOfLoggedInUser);
    } catch (err) {
        res.status(500).json({ error: "Cannot Fetch Groups" });
    }
});

router.post("/send/:groupID", verify, async (req, res) => {
    try {
        const groupID = req.params.groupID;
        const loggedInUserId = req.userExist._id;
        const content = req.body.content;

        const newGroupMsg = new GroupMessage({
            groupId: groupID,
            senderId: loggedInUserId,
            content: content
        });
        await newGroupMsg.save();
        res.status(200).json({status: "ok", msg: newGroupMsg});

    } catch (err) {
        res.status(500).json({ error: "Cannot Send Message to the Group" });
    }
});

router.get('/getmsg/:groupID', verify, async (req, res) => {
    try {
        const groupID = req.params.groupID;
        
        const grpMesgs = await GroupMessage.find({ groupId: groupID })
            .populate("senderId", "_id username email");

        res.status(200).json(grpMesgs);

    } catch (err) {
        res.status(500).json({ error: "Cannot Get the Messages of the Group" });
    }
});

router.post('/edit/:msgId', verify, async (req, res) => {
    try {
        const msgId = req.params.msgId;
        const content = req.body.content;

        await GroupMessage.findByIdAndUpdate({ _id: msgId }, { content: content });

        res.status(200).json({ msg: "Message Edited" });

    } catch (err) {
        res.status(500).json({ error: "Cannot edit Message" });
    }
});

router.delete('/delete/:msgId', verify, async (req, res) => {
    try {
        const msgId = req.params.msgId;
        await GroupMessage.findByIdAndDelete(msgId);

        res.status(200).json({ msg: "Message Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Cannot delete Message" });
    }
});

router.get('/members/:grpId', verify, async (req, res) => {
    try {
        const grpId = req.params.grpId;
        const grpmembers = await Group.findById(grpId)
        .populate("members", "_id username profilePic");
        res.status(200).json({ status: "fetchedmembers", grpmembers: grpmembers });
    } catch (err) {
        res.status(500).json({ error: "Cannot delete Message" });
    }

});

cron.schedule('00 04 * * *', async () => {
    await GroupMessage.deleteMany({});
},{ 
    timezone: "Asia/Kolkata" 
});

export default router;