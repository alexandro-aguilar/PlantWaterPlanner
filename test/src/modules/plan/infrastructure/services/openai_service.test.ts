import OpenAiService from '../../../../../../src/modules/plan/infrastructure/services/OpenAiService';

const create = jest.fn();

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: { create },
      },
    })),
  };
});

describe('OpenAiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('given plants list when generating plan then returns text content from first choice', async () => {
    // Given
    create.mockResolvedValue({ choices: [{ message: { content: '{"ok":true}' } }] });
    const svc = new OpenAiService();

    // When
    const result = await svc.generatePlan(['fern']);

    // Then
    expect(create).toHaveBeenCalled();
    expect(result).toBe('{"ok":true}');
  });

  it('given missing content when generating plan then returns empty object string', async () => {
    // Given
    create.mockResolvedValue({ choices: [{}] });
    const svc = new OpenAiService();

    // When
    const result = await svc.generatePlan(['fern']);

    // Then
    expect(result).toBe('{}');
  });
});
