import type { APIGatewayProxyEvent } from "aws-lambda";
import { CreateBusinessIdeaUseCase } from "../../../../application/use-case/create-business-idea-use-case";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BusinessIdeaRepository } from "../../../repository/business-idea-repository";
import { EventBridgePublisher } from "../../../../../common/event-bridge/publisher";
import { Context } from "../../../../../common/domain/aggregate";
const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*", // Or a specific origin
	"Access-Control-Allow-Headers":
		"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
	"Access-Control-Allow-Methods": "OPTIONS,POST,GET", // Adjust as per allowed methods for the API
};
class CreateBusinessIdeaLambdaHandler {
	constructor(
		private readonly createBusinessIdeaUseCase: CreateBusinessIdeaUseCase,
	) {}

	async handle(event: APIGatewayProxyEvent) {
		const { name, url, description } = JSON.parse(event.body as string) as {
			name: string;
			url: string;
			description: string;
		};

		const businessIdea = await this.createBusinessIdeaUseCase.execute({
			name,
			url,
			description,
		});

		return {
			statusCode: 200,
			body: JSON.stringify({ businessIdea }),
			headers: CORS_HEADERS,
		};
	}
}

const businessIdeaRepository = new BusinessIdeaRepository(
	new DynamoDBClient({
		region: "eu-central-1",
	}),
	process.env.BUSINESS_IDEA_TABLE_NAME as string,
);

const eventBridgePublisher = new EventBridgePublisher(
	process.env.EVENT_BUS_NAME as string,
);

Context.publisher = eventBridgePublisher;

const createBusinessIdeaUseCase = new CreateBusinessIdeaUseCase(
	businessIdeaRepository,
);

const createBusinessIdeaLambdaHandler = new CreateBusinessIdeaLambdaHandler(
	createBusinessIdeaUseCase,
);

export const handler = async (event: APIGatewayProxyEvent) => {
	return await createBusinessIdeaLambdaHandler.handle(event);
};
