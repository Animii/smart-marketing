import { CfnOutput, Stack } from "aws-cdk-lib";
import type { Construct } from "constructs";
import { CreateBusinessIdeaConstruct } from "./construct/create-business-idea";
import { CreateRecommendationsConstruct } from "./construct/create-recommendations";
import { DynamoDBTable } from "../../common/dynamodb";
import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { EventBus } from "../../common/event-bridge";

export class MarketingStack extends Stack {
	constructor(scope: Construct, id: string) {
		super(scope, id);

		const eventBus = new EventBus(this, "EventBus");

		const businessIdeaTable = new DynamoDBTable(this, "BusinessIdeaTable", {
			tableName: "BusinessIdeaTable",
			partitionKey: { name: "PK", type: AttributeType.STRING },
			sortKey: { name: "SK", type: AttributeType.STRING },
		});

		const createBusinessIdeaConstruct = new CreateBusinessIdeaConstruct(
			this,
			"CreateBusinessIdeaConstruct",
			{ table: businessIdeaTable, eventBus },
		);

		const createRecommendationsConstruct = new CreateRecommendationsConstruct(
			this,
			"CreateRecommendationsConstruct",
			{ table: businessIdeaTable, eventBus },
		);
		new CfnOutput(this, "CreateBusinessIdeaUrl", {
			value: createBusinessIdeaConstruct.getApiGatewayUrl(),
		});
		new CfnOutput(this, "CreateRecommendationsUrl", {
			value: createRecommendationsConstruct.getApiGatewayUrl(),
		});
	}
}
