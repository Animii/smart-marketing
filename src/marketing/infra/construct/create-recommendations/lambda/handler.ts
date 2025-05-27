import type { APIGatewayProxyEvent, SQSEvent } from "aws-lambda";
import { CreateRecommendationsUseCase } from "../../../../application/use-case/create-recommendations";
import { RecommendationService } from "../../../service/recommendation-service";
import { BusinessIdeaRepository } from "../../../repository/business-idea-repository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Context } from "../../../../../common/domain/aggregate";
import { EventBridgePublisher } from "../../../../../common/event-bridge/publisher";
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

	async handle(event: SQSEvent) {
		console.log("Received SQS event:", JSON.stringify(event, null, 2));

		for (const record of event.Records) {
			try {
				// Parse the EventBridge event from SQS message body
				const eventBridgeEvent = JSON.parse(record.body);
				console.log(
					"EventBridge event:",
					JSON.stringify(eventBridgeEvent, null, 2),
				);

				// Extract the detail from the EventBridge event
				const eventDetail = eventBridgeEvent.detail;
				console.log("Event detail:", JSON.stringify(eventDetail, null, 2));

				const businessIdeaId = eventDetail.businessIdeaId;
				console.log("Processing business idea ID:", businessIdeaId);

				const recommendations = await this.createRecommendationsUseCase.execute(
					{
						businessIdeaId,
					},
				);

				console.log("Created recommendations:", recommendations);
			} catch (error) {
				console.error("Error processing SQS record:", error);
				console.error("Record body:", record.body);
				throw error;
			}
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: "Recommendations processed successfully",
			}),
			headers: CORS_HEADERS,
		};
	}
}

const eventBridgePublisher = new EventBridgePublisher(
	process.env.EVENT_BUS_NAME as string,
);

Context.publisher = eventBridgePublisher;

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

export const handler = async (event: SQSEvent) => {
	return await createRecommendationsLambdaHandler.handle(event);
};
