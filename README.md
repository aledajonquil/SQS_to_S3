# SQS_to_S3
This tutorial outlines a simple yet effective way to manage messages in AWS SQS Dead Letter Queues by leveraging S3 for storage and providing a mechanism to re-queue messages. This ensures that important messages are not lost and can be re-processed as needed. The node.js version is in the /nodejs directory and the python version is in the /python directory. Language specific instructions can be found in the README file within each directory

## Prerequisites
* Basic knowledge of JavaScript and AWS services (SQS and S3)

## Overview
1. A script fetches messages from the DLQ and saves them into an S3 bucket.
2. Another script reads the messages from the S3 bucket and sends them back to the original SQS queue.

## Important Considerations
* Ensure that your AWS IAM user has the necessary permissions for both SQS and S3.
* The specific AWS resource names, URLs, and credentials in the provided scripts should be replaced with your actual AWS configuration to maintain security and relevance to your environment.
