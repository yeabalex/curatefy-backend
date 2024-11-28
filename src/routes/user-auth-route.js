const express = require("express");
const {
  redirect,
  status,
  getUser,
  isNewUser,
} = require("../controllers/user-auth-controller");
const authUser = require("../middleware/spotify-user-auth");

const spotifyUserRoute = express.Router();

//spotifyUserRoute.get('/login', authUser)
spotifyUserRoute.get("/login", authUser, (req, res) => {
  res.redirect("http://localhost:3000/feed");
});
spotifyUserRoute.get("/redirect", redirect);
spotifyUserRoute.get("/status", status);
spotifyUserRoute.get("/get-user", getUser);
spotifyUserRoute.get("/new-user-status", isNewUser);

module.exports = spotifyUserRoute;
