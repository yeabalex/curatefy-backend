const express = require("express");
const authUser = require("../middleware/spotify-user-auth");
const PostsController = require("../controllers/posts-controller");
const ValidationSchemas = require("../validation/validation-schemas");
const ValidateFields = require("../middleware/validate-fields");

const postsRoute = express.Router();

postsRoute.post(
  "/create",
  authUser,
  ValidateFields.validateReqBody(ValidationSchemas.newPost),
  new PostsController().createPost
);

postsRoute.get("/allPosts", PostsController.servePosts);

module.exports = postsRoute;
