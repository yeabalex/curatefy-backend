const dotenv = require("dotenv");

dotenv.config();

const requestURL =
  process.env.NODE_ENV === "development" ? "https://curatefy-backend-production.up.railway.app" : "https://curatefy-backend-production.up.railway.app";

module.exports = requestURL;
