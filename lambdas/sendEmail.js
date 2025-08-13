const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const dynamoClient = new DynamoDBClient({ region: process.env.region });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({ region: process.env.region });

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
    const { Items } = await documentClient.send(new ScanCommand({
      TableName: process.env.tableName
    }));
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
    await sesClient.send(new SendEmailCommand(params));
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
