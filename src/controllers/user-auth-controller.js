const UserModel = require("../models/spotify-user-model");
const dotenv = require("dotenv");
const AccessToken = require("../services/access-token");
const getProfile = require("../services/user/user-profile");
const requestURL = require("../constants/request-url");
const redirectURL = require("../constants/redirect-url");
const redisClient = require("../config/redis.config");
dotenv.config();

async function redirect(req, res) {
  try {
    const code = req.query.code;
    const state = req.query.state;
    const error = req.query.error;

    if (error) {
      console.error("Spotify OAuth error:", error);
      return res.redirect(`${redirectURL}?error=${encodeURIComponent(error)}`);
    }

    if (await req.session.user) {
      
      return res.redirect(redirectURL);
    }

    if (!state || !code) {
      return res.redirect("/api/v1/login");
    }

    const token = await new AccessToken().requestAuthCodeToken(
      code,
      state,
      `${requestURL}/api/v1/redirect`
    );

    const userProfile = await getProfile(token);

    const userData = {
      displayName: userProfile.display_name,
      email: userProfile.email,
      spotifyId: userProfile.id,
      image: userProfile.images[0]?.url || null,
    };

    await handleUserData(req, userData);

    return res.redirect(redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.redirect(
      `${redirectURL}?error=${encodeURIComponent("Authentication failed")}`
    );
  }
}

async function handleUserData(req, userData) {
  req.session.user = userData;

  const existingUser = await UserModel.findOne({
    spotifyId: userData.spotifyId,
  });

  if (!existingUser) {
    const newUser = new UserModel(userData);
    await newUser.save();

    await redisClient.set(
      userData.spotifyId,
      JSON.stringify({
        has_completed_registration: false,
      })
    );
  }
}

async function status(req, res) {
  try {
    return await req.session.user ? res.sendStatus(200) : res.sendStatus(403);
  } catch (error) {
    console.error("Status check error:", error);
    return res.sendStatus(500);
  }
}

async function getUser(req, res) {
  try {
    return req.session.user ? res.json(req.session.user) : res.sendStatus(403);
  } catch (error) {
    console.error("Get user error:", error);
    return res.sendStatus(500);
  }
}

async function isNewUser(req, res) {
  try {
    if (!req.session.user?.spotifyId) {
      return res.status(403).send("User not authenticated");
    }


    const parsedData = JSON.parse(data);
    return res.json({ isNew: !parsedData.has_completed_registration });
  } catch (error) {
    console.error("New user check error:", error);
    return res.status(500).send("Internal server error");
  }
}

module.exports = { redirect, status, getUser, isNewUser };
