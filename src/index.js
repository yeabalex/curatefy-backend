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

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === "https://curatefy.vercel.app" || origin === "http://localhost:3000") {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  next();
});

app.use(cors(corsOptions));
app.set('trust proxy', 1)
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
      ttl: 86400,
    }),
    secret: "default_secret",
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
      secure: true,  
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'none',
      path: "/"
      //domain: '.vercel.app'
    },
  })
);

app.use((req, res, next) => {
  // Security Headers
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self' https://curatefy-backend-production.up.railway.app;"
  );
  
  // CORS Headers
  const origin = req.headers.origin;
  if (["http://localhost:3000", "https://curatefy.vercel.app"].includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers', 
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
  }
  
  next();
});

// Then use cors middleware
app.use(cors(corsOptions));
//routes 
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin === "https://curatefy.vercel.app" || origin === "http://localhost:3000") {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  res.sendStatus(204);
});
app.use("/api/v1", spotifyUserRoute);
app.use("/api/v1", postsRoute);
app.use("/api/v1", searchRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", userRecommendationRoute);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
module.exports = app;
