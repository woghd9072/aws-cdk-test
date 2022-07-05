import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class CdkTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const queue = new sqs.Queue(this, 'CdkTestQueue', {
      visibilityTimeout: Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'topic', {
      displayName: 'topic-jaehong',
      topicName: 'topic-jaehong'
    });

    const table = new ddb.Table(this, 'table', {
      tableName: 'table-jaehong',
      partitionKey: {
        name: 'isbn',
        type: ddb.AttributeType.NUMBER
      }
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
      entry: 'codes/lambda/rest/src/index.ts'
    });

    const api = new apigateway.LambdaRestApi(this, 'rest-gw', {
      restApiName: 'rest-jaehong',
      handler: restFunc
    });

    // const test = api.root.addResource('api/test');
    // test.addMethod('GET', new apigateway.LambdaIntegration(restFunc));
  }
}