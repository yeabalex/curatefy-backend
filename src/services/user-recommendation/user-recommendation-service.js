const GetUser = require("../../utils/get-user-functions");
const UserModel = require("../../models/spotify-user-model");

class UserRecommendationService extends GetUser {
  spotifyId;
  constructor(spotifyId) {
    super({
      spotifyId: spotifyId,
    });
    this.spotifyId = spotifyId;
  }
  async getRecommendation(limit = 10) {
    try {
      const user = await super.getUserBySpotifyID();
      const userGenrePreferences = user.preferences.genres;
      const userFavArtists = user.preferences.favoriteArtists;
      const similarUsers = await UserModel.find({
        spotifyId: { $ne: this.spotifyId },
        $or: [
          {
            "preferences.genres": { $elemMatch: { $in: userGenrePreferences } },
          },
          {
            "preferences.favoriteArtists": {
              $elemMatch: { $in: userFavArtists },
            },
          },
        ],
      })
        .select("preferences image spotifyId displayName")
        .limit(limit);

      return {
        similarUsers: similarUsers.map((similarUser) => ({
          preferences: similarUser.preferences,
          image: similarUser.image,
          spotifyId: similarUser.spotifyId,
          displayName: similarUser.displayName,
          matchingGenres: similarUser.preferences.genres.filter((genre) =>
            userGenrePreferences.includes(genre)
          ),
          matchingArtists: similarUser.preferences.favoriteArtists.filter(
            (artist) => userFavArtists.includes(artist)
          ),
        })),
      };
    } catch (err) {
      console.error("Error in getRecommendation:", err);
      throw err;
    }
  }
}

module.exports = UserRecommendationService;
