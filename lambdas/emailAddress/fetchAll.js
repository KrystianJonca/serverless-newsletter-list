const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.region });
const documentClient = DynamoDBDocumentClient.from(client);

const handler = async (event) => {
  try {
    const { Items: emails } = await documentClient.send(new ScanCommand({
      TableName: process.env.tableName
    }));

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
