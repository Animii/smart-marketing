import { QueryRecommendationsUseCase } from "../../../../application/use-case/query-recommendations-use-case";
import { BusinessIdeaRepository } from "../../../repository/business-idea-repository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { APIGatewayProxyEvent } from "aws-lambda";
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
	"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};
export class QueryRecommendationsLambdaHandler {
	constructor(
		private readonly queryRecommendationsUseCase: QueryRecommendationsUseCase,
	) {}

	async handle(event: APIGatewayProxyEvent) {
		console.log(event);
		const businessIdeaId = event.queryStringParameters?.id;
		if (!businessIdeaId) {
			return { statusCode: 400, body: "Business idea ID is required" };
		}

		const recommendations = await this.queryRecommendationsUseCase.execute({
			businessIdeaId,
		});

		return {
			statusCode: 200,
			body: JSON.stringify(recommendations),
			headers: CORS_HEADERS,
		};
	}
}

const queryRecommendationsLambdaHandler = new QueryRecommendationsLambdaHandler(
	new QueryRecommendationsUseCase(
		new BusinessIdeaRepository(
			new DynamoDBClient({}),
			process.env.BUSINESS_IDEA_TABLE_NAME as string,
		),
	),
);

export const handler = async (event: APIGatewayProxyEvent) => {
	return await queryRecommendationsLambdaHandler.handle(event);
};
