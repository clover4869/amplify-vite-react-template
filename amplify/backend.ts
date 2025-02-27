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

const { s3TriggerFunction: fn } = backend;
const stack = Stack.of(fn);

const existingBucket: IBucket = Bucket.fromBucketName(
  stack,
  'ExistingBucket',
  'react-upload-file-with-url' // Replace with your bucket name
);

fn.addEventSourceMapping('S3Trigger', {
  eventSourceArn: existingBucket.bucketArn,
  eventSourceParams: {
    s3: {
      event: 's3:ObjectCreated:*',
    },
  },
});