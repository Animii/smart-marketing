import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { BusinessIdea } from "../../domain/aggregat/business-idea";
import { BusinessIdeaModel } from "../model/business-idea-model";

export class BusinessIdeaRepository {
	dynamodbDocumentClient: DynamoDBDocumentClient;
	constructor(
		readonly client: DynamoDBClient,
		readonly tableName: string,
	) {
		this.dynamodbDocumentClient = DynamoDBDocumentClient.from(client);
	}

	async save(businessIdea: BusinessIdea): Promise<void> {
		const model = new BusinessIdeaModel(
			businessIdea.id,
			businessIdea.name,
			businessIdea.url,
			businessIdea.description,
		);
		console.log(model);

		await this.dynamodbDocumentClient.send(
			new PutCommand({ TableName: this.tableName, Item: model }),
		);
	}

	async findById(id: string): Promise<BusinessIdea | null> {
		const key: BusinessIdeaModel["PK"] = `BUSINESS_IDEA-${id}`;

		const result = await this.dynamodbDocumentClient.send(
			new GetCommand({
				TableName: this.tableName,
				Key: { PK: key, SK: key },
			}),
		);

		if (!result.Item) {
			return null;
		}

		return BusinessIdea.create(
			result.Item.id,
			result.Item.name,
			result.Item.url,
			result.Item.description,
		);
	}
}
