import { GetCommand, PutCommand, QueryCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, USERS_TABLE } from '@/lib/dynamodb';
import { hash, compare } from 'bcryptjs';
import { v4 as uuid } from 'uuid';

export type User = {
  id: string;
  email: string;
  password: string;
  name?: string;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
};

export async function createUser(userData: {
  email: string;
  password: string;
  name?: string;
  walletAddress?: string;
}): Promise<Omit<User, 'password'>> {
  const hashedPassword = await hash(userData.password, 12);
  const now = new Date().toISOString();
  
  const user: User = {
    id: uuid(),
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    walletAddress: userData.walletAddress,
    createdAt: now,
    updatedAt: now,
  };

  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)',
    })
  );

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
      Limit: 1,
    })
  );

  if (!result.Items || result.Items.length === 0) {
    return null;
  }

  return result.Items[0] as User;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { id },
    })
  );

  if (!result.Item) {
    return null;
  }

  return result.Item as User;
}

export async function updateUser(
  id: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'createdAt' | 'updatedAt'>>
): Promise<Omit<User, 'password'> | null> {
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
      TableName: USERS_TABLE,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    })
  );

  if (!result.Attributes) {
    return null;
  }

  const user = result.Attributes as User;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function validateUser(
  email: string,
  password: string
): Promise<Omit<User, 'password'> | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValidPassword = await compare(password, user.password);

  if (!isValidPassword) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
} 