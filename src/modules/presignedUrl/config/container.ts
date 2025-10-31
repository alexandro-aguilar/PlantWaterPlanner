import { Container } from 'inversify';
import { types } from './types';
import ILogger from '../../../core/utils/ILogger';
import PowertoolsLoggerAdapter from '../../../core/utils/Logger';
import MetricsService from '../../../core/utils/MetricsService';
import TracerService from '../../../core/utils/TracerService';

export const container = new Container();

container.bind<ILogger>(types.Logger).to(PowertoolsLoggerAdapter).inSingletonScope();
container.bind<MetricsService>(types.MetricsService).to(MetricsService);
container.bind<TracerService>(types.TracerService).to(TracerService);
