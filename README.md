# image-to-text-converter

This project utilizes AWS resources to seamlessly convert images to text. AWS Beanstalk deploys the user-friendly frontend, while Lambda functions and API Gateways power the serverless backend. AWS KMS ensures secure encryption key storage.

CloudFormation manages resource provisioning, ensuring scalability and reliability. User credentials are securely stored in DynamoDB, offering a robust and secure solution for image-to-text conversion. Using the AWS Textract the text is extracted from the image provided.

- _Date Created_: 31 SEPTEMBER 2023
- _Git URL_: https://github.com/piyush-akoliya/image-to-text-converter.git

## Authors

- [Piyush Akoliya](akoliyapiyush28@gmail.com) - _(Developer)_

## Deployment

Entirely cloud based project that has been deployed in the cloud using cloud formation.

## Built With

- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/) - Deploy and scale web applications
- [AWS Textract](https://aws.amazon.com/textract/) - machine learning (ML) service that automatically extracts text, handwriting, and data from scanned documents.
- [DynamoDB](https://aws.amazon.com/dynamodb/) - Fast, flexible NoSQL database service for single-digit millisecond performance at any scale.
- [AWS Cloud Formation](https://aws.amazon.com/cloudformation/) - Speed up cloud provisioning with infrastructure as code
- [AWS AWS Key Management Service](https://aws.amazon.com/kms/) - Create and control keys used to encrypt or digitally sign your data
- [AWS API Gateway](https://aws.amazon.com/api-gateway/) - Create, maintain, and secure APIs at any scale
- [AWS Lambda](https://aws.amazon.com/lambda/) - AWS Lambda is a serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers.
- [AWS Simple Storage Solution](https://aws.amazon.com/s3/) - Object storage built to retrieve any amount of data from anywhere
