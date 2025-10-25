import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { Role } from 'aws-cdk-lib/aws-iam';

export default interface GeneratePlanLambdaProps {
  role: Role;
  bucket?: string;
  api: HttpApi;
}
