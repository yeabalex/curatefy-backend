const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_CLIENT,
});
redisClient
  .connect()
  .catch((err) => console.error("Redis connection error:", err));

module.exports = redisClient;
