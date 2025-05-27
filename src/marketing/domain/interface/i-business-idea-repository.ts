import type { BusinessIdea } from "../aggregat/business-idea";

export interface IBusinessIdeaRepository {
	findById(id: string): Promise<BusinessIdea | null>;
	save(businessIdea: BusinessIdea): Promise<void>;
}
