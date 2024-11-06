const dotenv = require("dotenv");

dotenv.config();

const requestURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "";

module.exports = requestURL;
