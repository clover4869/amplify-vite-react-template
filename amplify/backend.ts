import { defineBackend } from '@aws-amplify/backend';
import {storage} from './storage/resource'

export const backend = defineBackend({
  storage,
});

backend.addOutput({
  storage: {
    // aws_region: "ap-southeast-1",
    bucket_name: "react-upload-file-with-url",
  }
});