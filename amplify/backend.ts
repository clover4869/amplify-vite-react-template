import { defineBackend, defineFunction } from '@aws-amplify/backend';
import { Stack } from 'aws-cdk-lib';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import {storage} from './storage/resource'

const s3TriggerFunction = defineFunction({
  name: 's3TriggerFunction',
  entry: './storage/handle.ts',
});

export const backend = defineBackend({
  storage,
});

backend.addOutput({
  storage: {
    aws_region: "ap-southeast-1",
    bucket_name: "react-upload-file-with-url",
  }
});