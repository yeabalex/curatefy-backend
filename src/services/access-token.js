const axios = require("axios");
const dotenv = require("dotenv");
const redisClient = require("../config/redis.config");
dotenv.config();

class AccessToken {
  async requestAuthCodeToken(code, state, redirect_uri) {
    if (!code || !redirect_uri) {
      throw new Error("Missing required parameters");
    }

    if (!state) {
      throw new Error("State mismatch error");
    }

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          code,
          redirect_uri,
          grant_type: "authorization_code",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        }
      );
      return response.data.access_token;
    } catch (err) {
      throw new Error(`Failed to request auth code token: ${err.message}`);
    }
  }

  async requestClientCredentialsToken() {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        `Failed to request client credentials token: ${err.message}`
      );
    }
  }

  async storeAccessToken() {
    try {
      const resData = await this.requestClientCredentialsToken();

      await redisClient.set(
        "token",
        JSON.stringify({ access_token: resData.access_token }),
        "EX",
        3600
      );
    } catch (err) {
      throw new Error(`Failed to store access token: ${err.message}`);
    }
  }

  async getAccessToken() {
    try {
      const token = await redisClient.get("token");
      if (!token) {
        return JSON.parse(token);
      }

      await this.storeAccessToken();
      const newToken = await redisClient.get("token");
      return JSON.parse(newToken);
    } catch (err) {
      throw new Error(`Failed to get access token: ${err.message}`);
    }
  }
}

module.exports = AccessToken;
