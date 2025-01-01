const corsOptions = (req, callback) => {
  const whitelist = ["http://localhost:3000", "https://curatefy.vercel.app"];
  const origin = req.header("Origin");
  if (!origin) {
    return callback(null, { origin: false });
  }
  const isWhitelisted = whitelist.includes(origin);
  const options = {
    origin: isWhitelisted ? origin : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Credentials', 
      'Access-Control-Allow-Origin'  
    ],
    exposedHeaders: ['Set-Cookie'], 
  };
  callback(null, options);
};