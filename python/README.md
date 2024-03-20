# How To Use These Scripts
## Prerequisites

* **Python Installation:** Ensure Python (version 3.6 or newer) is installed on your system. You can download Python from the [official Python website](https://www.python.org/ "Python Website").
* **AWS CLI:** Installing and configuring the AWS CLI is recommended for managing AWS credentials. Follow the installation guide on the [AWS CLI official documentation](https://aws.amazon.com/cli/ "AWS CLI Documentation") and configure it by running `aws configure`.
* **IAM Permissions:** The AWS IAM user or role executing these scripts needs sufficient permissions for SQS and S3 services. The required permissions include sqs:ReceiveMessage, sqs:DeleteMessage, sqs:SendMessage, s3:GetObject, and s3:PutObject.
  
## Setting Up Your Environment
1. **Install Boto3:** Boto3 is the AWS SDK for Python. Install it by running `pip install boto3` in your terminal. This SDK is necessary for scripting interactions with AWS services like SQS and S3.
2. **Configure AWS SDK:** Boto3 uses the AWS credentials stored in your AWS configuration file or environment variables. These are usually set up when you configure the AWS CLI.
Ensure your AWS credentials (found in ~/.aws/credentials) and region (found in ~/.aws/config) are correctly set for the scripts to authenticate with AWS services.

## Using dlq_to_s3.py
This script is designed to transfer messages from an AWS SQS Dead Letter Queue (DLQ) to an S3 bucket. This ensures that messages are not lost after the DLQ's retention period expires.
* Open dlq_to_s3.py in your preferred text editor.
* Modify the placeholders for region_name, dead_letter_queue_url, bucket_name, and file_key to match your specific AWS configuration details.
* Execute the script by running `python dlq-to-s3.py` in your terminal.

## Using s3_to_queue.py
This script reads messages from an S3 bucket and re-queues them to the original SQS queue. This is useful for processing messages that were previously moved to a DLQ.
* Open s3_to_queue.py in your text editor.
* Update the region_name, queueURL, bucket_name, and file_key with your AWS configuration details.
* Run the script using the command `python s3-to-queue.py` in your terminal.

