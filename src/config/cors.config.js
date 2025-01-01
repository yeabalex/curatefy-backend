const corsOptions = (req, callback) => {
  const whitelist = ["http://localhost:3000", "https://curatefy.vercel.app"];
  const origin = req.header("Origin");

  if (whitelist.includes(origin)) {
    callback(null, {
      origin: origin, 
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
    });
  } else {
    callback(null, { origin: false });
  }
};
