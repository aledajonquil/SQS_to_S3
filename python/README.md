## How To Use These Scripts
1. Replace 'your-dlq-url', 'your-bucket-name', and 'your-file-path' with the actual URL of your Dead Letter Queue, the name of your S3 bucket, and the path (key) where you want to store your messages in S3.
2. Ensure your AWS credentials are configured properly. You can do this by running aws configure if you have the AWS CLI installed, or by setting the appropriate environment variables.
3. Install Boto3 if you haven't already by running pip install boto3.
4. Execute the script by running python dlq_to_s3.py.

This script fetches messages from your DLQ, saves them into an S3 bucket, and deletes them from the DLQ to prevent re-processing of the same messages.
