import { GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, SUBMISSIONS_TABLE } from '@/lib/dynamodb';
import { v4 as uuid } from 'uuid';

export type Submission = {
  id: string;
  content: string;
  userId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};

export async function createSubmission(submissionData: {
  content: string;
  userId: string;
  projectId: string;
}): Promise<Submission> {
  const now = new Date().toISOString();
  
  const submission: Submission = {
    id: uuid(),
    ...submissionData,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: SUBMISSIONS_TABLE,
      Item: submission,
    })
  );

  return submission;
}

export async function getSubmissionById(id: string): Promise<Submission | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: SUBMISSIONS_TABLE,
      Key: { id },
    })
  );

  if (!result.Item) {
    return null;
  }

  return result.Item as Submission;
}

export async function getSubmissionsByProject(projectId: string): Promise<Submission[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: SUBMISSIONS_TABLE,
      IndexName: 'ProjectIndex',
      KeyConditionExpression: 'projectId = :projectId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
      },
    })
  );

  return (result.Items || []) as Submission[];
}

export async function getSubmissionsByUser(userId: string): Promise<Submission[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: SUBMISSIONS_TABLE,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    })
  );

  return (result.Items || []) as Submission[];
}

export async function updateSubmission(
  id: string,
  updates: Partial<Omit<Submission, 'id' | 'userId' | 'projectId' | 'createdAt' | 'updatedAt'>>
): Promise<Submission | null> {
  const now = new Date().toISOString();
  
  let updateExpression = 'SET updatedAt = :updatedAt';
  const expressionAttributeValues: Record<string, any> = {
    ':updatedAt': now,
  };

  // Build update expression dynamically
  Object.entries(updates).forEach(([key, value]) => {
    updateExpression += `, ${key} = :${key}`;
    expressionAttributeValues[`:${key}`] = value;
  });

  const result = await docClient.send(
    new UpdateCommand({
      TableName: SUBMISSIONS_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  if (!result.Attributes) {
    return null;
  }

  return result.Attributes as Submission;
}

export async function deleteSubmission(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: SUBMISSIONS_TABLE,
      Key: { id },
    })
  );
} 