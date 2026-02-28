describe('Environment (src/core/utils)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    jest.resetModules();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('given no overrides when loading environment then defaults are set and TLS is relaxed for local', async () => {
    // Given
    delete process.env.STAGE;

    // When
    const Environment = (await import('../../../../src/core/utils/Environment')).default;

    // Then
    expect(Environment.STAGE).toBe('local');
    expect(Environment.S3_BUCKET_NAME).toBe('plant-water-planner-bucket');
    expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBe('0');
  });

  it('given stage is non-local when loading environment then TLS is not modified and stage is preserved', async () => {
    // Given
    process.env.STAGE = 'dev';
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;

    // When
    const Environment = (await import('../../../../src/core/utils/Environment')).default;

    // Then
    expect(Environment.STAGE).toBe('dev');
    expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBeUndefined();
  });

  it('given env overrides when loading environment then values reflect overrides', async () => {
    // Given
    process.env.STAGE = 'prod';
    process.env.S3_BUCKET_NAME = 'custom-bucket';
    process.env.OPENAI_API_KEY = 'abc';

    // When
    const Environment = (await import('../../../../src/core/utils/Environment')).default;

    // Then
    expect(Environment.STAGE).toBe('prod');
    expect(Environment.S3_BUCKET_NAME).toBe('custom-bucket');
    expect(Environment.OPENAI_API_KEY).toBe('abc');
  });
});
