const GetUser = require("../../utils/get-user-functions");
const UserService = require("../../services/user/user-service");

class UserController {
  async getUser(req, res) {
    try {
      const user = new GetUser(req.session.user);

      const userData = await user.getUserBySpotifyID(spotifyUserId);
      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(userData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateFields(req, res) {
    try {
      const { field } = await req.query;
      const validFields = ["followers", "following", "preferences"];

      if (!validFields.includes(field)) {
        return res.status(400).json({ error: "Invalid field to update" });
      }

      const updateData = req.body;
      if (!updateData) {
        return res.status(400).json({ error: "No data provided for update" });
      }

      const user = new GetUser(await req.session.user);
      const userID = (await user.getUserBySpotifyID())._id;

      const spotifyId = await req.session.user.spotifyId;
      const result = await UserService.updateUserField(
        userID,
        field,
        updateData,
        spotifyId
      );

      if (!result) {
        return res
          .status(404)
          .json({ error: "User not found or update failed" });
      }

      return res
        .status(200)
        .json({ message: "User field updated successfully", data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
