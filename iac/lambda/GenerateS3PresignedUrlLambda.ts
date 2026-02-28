import { Construct } from 'constructs/lib/construct';
import BaseLambdaFunction from '../core/BaseLambdaFunction';
import GeneratePlanLambdaProps from './GeneratePlanLambdaProps';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { resolve } from 'path';
import { Duration } from 'aws-cdk-lib';
import Environment from '../core/Environment';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpMethod, HttpRoute, HttpRouteKey } from 'aws-cdk-lib/aws-apigatewayv2';

export default class GenerateS3PresignedUrlLambda extends BaseLambdaFunction {
  constructor(scope: Construct, id: string, props: GeneratePlanLambdaProps) {
    super(scope, id, {
      functionName: `${id}-${Environment.current.STAGE}`,
      runtime: Runtime.NODEJS_24_X,
      handler: 'GenerateS3PresignedUrlHandler.handler',
      code: resolve(__dirname, '../../.dist/src/modules/presignedUrl/interface/handlers'),
      role: props.role,
      memorySize: 1024,
      timeout: Duration.seconds(60),
      environment: {
        POWERTOOLS_SERVICE_NAME: `${id}-${Environment.current.STAGE}`,
        S3_BUCKET_NAME: props.bucket?.bucketName as string,
        TMP_KEY_PREFIX: 'tmp/',
        PRESIGN_EXPIRES_SECONDS: '60',
        ALLOWED_MIME_TYPES: 'image/jpeg,image/jpg',
        STAGE: Environment.current.STAGE,
        // LocalStack-specific environment variables
        ...(Environment.current.STAGE === 'local' && {
          NODE_TLS_REJECT_UNAUTHORIZED: '0',
        }),
      },
    });

    const s3AccessPolicy = new Policy(scope, `${id}LambdaS3AccessPolicy`, {
      statements: [
        new PolicyStatement({
          actions: ['s3:PutObject'],
          resources: [`${props.bucket?.bucketArn}/*`],
        }),
      ],
    });

    this.role?.attachInlinePolicy(s3AccessPolicy);

    const integration = new HttpLambdaIntegration(`${id}Integration`, this);

    new HttpRoute(scope, `${id}Route`, {
      httpApi: props.api,
      routeKey: HttpRouteKey.with('/get-upload-url', HttpMethod.GET),
      integration,
    });
  }
}
