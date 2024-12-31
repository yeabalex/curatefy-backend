const corsOptions = (req, callback) => {
  const whitelist = ["http://localhost:3000", "https://curatefy.vercel.app"];
  const origin = req.header("Origin");

  const options = whitelist.includes(origin)
    ? { origin: true, credentials: true }
    : { origin: false };

  callback(null, options);
};

module.exports = corsOptions;
