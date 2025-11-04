import { BlockPublicAccess, Bucket, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export default class PlantWaterPlannerBucket extends Bucket {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      bucketName: id,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS_ONLY,
      cors: [
        {
          allowedMethods: [HttpMethods.PUT, HttpMethods.GET, HttpMethods.HEAD],
          allowedOrigins: ['*'],
          allowedHeaders: [
            'content-type',
            'x-amz-acl',
            'x-amz-meta-*',
            'x-amz-date',
            'authorization',
            'x-amz-security-token',
            'access-control-allow-origin',
          ],
          exposedHeaders: ['ETag'],
          maxAge: 300,
        },
      ],
    });
  }
}
