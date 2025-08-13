const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const dynamoClient = new DynamoDBClient({ region: process.env.region });
const documentClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({ region: process.env.region });

const htmlEmail = `
  <html>
    <body>
      <h1>This week's top offers:</h1>
    </body>
  </html>
`;

const handler = async (event) => {
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
        Html: { Data: htmlEmail },
      },
      Subject: {
        Data: 'Weekly Top Offers',
      },
    },
    Source: 'krystianjonca17@gmail.com',
  };

  try {
    await sesClient.send(new SendEmailCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Weekly offers email sent successfully',
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Error while sending weekly offers email.',
      }),
    };
  }
};

module.exports = {
  handler,
};
