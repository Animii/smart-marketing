import {
	EventBus as AwsEventBus,
	type EventBusProps,
} from "aws-cdk-lib/aws-events";
import type { Construct } from "constructs";

const DEFAULT_PROPS: EventBusProps = {
	description: "Default Event Bus",
};

export class EventBus extends AwsEventBus {
	constructor(scope: Construct, id: string, props?: EventBusProps) {
		super(scope, id, { ...DEFAULT_PROPS, ...props });
	}
}
