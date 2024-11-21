const dotenv = require("dotenv");

dotenv.config();

const redirectURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000/feed" : "";

module.exports = redirectURL;
