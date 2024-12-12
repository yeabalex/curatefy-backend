const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const s3Config = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  seceretAccessKey: process.end.AWS_SECERET_ACCESS_KEY,
  region: "us-west-2",
});

module.exports = { s3Config };
