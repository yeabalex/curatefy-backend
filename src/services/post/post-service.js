const mongoose = require("mongoose");
const S3Service = require("../aws/s3");
const PostModel = require("../../models/posts-model");
const GetUser = require("../../utils/get-user-functions");

class PostService {
  constructor() {
    this.s3Service = new S3Service();
  }

  async createPostAndUploadFile(userID, content, author, author_image, images) {
    try {
      const user = new GetUser({ spotifyId: userID });
      const userObjectID = (await user.getUserBySpotifyID())._id;

      const newPost = await PostModel.create({
        content,
        user: userObjectID,
        "author.author_name": author,
        "author.author_image": author_image,
        images: [],
        likes: { users: [] },
        comments: { items: [] },
      });

      const postID = newPost._id;

      const imageUrls = [];

      for (const img of images) {
        const { buffer, originalname, mimetype } = img;

        const imageUrl = await this.s3Service.uploadFile(
          userID,
          postID,
          buffer,
          originalname,
          mimetype
        );

        imageUrls.push(imageUrl);
      }

      await PostModel.updateOne(
        { _id: postID },
        { $set: { images: imageUrls } }
      );

      return {
        postID,
        images: imageUrls,
      };
    } catch (error) {
      console.error("Post creation failed:", error);
      throw new Error("Post creation unsuccessful");
    }
  }

  async deletePost(postID){
    try{
      const deletedPost = await PostModel.deleteOne({_id:postID})

      if(!deletedPost){
        throw new Error("No post found")
      }

      return deletedPost
    }catch(err){
      throw err
    }
  }

  async servePosts(){
    try{
      const posts = await PostModel.find().sort({ createdAt: -1 });

      console.log
      if(!posts){
        return "No posts available"
      }

      return JSON.stringify(posts)
    }catch(err){
      throw err
    }
  }
}

module.exports = PostService;
