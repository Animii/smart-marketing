import type { IBusinessIdeaRepository } from "../../domain/interface/i-business-idea-repository";
import type { IRecommendationService } from "../../domain/interface/i-recommendation-service";

export class CreateRecommendationsUseCase {
	constructor(
		private readonly businessIdeaRepository: IBusinessIdeaRepository,
		private readonly recommendationService: IRecommendationService,
	) {}

	async execute({
		businessIdeaId,
	}: {
		businessIdeaId: string;
	}) {
		const businessIdea =
			await this.businessIdeaRepository.findById(businessIdeaId);

		if (!businessIdea) {
			throw new Error("Business idea not found");
		}

		const recommendations =
			await this.recommendationService.recommend(businessIdea);

		return recommendations;
	}
}
