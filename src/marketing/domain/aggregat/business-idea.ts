import { AggregateRoot } from "../../../common/domain/aggregate";
import { BusinessIdeaCreatedEvent } from "../event";
import type { ChannelRecommendation } from "../entity/channel-recommendations";
import { ChannelRecommendationsAddedEvent } from "../event/channel-recommendation-added-event";

export class BusinessIdea extends AggregateRoot {
	private constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly url: string,
		public readonly description: string,
		public readonly channelRecommendations: ChannelRecommendation[] = [],
		public readonly createdAt: Date = new Date(),
		public readonly updatedAt: Date = new Date(),
	) {
		super(id);
	}

	static create(
		id: string,
		name: string,
		url: string,
		description: string,
		channelRecommendations: ChannelRecommendation[],
	) {
		const businessIdea = new BusinessIdea(
			id,
			name,
			url,
			description,
			channelRecommendations,
			new Date(),
			new Date(),
		);
		businessIdea.apply(BusinessIdeaCreatedEvent.create(businessIdea));
		return businessIdea;
	}

	static fromPersistence(
		id: string,
		name: string,
		url: string,
		description: string,
		channelRecommendations: ChannelRecommendation[],
		createdAt?: Date,
		updatedAt?: Date,
	) {
		// Reconstruct from persistence without triggering domain events
		return new BusinessIdea(
			id,
			name,
			url,
			description,
			channelRecommendations,
			createdAt || new Date(),
			updatedAt || new Date(),
		);
	}

	public addChannelRecommendation(
		channelRecommendations: ChannelRecommendation[],
	) {
		if (this.channelRecommendations.length > 0) {
			throw new Error("Channel recommendations already set");
		}

		this.channelRecommendations.push(...channelRecommendations);
		this.apply(ChannelRecommendationsAddedEvent.create(this));
	}
}
