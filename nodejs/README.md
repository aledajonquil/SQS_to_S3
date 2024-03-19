# How To Use These Scripts
## Prerequisites
* **Node.js and npm:** Ensure Node.js and npm are installed on your system. You can download them from the [official Node.js website](https://nodejs.org/en "Node.js").
* **AWS CLI:** While not strictly necessary, having the AWS CLI installed and configured on your machine is beneficial for managing AWS credentials. Install it following the instructions on [AWS CLI official documentation](https://aws.amazon.com/cli/ "AWS CLI Documentation") and configure it by running `aws configure`.
* **IAM Permissions:** The AWS account you use must have IAM permissions for SQS and S3 actions. Specifically, you'll need access to sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SendMessage, s3:GetObject, and s3:PutObject.

## Setting Up Your Environment
1. **Install the Package:** Navigate to your project directory and run `npm install` to install the necessary packages.
2. **Configure AWS SDK:**
The scripts use the default AWS credentials configured on your machine. You can set these up using the AWS CLI aws configure command.
Alternatively, you can specify credentials directly in the scripts. However, for best practices and security, relying on the AWS credentials file or environment variables is recommended.

## Using dlq_to_s3.js
This script transfers messages from an AWS SQS Dead Letter Queue (DLQ) to an S3 bucket for archival purposes.
1. Open the dlq_to_s3.js script in your favorite text editor.
2. Modify the region, deadLetterQueueURL, bucketName, and filePath variables to match your AWS setup.
3. Run the script using the command `node dlq_to_s3.js`.

## Using s3_to_queue.js
This script reads messages stored in an S3 bucket and re-queues them to the original SQS queue.
1. Open the s3_to_queue.js script in your text editor.
2. Update the region, queueURL, bucketName, and filePath with your specific AWS configuration.
3. Execute the script by running `node s3_to_queue.js`.
