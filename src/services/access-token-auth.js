const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

async function requestAccessToken(code, state, redirect_uri) {
  // Check if state is null
  if (state === null) {
      throw new Error('State mismatch error');
  }

  try {
      const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code',
          }).toString(),
          {
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: 'Basic ' + btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
              }
          }
      );
      return response.data.access_token;
  } catch (err) {
      console.error(err);
      throw err; // Optionally throw the error to be handled elsewhere
  }
}



module.exports = requestAccessToken