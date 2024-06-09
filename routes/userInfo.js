import express from "express";
import verify from "../verifyToken.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get('/:id', verify, async (req, res) => {
    try {
        const id = req.params.id;
        const details = await User.findById(id);
        if(details){
            res.json({ status: "yes", user: details });
        }
    } catch (err) {
        res.json({ status: "no", msg: "User not present" });
    }
});

export default router;