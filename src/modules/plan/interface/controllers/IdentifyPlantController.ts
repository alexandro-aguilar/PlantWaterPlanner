import { inject, injectable } from 'inversify';
import { types } from '../../config/types';
import ILogger from '../../../../core/utils/ILogger';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda/trigger/api-gateway-proxy';
import IdentifyPlantUseCase from '../../app/IdentifyPlantUseCase';

@injectable()
export default class IdentifyPlantController {
  constructor(
    @inject(types.Logger) private logger: ILogger,
    @inject(types.IdentifyPlantUseCase) private identifyPlantUseCase: IdentifyPlantUseCase
  ) {}

  async execute(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
      const body = JSON.parse(event.body || '{}');
      this.logger.info('body:', { body });
      const plantPath: string = body.plant;
      this.logger.info('Received plantPath:', { plantPath });
      const result = await this.identifyPlantUseCase.execute(plantPath);
      this.logger.info('Identified Plants:', { result });
      return {
        statusCode: 200,
        body: JSON.stringify({
          result,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } catch (error) {
      this.logger.error('Error identifying plants:', { error });
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to identify plants',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  }
}
