import express from "express";
import verify from "../verifyToken.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/add/:id", verify, async (req, res) => {
    try {
        const id = req.params.id;
        const loggedInUserId = req.userExist._id;

        await User.findByIdAndUpdate(loggedInUserId, {
            $addToSet: { friends: id },
        });

        await User.findByIdAndUpdate(id, {
            $addToSet: { friends: loggedInUserId },
        });

        res.status(200).json({status: "ok", msg: "Friend Added" });
    } catch (err) {
        res.status(500).json({ status: "notok", msg: "Error Adding Friend" });
    }
});

router.get("/", verify, async (req, res) => {
    try {
        const loggedInUserId = req.userExist._id;
        const loggedInUsersFriends = await User
            .findById(loggedInUserId)
            .populate(
                "friends",
                "username _id email profilePic gender",
            )
        res.status(200).json(loggedInUsersFriends.friends);

    } catch (err) {
        res.status(500).json({ msg: "Error Fetching Friends" });
    }
});

export default router;