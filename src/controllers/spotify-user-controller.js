const UserModel = require("../models/spotify-user-model");
const dotenv = require("dotenv");
const requestAccessToken = require("../services/access-token-auth");
const getProfile = require("../services/user-profile");

dotenv.config();

async function redirect(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const error = req.query.error || null;

  if (error) {
    return res.redirect("/");
  }

  if (state && code) {
    try {
      let userData = {};
      try {
        const token = await requestAccessToken(
          code,
          state,
          "http://localhost:3000/redirect"
        );
        //console.log(token);
        const userProfile = await getProfile(token);
        userData = {
          displayName: userProfile.display_name,
          email: userProfile.email,
          spotifyId: userProfile.id,
          image: userProfile.images[0] ? userProfile.images[0].url : null,
        };
      } catch (err) {
        return res.send(err.message);
      }
      //console.log(userProfile);
      if (userData) {
        req.session.user = userData;
        const getUserId = await UserModel.findOne({
          spotifyId: userData.spotifyId,
        });

        if (!getUserId) {
          const newUser = new UserModel({ ...userData });
          newUser.save();
        }
        return res.send("Logged in");
      }
    } catch (err) {
      console.error("Error during redirect:", err);
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
}

module.exports = { redirect };
