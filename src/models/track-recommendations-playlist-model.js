const mongoose = require("mongoose");

const recommendedTracksPlaylistSchema = new mongoose.Schema({
  playlistName: {
    type: mongoose.Schema.Types.String,
    default: "My Playlist",
    required: true,
  },
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Track", default: [] }],
  description: { type: mongoose.Schema.Types.String, default: "" },
});

module.exports = mongoose.model(
  "RecommendedTracksPlaylist",
  recommendedTracksPlaylistSchema
);
