import { defineBackend, defineFunction } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';

const s3TriggerFunction = defineFunction({
  name: 's3TriggerFunction',
  entry: './storage/handle.ts',
});

export const backend = defineBackend({
  s3TriggerFunction,
});

backend.addOutput({
  storage: {
    aws_region: "ap-southeast-1",
    bucket_name: "react-upload-file-with-url",
    triggers: {
      create: {
        function: s3TriggerFunction, // This is the Lambda function that gets triggered
        event: 's3:ObjectCreated:*' // Trigger on object creation in the S3 bucket
      }
    }
  }
});