import exporess from "express";
import verify from "../verifyToken.js";
import Message from "../models/messageModel.js";
import cron from "node-cron";

const router = exporess.Router();

router.post("/send/:id", verify, async (req, res) => {
    try {
        const senderId = req.userExist._id;
        const receiverId = req.params.id;
        const content = req.body.content;

        const newMessage = new Message({
            senderId,
            receiverId,
            content,
        });

        await newMessage.save();

        res.status(200).json({status: "ok", msg: newMessage});

    } catch (err) {
        res.status(500).json({ error: "Cannot Send Message" });
    }
});

router.get('/:id', verify, async (req, res) => {
    try {
        const senderId = req.userExist._id;
        const receiverId = req.params.id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ]
        }).populate("senderId", "_id username email");

        res.status(200).json(messages);

    } catch (err) {
        res.status(500).json({ error: "Cannot Fetch Messages" });
    }
});

router.post('/edit/:msgId', verify, async (req, res) => {
    try {
        const msgId = req.params.msgId;
        const content = req.body.content;

        await Message.findByIdAndUpdate({ _id: msgId }, { content: content });

        res.status(200).json({ msg: "Message Edited" });

    } catch (err) {
        res.status(500).json({ error: "Cannot edit Message" });
    }
});

router.delete('/delete/:msgId', verify, async (req, res) => {
    try {
        const msgId = req.params.msgId;
        await Message.findByIdAndDelete(msgId);

        res.status(200).json({ msg: "Message Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Cannot delete Message" });
    }
});

router.delete('/delete/chat/:id', verify, async (req, res) => {
    try {
        const senderId = req.userExist._id;
        const receiverId = req.params.id;

        await Message.deleteMany({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
            ]
        }).then(() => {
            res.status(200).json({ msg: "Deleted all messages in the chat" });
        }).catch((err) => {

        });

    } catch (err) {
        res.status(500).json({ error: "Cannot delete the Messages" });
    }
});

cron.schedule('00 04 * * *', async () => {
    await Message.deleteMany({});
},{ 
    timezone: "Asia/Kolkata" 
});

export default router;