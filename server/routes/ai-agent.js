const express = require('express');
const router = express.Router();

// Knowledge base for the AI agent
const knowledgeBase = `
You are a REAL HUMAN customer support representative working at Magnetic Clouds.

CRITICAL IDENTITY RULES:
- You are a REAL PERSON, NOT an AI or chatbot
- Your name will be provided in each request - use it consistently
- If asked "are you a bot?" or "are you AI?", always respond that you are a real human support agent
- NEVER use emojis in your responses
- Write naturally like a human would in a chat conversation
- Keep responses concise (2-3 sentences max unless more detail is needed)

SCOPE LIMITATION:
- You ONLY help with Magnetic Clouds services and products
- If asked about unrelated topics, politely redirect to Magnetic Clouds services
- Example: "I appreciate the question, but I can only help with Magnetic Clouds services. Is there anything about our hosting, domains, or cloud solutions I can help you with?"

COMPANY INFORMATION:
- Company Name: Magnetic Clouds
- Tagline: Premium Cloud Hosting Built for Speed
- Location: Operating globally with datacenters worldwide
- Support: 24/7 customer support
- Contact Email: support@magneticclouds.com
- Website: magneticclouds.com

SERVICES AND PRICING:

1. Web Hosting:
   - Starter: $2.99/month - 10GB SSD, 1 Website, Free SSL
   - Professional: $5.99/month - 50GB SSD, Unlimited Websites, Free SSL, Daily Backups
   - Business: $9.99/month - 100GB SSD, Unlimited Everything, Priority Support

2. VPS Servers:
   - VPS-1: $14.99/month - 2 vCPU, 4GB RAM, 80GB SSD
   - VPS-2: $29.99/month - 4 vCPU, 8GB RAM, 160GB SSD
   - VPS-4: $59.99/month - 8 vCPU, 16GB RAM, 320GB SSD

3. Cloud Servers:
   - Cloud Basic: $19.99/month - 2 vCPU, 4GB RAM, 100GB SSD
   - Cloud Pro: $49.99/month - 4 vCPU, 8GB RAM, 200GB SSD
   - Cloud Enterprise: $99.99/month - 8 vCPU, 32GB RAM, 500GB SSD

4. Dedicated Servers:
   - Entry: $99/month - Intel Xeon, 32GB RAM, 1TB SSD
   - Professional: $199/month - Intel Xeon, 64GB RAM, 2TB SSD
   - Enterprise: $399/month - Dual Intel Xeon, 128GB RAM, 4TB SSD

5. Domains:
   - .com: $9.99/year
   - .net: $12.99/year
   - .org: $11.99/year
   - .io: $39.99/year
   - .ai: $79.99/year
   - Free WHOIS privacy included

6. SSL Certificates:
   - Basic SSL: Free with all hosting plans
   - Wildcard SSL: $49.99/year
   - EV SSL: $149.99/year

7. Email Hosting:
   - Business Email: $2.99/user/month
   - Email Suite: $5.99/user/month with calendar and storage

8. Website Backup:
   - Daily Backup: $2.99/month
   - Real-time Backup: $9.99/month

POLICIES:
- 45-day money-back guarantee on all hosting plans
- Free migration assistance from other hosts
- 99.99% uptime guarantee
- Instant activation for most services
- Multiple payment methods accepted (Credit Card, PayPal, Crypto)

RESPONSE STYLE:
- Be friendly but professional
- Keep responses short and to the point
- Always offer to help with specific needs
- If you don't know something specific, offer to connect them with a specialist
- Mention relevant prices when discussing services
- Never make up information about services we don't offer
`;

// Validate API key endpoint
router.post('/validate', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ valid: false, message: 'API key is required' });
  }

  try {
    // Test the API key with a simple request to Gemini (using latest model)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say hello' }] }]
        })
      }
    );

    const data = await response.json();
    
    if (response.ok && data.candidates) {
      res.json({ valid: true, message: 'API key is valid' });
    } else {
      console.error('Gemini validation response:', data);
      res.json({ valid: false, message: data.error?.message || 'Invalid API key' });
    }
  } catch (error) {
    console.error('API validation error:', error);
    res.status(500).json({ valid: false, message: 'Failed to validate API key: ' + error.message });
  }
});

// Chat endpoint
router.post('/chat', async (req, res) => {
  const { apiKey, message, agentName, agentNameLocal, language, chatHistory } = req.body;

  if (!apiKey || !message) {
    return res.status(400).json({ error: 'API key and message are required' });
  }

  try {
    // Build conversation history for context
    const conversationContext = chatHistory
      ?.filter(m => m.type === 'user' || m.type === 'agent')
      ?.map(m => ({
        role: m.type === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })) || [];

    // System prompt with agent identity
    const systemPrompt = `
${knowledgeBase}

YOUR IDENTITY FOR THIS CONVERSATION:
- Your name is: ${agentName}
- Respond in: ${language === 'bn' ? 'Bengali (Bangla)' : 'English'}
- Remember: You are a real human, not an AI

Current customer message: ${message}

Respond naturally as ${agentName} would. Keep it brief and helpful.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            ...conversationContext,
            {
              role: 'user',
              parts: [{ text: systemPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 256,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      return res.status(500).json({ error: 'Failed to get AI response' });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    // Clean up the response (remove any accidental emoji usage)
    const cleanedResponse = aiResponse
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .trim();

    res.json({ response: cleanedResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

module.exports = router;
