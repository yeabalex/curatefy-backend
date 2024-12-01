const UserRecommendationController = require("../controllers/user-recommendation/user-recommendation-controller");
const authUser = require("../middleware/spotify-user-auth");
const express = require("express");

const userRecommendationRoute = express.Router();

userRecommendationRoute.get(
  "/recommendation/user",
  authUser,
  UserRecommendationController.getUsers
);

module.exports = { userRecommendationRoute };
