const AWS = require('aws-sdk');
const { fromBuffer } = require('file-type');
const { v4 } = require('uuid');

const S3 = new AWS.S3();
const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];

const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body || !body.image || !body.mime) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            'Please provide valid image (jpeg, jpg, png) and mime in the request body.',
        }),
      };
    }
    if (!allowedMimes.includes(body.mime)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Please provide valid image format (jpeg, jpg, png)',
        }),
      };
    }
    let imageData = body.image;

    if (imageData.substr(0, 7) === 'base64,') {
      imageData = imageData.substr(7, imageData.length);
    }

    const buffer = Buffer.from(imageData, 'base64');
    const { ext, mime } = await fromBuffer(buffer);

    if (mime !== body.mime) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Mimes do not match',
        }),
      };
    }

    const id = v4();
    const key = `${id}.${ext}`;

    await S3.putObject({
      Body: buffer,
      Key: key,
      ContentType: mime,
      Bucket: 'serverless-newsletter-list-photos-s3-bucket',
      ACL: 'public-read',
    }).promise();

    const url = `https://serverless-newsletter-list-photos-s3-bucket.s3-eu-central-1.amazonaws.com/${key}`;
    console.log(key);
    return {
      statusCode: 200,
      body: JSON.stringify({ imageURL: url }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while uploading the image.' }),
    };
  }
};

module.exports = {
  handler,
};
