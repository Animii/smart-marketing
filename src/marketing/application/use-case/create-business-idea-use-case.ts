import { randomUUID } from "node:crypto";
import { BusinessIdea } from "../../domain/aggregat/business-idea";
import type { IBusinessIdeaRepository } from "../../domain/interface/i-business-idea-repository";
export interface CreateBusinessIdeaUseCaseInput {
	name: string;
	url: string;
	description: string;
}
export class CreateBusinessIdeaUseCase {
	constructor(
		private readonly businessIdeaRepository: IBusinessIdeaRepository,
	) {}

	async execute(input: CreateBusinessIdeaUseCaseInput): Promise<BusinessIdea> {
		const businessIdea = BusinessIdea.create(
			randomUUID(),
			input.name,
			input.url,
			input.description,
		);
		await this.businessIdeaRepository.save(businessIdea);

		return businessIdea;
	}
}
