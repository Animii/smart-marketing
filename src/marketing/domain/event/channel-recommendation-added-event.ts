import type { IEvent } from "../../../common/event-bridge/event";
import type { ChannelRecommendation } from "../entity/channel-recommendations";
import type { BusinessIdea } from "../aggregat/business-idea";

export class ChannelRecommendationsAddedEvent implements IEvent {
	public readonly source: "marketing";
	public readonly detail: string;
	public readonly detailType: "ChannelRecommendationAdded";

	constructor(
		readonly businessIdeaId: string,
		readonly channelRecommendations: ChannelRecommendation[],
	) {
		this.source = "marketing";
		this.detail = JSON.stringify({
			businessIdeaId,
			channelRecommendations,
		});
		this.detailType = "ChannelRecommendationAdded";
	}

	static create(businessIdea: BusinessIdea) {
		return new ChannelRecommendationsAddedEvent(
			businessIdea.id,
			businessIdea.channelRecommendations,
		);
	}
}
