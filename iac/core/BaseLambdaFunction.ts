import Environment from './Environment';
import { FunctionProps, Function, Code, Tracing, Architecture } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface BaseLambdaFunctionProps extends Omit<FunctionProps, 'code'> {
  code: Code | string;
}

export default abstract class BaseLambdaFunction extends Function {
  constructor(scope: Construct, id: string, props: BaseLambdaFunctionProps) {
    super(scope, id, {
      ...props,
      architecture: Architecture.ARM_64,
      code:
        Environment.current.STAGE === 'local'
          ? Code.fromBucket(Bucket.fromBucketName(scope, `${id}HotReloadBucket`, 'hot-reload'), props.code as string)
          : Code.fromAsset(props.code as string),
      environment: {
        PROJECT_NAME: Environment.current.PROJECT_NAME,
        STAGE: Environment.current.STAGE,
        ...props.environment,
      },
      tracing: Tracing.ACTIVE,
    });
  }
}
