import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class LambdaS3LogStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Import an existing S3 bucket by name
        const existingBucket = s3.Bucket.fromBucketName(this, 'react-upload-file-with-url', 'react-upload-file-with-url');

        // Create a Lambda function
        const lambdaFunction = new lambda.Function(this, 'S3TriggerLambda', {
            runtime: lambda.Runtime.NODEJS_18_X, // Change to preferred runtime
            handler: 'index.handler',
            code: lambda.Code.fromAsset('lambda'), // Lambda code in 'lambda' directory
        });

        // Grant Lambda permissions to read objects from the existing S3 bucket
        existingBucket.grantRead(lambdaFunction);

        // Create CloudWatch Log Group to store logs
        const logGroup = new logs.LogGroup(this, 'LambdaLogGroup', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        // Grant Lambda permissions to write logs
        lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            resources: [logGroup.logGroupArn],
        }));

        // Create a function to upload logs to S3
        lambdaFunction.addEnvironment('LOG_BUCKET', existingBucket.bucketName);

        // Lambda function code to upload logs to S3
        const lambdaLogToS3 = new lambda.Function(this, 'LambdaLogToS3', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'logToS3.handler',
            code: lambda.Code.fromInline(`
                const AWS = require('aws-sdk');
                const s3 = new AWS.S3();
                
                exports.handler = async (event) => {
                    const logMessage = "Hello";
                    const bucket = process.env.LOG_BUCKET;
                    const params = {
                        Bucket: bucket,
                        Key: 'lambda_logs/hello.log', // You can make the log filename dynamic if needed
                        Body: logMessage,
                    };

                    try {
                        await s3.putObject(params).promise();
                        console.log('Log uploaded successfully!');
                    } catch (err) {
                        console.log('Error uploading log:', err);
                    }
                };
            `),
            environment: {
                LOG_BUCKET: existingBucket.bucketName,
            },
        });

        // Grant the Lambda function permissions to put objects in S3
        existingBucket.grantPut(lambdaLogToS3);
    }
}
