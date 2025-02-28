import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';

export class S3TriggerStack extends cdk.Stack {
  public readonly fileUploadBucket: s3.IBucket; // Use IBucket interface for an existing bucket
  // public readonly s3ProcessorLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      env: {
        region: 'us-west-2',  // Replace with your region
      }
    });

    // Step 1: Use the existing S3 bucket
    this.fileUploadBucket = s3.Bucket.fromBucketName(this, 'FileUploadBucket', 'react-upload-file-with-url');

    // // Step 2: Create Lambda function to process S3 events
    // this.s3ProcessorLambda = new lambda.Function(this, 'S3ProcessorLambda', {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   handler: 'handler.handle',  // Lambda handler
    //   code: lambda.Code.fromAsset('./amplify/cdk-custom/trigger-s3'), // Lambda code directory
    // });
    const region = 'ap-southeast-1'; 

    // Define the Lambda function
    const s3ProcessorLambda = new lambda.Function(this, 'S3ProcessorLambda', {
      runtime: lambda.Runtime.NODEJS_18_X, // Specify the runtime
      handler: 'handler.handler',           // Specify the handler function
      code: lambda.Code.fromAsset('./amplify/cdk-custom/trigger-s3'),
      functionName: 'S3ProcessorLambda',
      description: 'This is my custom Lambda function created using CDK',
      memorySize: 128,
    });



    // Step 3: Grant Lambda permissions to read from the S3 bucket
    this.fileUploadBucket.grantRead(s3ProcessorLambda);

    // Step 4: Add S3 event notification to Lambda function
    this.fileUploadBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(s3ProcessorLambda));

    // Output the Lambda function ARN
    new CfnOutput(this, 'S3ProcessorLambdaArn', {
      value: s3ProcessorLambda.functionArn,
      exportName: 'S3ProcessorLambdaArn',
    });
  }
}
