import mongoose from "mongoose";

const groupMessageModel = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const GroupMessage = mongoose.model("GroupMessage", groupMessageModel);
export default GroupMessage;

