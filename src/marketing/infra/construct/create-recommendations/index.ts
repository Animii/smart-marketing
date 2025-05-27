import { Construct } from "constructs";
import { Lambda } from "../../../../common/lambda";
import * as path from "node:path";
import type { DynamoDBTable } from "../../../../common/dynamodb";

import type { RestApi } from "../../../../common/rest-api";
import type { EventBus } from "../../../../common/event-bridge";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Rule } from "aws-cdk-lib/aws-events";
import { SqsQueue } from "aws-cdk-lib/aws-events-targets";
import { Duration } from "aws-cdk-lib";
import { QueueWithDLQ } from "../../../../common/sqs";
import type { BusinessIdeaCreatedEvent } from "../../../domain/event";
export interface CreateRecommendationsConstructProps {
	table: DynamoDBTable;
	eventBus: EventBus;
}
export class CreateRecommendationsConstruct extends Construct {
	constructor(
		scope: Construct,
		id: string,
		{ table, eventBus }: CreateRecommendationsConstructProps,
	) {
		super(scope, id);

		const lambda = new Lambda(this, "CreateRecommendationsLambda", {
			handler: "index.handler",
			entry: path.join(__dirname, "lambda/handler.ts"),
			environment: {
				BUSINESS_IDEA_TABLE_NAME: table.tableName,
				OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
				EVENT_BUS_NAME: eventBus.eventBusName,
			},
		});
		table.grantReadWriteData(lambda);
		eventBus.grantPutEventsTo(lambda);

		const sqs = new QueueWithDLQ(this, "CreateRecommendationsQueue", {
			queueName: "create-recommendations-queue",
			visibilityTimeout: Duration.seconds(300),
		});

		lambda.addEventSource(
			new SqsEventSource(sqs, {
				batchSize: 1,
			}),
		);
		sqs.grantSendMessages(lambda);
		const rule = new Rule(this, "CreateRecommendationsRule", {
			eventBus,
			eventPattern: {
				source: ["marketing" satisfies BusinessIdeaCreatedEvent["source"]],
				detailType: [
					"BusinessIdeaCreated" satisfies BusinessIdeaCreatedEvent["detailType"],
				],
			},
		});

		rule.addTarget(new SqsQueue(sqs));
	}

	getApiGatewayUrl() {
		return "";
	}
}
