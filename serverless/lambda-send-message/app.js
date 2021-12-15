const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
  console.log(JSON.stringify(event));
  const TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME;
  const ENDPOINT = process.env.API_GATEWAY_ENDPOINT;

  let connectionData;

  try {
    connectionData = await ddb.scan({ TableName: TABLE_NAME }).promise();
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: ENDPOINT
  });

  const data = event.body ? JSON.parse(event.body).data : event.detail;

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {

      try {
        const params = {
            ConnectionId: connectionId,
            Data: JSON.stringify(data),
        };
        console.log("Posting to WS with params:\n", params);
        await apigwManagementApi.postToConnection(params).promise();
        console.log("Posted to WS with params:\n", params);
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Stale: ${connectionId}`);
          await ddb.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise();
        } else {
          throw e;
        }
      }
    
  });

  try {
    await Promise.all(postCalls);
  } catch (e) {
    return { statusCode: 500, body: e.stack };
  }

  return { statusCode: 200, body: 'Sent' };
};