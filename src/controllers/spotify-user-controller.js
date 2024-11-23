const UserModel = require("../models/spotify-user-model");
const dotenv = require("dotenv");
const AccessToken = require("../services/access-token");
const getProfile = require("../services/user/user-profile");
const requestURL = require("../constants/request-url");
const redirectURL = require("../constants/redirect-url");
const redisClient = require("../config/redis.config");

dotenv.config();

//let currUser = {};
async function redirect(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const error = req.query.error || null;

  if (error) {
    return res.redirect("http://localhost:3000");
  }

  if (await req.session.user) {
    return res.redirect(`${redirectURL}`);
  }

  if (state && code) {
    try {
      let userData = null;
      try {
        const token = await new AccessToken().requestAuthCodeToken(
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
        //currUser = userData;
        const getUserId = await UserModel.findOne({
          spotifyId: userData.spotifyId,
        });
        //console.log(userData);
        req.session.user = userData;
        if (!getUserId) {
          try {
            const newUser = new UserModel({ ...userData });
            await newUser.save();
            redisClient.set(
              userData.spotifyId,
              JSON.stringify({
                has_completed_registration: false,
              })
            );
          } catch (error) {
            res.send(error.message);
          }
        }

        return res.redirect(`${redirectURL}`);
      }
    } catch (err) {
      res.send(err.message);
    }
  } else {
    res.redirect("/api/v1/login");
  }
}

async function status(req, res) {
  return req.session.user ? res.sendStatus(200) : res.sendStatus(403);
}

async function getUser(req, res) {
  return req.session.user ? res.json(req.session.user) : null;
}

async function isNewUser(req, res) {
  try {
    const data = await redisClient.get(req.session.user.spotifyId);
    if (data) {
      const parsedData = JSON.parse(data);
      return res.send(!parsedData.has_completed_registration);
    } else {
      return res.send("Unkown Error");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = { redirect, status, getUser, isNewUser };
