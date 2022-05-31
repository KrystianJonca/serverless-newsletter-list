const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const validateEmail = (email) => {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(regexEmail)) return true;
  else return false;
};

const handler = async (event) => {
  const { email } = JSON.parse(event.body);

  if (!email || !validateEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Please provide valid email in the request body.',
      }),
    };
  }

  const createdAt = new Date().toISOString();
  const newEmail = {
    email,
    createdAt,
  };

  try {
    await documentClient
      .put({
        TableName: 'EmailsTable',
        Item: newEmail,
      })
      .promise();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while adding new Email.' }),
    };
  }
  console.log(`New Email created: ${newEmail.email}`);

  return {
    statusCode: 200,
    body: JSON.stringify(newEmail),
  };
};

module.exports = {
  handler,
};
