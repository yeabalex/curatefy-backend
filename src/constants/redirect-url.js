const dotenv = require("dotenv");

dotenv.config();

const redirectURL =
  process.env.NODE_ENV === "development" ? "https://curatefy.vercel.app/feed" : "https://curatefy.vercel.app/feed";

module.exports = redirectURL;
