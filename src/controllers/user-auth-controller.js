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

    // Handle error from Spotify OAuth
    if (error) {
      console.error("Spotify OAuth error:", error);
      return res.redirect(`${redirectURL}?error=${encodeURIComponent(error)}`);
    }

    // Check if user is already logged in
    if (req.session.user) {
      return res.redirect(redirectURL);
    }

    // Validate required parameters
    if (!state || !code) {
      return res.redirect("/api/v1/login");
    }

    // Get access token and user profile
    const token = await new AccessToken().requestAuthCodeToken(
      code,
      state,
      `${requestURL}/api/v1/redirect`
    );

    const userProfile = await getProfile(token);

    // Prepare user data
    const userData = {
      displayName: userProfile.display_name,
      email: userProfile.email,
      spotifyId: userProfile.id,
      image: userProfile.images[0]?.url || null,
    };

    // Handle user session and database operations
    await handleUserData(req, userData);

    // Redirect to frontend
    return res.redirect(redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.redirect(
      `${redirectURL}?error=${encodeURIComponent("Authentication failed")}`
    );
  }
}

async function handleUserData(req, userData) {
  // Set session
  req.session.user = userData;

  // Check if user exists
  const existingUser = await UserModel.findOne({
    spotifyId: userData.spotifyId,
  });

  if (!existingUser) {
    // Create new user
    const newUser = new UserModel(userData);
    await newUser.save();

    // Set Redis data for new user
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

    const data = await redisClient.get(req.session.user.spotifyId);
    if (!data) {
      return res.status(404).send("User data not found");
    }

    const parsedData = JSON.parse(data);
    return res.json({ isNew: !parsedData.has_completed_registration });
  } catch (error) {
    console.error("New user check error:", error);
    return res.status(500).send("Internal server error");
  }
}

module.exports = { redirect, status, getUser, isNewUser };
