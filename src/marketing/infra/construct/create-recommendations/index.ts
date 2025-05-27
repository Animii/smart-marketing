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
export interface CreateRecommendationsConstructProps {
	table: DynamoDBTable;
}
export class CreateRecommendationsConstruct extends Construct {
	private readonly apiGateway: RestApi;

	constructor(
		scope: Construct,
		id: string,
		{ table }: CreateRecommendationsConstructProps,
	) {
		super(scope, id);

		const lambda = new Lambda(this, "CreateRecommendationsLambda", {
			handler: "index.handler",
			entry: path.join(__dirname, "lambda/handler.ts"),
			environment: {
				BUSINESS_IDEA_TABLE_NAME: table.tableName,
				OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
			},
		});
		table.grantReadWriteData(lambda);

		this.apiGateway = new RestApi(this, "CreateRecommendationsApi");
		this.apiGateway.addLambdaIntegration(lambda, "create-recommendations");
	}

	getApiGatewayUrl() {
		return `${this.apiGateway.url}create-recommendations`;
	}
}
