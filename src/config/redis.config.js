const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://redis:6379",
});
redisClient
  .connect()
  .catch((err) => console.error("Redis connection error:", err));

module.exports = redisClient;
