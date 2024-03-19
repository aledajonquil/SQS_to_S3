# SQS_to_S3
This tutorial explains how to write messages from an AWS SQS Dead Letter Queue to an S3 file, to prevent message expiration, then from S3 to a new SQS queue.

## Prerequisites
* AWS CLI installed and configured
* Node.js and npm installed
* Basic knowledge of JavaScript and AWS services (SQS and S3)

## Overview
1. Transfer Messages from DLQ to S3: A script (dlq_to_s3.js) fetches messages from the DLQ and saves them into an S3 bucket.
2. Re-queue Messages from S3 to SQS: Another script (s3_to_queue.js) reads the messages from the S3 bucket and sends them back to the original SQS queue.

## Step 1: Setting Up Your Environment
1. Create an AWS IAM user with programmatic access and attach policies that grant access to SQS and S3.
2. Configure your AWS CLI with the IAM credentials.
3. Create an SQS queue and a corresponding Dead Letter Queue.
4. Create an S3 bucket to store the messages.

## Step 2: Transfer Messages from DLQ to S3
1. Script Overview (dlq_to_s3.js):

* Fetches messages from the DLQ.
* Writes the messages to a file in an S3 bucket.
* Deletes the messages from the DLQ once successfully saved to S3.

2. Configuration:

* Update the region, credentials, deadLetterQueueURL, bucketName, and filePath variables with your specific AWS configuration.

3. Running the Script:

* Install necessary packages: npm install @aws-sdk/client-sqs @aws-sdk/client-s3 @aws-sdk/credential-provider-ini.
* Run the script: node dlq_to_s3.js.

Step 3: Re-queue Messages from S3 to SQS
Script Overview (s3_to_queue.js):

Reads messages from the specified file in the S3 bucket.
Sends those messages back to the original SQS queue.
Configuration:

Similar to the DLQ to S3 script, update the script with your AWS configurations.
Running the Script:

Use the same Node.js setup and commands as mentioned in Step 2.
Important Considerations
Ensure that your AWS IAM user has the necessary permissions for both SQS and S3.
Modify the scripts to handle any specific logic or message formatting your application requires.
Regularly monitor your SQS queues and S3 buckets to ensure smooth operation.
Cleanup
To avoid unnecessary charges, remember to delete the SQS queues and S3 buckets when they are no longer needed.
Conclusion
This tutorial outlines a simple yet effective way to manage messages in AWS SQS Dead Letter Queues by leveraging S3 for storage and providing a mechanism to re-queue messages. This ensures that important messages are not lost and can be re-processed as needed.

Remember, the specific AWS resource names, URLs, and credentials in the provided scripts should be replaced with your actual AWS configuration to maintain security and relevance to your environment.
