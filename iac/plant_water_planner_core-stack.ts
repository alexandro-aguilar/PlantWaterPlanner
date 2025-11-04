import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import GeneratePlanLambda from './lambda/GeneratePlanLambda';
import CoreApiGateway from './apiGateway/CoreApiGateway';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import IdentifyPlantLambda from './lambda/IdentifyPlantLambda';
import Environment from './core/Environment';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import PlantWaterPlannerBucket from './s3/PlantWaterPlannerBucket';
import GenerateS3PresignedUrlLambda from './lambda/GenerateS3PresignedUrlLambda';

export class PlantWaterPlannerCoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (Environment.current.STAGE === 'local') {
      new Bucket(this, 'PlantWaterPlannerHotReloadBucket', {
        bucketName: 'hot-reload',
      });
    }

    const bucket = new PlantWaterPlannerBucket(this, Environment.current.S3_BUCKET_NAME);

    const api = new CoreApiGateway(this, 'CoreApiGateway');

    const role = new Role(this, 'GeneratePlanLambdaRole', {
      roleName: 'GeneratePlanLambdaRole',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });

    new GeneratePlanLambda(this, 'GeneratePlanLambda', {
      role,
      api,
    });

    new IdentifyPlantLambda(this, 'IdentifyPlantLambda', {
      role,
      api,
      bucket,
    });

    new GenerateS3PresignedUrlLambda(this, 'GenerateS3PresginedUrlLambda', {
      role,
      bucket,
      api,
    });
  }
}
