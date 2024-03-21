/**
 * Script to transfer messages from an AWS SQS Dead Letter Queue (DLQ) to an S3 bucket.
 * This prevents messages from expiring in the DLQ by storing them for later processing.
 */

import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { GetObjectCommand, S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';

// AWS configuration
const region = "your-region"; // Example: "us-east-1"
const credentials = fromIni({ profile: 'your-profile' }); // Profile in your AWS credentials file

// SQS and S3 configuration
const s3Client = new S3Client({ region, credentials });
const sqsClient = new SQSClient({ region, credentials });

// Replace these with your Dead Letter Queue URL and S3 bucket details
const bucketName = 'your-bucket-name'; // Example: 'your-dlq-messages-bucket'
const deadLetterQueueURL = 'your-dlq-url'; // Example: 'https://sqs.your-region.amazonaws.com/your-account-id/your-dlq-name'
const filePath = 'your-file-path'; // Example: 'dlq-messages.txt'

// Receive messages from the DLQ
const receiveMessages = async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: deadLetterQueueURL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 20
  });

  try {
    const data = await sqsClient.send(command);
    return data.Messages || [];
  } catch (error) {
    console.error('Error receiving messages:', error);
    throw error;
  }
};

// Get existing content from S3 (if any)
const getExistingS3Content = async () => {
  try {
    const data = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    }));
    const bodyContents = await streamToString(data.Body);
    return bodyContents;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return ''; // Return empty string if the file does not exist
    } else {
      console.error('Error downloading from S3:', error);
      throw error;
    }
  }
};

// Helper function to convert stream to string
function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

// Write messages to S3
const writeToS3 = async (messages) => {
  const existingContent = await getExistingS3Content();
  const newContent = messages.map(msg => msg.Body).join('\n');
  const fileContent = existingContent + '\n' + newContent;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filePath,
    Body: fileContent
  });

  try {
    await s3Client.send(command);
    console.log('Successfully uploaded messages to S3');
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

// Delete a message from the DLQ
const deleteMessage = async (receiptHandle) => {
  const deleteParams = {
    QueueUrl: deadLetterQueueURL,
    ReceiptHandle: receiptHandle,
  };

  try {
    await sqsClient.send(new DeleteMessageCommand(deleteParams));
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error deleting message:', error);
  }
};

const processDLQMessages = async () => {
  const messages = await receiveMessages();
  if (messages.length > 0) {
    await writeToS3(messages);
    for (const message of messages) {
      await deleteMessage(message.ReceiptHandle); // Delete after writing to S3
    }
    processDLQMessages(); // Recursively process next batch
  } else {
    console.log('No messages to process');
  }
};

processDLQMessages(); // Start the process
