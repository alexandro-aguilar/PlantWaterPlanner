import { Construct } from 'constructs/lib/construct';
import BaseLambdaFunction from '../core/BaseLambdaFunction';
import GeneratePlanLambdaProps from './GeneratePlanLambdaProps';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { resolve } from 'path';
import { Duration } from 'aws-cdk-lib';
import Environment from '../core/Environment';
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export default class GenerateS3PresginedUrl extends BaseLambdaFunction {
  constructor(scope: Construct, id: string, props: GeneratePlanLambdaProps) {
    super(scope, id, {
      runtime: Runtime.NODEJS_22_X,
      handler: 'IdentifyPlantHandler.handler',
      code: resolve(__dirname, '../../.dist/src/modules/plan/interface/handlers'),
      role: props.role,
      memorySize: 1024,
      timeout: Duration.seconds(60),
      environment: {
        POWERTOOLS_SERVICE_NAME: `${id}`,
        BUCKET: props.bucket?.bucketName as string,
        KEY_PREFIX: 'guest/',
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
  }
}
