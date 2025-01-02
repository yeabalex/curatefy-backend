const dotenv = require("dotenv");
const generateRandomString = require("../utils/generate-random-string");
const querystring = require("querystring");
dotenv.config();

async function authUser(req, res, next) {
  const state = generateRandomString(16);
  const scope = "user-read-email user-read-private";

  if (await req.session.user) {
    
    return next();
  }

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: "https://curatefy-backend-production.up.railway.app/api/v1/redirect",
        state: state,
      })
  );
}

module.exports = authUser;
