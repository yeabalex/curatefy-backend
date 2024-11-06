const UserPosts = require("../models/posts-model");
const GetUser = require("../utils/get-user-functions");

class PostsController {
  async createPost(req, res) {
    try {
      const user = req.session.user;
      if (user) {
        const newPost = { ...req.body };
        let authorizedUserId = "";
        try {
          const getUser = new GetUser(user);
          authorizedUserId = (await getUser.getUserBySpotifyID())._id;
        } catch (err) {
          return res.send(err.message);
        }
        newPost.user = authorizedUserId;
        const createdPost = new UserPosts({ ...newPost });
        createdPost.save();
        res.json(newPost);
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      res.send(err.message);
    }
  }
}

module.exports = PostsController;
