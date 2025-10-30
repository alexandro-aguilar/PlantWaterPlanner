import { inject, injectable } from 'inversify';
import { types } from '../../config/types';
import OpenAiService from '../../infrastructure/services/OpenAiService';
import ILogger from '../../../../core/utils/ILogger';

@injectable()
export default class GeneratePlanController {
  constructor(
    @inject(types.Logger) private logger: ILogger,
    @inject(types.OpenAiService) private openAiService: OpenAiService
  ) {}

  async execute(plants: Array<string>): Promise<string> {
    this.logger.info('GeneratePlanController executed', { plants });

    const startTime = Date.now();
    const response = await this.openAiService.generatePlan(plants);
    const executionTime = Date.now() - startTime;

    this.logger.info('Generated Plan:', { response, executionTimeMs: executionTime });
    return response;
  }
}
