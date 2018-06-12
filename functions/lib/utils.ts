import awsSdk = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;

// Create a DynamoDB connection
let dynamoDb:awsSdk.DynamoDB.DocumentClient;
if (IS_OFFLINE === 'true') {
  dynamoDb = new awsSdk.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
} else {
  dynamoDb = new awsSdk.DynamoDB.DocumentClient();
}


// Helper iterator
function* entries(obj: any) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

module.exports.dynamoDb = dynamoDb;
module.exports.entries = entries;
