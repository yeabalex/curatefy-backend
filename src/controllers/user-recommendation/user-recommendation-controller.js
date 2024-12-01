const UserRecommendationService = require("../../services/user-recommendation/user-recommendation-service");

class UserRecommendationController {
  static async getUsers(req, res) {
    try {
      const userSpotifyId = await req.session.user.spotifyId;
      const userRecommendation = new UserRecommendationService(userSpotifyId);

      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
      const users = await userRecommendation.getRecommendation(limit);

      res.json(users);
    } catch (error) {
      console.error("Error in getUsers:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
}

module.exports = UserRecommendationController;
