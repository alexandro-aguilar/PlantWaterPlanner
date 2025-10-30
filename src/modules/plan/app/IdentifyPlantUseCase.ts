import { inject, injectable } from 'inversify';
import ILogger from '../../../core/utils/ILogger';
import { types } from '../config/types';
import PlantImageAnalizeOpenAi from '../infrastructure/services/PlantImageAnalizeOpenAi';
import S3Service from '../infrastructure/services/S3Service';

@injectable()
export default class IdentifyPlanUseCase {
  constructor(
    @inject(types.Logger) private logger: ILogger,
    @inject(types.PlantImageAnalizeOpenAi) private plantImageAnalizeOpenAi: PlantImageAnalizeOpenAi,
    @inject(types.S3Service) private s3Service: S3Service
  ) {}

  async execute(plantUrl: string): Promise<string> {
    try {
      const imageBase64 = await this.s3Service.downloadFileAsBase64(plantUrl);

      const identificationResult = await this.plantImageAnalizeOpenAi.identifyPlants(imageBase64);
      const parsedResult = JSON.parse(identificationResult);
      this.logger.info('Plant identification completed', { parsedResult });
      return parsedResult;
    } catch (error) {
      this.logger.error('Error in IdentifyPlanUseCase execute:', { error });
      throw error;
    }
  }
}
