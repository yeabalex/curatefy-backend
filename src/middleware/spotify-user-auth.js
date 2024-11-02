const dotenv = require("dotenv");
const generateRandomString = require("../utils/generate-random-string");
const querystring = require("querystring");
const requestAccessToken = require("../services/access-token-auth");
const getProfile = require("../services/user-profile");
dotenv.config();

async function authUser(req, res, next) {
  const state = generateRandomString(16);
  const scope = "user-read-email user-read-private";

  if (await req.session.user) {
    return res.send("Logged in session");
  }

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: "http://localhost:3000/redirect",
        state: state,
      })
  );
}

module.exports = authUser;
