import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';
import * as path from 'path';

export class SqsConsumerStack extends cdk.Stack {
  public readonly notificationQueue: sqs.Queue;
  public readonly sqsProcessorLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Step 1: Create an SQS Queue with your specified name
    this.notificationQueue = new sqs.Queue(this, 'NotificationQueue', {
      queueName: 'stk-test',  // Your specified queue name
      visibilityTimeout: cdk.Duration.seconds(30),
    });

    // Step 2: Create Lambda function to consume SQS messages
    this.sqsProcessorLambda = new lambda.Function(this, 'SqsProcessorLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler.handler',  // Lambda handler
      code: lambda.Code.fromAsset('./amplify/cdk-custom/consumer-sqs'), // Lambda code directory
    });

    // Step 3: Grant permissions to Lambda to read from SQS
    this.notificationQueue.grantConsumeMessages(this.sqsProcessorLambda);

    // Step 4: Add SQS event source to Lambda function (use the correct event source)
    this.sqsProcessorLambda.addEventSource(new lambdaEventSources.SqsEventSource(this.notificationQueue, {
      batchSize: 5,
    }));
  }
}
