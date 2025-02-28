import { defineBackend } from '@aws-amplify/backend';
// import { SqsConsumerStack } from './cdk-custom/consumer-sqs/resource';
import { S3TriggerStack } from './cdk-custom/trigger-s3/resource';
import { HelloWorldLambdaStack } from './cdk-custom/helloworld/resource';

export const backend = defineBackend({
});


// new SqsConsumerStack(
//     backend.createStack('SqsConsumerStack'),
//     'sqsConsumerStack',
//     {}
// );
new S3TriggerStack(
    backend.createStack('S3TriggerStack'),
    's3TriggerStack',
    {}
);

new HelloWorldLambdaStack(
    backend.createStack('HelloWorldLambdaStack'),
    'helloWorldLambdaResource',
    {}
  );