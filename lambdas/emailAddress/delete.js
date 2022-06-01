const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const validateEmail = (email) => {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(regexEmail)) return true;
  else return false;
};

const handler = async (event) => {
  const { email } = event.queryStringParameters;
  if (!email || !validateEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Please provide valid email in the url.',
      }),
    };
  }

  try {
    await documentClient
      .delete({ TableName: process.env.tableName, Key: { email } })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email deleted.' }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while deleting the email.' }),
    };
  }
};

module.exports = {
  handler,
};
