import type { BusinessIdea } from "../../domain/aggregat/business-idea";
import { ChannelRecommendation } from "../../domain/entity/channel-recommendations";
import type { IRecommendationService } from "../../domain/interface/i-recommendation-service";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import {
	TractionChannels,
	TractionChannelValueObject,
	type TractionChannel,
} from "../../domain/value-object/traction-channel";

const prompt = (
	websiteContent: string,
	channels: string[],
) => `Given the following business idea/website description: "${websiteContent}"


Identify the top 3 marketing channels most likely to yield initial traction (inner circle),
Briefly explain each recommendation and suggest content formats and necessary elements required to start effectively.
Pick only from the following channels: ${channels.join(", ")}
`;

const API_KEY = process.env.OPENAI_API_KEY;

export class RecommendationService implements IRecommendationService {
	private readonly MAX_CONTENT_LENGTH = 8000;
	private readonly MAX_SUMMARY_LENGTH = 2000;

	async recommend(
		businessIdea: BusinessIdea,
	): Promise<ChannelRecommendation[]> {
		const websiteContent = await this.getWebsiteContent(businessIdea.url);

		const websiteContentSummary =
			await this.summarizeWebsiteContent(websiteContent);

		const channelRecommendations = await this.generateChannelRecommendations(
			websiteContentSummary,
		);
		return channelRecommendations;
	}

	private async summarizeWebsiteContent(
		websiteContent: string,
	): Promise<string> {
		const response = await generateText({
			model: openai("gpt-3.5-turbo"),
			prompt: `Summarize the following website content in a concise business description (max 200 words). Focus on the main value proposition, target audience, and key features: ${websiteContent}`,
		});

		return response.text.slice(0, this.MAX_SUMMARY_LENGTH);
	}

	private async generateChannelRecommendations(
		websiteContentSummary: string,
	): Promise<ChannelRecommendation[]> {
		const response = await generateObject({
			model: openai("gpt-4o"),
			schema: z.object({
				innerCircle: z
					.array(
						z.object({
							channel: z.string(),
							explanation: z.string(),
							contentFormat: z.string(),
							contentElements: z.array(z.string()),
						}),
					)
					.length(3),
			}),
			prompt: prompt(
				websiteContentSummary,
				TractionChannels.map((channel) => {
					const valueObject = TractionChannelValueObject.create(channel);
					return valueObject.toPrettyString();
				}),
			),
			maxTokens: 2000,
		});

		return response.object.innerCircle.map((channel) => {
			return ChannelRecommendation.create(
				channel.channel,
				channel.explanation,
				channel.contentFormat,
				channel.contentElements,
			);
		});
	}

	async getWebsiteContent(url: string): Promise<string> {
		try {
			const response = await fetch(url);
			const html = await response.text();

			// Extract text content and limit size
			const textContent = this.extractTextFromHtml(html);
			const limitedContent = textContent.slice(0, this.MAX_CONTENT_LENGTH);

			return limitedContent;
		} catch (error) {
			console.error("Error fetching website content:", error);
			// Return empty string or throw based on your error handling strategy
			return "";
		}
	}

	private extractTextFromHtml(html: string): string {
		// Remove HTML tags and extract meaningful text
		const text = html
			// Remove script and style elements
			.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
			.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
			// Remove HTML tags
			.replace(/<[^>]+>/g, " ")
			// Decode HTML entities
			.replace(/&nbsp;/g, " ")
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#x27;/g, "'")
			// Clean up whitespace
			.replace(/\s+/g, " ")
			.trim();

		// Focus on content that's likely to be meaningful
		// You could enhance this with more sophisticated text extraction
		// like targeting specific HTML elements (title, meta description, h1-h6, p tags)

		return text;
	}
}
