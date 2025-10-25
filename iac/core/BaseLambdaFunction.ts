import Environment from './Environment';
import { FunctionProps, Function, Code, Tracing } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface BaseLambdaFunctionProps extends Omit<FunctionProps, 'code'> {
  code: Code | string;
}

export default abstract class BaseLambdaFunction extends Function {
  constructor(scope: Construct, id: string, props: BaseLambdaFunctionProps) {
    super(scope, id, {
      ...props,
      code:
        Environment.stage === 'local'
          ? Code.fromBucket(Bucket.fromBucketName(scope, 'HotReloadBucket', 'hot-reload'), props.code as string)
          : Code.fromAsset(props.code as string),
      environment: {
        PROJECT_NAME: Environment.projectName,
        STAGE: Environment.projectName,
        POWERTOOLS_LOG_LEVEL: Environment.projectName,
        ...props.environment,
      },
      tracing: Tracing.ACTIVE,
    });
  }
}
