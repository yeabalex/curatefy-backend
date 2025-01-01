const corsOptions = (req, callback) => {
  const whitelist = ["http://localhost:3000", "https://curatefy.vercel.app"];
  const origin = req.header("Origin");
  
  if (!origin) {
    return callback(null, { origin: false });
  }

  const options = {
    origin: whitelist.includes(origin) ? origin : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  
  callback(null, options);
};