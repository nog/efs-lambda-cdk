# EFS Lambda CDK Sample

This project demonstrates how to use AWS CDK to create a Lambda function that interacts with an Amazon EFS file system to implement a simple counter application.

## Prerequisites

- Node.js
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Project Structure

- `lib/efs-lambda-cdk-stack.ts`: Contains the CDK stack definition
- `lambda/index.rb`: Contains the Lambda function code
- `bin/efs-lambda-cdk.ts`: CDK app entry point

## Setup and Deployment

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the project:
   ```
   npm run build
   ```
4. Deploy the stack:
   ```
   npm run deploy
   ```

## Testing the Lambda Function

After deployment, you can test the Lambda function using the AWS Console or AWS CLI.

## Cleaning Up

To avoid incurring future charges, remember to destroy the resources when you're done:

```
npm run destroy
```

## Security

This project uses default security group rules. For production use, please review and tighten security rules as needed.