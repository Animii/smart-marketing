import type { TractionChannel } from "./traction-channel";

export class AnalysisResults {
	private constructor(public readonly tractionChannels: TractionChannel[]) {}

	static create(tractionChannels: TractionChannel[]) {
		return new AnalysisResults(tractionChannels);
	}
}
