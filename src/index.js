const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//config
const connectDB = require("./config/db.config");
const RedisStore = require("connect-redis").default;
const redisClient = require("./config/redis.config");
const dotenv = require("dotenv");
const cors = require("cors");
const corsOptions = require("./config/cors.config");

//routes
const spotifyUserRoute = require("./routes/user-auth-route");
const postsRoute = require("./routes/posts-route");
const searchRoute = require("./routes/search-route");
const userRoute = require("./routes/user-route");
const { userRecommendationRoute } = require("./routes/recommendation-route");

dotenv.config();
const app = express();
const PORT = 3001;

connectDB();
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      ttl: 86400,
    }),
    secret: "default_secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none',
      domain:'.vercel.app'
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

//routes v1
app.use("/api/v1", spotifyUserRoute);
app.use("/api/v1", postsRoute);
app.use("/api/v1", searchRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", userRecommendationRoute);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
module.exports = app;
