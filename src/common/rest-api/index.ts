import {
	AuthorizationType,
	RestApi as AwsRestApi,
	Cors,
	EndpointType,
	LambdaIntegration,
	type RestApiProps,
} from "aws-cdk-lib/aws-apigateway";
import type { Construct } from "constructs";
import type { Lambda } from "../lambda";

export const DEFAULT_PROPS: RestApiProps = {
	endpointTypes: [EndpointType.REGIONAL],
	defaultCorsPreflightOptions: {
		allowOrigins: Cors.ALL_ORIGINS,
		allowMethods: Cors.ALL_METHODS,
		allowHeaders: ["*"],
	},
};
export class RestApi extends AwsRestApi {
	constructor(scope: Construct, id: string, props?: RestApiProps) {
		super(scope, id, { ...DEFAULT_PROPS, ...props });
	}

	addLambdaIntegration(
		lambda: Lambda,
		path = "",
		method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
	) {
		return this.root
			.addResource(path)
			.addMethod(method, new LambdaIntegration(lambda), {
				authorizationType: AuthorizationType.NONE,
			});
	}
}
