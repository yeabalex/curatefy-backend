const axios = require("axios");

async function getProfile(accessToken) {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spotify API error:", response.status, errorText);
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log("Profile data:", data);
    return data;
  } catch (err) {
    //console.error("Error in getProfile function:", err);
    throw err;
  }
}

module.exports = getProfile;
