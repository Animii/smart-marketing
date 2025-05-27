export enum TractionChannel {
	VIRAL_MARKETING = "viral-marketing",
	PUBLIC_RELATIONS = "public-relations",
	SEARCH_ENGINE_OPTIMIZATION = "search-engine-optimization",
	CONTENT_MARKETING = "content-marketing",
	PAID_ADS = "paid-ads",
	REFERRAL = "referral",
	SOCIAL_MARKETING = "social-marketing",
	EMAIL_MARKETING = "email-marketing",
	OTHER = "other",
}

export const TractionChannels = [
	TractionChannel.VIRAL_MARKETING,
	TractionChannel.PUBLIC_RELATIONS,
	TractionChannel.SEARCH_ENGINE_OPTIMIZATION,
	TractionChannel.CONTENT_MARKETING,
	TractionChannel.PAID_ADS,
	TractionChannel.REFERRAL,
	TractionChannel.SOCIAL_MARKETING,
	TractionChannel.EMAIL_MARKETING,
	TractionChannel.OTHER,
] as const;

export class TractionChannelValueObject {
	private constructor(public readonly value: TractionChannel) {}

	static create(value: TractionChannel) {
		if (!Object.values(TractionChannels).includes(value)) {
			throw new Error("Invalid traction channel");
		}

		return new TractionChannelValueObject(value);
	}
}
