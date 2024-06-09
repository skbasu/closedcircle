import mongoose from "mongoose";

const groupModel = new mongoose.Schema({
    groupname: {
        required: true,
        type: String,
    },
    groupPic: {
        required: true,
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],

}, { timestamps: true });

const Group = mongoose.model("Group", groupModel);
export default Group;