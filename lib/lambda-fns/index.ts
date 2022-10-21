// importe o source map pra não ficar uma merda o mapeamento do log de erro
import 'source-map-support';
import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';

const logger = new Logger({ serviceName: 'IorranService', logLevel: 'INFO' });
// com isso e o tracing ativo no lambda vc deve conseguir ver no xray o lambda
// e verificar tempos etc.
const tracer = new Tracer({ serviceName: 'IorranService' });
tracer.provider.setLogger(logger);

// tenta criar a conexão com o banco aqui para poder compartilhar com a instância ativa
// pegue a variavel de ambiente pelo nome definido no lambda
// process.env.DB_CONNECTION

export const handler = async(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  logger.addContext(context);

  logger.info('body sempre é uma string', JSON.parse(event.body!));

  return {
    statusCode: 200,
    body: 'tai seu exemplo Iorran'
  }
}