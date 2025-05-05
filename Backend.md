# Anonymous Science Backend Documentation

This document provides detailed information about the backend implementation of the Anonymous Science project, including setup instructions, API endpoints, and usage examples.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [PostgreSQL Setup](#postgresql-setup)
  - [DynamoDB Setup](#dynamodb-setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Environment Variables](#environment-variables)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher) OR AWS account for DynamoDB

## Setup

You can choose either PostgreSQL or DynamoDB as your database. Follow the instructions for your preferred option.

### PostgreSQL Setup

1. **Install PostgreSQL**
   - Download from: https://www.postgresql.org/download/windows/
   - Run the installer and follow the prompts
   - Set a password for the postgres user
   - Keep the default port (5432)

2. **Create Database**
   - Open pgAdmin 4 (installed with PostgreSQL)
   - Enter your master password if prompted
   - Expand the "Servers" node, then expand your PostgreSQL server
   - Right-click on "Databases" and select "Create" > "Database"
   - Name it "anonymous_science" and save

3. **Configure Environment Variables**
   - Create a file named `.env` in your project root directory
   - Add these lines:
     ```
     DATABASE_URL="postgresql://postgres:your_password@localhost:5432/anonymous_science"
     JWT_SECRET="your_jwt_secret"
     NEXT_PUBLIC_API_URL="http://localhost:3000/api"
     ```
   - Replace `your_password` with your PostgreSQL password
   - Replace `your_jwt_secret` with a secure random string

4. **Initialize the Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### DynamoDB Setup

1. **Create AWS Account**
   - Go to https://aws.amazon.com/ and create an account if you don't have one

2. **Create IAM User**
   - Open the AWS Management Console
   - Navigate to IAM (Identity and Access Management)
   - Create a new user with programmatic access
   - Attach the `AmazonDynamoDBFullAccess` policy
   - Save the access key ID and secret access key

3. **Configure Environment Variables**
   - Create a file named `.env` in your project root directory
   - Add these lines:
     ```
     AWS_REGION=us-east-1
     AWS_ACCESS_KEY_ID=your_access_key_id
     AWS_SECRET_ACCESS_KEY=your_secret_access_key
     JWT_SECRET="your_jwt_secret"
     NEXT_PUBLIC_API_URL="http://localhost:3000/api"
     ```

4. **Create DynamoDB Tables**
   - Install AWS CLI: https://aws.amazon.com/cli/
   - Configure AWS CLI with your credentials:
     ```bash
     aws configure
     ```
   - Deploy the CloudFormation template:
     ```bash
     aws cloudformation deploy --template-file dynamodb-tables.yaml --stack-name anonymous-science-tables
     ```

5. **Install Dependencies**
   ```bash
   npm install
   npm install uuid @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
   ```

## Starting the Application

```bash
npm run dev
```

## Database Schema

### PostgreSQL Schema (via Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  walletAddress String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  projects      Project[]
  submissions   Submission[]
}

model Project {
  id          String    @id @default(cuid())
  title       String
  description String
  content     String
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  submissions Submission[]
}

model Submission {
  id        String   @id @default(cuid())
  content   String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### DynamoDB Schema

The project uses three DynamoDB tables:

1. **Users Table** (`anonymous-science-users`)
   - Primary key: `id` (string)
   - GSI: `EmailIndex` on `email`
   - Fields: `id`, `email`, `password`, `name`, `walletAddress`, `createdAt`, `updatedAt`

2. **Projects Table** (`anonymous-science-projects`)
   - Primary key: `id` (string)
   - GSI: `AuthorIndex` on `authorId`
   - Fields: `id`, `title`, `description`, `content`, `authorId`, `createdAt`, `updatedAt`

3. **Submissions Table** (`anonymous-science-submissions`)
   - Primary key: `id` (string)
   - GSI: `ProjectIndex` on `projectId`
   - GSI: `UserIndex` on `userId`
   - Fields: `id`, `content`, `userId`, `projectId`, `createdAt`, `updatedAt`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "walletAddress": "0x..." // Optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Projects

#### List All Projects
```http
GET /api/projects
```

#### Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Project Title",
  "description": "Project Description",
  "content": "Project Content"
}
```

#### Get Project Details
```http
GET /api/projects/:id
```

#### Update Project (Protected)
```http
PATCH /api/projects/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "content": "Updated Content"
}
```

#### Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer <jwt_token>
```

### Submissions

#### List Project Submissions
```http
GET /api/projects/:id/submissions
```

#### Create Submission (Protected)
```http
POST /api/projects/:id/submissions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Submission Content"
}
```

## Authentication

The backend uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register or login to get a JWT token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

Token expiration is set to 7 days by default.

## Error Handling

The API uses consistent error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Environment Variables

### PostgreSQL Setup
| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | Secret key for JWT signing | Yes |
| NEXT_PUBLIC_API_URL | Base URL for API endpoints | Yes |

### DynamoDB Setup
| Variable | Description | Required |
|----------|-------------|----------|
| AWS_REGION | AWS region for DynamoDB | Yes |
| AWS_ACCESS_KEY_ID | AWS access key | Yes |
| AWS_SECRET_ACCESS_KEY | AWS secret key | Yes |
| JWT_SECRET | Secret key for JWT signing | Yes |
| NEXT_PUBLIC_API_URL | Base URL for API endpoints | Yes |

## Switching Between Database Types

The project is designed to work with either PostgreSQL or DynamoDB. To switch:

1. Set the appropriate environment variables
2. Use the corresponding model files:
   - For PostgreSQL: Use the Prisma client
   - For DynamoDB: Use the AWS SDK models in `/models` directory

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Security**: Tokens are signed with a secret key and have expiration
3. **Input Validation**: All inputs are validated using Zod schemas
4. **Protected Routes**: Sensitive operations require authentication
5. **Author Checks**: Users can only modify their own projects

## Troubleshooting

### PostgreSQL Issues
1. **Database Connection Issues**
   - Verify DATABASE_URL in .env
   - Check PostgreSQL service is running
   - Ensure database exists

### DynamoDB Issues
1. **AWS Credentials Issues**
   - Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env
   - Check that the IAM user has DynamoDB permissions
   - Ensure tables exist in the specified AWS region

2. **Table Creation Issues**
   - Check CloudFormation template syntax
   - Verify AWS CLI is configured correctly
   - Look for error messages in AWS CloudFormation console

3. **General Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure correct Authorization header format

## License

This project is licensed under the MIT License.