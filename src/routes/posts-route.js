const express = require("express");
const authUser = require("../middleware/spotify-user-auth");
const {PostsController, upload} = require("../controllers/posts/posts-controller");
const ValidationSchemas = require("../validation/validation-schemas");
const ValidateFields = require("../middleware/validate-fields");

const postsRoute = express.Router();

postsRoute.post("/posts/create", authUser, upload.array("images", 4), new PostsController().createPost);
postsRoute.delete("/posts/delete", authUser, new PostsController().deletePost)

postsRoute.get("/posts", authUser, new PostsController().servePost);

module.exports = postsRoute;
