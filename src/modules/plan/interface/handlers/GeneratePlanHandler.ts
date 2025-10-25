import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda';
import ILogger from '../../../../core/utils/ILogger';
import TracerService from '../../../../core/utils/TracerService';
import { container } from '../../config/container';
import { types } from '../../config/types';
import middy from '@middy/core';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import GeneratePlanController from '../controllers/GeneratePlanController';

const tracer = container.get<TracerService>(types.TracerService).tracer;
const logger: ILogger = container.get(types.Logger);

export const handler = middy(
  async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> => {
    logger.addContext({ requestId: context.awsRequestId });
    logger.info('env:', { env: process.env });

    const body = JSON.parse(event.body || '{}');
    const plants: Array<string> = body.plants;

    const generatePlanController = container.get<GeneratePlanController>(types.GeneratePlanController);
    const plan = await generatePlanController.execute(plants);

    return {
      statusCode: 200,
      body: JSON.stringify({
        plan,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
).use(captureLambdaHandler(tracer));
