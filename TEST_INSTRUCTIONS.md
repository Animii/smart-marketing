# Testing RecommendationService

This document provides instructions for testing the RecommendationService with the Custom Pottery Ribs website.

## Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key to run the tests
2. **Node.js dependencies**: Make sure all dependencies are installed

## Setup

1. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

## Running Tests

### Option 1: Run with tsx (Simple Script)

Run the standalone test script:
```bash
npx tsx test-recommendation.ts
```

This will:
- Fetch content from https://www.custompotteryribs.com/
- Generate marketing channel recommendations using OpenAI
- Display the results in a nice format

### Option 2: Run with Jest (Full Test Suite)

Run the Jest test:
```bash
npm test recommendation-service.test.ts
```

Or run all tests:
```bash
npm test
```

## Expected Output

The test should generate 3 marketing channel recommendations for the pottery ribs business, each with:
- **Channel name**: The recommended marketing channel (e.g., "Instagram", "Pinterest", etc.)
- **Explanation**: Why this channel is recommended and how to use it effectively

## Troubleshooting

- **API Key Error**: Make sure your OpenAI API key is set correctly
- **Network Error**: Check your internet connection for fetching website content
- **Timeout**: The test has a 30-second timeout; if it takes longer, there might be an API issue

## Example Output

```
🚀 Testing RecommendationService with Custom Pottery Ribs website...

📝 Business Idea:
   Name: Custom Pottery Ribs
   URL: https://www.custompotteryribs.com/
   Description: Custom pottery tools and ribs for ceramic artists and potters

🌐 Fetching website content...
✅ Fetched 12543 characters of content

🤖 Generating marketing channel recommendations...
✅ Generated 3 recommendations:

1. 📢 Channel: Instagram
   💡 Explanation: Perfect for showcasing pottery work and tools with visual content...

2. 📢 Channel: Pinterest
   💡 Explanation: Ideal for reaching pottery enthusiasts searching for tools...

3. 📢 Channel: Etsy
   💡 Explanation: Direct marketplace for handmade pottery tools...

🎉 Test completed successfully! 