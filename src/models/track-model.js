const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    trackName: { type: String, required: true },
    artists: [
      {
        name: { type: String, required: true },
        externalUrl: { type: String, required: true },
      },
    ],
    album: { type: String, required: true },
    duration: { type: Number, required: true },
    externalUrl: { type: String, required: true },
    previewUrl: { type: String },
    releaseDate: { type: Date, required: true },
    genres: { type: [String], default: [] },
    likes: {
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "SpotifyUsers" }],
    },
    comments: {
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
    },
    popularity: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Track", trackSchema);
