import { APIGatewayProxyEvent, Context, SQSEvent } from 'aws-lambda';

export function createMockAPIGatewayProxyEvent(
    httpMethod: string = 'POST',
    body: string | null = '{"phoneNumber": "123456789", "message": "Hello"}',
  ): APIGatewayProxyEvent {
    return {
        body,
        headers: {},
        multiValueHeaders: {},
        httpMethod,
        isBase64Encoded: false,
        path: '/your-api-endpoint',
        pathParameters: null,
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {
            accountId: '123456789012',
            resourceId: 'resource-id',
            stage: 'test',
            requestId: 'test-request-id',
            requestTime: '2022-01-01T01:23:45Z',
            requestTimeEpoch: 1641042225000,
            identity: {
                cognitoIdentityPoolId: null,
                accountId: null,
                cognitoIdentityId: null,
                caller: null,
                sourceIp: '127.0.0.1',
                principalOrgId: null,
                accessKey: null,
                cognitoAuthenticationType: null,
                cognitoAuthenticationProvider: null,
                userArn: null,
                userAgent: 'Custom User Agent String',
                user: null,
                apiKey: 'mock-key',
                apiKeyId: 'mock-id',
                clientCert: null
            },
            domainName: 'test-event-name.execute-api.us-east-1.amazonaws.com',
            resourcePath: '/your-api-endpoint',
            httpMethod,
            apiId: 'test-api-id',
            authorizer: undefined,
            protocol: '',
            path: ''
        },
        resource: '/your-api-endpoint',
    };
}

export function createMockContext(): Context {
    return {
        awsRequestId: 'mock-request-id',
        logGroupName: 'mock-log-group',
        logStreamName: 'mock-log-stream',
        functionVersion: 'mock-function-version',
        invokedFunctionArn: 'mock-function-arn',
        memoryLimitInMB: '256',
        functionName: 'mock-name',
        getRemainingTimeInMillis: () => 5000,
        callbackWaitsForEmptyEventLoop: true,
        done: () => {},
        fail: () => {},
        succeed: () => {},
    };
}

export function createMockSqsEvent(): SQSEvent {
    const mockMessageBody = '{"phoneNumber": "123456789", "messageBody": "Hello"}';
  
    return {
      Records: [
        {
          messageId: 'mock-message-id',
          receiptHandle: 'mock-receipt-handle',
          body: mockMessageBody,
          attributes: {
              ApproximateReceiveCount: '',
              SentTimestamp: '',
              SenderId: '',
              ApproximateFirstReceiveTimestamp: ''
          },
          messageAttributes: {},
          md5OfBody: 'mock-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:mock-queue',
          awsRegion: 'us-east-1',
        },
      ],
    };
  }
