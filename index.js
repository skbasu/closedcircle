import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import usersRoute from "./routes/users.js"
import userInfoRoute from './routes/userInfo.js';
import friendsRoute from './routes/friends.js';
import messagesRoute from './routes/messages.js';
import groupesRoute from './routes/groups.js';
import { app, server } from "./socket/socket.js";

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();

//Middlewares
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/userinfo', userInfoRoute);
app.use('/api/v1/friends', friendsRoute);
app.use('/api/v1/messages', messagesRoute);
app.use('/api/v1/groups', groupesRoute);


const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
});

//Testing if everything is fine
app.get('/', (req, res) => {
    res.send("Everything is fine in closed circle");
});

//Connecting to mongodb
const URL = process.env.MONGO_URL
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    //console.log("MongoDb Connected...");
}).catch((err) => {
    //console.log("Error", err);
});
