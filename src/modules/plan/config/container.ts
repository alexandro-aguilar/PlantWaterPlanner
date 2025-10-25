import { Container } from 'inversify';
import { types } from './types';
import ILogger from '../../../core/utils/ILogger';
import PowertoolsLoggerAdapter from '../../../core/utils/Logger';
import MetricsService from '../../../core/utils/MetricsService';
import TracerService from '../../../core/utils/TracerService';
import OpenAiService from '../infrastructure/services/OpenAiService';
import GeneratePlanController from '../interface/controllers/GeneratePlanController';

export const container = new Container();

container.bind<ILogger>(types.Logger).to(PowertoolsLoggerAdapter).inSingletonScope();
container.bind<MetricsService>(types.MetricsService).to(MetricsService);
container.bind<TracerService>(types.TracerService).to(TracerService);
container.bind<GeneratePlanController>(types.GeneratePlanController).to(GeneratePlanController);
container.bind<OpenAiService>(types.OpenAiService).to(OpenAiService);
