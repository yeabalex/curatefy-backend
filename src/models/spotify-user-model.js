const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    spotifyId: { type: String, required: true, unique: true },
    followers: {
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SpotifyUser",
          default: [],
          unique: true,
        },
      ],
    },
    following: {
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SpotifyUser",
          default: [],
          unique: true,
        },
      ],
    },
    image: { type: String },
    preferences: {
      genres: {
        type: [{ type: String }],
        default: [],
        validate: [arrayLimit, "Exceeds the limit of genres"],
      },
      favoriteArtists: {
        type: [{ type: String }],
        default: [],
        validate: [arrayLimit, "Exceeds the limit of favorite artists"],
      },
      favoriteTracks: {
        type: [{ type: String }],
        default: [],
        validate: [arrayLimit, "Exceeds the limit of favorite tracks"],
      },
    },
    posts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "UserPosts", default: [] },
    ],
    handle: {
      type: mongoose.Schema.Types.String,
      unique: true,
    },
    verifiedArtist: {
      isVerifiedArtist: { type: mongoose.Schema.Types.String },
      pinnedMessage: { type: mongoose.Schema.Types.String },
    },
  },
  { timestamps: true }
);

userSchema.virtual("followerCount").get(function () {
  return this.followers.users.length;
});

userSchema.virtual("followingCount").get(function () {
  return this.following.users.length;
});

function arrayLimit(val) {
  return val.length <= 5;
}

userSchema.pre("save", async function (next) {
  if (!this.handle) {
    this.handle = this.spotifyId;
  }
  next();
});
module.exports = mongoose.model("SpotifyUser", userSchema);
