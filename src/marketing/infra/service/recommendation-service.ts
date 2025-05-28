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
import puppeteer, { type Browser } from "puppeteer";

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
		let browser: Browser | undefined;
		try {
			browser = await puppeteer.launch({
				headless: true,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
				],
			});

			const page = await browser.newPage();

			// Set user agent to avoid bot detection
			await page.setUserAgent(
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			);

			await page.setViewport({ width: 1280, height: 720 });

			await page.goto(url, {
				waitUntil: "networkidle2",
				timeout: 30000,
			});

			const textContent = await page.evaluate(() => {
				const scripts = document.querySelectorAll("script, style, noscript");
				for (const el of scripts) {
					el.remove();
				}

				const contentSelectors = [
					"main",
					"article",
					'[role="main"]',
					".content",
					"#content",
					".main-content",
					".container",
					".wrapper",
				];

				let content = "";
				for (const selector of contentSelectors) {
					const element = document.querySelector(selector);
					if (
						element &&
						(element as HTMLElement).innerText.trim().length > 100
					) {
						content = (element as HTMLElement).innerText;
						break;
					}
				}

				if (!content) {
					content = document.body.innerText;
				}

				return content.replace(/\s+/g, " ").trim();
			});

			await page.waitForTimeout(2000);

			if (this.isBlockedContent(textContent) || textContent.length < 50) {
				throw new Error("Content appears to be blocked or insufficient");
			}

			return textContent.slice(0, this.MAX_CONTENT_LENGTH);
		} catch (error) {
			console.error("Error fetching website content with Puppeteer:", error);
			return this.fallbackFetch(url);
		} finally {
			if (browser) {
				await browser.close();
			}
		}
	}

	private async fallbackFetch(url: string): Promise<string> {
		try {
			const response = await fetch(url, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
					Accept:
						"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
					"Accept-Language": "en-US,en;q=0.5",
					"Accept-Encoding": "gzip, deflate",
					Connection: "keep-alive",
					"Upgrade-Insecure-Requests": "1",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const html = await response.text();
			const textContent = this.extractTextFromHtml(html);

			return textContent.slice(0, this.MAX_CONTENT_LENGTH);
		} catch (error) {
			console.error("Fallback fetch also failed:", error);
			return "";
		}
	}

	private isBlockedContent(content: string): boolean {
		const blockedPhrases = [
			"enable javascript",
			"javascript is required",
			"please enable cookies",
			"access denied",
			"cloudflare",
			"checking your browser",
		];

		const lowerContent = content.toLowerCase();
		return blockedPhrases.some((phrase) => lowerContent.includes(phrase));
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
