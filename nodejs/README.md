# How To Use These Scripts
##Prerequisites
**Node.js and npm:** Ensure Node.js and npm are installed on your system. You can download them from the official Node.js website.
AWS CLI: While not strictly necessary, having the AWS CLI installed and configured on your machine is beneficial for managing AWS credentials. Install it following the instructions on AWS CLI official documentation and configure it by running aws configure.
IAM Permissions: The AWS account you use must have IAM permissions for SQS and S3 actions. Specifically, you'll need access to sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SendMessage, s3:GetObject, and s3:PutObject.
Setting Up Your Environment
Install AWS SDK for JavaScript: Navigate to your project directory and run npm install @aws-sdk/client-sqs @aws-sdk/client-s3 to install the necessary AWS SDK packages for SQS and S3 services.
Configure AWS SDK:
The scripts use the default AWS credentials configured on your machine. You can set these up using the AWS CLI aws configure command.
Alternatively, you can specify credentials directly in the scripts. However, for best practices and security, relying on the AWS credentials file or environment variables is recommended.
Using dlq_to_s3.js
Script Purpose: This script transfers messages from an AWS SQS Dead Letter Queue (DLQ) to an S3 bucket for archival purposes.
Configuration:
Open the dlq_to_s3.js script in your favorite text editor.
Modify the region, deadLetterQueueURL, bucketName, and filePath variables to match your AWS setup.
Execution:
Run the script using the command node dlq_to_s3.js.
The script will fetch messages from the specified DLQ and store them in the designated S3 bucket.
Using s3_to_queue.js
Script Purpose: This script reads messages stored in an S3 bucket and re-queues them to the original SQS queue.
Configuration:
Open the s3_to_queue.js script in your text editor.
Update the region, queueURL, bucketName, and filePath with your specific AWS configuration.
Execution:
Execute the script by running node s3_to_queue.js.
It will read messages from the S3 bucket and send them back to the SQS queue specified.
Additional Notes
Ensure that the IAM user or role used to execute these scripts has the necessary permissions for the actions they perform.
Always test these scripts in a development environment before using them in production to ensure they work as expected with your AWS setup.
Regularly monitor the execution and output of these scripts, especially if automating their execution, to catch any issues early.
