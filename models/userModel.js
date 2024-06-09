import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { required: true, type: String, unique: true },
    email: { required: true, type: String, unique: true },
    gender: { required: true, type: String, enum: ["boy", "girl"], },
    profilePic: { required: true, type: String, default: "" },
    password: { required: true, type: String },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;