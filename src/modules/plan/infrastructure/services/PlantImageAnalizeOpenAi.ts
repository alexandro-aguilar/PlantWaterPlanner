import { OpenAI } from 'openai';
import Environment from '../../../../core/utils/Environment';
import { inject, injectable } from 'inversify';
import ILogger from '../../../../core/utils/ILogger';
import { types } from '../../config/types';

@injectable()
export default class OpenAiVisionService {
  private openAiClient: OpenAI;

  constructor(@inject(types.Logger) private logger: ILogger) {
    this.openAiClient = new OpenAI({ apiKey: Environment.OPENAI_API_KEY || '' });
  }

  private async analyzeImage(imageBase64: string, prompt: string): Promise<string> {
    this.logger.info('apikey', { key: Environment.OPENAI_API_KEY });
    this.logger.info('Analyzing image with OpenAI Vision API');
    try {
      const response = await this.openAiClient.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });
      this.logger.info('Analysis', { response });
      return response.choices[0]?.message?.content ?? '';
    } catch (error) {
      this.logger.error('Error analyzeImage:', { error });
      throw error;
    }
  }

  async identifyPlants(imageBase64: string): Promise<string> {
    try {
      this.logger.info('imageBase64 Analize', { length: imageBase64.length });
      const prompt = `Analiza esta imagen e identifica todas las plantas que puedas ver. 
  Para cada planta proporciona:
  - Nombre común y científico si es posible
  - Recomendaciones de riego (frecuencia en días)
  - Estado aparente de la planta (saludable, necesita agua, etc.)
  
  Devuelve la respuesta en formato JSON con la siguiente estructura:
  {
    "plants": [
      {
        "name": "string",
        "scientific_name": "string",
        "watering_frequency_days": number,
        "current_condition": "string",
        "care_notes": "string"
      }
    ]
  }`;

      return await this.analyzeImage(imageBase64, prompt);
    } catch (error) {
      this.logger.error('Error in identifyPlants:', { error });
      throw error;
    }
  }
}
