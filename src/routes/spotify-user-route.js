const express = require("express");
const {
  redirect,
  status,
  getUser,
  isNewUser,
} = require("../controllers/spotify-user-controller");
const authUser = require("../middleware/spotify-user-auth");

const spotifyUserRoute = express.Router();

//spotifyUserRoute.get('/login', authUser)
spotifyUserRoute.get("/login", authUser, (req, res) => {
  res.redirect("http://localhost:3000/feed");
});
spotifyUserRoute.get("/redirect", authUser, redirect);
spotifyUserRoute.get("/status", authUser, status);
spotifyUserRoute.get("/get-user", authUser, getUser);
spotifyUserRoute.get("/new-user-status", authUser, isNewUser);

module.exports = spotifyUserRoute;
