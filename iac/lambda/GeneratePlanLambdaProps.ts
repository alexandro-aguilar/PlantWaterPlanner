import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export default interface GeneratePlanLambdaProps {
  role: Role;
  bucket?: Bucket;
  api: HttpApi;
}
