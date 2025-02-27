import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const backend =  defineBackend({
  auth,
  data,
  storage
});

const { cfnBucket: defaultBucket } = backend.storage.resources.cfnResources
defaultBucket.bucketName = 'react-upload-file-with-url'
