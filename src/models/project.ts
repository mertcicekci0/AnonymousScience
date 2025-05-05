import { GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, PROJECTS_TABLE } from '@/lib/dynamodb';
import { v4 as uuid } from 'uuid';

export type Project = {
  id: string;
  title: string;
  description: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export async function createProject(projectData: {
  title: string;
  description: string;
  content: string;
  authorId: string;
}): Promise<Project> {
  const now = new Date().toISOString();
  
  const project: Project = {
    id: uuid(),
    ...projectData,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: PROJECTS_TABLE,
      Item: project,
    })
  );

  return project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: PROJECTS_TABLE,
      Key: { id },
    })
  );

  if (!result.Item) {
    return null;
  }

  return result.Item as Project;
}

export async function getProjectsByAuthor(authorId: string): Promise<Project[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: PROJECTS_TABLE,
      IndexName: 'AuthorIndex',
      KeyConditionExpression: 'authorId = :authorId',
      ExpressionAttributeValues: {
        ':authorId': authorId,
      },
    })
  );

  return (result.Items || []) as Project[];
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>
): Promise<Project | null> {
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
      TableName: PROJECTS_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  if (!result.Attributes) {
    return null;
  }

  return result.Attributes as Project;
}

export async function deleteProject(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: PROJECTS_TABLE,
      Key: { id },
    })
  );
} 