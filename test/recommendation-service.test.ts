import { RecommendationService } from "../src/marketing/infra/service/recommendation-service";
import { BusinessIdea } from "../src/marketing/domain/aggregat/business-idea";
import { TractionChannel } from "../src/marketing/domain/value-object/traction-channel";

describe("RecommendationService", () => {
	let recommendationService: RecommendationService;

	beforeEach(() => {
		recommendationService = new RecommendationService(
			process.env.OPENAI_API_KEY as string,
		);
	});

	test("should generate recommendations for custom pottery ribs website", async () => {
		// Given
		const businessIdea = BusinessIdea.create(
			"test-id-1",
			"Custom Pottery Ribs",
			"https://www.custompotteryribs.com/",
			"Custom pottery tools business",
		);

		// When
		const recommendations = await recommendationService.recommend(businessIdea);

		// Then
		expect(recommendations).toBeDefined();
		expect(recommendations.length).toBeGreaterThan(0);
		expect(recommendations.length).toBeLessThanOrEqual(3); // Should return 3 inner circle recommendations

		// Check that each recommendation has the required properties
		for (const recommendation of recommendations) {
			expect(recommendation.channel).toBeDefined();
			expect(typeof recommendation.channel).toBe("string");
			expect(recommendation.channel.length).toBeGreaterThan(0);

			expect(recommendation.explanation).toBeDefined();
			expect(typeof recommendation.explanation).toBe("string");
			expect(recommendation.explanation.length).toBeGreaterThan(0);
		}

		// Log the results for manual inspection
		console.log("Generated recommendations:");
		for (const [index, rec] of recommendations.entries()) {
			console.log(`${index + 1}. Channel: ${rec.channel}`);
			console.log(`   Explanation: ${rec.explanation}`);
			console.log("");
		}
	}, 300000); // 30 second timeout for API call

	test("should fetch website content", async () => {
		// Given
		const url = "https://www.custompotteryribs.com/";

		// When
		const content = await recommendationService.getWebsiteContent(url);

		// Then
		expect(content).toBeDefined();
		expect(typeof content).toBe("string");
		expect(content.length).toBeGreaterThan(0);

		// Log a snippet of the content for inspection
		console.log(`Website content snippet: ${content.substring(0, 200)}...`);
	}, 15000); // 15 second timeout for website fetch
});
