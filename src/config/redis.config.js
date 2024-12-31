const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://nileredis-0cxykn.serverless.usw2.cache.amazonaws.com:6379",
});
redisClient
  .connect()
  .catch((err) => console.error("Redis connection error:", err));

module.exports = redisClient;
