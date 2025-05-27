#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MarketingStack } from "../src/marketing/infra/marketing-stack";

const app = new cdk.App();
new MarketingStack(app, "MarketingStack");
