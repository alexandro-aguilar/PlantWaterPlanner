import { APIGatewayProxyEventV2 } from 'aws-lambda';

export default interface ParsedAPIGatewayProxyEventV2<T = object> extends Omit<APIGatewayProxyEventV2, 'body'> {
  body: T;
}
