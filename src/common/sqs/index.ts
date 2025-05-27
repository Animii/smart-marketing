import { Duration } from "aws-cdk-lib";
import { Queue as AwsQueue, type QueueProps } from "aws-cdk-lib/aws-sqs";
import type { Construct } from "constructs";
const DEFAULT_PROPS: QueueProps = {
	visibilityTimeout: Duration.seconds(300),
};
export class Queue extends AwsQueue {
	constructor(scope: Construct, id: string, props?: QueueProps) {
		super(scope, id, { ...DEFAULT_PROPS, ...props });
	}
}

export class QueueWithDLQ extends Queue {
	constructor(scope: Construct, id: string, props?: QueueProps) {
		const dlq = new Queue(scope, `${id}Dlq`);
		super(scope, id, {
			...DEFAULT_PROPS,
			...props,
			deadLetterQueue: {
				maxReceiveCount: 3,
				queue: dlq,
			},
		});
	}
}
