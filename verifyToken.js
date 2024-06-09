import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verify = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ msg: "Access Denied" });
    try {
        const verifed = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userExist = verifed;
        next();
    } catch (err) {
        res.status(400).send({ msg: "Invalid Token" });
    }
}

export default verify;