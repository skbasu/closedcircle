import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

router.post('/register', async (req, res) => {
    const usernameExist = await User.findOne({ username: req.body.username });
    const emailExist = await User.findOne({ email: req.body.email });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    if(usernameExist){
        return res.status(400).json({err: "sameusername", msg: "Username is already taken" });
    } else if (emailExist){
        return res.status(400).json({err: "sameemail", msg: "Email already in use" });
    } else {
        try {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                gender: req.body.gender,
                profilePic: `https://avatar.iran.liara.run/public/${req.body.gender}`,
                password: hashed
            });
            await user.save();
            res.json({ status: "ok", user: user._id });
        } catch (err) {
            res.json({errorMsg: err.message });
        }
    }
});

router.post("/login", async (req, res) => {
    //Email exists or not
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist)
        return res.status(400).json({ err: "noemail", msg: "Email does not exist" });

    //Password correct or not
    const validPass = await bcrypt.compare(req.body.password, userExist.password);
    if (!validPass)
        return res.status(400).json({ err: "incpass", msg: "Incorrect Password" });

    //Create and assign a token
    const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).json({ status: "user exist", token: token, user: userExist });
});

export default router;