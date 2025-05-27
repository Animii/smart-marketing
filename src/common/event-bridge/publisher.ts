import {
	EventBridgeClient,
	PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import type { IEvent } from "./event";

export class EventBridgePublisher {
	private readonly eventBridgeClient: EventBridgeClient;

	constructor(private readonly eventBusName: string) {
		this.eventBridgeClient = new EventBridgeClient({});
		console.log(
			"EventBridge publisher initialized with event bus:",
			eventBusName,
		);
	}

	async publish(event: IEvent) {
		console.log("Publishing event to EventBridge:", {
			eventBusName: this.eventBusName,
			source: event.source,
			detailType: event.detailType,
			detail: event.detail,
		});

		const command = new PutEventsCommand({
			Entries: [
				{
					EventBusName: this.eventBusName,
					Detail: event.detail,
					DetailType: event.detailType,
					Source: event.source,
				},
			],
		});

		try {
			const result = await this.eventBridgeClient.send(command);
			console.log("Event published successfully:", result);
		} catch (error) {
			console.error("Error publishing event:", error);
			throw error;
		}
	}
}
