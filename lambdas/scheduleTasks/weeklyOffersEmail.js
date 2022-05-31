const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const SES = new AWS.SES();

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
        Html: { Data: htmlEmail },
      },
      Subject: {
        Data: 'Weekly Top Offers',
      },
    },
    Source: 'krystianjonca17@gmail.com',
  };

  try {
    await SES.sendEmail(params).promise();
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
