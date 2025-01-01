const corsOptions = (req, callback) => {
  const whitelist = new Set(["http://localhost:3000", "https://curatefy.vercel.app"]);
  const origin = req.header("Origin");
  
  if (!origin || !whitelist.has(origin)) {
    callback(new Error('Not allowed by CORS'));
    return;
  }

  callback(null, {
    origin: origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie']
  });
};

module.exports = corsOptions;