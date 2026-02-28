import { Readable } from 'stream';
import S3Service from '../../../../../../src/modules/plan/infrastructure/services/S3Service';
import Environment from '../../../../../../src/core/utils/Environment';
import { S3Client } from '@aws-sdk/client-s3';

const logger = {
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  addContext: jest.fn(),
};

describe('S3Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('given object exists when downloading as base64 then returns encoded string', async () => {
    // Given
    const body = Buffer.from('hello');
    const stream = Readable.from(body);
    jest.spyOn(S3Client.prototype as any, 'send').mockResolvedValueOnce({ Body: stream });
    const svc = new S3Service(logger as any);

    // When
    const base64 = await svc.downloadFileAsBase64('path/file.txt');

    // Then
    expect(base64).toBe(body.toString('base64'));
  });

  it('given missing object when checking existence then returns false for NoSuchKey', async () => {
    // Given
    const error: any = new Error('nope');
    error.name = 'NoSuchKey';
    jest.spyOn(S3Client.prototype as any, 'send').mockRejectedValueOnce(error);
    const svc = new S3Service(logger as any);

    // When
    const exists = await svc.fileExists('missing');

    // Then
    expect(exists).toBe(false);
  });

  it('given missing body when downloading then throws explicit error', async () => {
    // Given
    jest.spyOn(S3Client.prototype as any, 'send').mockResolvedValueOnce({ Body: undefined });
    const svc = new S3Service(logger as any);

    // When / Then
    await expect(svc.downloadFile('key')).rejects.toThrow(
      `File not found: key in bucket: ${Environment.S3_BUCKET_NAME}`
    );
  });
});
