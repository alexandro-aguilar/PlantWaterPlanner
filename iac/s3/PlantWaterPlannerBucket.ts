import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export default class PlantWaterPlannerBucket extends Bucket {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      bucketName: id,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS_ONLY,
    });
  }
}
