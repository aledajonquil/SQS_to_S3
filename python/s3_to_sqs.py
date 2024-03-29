import boto3
from botocore.exceptions import NoCredentialsError

# Specify the AWS region
aws_region = 'your-region'

# Initialize Boto3 clients for SQS and S3 with an explicit region
sqs_client = boto3.client('sqs', region_name=aws_region)
s3_client = boto3.client('s3', region_name=aws_region)

# Specify your S3 bucket details and the original SQS queue URL
bucket_name = 'your-bucket-name'
file_key = 'your-filenamet'  # The S3 object key (file name)
queue_url = 'url-of-your-queue'

def clear_s3_file_content(bucket, key):
    """Clears the content of the specified S3 file by overwriting it with an empty string."""
    try:
        s3_client.put_object(Bucket=bucket, Key=key, Body='')
        print("File content cleared successfully.")
    except Exception as e:
        print(f"An error occurred while clearing the file content: {str(e)}")

def read_messages_from_s3(bucket, key):
    """Read messages from an S3 object."""
    try:
        s3_object = s3_client.get_object(Bucket=bucket, Key=key)
        body = s3_object['Body'].read().decode('utf-8')
        messages = body.split('\n')
        return messages
    except NoCredentialsError:
        print("Error: AWS credentials not found.")
        return []
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []

def requeue_messages(queue_url, messages):
    """Re-queue messages to the original SQS queue."""
    for message_body in messages:
        if not message_body.strip():
            continue  # Skip empty lines
        try:
            sqs_client.send_message(QueueUrl=queue_url, MessageBody=message_body)
            print("Message re-queued successfully.")
        except NoCredentialsError:
            print("Error: AWS credentials not found.")
        except Exception as e:
            print(f"An error occurred: {str(e)}")

def process_messages():
    """Main function to process messages from S3 to SQS."""
    messages = read_messages_from_s3(bucket_name, file_key)
    if messages:
        requeue_messages(queue_url, messages)
        clear_s3_file_content(bucket_name, file_key)
    else:
        print("No messages found in the specified S3 object.")

if __name__ == "__main__":
    process_messages()
