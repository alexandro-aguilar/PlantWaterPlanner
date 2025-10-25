import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import GeneratePlanLambda from './lambda/GeneratePlanLambda';
import CoreApiGateway from './apiGateway/CoreApiGateway';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import Environment from './core/Environment';

export class PlantWaterPlannerCoreStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new CoreApiGateway(this, 'CoreApiGateway');

    const role = new Role(this, 'GeneratePlanLambdaRole', {
      roleName: 'GeneratePlanLambdaRole',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });
    console.log('hola:', process.env.OPENAI_API_KEY, Environment);
    new GeneratePlanLambda(this, 'GeneratePlanLambda', {
      role,
      api,
    });
  }
}
