import { defineBackend } from '@aws-amplify/backend';
import { LambdaS3LogStack } from './cdk-custom/trigger-s3/trigger-s3';

export const backend = defineBackend({
});

backend.addOutput({
  storage: {
    aws_region: "ap-southeast-1",
    bucket_name: "react-upload-file-with-url",
  }
});

new LambdaS3LogStack(
  backend.createStack('LambdaS3LogStack'),
  'lambdaS3LogStack',
  {}
);