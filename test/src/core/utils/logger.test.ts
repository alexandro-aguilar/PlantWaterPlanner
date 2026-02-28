import PowertoolsLoggerAdapter from '../../../../src/core/utils/Logger';
import { LogLevel } from '@aws-lambda-powertools/logger';

const info = jest.fn();
const debug = jest.fn();
const error = jest.fn();
const warn = jest.fn();
const appendPersistentKeys = jest.fn();

jest.mock('@aws-lambda-powertools/logger', () => {
  return {
    LogLevel: { INFO: 'INFO', DEBUG: 'DEBUG', ERROR: 'ERROR', WARN: 'WARN' },
    Logger: jest.fn().mockImplementation(() => ({ info, debug, error, warn, appendPersistentKeys })),
  };
});

describe('PowertoolsLoggerAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('given message only when logging then delegates to info without payload', () => {
    // Given
    const logger = new PowertoolsLoggerAdapter();

    // When
    logger.info('hello');

    // Then
    expect(info).toHaveBeenCalledWith('hello');
  });

  it('given message and object when logging then stringifies payload', () => {
    // Given
    const logger = new PowertoolsLoggerAdapter();
    const payload = { foo: 'bar' };

    // When
    logger.debug('debug', payload);

    // Then
    expect(debug).toHaveBeenCalledWith('debug', JSON.stringify(payload));
  });

  it('given context when adding context then appends persistent keys', () => {
    // Given
    const logger = new PowertoolsLoggerAdapter();
    const context = { requestId: 'abc' };

    // When
    logger.addContext(context);

    // Then
    expect(appendPersistentKeys).toHaveBeenCalledWith(context);
  });
});
