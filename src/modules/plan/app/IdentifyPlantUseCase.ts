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
      this.logger.info('IdentifyPlanUseCase', { plantUrl });
      const imageBase64 = await this.s3Service.downloadFileAsBase64(plantUrl);
      this.logger.info('IdentifyPlanUseCase', { imageBase64Length: imageBase64.length });
      const identificationResult = await this.plantImageAnalizeOpenAi.identifyPlants(imageBase64);
      return JSON.parse(identificationResult);
    } catch (error) {
      this.logger.error('Error in IdentifyPlanUseCase execute:', { error });
      throw error;
    }
  }
}
