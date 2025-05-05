require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

// Log the credentials being used (without the actual secret values)
console.log('AWS Region:', process.env.AWS_REGION);
console.log('AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set correctly' : 'Not set');
console.log('AWS Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set correctly' : 'Not set');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAMES = [
  'anonymous-science-users',
  'anonymous-science-projects',
  'anonymous-science-submissions'
];

async function testConnection() {
  console.log('Testing DynamoDB connection...');
  
  try {
    for (const tableName of TABLE_NAMES) {
      console.log(`Testing table: ${tableName}`);
      
      const result = await docClient.send(
        new ScanCommand({
          TableName: tableName,
          Limit: 1
        })
      );
      
      console.log(`✅ Successfully connected to ${tableName}`);
      console.log(`Items in table: ${result.Items ? result.Items.length : 0}`);
    }
    
    console.log('All DynamoDB tables are accessible!');
  } catch (error) {
    console.error('❌ Error connecting to DynamoDB:', error.message);
    console.error('Stack trace:', error.stack);
    console.log('Please check your AWS credentials and table names.');
  }
}

testConnection(); 