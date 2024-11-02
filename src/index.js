const express = require("express");
const connectDB = require("./config/db.config");
const spotifyUserRoute = require("./routes/spotify-user-route");
const cookieParser = require("cookie-parser");
const RedisStore = require("connect-redis").default;
const session = require("express-session");
const redisClient = require("./config/redis.config");

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      ttl: 86400,
    }),
    secret: process.env.SESSION_SECRET || "default_secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(spotifyUserRoute);
app.get("/", (req, res) => {
  res.send("home");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
module.exports = app;
