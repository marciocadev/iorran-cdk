import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PrivateSubnet, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class IorranCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // deixe o gateway na stack principal pra poder ser compartilhado entre as stacks
    const rest = new RestApi(this, 'RestApi', {
      restApiName: 'iorran-gateway',
    });

    // estou assumindo que vc vai importar a VPC, SecurityGroup e Subnet
    const vpc = Vpc.fromLookup(this, 'VpcImport', {
      vpcId: 'identificador-da-vpc-existente',
    });
    const securityGroup = SecurityGroup.fromSecurityGroupId(
      this, // scope
      'SecurityGroupImport', // id
      'identificador-do-security-group-existente', // securityGroupId
    );
    const subnet1 = PrivateSubnet.fromPrivateSubnetAttributes(this, 'SubnetImport1', {
      subnetId: 'identificador-da-subnet'
    });


  }
}
