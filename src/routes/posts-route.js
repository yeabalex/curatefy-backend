const express = require("express");
const authUser = require("../middleware/spotify-user-auth");
const PostsController = require("../controllers/posts-controller");
const PostValidationSchema = require("../validation/post-validation-schema");
const validate = require("../middleware/validate-fields");

const postsRoute = express.Router();

postsRoute.post(
  "/create",
  authUser,
  validate(PostValidationSchema.newPost),
  new PostsController().createPost
);

module.exports = postsRoute;
