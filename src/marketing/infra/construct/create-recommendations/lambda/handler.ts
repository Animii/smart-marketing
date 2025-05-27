import type { APIGatewayProxyEvent } from "aws-lambda";
import { CreateRecommendationsUseCase } from "../../../../application/use-case/create-recommendations";
import { RecommendationService } from "../../../service/recommendation-service";
import { BusinessIdeaRepository } from "../../../repository/business-idea-repository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
	"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};
export class CreateRecommendationsLambdaHandler {
	constructor(
		private readonly createRecommendationsUseCase: CreateRecommendationsUseCase,
	) {}

	async handle(event: APIGatewayProxyEvent) {
		const { businessIdeaId } = JSON.parse(event.body as string) as {
			businessIdeaId: string;
		};

		const recommendations = await this.createRecommendationsUseCase.execute({
			businessIdeaId,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ recommendations }),
			headers: CORS_HEADERS,
		};
	}
}

const recommendationService = new RecommendationService(
	process.env.OPENAI_API_KEY as string,
);

const businessIdeaRepository = new BusinessIdeaRepository(
	new DynamoDBClient({
		region: "eu-central-1",
	}),
	process.env.BUSINESS_IDEA_TABLE_NAME as string,
);

const createRecommendationsUseCase = new CreateRecommendationsUseCase(
	businessIdeaRepository,
	recommendationService,
);

const createRecommendationsLambdaHandler =
	new CreateRecommendationsLambdaHandler(createRecommendationsUseCase);

export const handler = async (event: APIGatewayProxyEvent) => {
	return await createRecommendationsLambdaHandler.handle(event);
};
