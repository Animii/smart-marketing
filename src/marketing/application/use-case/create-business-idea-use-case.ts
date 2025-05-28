import { randomUUID } from "node:crypto";
import { BusinessIdea } from "../../domain/aggregat/business-idea";
import type { IBusinessIdeaRepository } from "../../domain/interface/i-business-idea-repository";
export interface CreateBusinessIdeaUseCaseInput {
	name: string;
	url: string;
	description?: string;
}
export class CreateBusinessIdeaUseCase {
	constructor(
		private readonly businessIdeaRepository: IBusinessIdeaRepository,
	) {}

	async execute(input: CreateBusinessIdeaUseCaseInput): Promise<BusinessIdea> {
		const businessIdea = await BusinessIdea.create({
			name: input.name,
			url: input.url,
			description: input.description ?? "",
			channelRecommendations: [],
		});
		await this.businessIdeaRepository.save(businessIdea);

		return businessIdea;
	}
}
