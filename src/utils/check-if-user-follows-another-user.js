//const { currUser } = require("../controllers/spotify-user-controller");
const GetUser = require("./get-user-functions");
const UserModel = require("../models/spotify-user-model");
const { currUser } = require("../controllers/user-auth-controller");

async function checkFollow(id) {
  try {
    const foundFollowing = await UserModel.findOne({ _id: id });
    if (!foundFollowing) {
      console.log("User not found");
      return 0;
    }

    const foundFollower = await new GetUser(currUser).getUserBySpotifyID();
    if (!foundFollower) {
      console.log("Current user not found");
      return 0;
    }

    const followSet = new Set(
      foundFollowing.followers.users.map((user) => user.toString())
    );

    return followSet.has(foundFollower._id.toString());
  } catch (err) {
    console.error(err);
    return 0;
  }
}

module.exports = checkFollow;
