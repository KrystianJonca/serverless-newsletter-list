const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {
  try {
    const { Items: emails } = await documentClient
      .scan({ TableName: process.env.tableName })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ data: emails }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error while fetching emails.' }),
    };
  }
};

module.exports = {
  handler,
};
