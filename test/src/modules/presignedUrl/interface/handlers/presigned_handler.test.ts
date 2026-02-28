const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  addContext: jest.fn(),
};

jest.mock('../../../../../../src/modules/presignedUrl/config/container', () => ({
  container: {
    get: jest.fn(() => mockLogger),
  },
}));

const getSignedUrl = jest.fn();

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args: any[]) => getSignedUrl(...args),
}));

describe('GenerateS3PresignedUrlHandler', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, S3_BUCKET_NAME: 'bucket', TMP_KEY_PREFIX: 'tmp/', PRESIGN_EXPIRES_SECONDS: '60', ALLOWED_MIME_TYPES: 'image/jpeg,image/jpg' };
    jest.resetModules();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('given missing filename when requesting URL then returns 400', async () => {
    // Given
    const { handler } = await import('../../../../../../src/modules/presignedUrl/interface/handlers/GenerateS3PresignedUrlHandler');
    const event: any = { queryStringParameters: { contentType: 'image/jpeg' } };

    // When
    const resp: any = await handler(event, { awsRequestId: 'req-1' } as any);

    // Then
    expect(resp.statusCode).toBe(400);
  });

  it('given unsupported content type when requesting URL then returns 415', async () => {
    // Given
    const { handler } = await import('../../../../../../src/modules/presignedUrl/interface/handlers/GenerateS3PresignedUrlHandler');
    const event: any = { queryStringParameters: { filename: 'photo.jpg', contentType: 'text/plain' } };

    // When
    const resp: any = await handler(event, { awsRequestId: 'req-2' } as any);

    // Then
    expect(resp.statusCode).toBe(415);
  });

  it('given valid request when requesting URL then returns presigned url', async () => {
    // Given
    getSignedUrl.mockResolvedValue('signed-url');
    const { handler } = await import('../../../../../../src/modules/presignedUrl/interface/handlers/GenerateS3PresignedUrlHandler');
    const event: any = { queryStringParameters: { filename: 'photo.jpg', contentType: 'image/jpeg' } };

    // When
    const resp: any = await handler(event, { awsRequestId: 'req-3' } as any);

    // Then
    expect(resp.statusCode).toBe(200);
    expect(JSON.parse(resp.body).url).toBe('signed-url');
    expect(mockLogger.addContext).toHaveBeenCalledWith({ requestId: 'req-3' });
  });
});

export {};
