const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

class S3Service {
  s3;
  bucketName;
  region;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "us-west-2",
    });

    this.s3 = new AWS.S3();
    this.bucketName = "static-assets-crtfy";
    this.region = process.env.AWS_REGION || "us-west-2";
  }

  async uploadFile(userID, postID, file, fileName, contentType) {
    const key = `static/${userID}/${postID}/${fileName}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      console.log(`File successfully uploaded to ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      throw error;
    }
  }

  getPublicUrl(userID, postID, fileName) {
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/static/${userID}/${postID}/${fileName}`;
  }
}

module.exports = S3Service;
