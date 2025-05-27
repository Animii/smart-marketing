import type { IEvent } from "@/common/event-bridge/event";
import type { EventBridgePublisher } from "@/common/event-bridge/publisher";

export const Context: {
	publisher: EventBridgePublisher | undefined;
} = {
	publisher: undefined,
};

export class AggregateRoot {
	constructor(public readonly id: string) {}

	async apply(event: IEvent) {
		console.log("apply", event);
		await Context.publisher?.publish(event);
		console.log(Context.publisher);
	}
}
