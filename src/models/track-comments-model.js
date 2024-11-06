const mongoose = require("mongoose");

const trackCommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpotifyUser",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TrackComment",
        default: [],
      },
    ],
    likes: {
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrackComment", trackCommentSchema);
