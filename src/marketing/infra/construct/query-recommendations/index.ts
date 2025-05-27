import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "node:path";
import { Lambda } from "../../../../common/lambda";
import type { DynamoDBTable } from "../../../../common/dynamodb";
import { RestApi } from "../../../../common/rest-api";

export interface QueryRecommendationsConstructProps {
	table: DynamoDBTable;
}

export class QueryRecommendationsConstruct extends Construct {
	constructor(
		scope: Construct,
		id: string,
		{ table }: QueryRecommendationsConstructProps,
	) {
		super(scope, id);

		const lambda = new Lambda(this, "QueryRecommendationsLambda", {
			handler: "index.handler",
			entry: path.join(__dirname, "lambda/handler.ts"),
			environment: {
				BUSINESS_IDEA_TABLE_NAME: table.tableName,
			},
		});
		table.grantReadWriteData(lambda);

		const apiGateway = new RestApi(this, "QueryRecommendationsApi");
		apiGateway.addLambdaIntegration(lambda, "query-recommendations", "GET");

		new CfnOutput(this, "QueryRecommendationsUrl", {
			value: `${apiGateway.url}query-recommendations`,
		});
	}
}
