const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const SES = new AWS.SES();

const handler = async (event) => {
  const { from, subject, text } = JSON.parse(event.body);

  if (!from || !subject || !text) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Please provide from, subject and text in the req body.',
      }),
    };
  }
  let addresses = [];

  try {
    const { Items } = await documentClient
      .scan({ TableName: 'EmailsTable' })
      .promise();
    addresses = Items.map((item) => item.email);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while fetching emails.' }),
    };
  }

  const params = {
    Destination: {
      ToAddresses: addresses,
    },
    Message: {
      Body: {
        Text: { Data: text },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: from,
  };

  try {
    await SES.sendEmail(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Emails sent successfully' }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while sending emails.' }),
    };
  }
};

module.exports = {
  handler,
};
