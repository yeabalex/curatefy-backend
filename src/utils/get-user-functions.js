const UserModel = require("../models/spotify-user-model");

class GetUser {
  user;
  constructor(user) {
    this.user = user;
  }

  async getUserBySpotifyID() {
    try {
      const foundUser = await UserModel.findOne({
        spotifyId: this.user.spotifyId,
      });
      if (!foundUser) {
        throw new Error("User Not Found");
      }
      return foundUser;
    } catch (err) {
      throw err;
    }
  }

  async getUserByObjectID() {
    try {
      const foundUser = await UserModel.findOne({
        _id: this.user.objectID,
      });
      if (!foundUser) {
        throw new Error("User Not Found");
      }
      return foundUser;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = GetUser;
