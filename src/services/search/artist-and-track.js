const SpotifyRequest = require("../spotify-request");
const sqsFomater = require("../../utils/search-query-string");

class ArtistTrack extends SpotifyRequest {
  /**
   * Search for an artist by name
   * @param {string} name Artist name
   * @returns {Promise<Object>} Search results
   * @throws {Error} If the search fails
   */
  async searchArtistByName(name) {
    if (!name?.trim()) {
      throw new Error("Artist name is required and cannot be empty");
    }

    try {
      const formattedName = sqsFomater(name);
      const results = await super.makeSpotifyRequest("/search", {
        q: formattedName,
        type: "artist",
      });

      if (!results?.artists?.items) {
        throw new Error("Invalid response format from Spotify API");
      }

      return results;
    } catch (err) {
      throw new Error(`Failed to search artist: ${err.message}`);
    }
  }

  /**
   * Search for a track by name
   * @param {string} name Track name
   * @returns {Promise<Object>} Search results
   * @throws {Error} If the search fails
   */
  async searchTrackByName(name) {
    if (!name?.trim()) {
      throw new Error("Track name is required and cannot be empty");
    }

    try {
      const formattedName = sqsFomater(name);
      const results = await super.makeSpotifyRequest("/search", {
        q: formattedName,
        type: "track",
      });

      if (!results?.tracks?.items) {
        throw new Error("Invalid response format from Spotify API");
      }

      return results;
    } catch (err) {
      throw new Error(`Failed to search track: ${err.message}`);
    }
  }
}

module.exports = ArtistTrack;
