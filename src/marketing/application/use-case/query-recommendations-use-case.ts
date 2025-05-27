import type { ChannelRecommendation } from "../../domain/entity/channel-recommendations";
import type { IBusinessIdeaRepository } from "../../domain/interface/i-business-idea-repository";

export class QueryRecommendationsUseCase {
	constructor(
		private readonly businessIdeaRepository: IBusinessIdeaRepository,
	) {}

	async execute({
		businessIdeaId,
	}: {
		businessIdeaId: string;
	}): Promise<ChannelRecommendation[]> {
		const businessIdea =
			await this.businessIdeaRepository.findById(businessIdeaId);

		if (!businessIdea) {
			throw new Error("Business idea not found");
		}

		return businessIdea.channelRecommendations;
	}
}
