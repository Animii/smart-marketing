export enum TractionChannel {
	VIRAL_MARKETING = "viral-marketing",
	PUBLIC_RELATIONS = "public-relations",
	SEARCH_ENGINE_OPTIMIZATION = "search-engine-optimization",
	CONTENT_MARKETING = "content-marketing",
	SOCIAL_AND_DISPLAY_ADS = "social-and-display-ads",
	SEARCH_ENGINE_MARKETING = "search-engine-marketing",
	OFFLINE_ADVERTISING = "offline-advertising",
	EMAIL_MARKETING = "email-marketing",
	ENGINEERING_AS_MARKETING = "engineering-as-marketing",
	TARGETING_BLOGS = "targeting-blogs",
	UNCONVENTIONAL_PR = "unconventional-pr",
	BUSINESS_DEVELOPMENT = "business-development",
	SALES = "sales",
	AFFILIATE_PROGRAMS = "affiliate-programs",
	EXISTING_PLATFORMS = "existing-platforms",
	TRADE_SHOWS = "trade-shows",
	OFFLINE_EVENTS = "offline-events",
	SPEAKING_ENGAGEMENTS = "speaking-engagements",
	COMMUNITY_BUILDING = "community-building",
}

export const TractionChannels = [
	TractionChannel.VIRAL_MARKETING,
	TractionChannel.PUBLIC_RELATIONS,
	TractionChannel.SEARCH_ENGINE_OPTIMIZATION,
	TractionChannel.CONTENT_MARKETING,
	TractionChannel.SOCIAL_AND_DISPLAY_ADS,
	TractionChannel.SEARCH_ENGINE_MARKETING,
	TractionChannel.OFFLINE_ADVERTISING,
	TractionChannel.EMAIL_MARKETING,
	TractionChannel.ENGINEERING_AS_MARKETING,
	TractionChannel.TARGETING_BLOGS,
	TractionChannel.UNCONVENTIONAL_PR,
	TractionChannel.BUSINESS_DEVELOPMENT,
	TractionChannel.SALES,
	TractionChannel.AFFILIATE_PROGRAMS,
	TractionChannel.EXISTING_PLATFORMS,
	TractionChannel.TRADE_SHOWS,
	TractionChannel.OFFLINE_EVENTS,
	TractionChannel.SPEAKING_ENGAGEMENTS,
	TractionChannel.COMMUNITY_BUILDING,
] as const;

export const TractionChannelsMap = {
	[TractionChannel.VIRAL_MARKETING]: "Viral Marketing",
	[TractionChannel.PUBLIC_RELATIONS]: "Public Relations",
	[TractionChannel.SEARCH_ENGINE_OPTIMIZATION]: "Search Engine Optimization",
	[TractionChannel.CONTENT_MARKETING]: "Content Marketing",
	[TractionChannel.SOCIAL_AND_DISPLAY_ADS]: "Social and Display Ads",
	[TractionChannel.SEARCH_ENGINE_MARKETING]: "Search Engine Marketing",
	[TractionChannel.OFFLINE_ADVERTISING]: "Offline Advertising",
	[TractionChannel.EMAIL_MARKETING]: "Email Marketing",
	[TractionChannel.ENGINEERING_AS_MARKETING]: "Engineering as Marketing",
	[TractionChannel.TARGETING_BLOGS]: "Targeting Blogs",
	[TractionChannel.UNCONVENTIONAL_PR]: "Unconventional PR",
	[TractionChannel.BUSINESS_DEVELOPMENT]: "Business Development",
	[TractionChannel.SALES]: "Sales",
	[TractionChannel.AFFILIATE_PROGRAMS]: "Affiliate Programs",
	[TractionChannel.EXISTING_PLATFORMS]: "Existing Platforms",
	[TractionChannel.TRADE_SHOWS]: "Trade Shows",
	[TractionChannel.OFFLINE_EVENTS]: "Offline Events",
	[TractionChannel.SPEAKING_ENGAGEMENTS]: "Speaking Engagements",
	[TractionChannel.COMMUNITY_BUILDING]: "Community Building",
};

export class TractionChannelValueObject {
	private constructor(public readonly value: TractionChannel) {}

	public toPrettyString() {
		return TractionChannelsMap[this.value];
	}

	static create(value: TractionChannel) {
		if (!Object.values(TractionChannels).includes(value)) {
			throw new Error("Invalid traction channel");
		}

		return new TractionChannelValueObject(value);
	}
}
