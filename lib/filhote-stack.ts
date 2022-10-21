import { Duration, NestedStack, NestedStackProps } from "aws-cdk-lib";
import { IRestApi, JsonSchema, JsonSchemaType, LambdaIntegration, Model, RequestValidator } from "aws-cdk-lib/aws-apigateway";
import { ISecurityGroup, ISubnet, IVpc } from "aws-cdk-lib/aws-ec2";
import { Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export interface FilhoteStackProps extends NestedStackProps {
  vpc?: IVpc;
  securityGroup?: Array<ISecurityGroup>;
  subnet?: Array<ISubnet>;
  restApi: IRestApi;
}

export class FilhoteStack extends NestedStack {
  constructor(scope: Construct, id: string, props: FilhoteStackProps) {
    super(scope, id, props);

    // esse lambda vai fazer um insert no banco por exemplo
    const lambda = new NodejsFunction(this, 'LambdaFilhote', {
      functionName: 'lambda-filhote-do-iorran',
      entry: join(__dirname, 'lambda-fns/index.ts'),
      handler: 'handler',
      tracing: Tracing.ACTIVE,
      timeout: Duration.seconds(20), // por padrão o lambda tem tempo de vida de 3 segundos, aqui vc aumenta, mas como ta ligado ao gateway não pode ser maior que 30 segundos 
      bundling: {
        sourceMap: true,
        minify: true,
      },
      environment: {
        DB_CONNECTION: 'passa as strings de comunicação do DB aqui como variável de ambiente'
      }
    });

    /* aqui criamos um validador do payload dessa forma podemos definir 
       os tipos das variáveis e validar se todos os campos obrigatórios
       serão preenchidos

       campo1 e campo2 serão obrigatórios
       campo3 não
    */
    const schemaPost: JsonSchema = {
      title: 'schema-filhote-post',
      type: JsonSchemaType.OBJECT,
      required: ['campo1', 'campo2'],
      properties: {
        campo1: { type: JsonSchemaType.NUMBER },
        campo2: { type: JsonSchemaType.STRING },
        campo3: { type: JsonSchemaType.BOOLEAN },
      }
    }

    // associar o schema ao rest para criar o model
    const model = new Model(this, 'ModelFilhote', {
      restApi: props?.restApi,
      schema: schemaPost,
      contentType: 'application/json',
    });

    // criar um validador para o body (da pra usar pra outras coisas)
    const validatePost = new RequestValidator(this, 'ValidatorFilhote', {
      restApi: props.restApi,
      validateRequestBody: true
    });

    // vamos criar agora o endpoint integrando ao lambda e criado o path
    const root = props.restApi.root;
    const postResource = root.addResource('insert-filhote');
    postResource.addMethod('POST',
      new LambdaIntegration(lambda),
      {
        requestModels: { 'application/json': model },
        requestValidator: validatePost,
      }
    );
  }
}