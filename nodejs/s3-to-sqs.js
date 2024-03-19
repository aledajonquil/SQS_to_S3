/**
 * Script to re-queue messages from an S3 bucket back to the original AWS SQS queue.
 * This allows for processing messages that were previously moved to a DLQ and stored in S3.
 */

import { fromIni } from '@aws-sdk/credential-provider-ini';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fetch from 'node-fetch';

// Generic AWS configuration
const region = "your-region"; // Example: "us-east-1"
const credentials = fromIni({ profile: 'your-profile' }); // Profile in your AWS credentials file

// SQS and S3 configuration
const s3Client = new S3Client({ region, credentials });
const sqsClient = new SQSClient({ region, credentials });

// Replace these with your original SQS queue URL and S3 bucket details
const bucketName = 'your-bucket-name'; // Example: 'your-dlq-messages-bucket'
const filePath = 'your-file-path'; // Example: 'dlq-messages.txt'
const queueURL = 'your-queue-url'; // Example: 'https://sqs.your-region.amazonaws.com/your-account-id/your-queue-name'

// Function to remove messages from file after they are sent to a queue
const clearFileContentInS3 = async (bucket, key) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: ''
  });
  try {
    await s3Client.send(command);
    console.log(`File content cleared in S3: ${key}`);
  } catch (error) {
    console.error('Error clearing file content in S3:', error);
    throw error;
  }
};

// Function to get file content from S3
const getFileContentFromS3 = async (bucket, key) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  try {
    const response = await fetch(signedUrl);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    throw error;
  }
};

// Function to send a message to SQS
const sendMessageToSQS = async (messageBody) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: messageBody
  });

  try {
    await sqsClient.send(command);
    console.log('Message sent to SQS:', messageBody);
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw error;
  }
};

// Main function to read from S3 and send to SQS
const processS3FileToSQS = async () => {
  const fileContent = await getFileContentFromS3(bucketName, filePath);
  const messages = fileContent.split('\n').filter(message => message.trim() !== '');

  for (const message of messages) {
    await sendMessageToSQS(message);
  }

  await clearFileContentInS3(bucketName, filePath);
};

processS3FileToSQS(); // Start the process
