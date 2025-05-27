import { RecommendationService } from "./src/marketing/infra/service/recommendation-service";
import { BusinessIdea } from "./src/marketing/domain/aggregat/business-idea";

async function testRecommendationService() {
	console.log(
		"🚀 Testing RecommendationService with Custom Pottery Ribs website...\n",
	);

	// Check if OpenAI API key is set
	if (!process.env.OPENAI_API_KEY) {
		console.warn("⚠️  Warning: OPENAI_API_KEY environment variable is not set.");
		console.warn("   Set it with: export OPENAI_API_KEY=your_api_key_here\n");
	}

	try {
		// Create the service instance
		const service = new RecommendationService();

		// Create a business idea for the pottery ribs website
		const businessIdea = BusinessIdea.create(
			"test-pottery-1",
			"Custom Pottery Ribs",
			"https://www.custompotteryribs.com/",
			"Custom pottery tools and ribs for ceramic artists and potters",
		);

		console.log("📝 Business Idea:");
		console.log(`   Name: ${businessIdea.name}`);
		console.log(`   URL: ${businessIdea.url}`);
		console.log(`   Description: ${businessIdea.description}\n`);

		// Test fetching website content first
		console.log("🌐 Fetching website content...");
		const websiteContent = await service.getWebsiteContent(businessIdea.url);
		console.log(`✅ Fetched ${websiteContent.length} characters of content`);
		console.log(`📄 Content preview: ${websiteContent.substring(0, 200)}...\n`);

		// Generate recommendations
		console.log("🤖 Generating marketing channel recommendations...");
		const recommendations = await service.recommend(businessIdea);

		console.log(`✅ Generated ${recommendations.length} recommendations:\n`);

		// Display the recommendations
		for (const [index, recommendation] of recommendations.entries()) {
			console.log(`${index + 1}. 📢 Channel: ${recommendation.channel}`);
			console.log(`   💡 Explanation: ${recommendation.explanation}\n`);
		}

		console.log("🎉 Test completed successfully!");
	} catch (error) {
		console.error("❌ Test failed with error:");
		console.error(error);
		process.exit(1);
	}
}

// Run the test
testRecommendationService();
