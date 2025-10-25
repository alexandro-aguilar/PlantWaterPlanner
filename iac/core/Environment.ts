export default class Environment {
  private static instance: Environment;

  public readonly stage: string;
  public readonly projectName: string;
  public readonly OPENAI_API_KEY: string;

  private constructor() {
    this.stage = process.env.STAGE || 'local';
    this.projectName = process.env.PROJECT_NAME || 'PlantWaterPlanner';
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  // Convenience method to get the instance and access properties directly
  public static get current(): Environment {
    return Environment.getInstance();
  }
}
