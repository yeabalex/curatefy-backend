const multer = require("multer");
const PostService = require("../../services/post/post-service");

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF files are allowed"), false);
    }
  },
});

class PostsController {
  constructor() {
    this.postService = new PostService();
    this.createPost = this.createPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.servePost = this.servePost.bind(this);
  }

  async createPost(req, res) {
    try {
      const { userID } = req.query;
      const { content, author, author_image } = req.body; 
      const images = req.files;


      if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
      }

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const result = await this.postService.createPostAndUploadFile(
        userID,
        content,
        author,
        author_image,
        images
      );

      return res.status(201).json({
        postID: result.postID,
        imageUrls: result.imageUrls,
      });
    } catch (error) {
      console.error("Post creation error:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  async deletePost(req,res){
    try{
      const {postID} = req.query
      if(!postID){
        return res.json({message: "post ID required"})
      }
      const deletedPost = await this.postService.deletePost(postID)
      return res.send(deletedPost)
    }catch(err){
      console.error(err)
    }
  }

  async servePost(req, res){
    try{
      const posts = await this.postService.servePosts()
      const parsedPosts = JSON.parse(posts)
      console.log(parsedPosts)
      return res.json({posts:parsedPosts})
    }catch(err){
      console.error(err)
    }
  }
}

module.exports = { PostsController, upload };
