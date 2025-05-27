export class ChannelRecommendation {
	private constructor(
		public readonly channel: string,
		public readonly explanation: string,
		public readonly contentFormat: string,
		public readonly contentElements: string[],
	) {}

	static create(
		channel: string,
		explanation: string,
		contentFormat: string,
		contentElements: string[],
	): ChannelRecommendation {
		return new ChannelRecommendation(
			channel,
			explanation,
			contentFormat,
			contentElements,
		);
	}
}
