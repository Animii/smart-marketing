export class ChannelRecommendation {
	private constructor(
		public readonly channel: string,
		public readonly explanation: string,
	) {}

	static create(channel: string, explanation: string): ChannelRecommendation {
		return new ChannelRecommendation(channel, explanation);
	}
}
