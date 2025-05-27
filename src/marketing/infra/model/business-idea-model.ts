import type { ChannelRecommendation } from "../../domain/entity/channel-recommendations";
import { BusinessIdea } from "../../domain/aggregat/business-idea";

export class BusinessIdeaModel {
	PK: `BUSINESS_IDEA-${string}`;
	SK: `BUSINESS_IDEA-${string}`;

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly url: string,
		public readonly description: string,
		public readonly channelRecommendations: ChannelRecommendation[],
	) {
		this.PK = `BUSINESS_IDEA-${this.id}`;
		this.SK = `BUSINESS_IDEA-${this.id}`;
	}

	async toDomain(): Promise<BusinessIdea> {
		return await BusinessIdea.create({
			id: this.id,
			name: this.name,
			url: this.url,
			description: this.description,
			channelRecommendations: this.channelRecommendations,
		});
	}

	static fromDomain(businessIdea: BusinessIdea): BusinessIdeaModel {
		return new BusinessIdeaModel(
			businessIdea.id,
			businessIdea.name,
			businessIdea.url,
			businessIdea.description,
			businessIdea.channelRecommendations,
		);
	}
}
