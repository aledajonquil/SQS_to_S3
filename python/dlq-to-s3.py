import boto3
from botocore.exceptions import NoCredentialsError

# Initialize Boto3 clients for SQS and S3
sqs_client = boto3.client('sqs')
s3_client = boto3.client('s3')

# AWS SQS and S3 configuration
dead_letter_queue_url = 'your-dlq-url'
bucket_name = 'your-bucket-name'
file_path = 'your-file-path'

def fetch_messages_from_dlq():
    """
    Fetch messages from the Dead Letter Queue.
    """
    try:
        messages = sqs_client.receive_message(
            QueueUrl=dead_letter_queue_url,
            MaxNumberOfMessages=10,  # Adjust based on your needs
            WaitTimeSeconds=20  # Long polling
        )
        return messages.get('Messages', [])
    except NoCredentialsError:
        print("Credentials not available")
        return []

def save_messages_to_s3(messages):
    """
    Save messages to an S3 bucket.
    """
    if not messages:
        print("No messages to save")
        return

    # Convert message list to string, one message per line
    message_content = '\n'.join([message['Body'] for message in messages])
    
    try:
        # Check if the file already exists in S3 and append content if it does
        try:
            existing_content = s3_client.get_object(Bucket=bucket_name, Key=file_path)
            existing_content_body = existing_content['Body'].read().decode('utf-8')
            message_content = existing_content_body + '\n' + message_content
        except s3_client.exceptions.NoSuchKey:
            print("File not found in S3. Creating new file.")
        
        # Upload the new content
        s3_client.put_object(Bucket=bucket_name, Key=file_path, Body=message_content)
        print("Successfully uploaded messages to S3")
    except NoCredentialsError:
        print("Credentials not available")
    except Exception as e:
        print(f"Failed to upload messages to S3: {e}")

def delete_messages_from_dlq(messages):
    """
    Delete messages from the DLQ once they have been successfully saved to S3.
    """
    for message in messages:
        try:
            sqs_client.delete_message(
                QueueUrl=dead_letter_queue_url,
                ReceiptHandle=message['ReceiptHandle']
            )
            print(f"Message {message['MessageId']} deleted from DLQ")
        except Exception as e:
            print(f"Failed to delete message {message['MessageId']} from DLQ: {e}")

if __name__ == "__main__":
    messages = fetch_messages_from_dlq()
    if messages:
        save_messages_to_s3(messages)
        delete_messages_from_dlq(messages)
    else:
        print("No messages found in DLQ.")
