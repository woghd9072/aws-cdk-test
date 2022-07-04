import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as ddb from "aws-cdk-lib/aws-dynamodb";

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
    })
  }
}