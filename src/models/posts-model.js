const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: { type: mongoose.Schema.Types.String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpotifyUsers",
      required: true,
    },
    images: [{ type: mongoose.Schema.Types.String }],
    likes: {
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "SpotifyUsers" }],
    },
    comments: {
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
    },
    hashTags: [{ type: mongoose.Schema.Types.String }],
    author: {
      author_name:{type: mongoose.Schema.Types.String, required: true},
      author_image:{type: mongoose.Schema.Types.String, required: true}
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("likeCount").get(function () {
  return this.likes.users.length;
});

postSchema.virtual("commentCount").get(function () {
  return this.comments.items.length;
});

postSchema.virtual("popularity").get(function () {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const postedInSeconds = Math.floor(this.createdAt.getTime() / 1000);
  const secondsSincePosted = nowInSeconds - postedInSeconds;

  return (
    this.likes.users.length +
    (this.comments.items.length * 1.2) / secondsSincePosted
  );
});

module.exports = mongoose.model("UserPosts", postSchema);
