const express = require("express");
const UserController = require("../controllers/user/user-controllers");

const userRoute = express.Router();

userRoute.post("/user/update", UserController.updateFields);

module.exports = userRoute;
