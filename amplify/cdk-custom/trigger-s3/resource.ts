import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import * as path from 'path';

export class S3TriggerStack extends cdk.Stack {
  public readonly fileUploadBucket: s3.IBucket; // Use IBucket interface for an existing bucket
  public readonly s3ProcessorLambda: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Step 1: Use the existing S3 bucket
    this.fileUploadBucket = s3.Bucket.fromBucketName(this, 'FileUploadBucket', 'react-upload-file-with-url');

    // Step 2: Create Lambda function to process S3 events
    this.s3ProcessorLambda = new lambda.Function(this, 'S3ProcessorLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler.handle',  // Lambda handler
      code: lambda.Code.fromAsset('./amplify/cdk-custom/trigger-s3'), // Lambda code directory
    });

    // Step 3: Grant Lambda permissions to read from the S3 bucket
    this.fileUploadBucket.grantRead(this.s3ProcessorLambda);

    // Step 4: Add S3 event notification to Lambda function
    this.fileUploadBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(this.s3ProcessorLambda));
  }
}
