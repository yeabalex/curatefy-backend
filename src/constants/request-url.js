const dotenv = require("dotenv");

dotenv.config();

const requestURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

module.exports = requestURL;
