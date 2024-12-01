const express = require("express");
const UserController = require("../controllers/user/user-controllers");
const authUser = require("../middleware/spotify-user-auth");

const userRoute = express.Router();

userRoute.post("/user/update", authUser, UserController.updateFields);

module.exports = userRoute;
