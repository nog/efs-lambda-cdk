import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

export class EfsLambdaCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCの作成
    const vpc = new ec2.Vpc(this, 'MyVPC', {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    });

    // EFSファイルシステムの作成
    const fileSystem = new efs.FileSystem(this, 'MyEfsFileSystem', {
      vpc,
      lifecyclePolicy: efs.LifecyclePolicy.AFTER_14_DAYS,
      performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
      encrypted: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    
    // EFSアクセスポイントの作成
    const accessPoint = fileSystem.addAccessPoint('MyAccessPoint', {
      createAcl: {
        ownerGid: '1001',
        ownerUid: '1001',
        permissions: '750'
      },
      path: '/lambda',
      posixUser: {
        gid: '1001',
        uid: '1001'
      },
    });

    // Lambda関数の作成
    const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.RUBY_3_3,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      vpc,
      filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/efs'),
      environment: {
        EFS_PATH: '/mnt/efs'
      },
    });

    // EFSへのアクセス権限を付与
    lambdaFunction.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonElasticFileSystemClientFullAccess')
    );
  }
}