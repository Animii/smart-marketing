import { BillingMode, Table, type TableProps } from "aws-cdk-lib/aws-dynamodb";
import type { Construct } from "constructs";

export const DEFAULT_PROPS: Partial<TableProps> = {
	billingMode: BillingMode.PAY_PER_REQUEST,
	deletionProtection: true,
	pointInTimeRecoverySpecification: {
		pointInTimeRecoveryEnabled: true,
	},
};

export class DynamoDBTable extends Table {
	constructor(scope: Construct, id: string, props: TableProps) {
		super(scope, id, {
			...DEFAULT_PROPS,
			...props,
		});
	}
}
