# iorran-cdk

vou deixar este exemplo com a implementação de um endpoint em uma nested stack, gostto de fazer assim pq posso deixar a lógica separada por stack, se vc quiser pode deixar tudo na stack principal mas com esse exemplo da pra vc ver como fazer com uma stack raiz e outra stack dependente, pode tentar tb isolar a nested stack por funcionalidade, um crud de um clinet poderia estar numa stack enquanto o crud das compras desse cliente pode estar em outra

Se vira ai

## Criar o projeto
* cdk init -l typescript

## VPC, security group e subnet

Estou assumindo que vc vai usar uma VPC, subnet e security group existente, então coloquei um modelo de import no código

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
