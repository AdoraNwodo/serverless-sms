import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class CodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaPath = "src/lambda"
    const httpPostfunctionHandler = "function.handleHttpPost"
    const sqsMessagefunctionHandler = "function.handleSqsMessages"

    // Create SNS Topic
    const snsTopic = new sns.Topic(this, 'adorasnstopic');

    // Create SQS Queue
    const sqsQueue = new sqs.Queue(this, 'adorasnsqueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const httpPostHandler = new lambda.Function(this, 'adorahttpposthandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(lambdaPath),
      handler: httpPostfunctionHandler,
      environment: {
        SNS_TOPIC_ARN: snsTopic.topicArn,
      },
    });
    snsTopic.grantPublish(httpPostHandler);

    const sqsMessageHandler = new lambda.Function(this, 'adorasqsmessagehandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(lambdaPath),
      handler: sqsMessagefunctionHandler,
    });
    snsTopic.addSubscription(new subscriptions.LambdaSubscription(sqsMessageHandler));

    // Permissions
    httpPostHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sns:Publish'],
      resources: [snsTopic.topicArn],
    }));

    sqsMessageHandler.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sqs:SendMessage'],
      resources: [sqsQueue.queueArn],
    }));
    
    const api = new apigateway.RestApi(this, 'adoraapigateway');
    const integration = new apigateway.LambdaIntegration(httpPostHandler);
    const resource = api.root.addResource('send');
    resource.addMethod('POST', integration);
  }
}
