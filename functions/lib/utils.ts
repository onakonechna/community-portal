import awsSdk = require('aws-sdk');
const IS_OFFLINE = process.env.IS_OFFLINE;

// Create a DynamoDB connection
let dynamodb: awsSdk.DynamoDB.DocumentClient;
if (IS_OFFLINE === 'true') {
  dynamodb = new awsSdk.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
} else {
  dynamodb = new awsSdk.DynamoDB.DocumentClient();
}


// Helper iterator
// Usage:
// for (let [key, value] of entries(myObj)) {
//    // do something with key|value
// }
function* entries(obj: any) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}


module.exports.dynamodb = dynamodb;
module.exports.entries = entries;
