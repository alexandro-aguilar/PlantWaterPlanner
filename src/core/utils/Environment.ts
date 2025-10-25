export default class Environment {
  static readonly STAGE = process.env.STAGE || 'local';
  static readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
  static readonly POWERTOOLS_SERVICE_NAME = process.env.POWERTOOLS_SERVICE_NAME || 'plant-water-planner-core';
  static readonly POWERTOOLS_LOG_LEVEL = process.env.POWERTOOLS_LOG_LEVEL || 'INFO';
  static readonly PROJECT_NAME = process.env.PROJECT_NAME || 'PlantWaterPlanner';
}
