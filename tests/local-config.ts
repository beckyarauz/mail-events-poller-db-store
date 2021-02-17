import * as AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION_TEST,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_TEST,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_TEST,
});
