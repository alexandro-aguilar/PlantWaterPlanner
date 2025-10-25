import { OpenAI } from 'openai';
import Environment from '../../../../core/utils/Environment';

export default class OpenAiService {
  private openAiClient: OpenAI;

  constructor() {
    this.openAiClient = new OpenAI({ apiKey: Environment.OPENAI_API_KEY || '' });
  }

  async generatePlan(plants: Array<string>): Promise<string> {
    const response = await this.openAiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Genera un plan de riego realista para las siguientes plantas (en días): ${plants.join(', ')}.
Devuelve fechas ISO (YYYY-MM-DD) para last_watered y next_watering si aplica.`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'watering_plan',
          schema: {
            type: 'object',
            properties: {
              plants: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    frequency_days: { type: 'integer' },
                    last_watered: { type: 'string' },
                    next_watering: { type: 'string' },
                  },
                  required: ['name', 'frequency_days'],
                  additionalProperties: false,
                },
              },
            },
            required: ['plants'],
            additionalProperties: false,
          },
          strict: true,
        },
      },
    });

    const text = response.choices[0]?.message?.content ?? '{}';
    return text;
  }
}
