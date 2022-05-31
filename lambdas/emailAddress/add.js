const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const validateEmail = (email) => {
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (email.match(regexEmail)) 
    return true; 
  else 
    return false; 
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

  const createdAt = new Date();
  const newEmail = {
    email,
    createdAt,
  };

  try {
    await documentClient.put({
      TableName: process.env.TABLE_NAME,
      Item: newEmail,
    });
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while adding news Email.' }),
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
