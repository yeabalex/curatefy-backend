const axios = require("axios");
const dotenv = require("dotenv");
const redisClient = require("../config/redis.config");

dotenv.config();

async function requestAccessToken(code, state, redirect_uri) {
  try {
    if (state === null) {
      throw new Error("State mismatch error");
    }
  } catch (err) {
    throw err;
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ),
        },
      }
    );
    return response.data.access_token;
  } catch (err) {
    //console.error("This token error");
    throw err;
  }
}

module.exports = requestAccessToken;
