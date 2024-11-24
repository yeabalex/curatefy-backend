const ArtistTrack = require("../../services/search/artist-and-track");

class SearchController {
  async search(req, res) {
    try {
      const { name, type } = req.query;
      let result;

      const artistTrackService = new ArtistTrack();
      switch (type) {
        case "artist":
          result = await artistTrackService.searchArtistByName(name);
          break;

        case "track":
          result = await artistTrackService.searchTrackByName(name);
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Invalid search type",
            data: null,
          });
      }

      return res.status(200).json({
        success: true,
        message: `${type}s retrieved successfully`,
        data: result,
      });
    } catch (error) {
      console.error("Error in search:", error);
      return res.status(500).json({
        success: false,
        message: `Failed to search ${req.query.type}s`,
        error: error.message,
      });
    }
  }
}

module.exports = SearchController;
