/**
 * Script to re-queue messages from an S3 bucket back to the original AWS SQS queue.
 * This allows for processing messages that were previously moved to a DLQ and stored in S3.
 */

const { SQSClient, SendMessageBatchCommand } = require('@aws-sdk/client-sqs');
const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { fromIni } = require("@aws-sdk/credential-provider-ini");

// Generic AWS configuration
const region = "your-region"; // Example: "us-east-1"
const credentials = fromIni({ profile: 'your-profile' }); // Profile in your AWS credentials file

// SQS and S3 configuration
const sqsClient = new SQSClient({ region, credentials });
const s3Client = new S3Client({ region, credentials });

// Replace these with your original SQS queue URL and S3 bucket details
const queueURL = 'your-queue-url'; // Example: 'https://sqs.your-region.amazonaws.com/your-account-id/your-queue-name'
const bucketName = 'your-bucket-name'; // Example: 'your-dlq-messages-bucket'
const filePath = 'your-file-path'; // Example: 'dlq-messages.txt'

// Function to read messages from S3
const readMessagesFromS3 = async () => {
  try {
    const data = await s3Client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    }));
    const bodyContents = await streamToString(data.Body);
    return bodyContents.split('\n').filter(message => message.trim() !== '');
  } catch (error) {
    console.error('Error reading from S3:', error);
    throw error;
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

// Function to re-queue messages to SQS
const reQueueMessages = async (messages) => {
  // SQS batch command can only handle up to 10 messages at a time
  for (let i = 0; i < messages.length; i += 10) {
    const batch = messages.slice(i, i + 10).map((msg, index) => ({
      Id: String(index),
      MessageBody: msg,
    }));

    const command = new SendMessageBatchCommand({
      QueueUrl: queueURL,
      Entries: batch
    });

    try {
      await sqsClient.send(command);
      console.log(`Successfully re-queued ${batch.length} messages`);
    } catch (error) {
      console.error('Error re-queuing messages:', error);
    }
  }
};

// Main function to process the re-queuing
const processReQueueing = async () => {
  const messages = await readMessagesFromS3();
  if (messages.length > 0) {
    await reQueueMessages(messages);
  } else {
    console.log('No messages to re-queue');
  }
};

processReQueueing(); // Start the process
