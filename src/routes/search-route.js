const ArtistTrack = require("../services/search/artist-and-track");
const express = require("express");

const searchRoute = express.Router();

searchRoute.get("/artist", async (req, res) => {
  const result = await new ArtistTrack().searchArtistByName("Burna Boy");

  res.json(result);
});

module.exports = searchRoute;
