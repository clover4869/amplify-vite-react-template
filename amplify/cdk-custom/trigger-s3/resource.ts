import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3Notifications from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';

export class S3TriggerUploadStack extends cdk.Stack {
  public readonly fileUploadBucket: s3.IBucket; 

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props
    });

    this.fileUploadBucket = s3.Bucket.fromBucketName(this, 'FileUploadBucket', 'stk-upload-file');


    const s3TriggerUploadLambda = new lambda.Function(this, 'S3TriggerUploadLambda', {
      runtime: lambda.Runtime.NODEJS_18_X, // Specify the runtime
      handler: 'handler.handler',           // Specify the handler function
      code: lambda.Code.fromAsset('./amplify/cdk-custom/trigger-s3'),
      functionName: 'S3TriggerUploadLambda',
      description: 'This is my custom Lambda function created using CDK',
      memorySize: 128,
      environment: {
        TEST: 'test',
      }
    });

    this.fileUploadBucket.grantRead(s3TriggerUploadLambda);

    this.fileUploadBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notifications.LambdaDestination(s3TriggerUploadLambda));

    new CfnOutput(this, 'S3TriggerUploadLambdaArn', {
      value: s3TriggerUploadLambda.functionArn,
      exportName: 'S3TriggerUploadLambdaArn',
    });
  }
}
