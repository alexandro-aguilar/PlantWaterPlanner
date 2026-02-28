import Environment from '../iac/core/Environment';

type MutableEnvironment = {
  instance?: unknown;
};

const resetEnvironmentSingleton = () => {
  (Environment as unknown as MutableEnvironment).instance = undefined;
};

describe('Environment', () => {
  const baseEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...baseEnv };
    resetEnvironmentSingleton();
  });

  it('given no env overrides when loading environment then uses local defaults with suffixed bucket', () => {
    // Given no STAGE or S3_BUCKET_NAME overrides
    delete process.env.STAGE;
    delete process.env.S3_BUCKET_NAME;

    // When
    const env = Environment.current;

    // Then
    expect(env.STAGE).toBe('local');
    expect(env.S3_BUCKET_NAME).toBe('plant-water-planner-bucket-local');
  });

  it('given STAGE is mixed case when loading environment then stage is lowercased and bucket is suffixed', () => {
    // Given
    process.env.STAGE = 'DeV';
    delete process.env.S3_BUCKET_NAME;

    // When
    const env = Environment.current;

    // Then
    expect(env.STAGE).toBe('dev');
    expect(env.S3_BUCKET_NAME).toBe('plant-water-planner-bucket-dev');
  });

  it('given custom bucket name when loading environment then uses provided bucket without suffix', () => {
    // Given
    process.env.STAGE = 'prod';
    process.env.S3_BUCKET_NAME = 'custom-bucket';

    // When
    const env = Environment.current;

    // Then
    expect(env.STAGE).toBe('prod');
    expect(env.S3_BUCKET_NAME).toBe('custom-bucket');
  });
});
