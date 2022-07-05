import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class CdkTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const topic = new sns.Topic(this, 'topic', {
      displayName: 'test-topic-jaehong',
      topicName: 'test-topic-jaehong'
    });

    const table = new ddb.Table(this, 'table', {
      tableName: 'test-table-jaehong',
      partitionKey: {
        name: 'isbn',
        type: ddb.AttributeType.NUMBER
      }
    });

    const bucket = new s3.Bucket(this, 'bucket', {
      bucketName: 'test-bucket-jaehong'
    });

    const queue = new sqs.Queue(this, 'CdkTestQueue', {
      visibilityTimeout: Duration.seconds(300),
      queueName: 'test-queue-jaehong'
    });

    const func = new lambda.Function(this, 'func-py', {
      functionName: 'func-rest-jaehong',
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("codes/lambda/sample/src"),
      handler: "handler.handle",
      environment: {
        DDB_NAME: table.tableName
      }
    })

    const restFunc = new NodejsFunction(this, 'ts-rest-func', {
      functionName: 'func-rest-jaehong-ts',
      entry: 'codes/lambda/rest/src/index.ts',
      runtime: Runtime.NODEJS_16_X
    });

    const api = new apigateway.LambdaRestApi(this, 'rest-gw', {
      restApiName: 'rest-jaehong',
      handler: restFunc,
      proxy: false
    });

    const test = api.root.addResource('test');
    test.addMethod('GET', new apigateway.LambdaIntegration(restFunc));
  }
}