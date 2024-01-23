# Serverless SMS Solution with AWS Lambda and TypeScript

This project implements a serverless solution using AWS Lambda and TypeScript for sending SMS messages. The solution involves receiving an HTTP POST request containing a phone number and message body, forwarding the payload to an SNS topic, processing the message through an SQS queue subscribed to the SNS topic, and finally sending an SMS message via SNS to the provided phone number.

The project also contains AWS IaC using the AWS CDK and there are a few tests to check for correctness.

## Lambda Functions

There are two Lambda functions in this project:

- **HTTP Post Handler**: This Lambda function is triggered by an HTTP POST request. It extracts the phone number and message body from the request payload, publishes the payload to an SNS topic, and returns a response.

- **SQS Message Handler**: This Lambda function listens for messages on an SQS queue, subscribed to the SNS topic. Upon receiving a message, it sends an SMS message via SNS to the phone number provided in the message payload.

The Lambda functions are located in `/code/lambda/function.ts`. There is also an `sns-service.ts` that serves as a business logic layer.

## AWS CDK Infrastructure as Code
The AWS CDK script deploys the necessary infrastructure for the solution, including the SNS topic, SQS queue, and the required Lambda functions with their associated triggers.

## Tests
The project includes tests for the Lambda functions. Test scripts cover the functionality of each Lambda function, ensuring they handle inputs correctly and produce the expected outputs.

You can find the tests in the `/code/test` directory.

## Getting Started
To set up and run the project locally, follow these steps:

1. Clone the repository:

``` bash
git clone https://github.com/AdoraNwodo/serverless-sms.git
cd your-repository
```

2. Install dependencies:

``` bash
npm install
```

3. Run tests

``` bash
npm test
```

4. Deploy

```bash
npm run cdk deploy
```

Happy Coding 🩷