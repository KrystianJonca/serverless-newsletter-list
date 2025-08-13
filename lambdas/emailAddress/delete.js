const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.region });
const documentClient = DynamoDBDocumentClient.from(client);

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
    await documentClient.send(new DeleteCommand({
      TableName: process.env.tableName, 
      Key: { email }
    }));

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
