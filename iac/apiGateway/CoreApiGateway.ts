import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpApi, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';

export default class CoreApiGateway extends HttpApi {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.OPTIONS, CorsHttpMethod.POST],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(10), // Cache preflight response for 10 days
      },
      apiName: id,
    });
  }
}
