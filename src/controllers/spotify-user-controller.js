const UserModel = require("../models/spotify-user-model");
const dotenv = require("dotenv");
const requestAccessToken = require("../services/access-token-auth");
const getProfile = require("../services/user-profile");
const requestURL = require("../constants/request-url");

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
      let userData = null;
      try {
        const token = await requestAccessToken(
          code,
          state,
          `${requestURL}/api/v1/redirect`
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
        const getUserId = await UserModel.findOne({
          spotifyId: userData.spotifyId,
        });
        //console.log(userData);
        req.session.user = userData;
        if (!getUserId) {
          try {
            const newUser = new UserModel({ ...userData });
            await newUser.save();
            return res.send("Logged in");
          } catch (error) {
            res.send(error.message);
          }
          return;
        }

        return res.sendStatus(200);
      }
    } catch (err) {
      res.send(err.message);
    }
  } else {
    res.redirect("/api/v1/login");
  }
}

module.exports = { redirect };
