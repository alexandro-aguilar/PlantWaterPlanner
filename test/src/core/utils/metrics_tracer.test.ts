import MetricsService from '../../../../src/core/utils/MetricsService';
import TracerService from '../../../../src/core/utils/TracerService';
import Environment from '../../../../src/core/utils/Environment';

const metricsCtor = jest.fn();
const tracerCtor = jest.fn();

jest.mock('@aws-lambda-powertools/metrics', () => ({
  Metrics: jest.fn().mockImplementation((args) => {
    metricsCtor(args);
    return { name: 'metrics-mock' };
  }),
}));

jest.mock('@aws-lambda-powertools/tracer', () => ({
  Tracer: jest.fn().mockImplementation((args) => {
    tracerCtor(args);
    return { name: 'tracer-mock' };
  }),
}));

describe('MetricsService', () => {
  it('given construction when created then initializes metrics with defaults', () => {
    // When
    const svc = new MetricsService();

    // Then
    expect(metricsCtor).toHaveBeenCalledWith(
      expect.objectContaining({
        namespace: Environment.PROJECT_NAME,
        serviceName: Environment.POWERTOOLS_SERVICE_NAME,
        defaultDimensions: expect.objectContaining({ environment: Environment.STAGE }),
      })
    );
    expect((svc as any)._metrics).toEqual({ name: 'metrics-mock' });
  });
});

describe('TracerService', () => {
  it('given construction when created then initializes tracer with service name', () => {
    // When
    const svc = new TracerService();

    // Then
    expect(tracerCtor).toHaveBeenCalledWith({ serviceName: Environment.POWERTOOLS_SERVICE_NAME });
    expect((svc as any)._tracer).toEqual({ name: 'tracer-mock' });
  });
});
