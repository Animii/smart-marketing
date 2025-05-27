import type { BusinessIdea } from "../aggregat/business-idea";
import type { ChannelRecommendation } from "../entity/channel-recommendations";

export interface IRecommendationService {
	recommend(businessIdea: BusinessIdea): Promise<ChannelRecommendation[]>;
}
