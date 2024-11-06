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
    popularity: { type: mongoose.Schema.Types.Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.virtual("likeCount").get(function () {
  return this.likes.users.length;
});

postSchema.virtual("commentCount").get(function () {
  return this.comments.items.length;
});

module.exports = mongoose.model("UserPosts", postSchema);
