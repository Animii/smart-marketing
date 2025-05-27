import { Construct } from "constructs";
import { Lambda } from "../../../../common/lambda";
import * as path from "node:path";
import type { DynamoDBTable } from "../../../../common/dynamodb";
import {
	AuthorizationType,
	Cors,
	EndpointType,
} from "aws-cdk-lib/aws-apigateway";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { RestApi } from "../../../../common/rest-api";
import type { EventBus } from "../../../../common/event-bridge";
export interface CreateBusinessIdeaConstructProps {
	table: DynamoDBTable;
	eventBus: EventBus;
}
export class CreateBusinessIdeaConstruct extends Construct {
	private readonly apiGateway: RestApi;

	constructor(
		scope: Construct,
		id: string,
		{ table, eventBus }: CreateBusinessIdeaConstructProps,
	) {
		super(scope, id);

		const lambda = new Lambda(this, "CreateBusinessIdeaLambda", {
			handler: "index.handler",
			entry: path.join(__dirname, "lambda/handler.ts"),
			environment: {
				BUSINESS_IDEA_TABLE_NAME: table.tableName,
				EVENT_BUS_NAME: eventBus.eventBusName,
			},
		});
		table.grantReadWriteData(lambda);
		eventBus.grantPutEventsTo(lambda);

		this.apiGateway = new RestApi(this, "CreateRecommendationsApi");
		this.apiGateway.addLambdaIntegration(lambda, "create-business-idea");
	}

	getApiGatewayUrl() {
		return `${this.apiGateway.url}create-business-idea`;
	}
}
