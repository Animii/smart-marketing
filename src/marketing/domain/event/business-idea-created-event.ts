import type { BusinessIdea } from "../aggregat/business-idea";
import type { IEvent } from "@common/event-bridge/event";

export class BusinessIdeaCreatedEvent implements IEvent {
	public readonly source: "marketing";
	public readonly detail: string;
	public readonly detailType: "BusinessIdeaCreated";

	constructor(
		readonly businessIdeaId: string,
		readonly businessIdeaName: string,
		readonly businessIdeaUrl: string,
		readonly businessIdeaDescription: string,
		readonly createdAt: Date,
	) {
		this.source = "marketing";
		this.detail = JSON.stringify({
			businessIdeaId,
			businessIdeaName,
			businessIdeaUrl,
			businessIdeaDescription,
			createdAt,
		});
		this.detailType = "BusinessIdeaCreated";
	}

	static create(businessIdea: BusinessIdea) {
		return new BusinessIdeaCreatedEvent(
			businessIdea.id,
			businessIdea.name,
			businessIdea.url,
			businessIdea.description,
			new Date(),
		);
	}
}
