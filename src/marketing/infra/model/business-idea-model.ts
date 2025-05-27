import type { ChannelRecommendation } from "@/marketing/domain/entity/channel-recommendations";
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

	toDomain(): BusinessIdea {
		return BusinessIdea.create(
			this.id,
			this.name,
			this.url,
			this.description,
			this.channelRecommendations,
		);
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
