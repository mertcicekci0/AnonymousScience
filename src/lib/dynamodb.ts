import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

// Table names
export const USERS_TABLE = 'anonymous-science-users';
export const PROJECTS_TABLE = 'anonymous-science-projects';
export const SUBMISSIONS_TABLE = 'anonymous-science-submissions'; 