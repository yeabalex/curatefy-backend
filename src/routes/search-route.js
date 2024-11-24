const express = require("express");
const SearchController = require("../controllers/search/search-controller");
const ValidateFields = require("../middleware/validate-fields");
const ValidationSchemas = require("../validation/validation-schemas");

const searchRoute = express.Router();

searchRoute.get(
  "/search",
  ValidateFields.validateReqQuery(ValidationSchemas.search),
  new SearchController().search
);

module.exports = searchRoute;
