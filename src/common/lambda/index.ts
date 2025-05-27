import type { Construct } from "constructs";
import {
	NodejsFunction,
	type NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";

const DEFAULT_PROPS: Partial<NodejsFunctionProps> = {
	runtime: Runtime.NODEJS_20_X,
	memorySize: 1024,
	timeout: Duration.seconds(30),
};

export class Lambda extends NodejsFunction {
	constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
		super(scope, id, {
			...DEFAULT_PROPS,
			...props,
		});
	}
}
