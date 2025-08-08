// AI Integration with Free APIs
class AIIntegration {
    constructor() {
        this.apiKey = null;
        this.provider = 'openai'; // or 'gemini', 'huggingface'
        this.init();
    }

    init() {
        this.setupFreeAPIs();
        this.setupEventListeners();
    }

    setupFreeAPIs() {
        // Try to get API keys from environment or use free alternatives
        this.apiKey = this.getAPIKey();
        
        // Setup free API endpoints
        this.freeAPIs = {
            openai: {
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            },
            gemini: {
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                apiKey: this.getGeminiKey()
            },
            huggingface: {
                endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
                headers: {
                    'Authorization': `Bearer ${this.getHuggingFaceKey()}`
                }
            }
        };
    }

    getAPIKey() {
        // Try to get from environment or use a free tier key
        return process.env.OPENAI_API_KEY || 'your-free-api-key-here';
    }

    getGeminiKey() {
        return process.env.GEMINI_API_KEY || 'your-gemini-api-key-here';
    }

    getHuggingFaceKey() {
        return process.env.HUGGINGFACE_API_KEY || 'your-huggingface-api-key-here';
    }

    setupEventListeners() {
        // Listen for AI requests from other components
        document.addEventListener('ai-request', (e) => {
            this.handleAIRequest(e.detail);
        });
    }

    async handleAIRequest(request) {
        const { type, input, callback } = request;
        
        try {
            let response;
            
            switch (type) {
                case 'chat':
                    response = await this.generateChatResponse(input);
                    break;
                case 'voice':
                    response = await this.generateVoiceResponse(input);
                    break;
                case 'analysis':
                    response = await this.analyzeText(input);
                    break;
                default:
                    response = await this.generateFallbackResponse(input);
            }
            
            if (callback) {
                callback(response);
            }
            
            // Dispatch response event
            document.dispatchEvent(new CustomEvent('ai-response', {
                detail: { type, input, response }
            }));
            
        } catch (error) {
            console.error('AI request failed:', error);
            const fallbackResponse = this.generateFallbackResponse(input);
            
            if (callback) {
                callback(fallbackResponse);
            }
        }
    }

    async generateChatResponse(input) {
        // Try different providers in order of preference
        const providers = ['openai', 'gemini', 'huggingface'];
        
        for (const provider of providers) {
            try {
                const response = await this.callAPI(provider, input);
                if (response) {
                    return response;
                }
            } catch (error) {
                console.warn(`${provider} API failed, trying next...`, error);
                continue;
            }
        }
        
        // If all APIs fail, return fallback response
        return this.generateFallbackResponse(input);
    }

    async callAPI(provider, input) {
        const api = this.freeAPIs[provider];
        if (!api) return null;

        const systemPrompt = `You are an AI business assistant for AI Nexus Pro, a company that provides AI integration services. 
        You help potential clients understand AI solutions, pricing, and business benefits. 
        Be helpful, professional, and encourage them to explore our services.`;

        try {
            switch (provider) {
                case 'openai':
                    return await this.callOpenAI(api, input, systemPrompt);
                case 'gemini':
                    return await this.callGemini(api, input, systemPrompt);
                case 'huggingface':
                    return await this.callHuggingFace(api, input);
                default:
                    return null;
            }
        } catch (error) {
            console.error(`Error calling ${provider} API:`, error);
            return null;
        }
    }

    async callOpenAI(api, input, systemPrompt) {
        const response = await fetch(api.endpoint, {
            method: 'POST',
            headers: api.headers,
            body: JSON.stringify({
                model: api.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: input }
                ],
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || null;
    }

    async callGemini(api, input, systemPrompt) {
        const response = await fetch(`${api.endpoint}?key=${api.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nUser: ${input}\n\nAssistant:`
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 150,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }

    async callHuggingFace(api, input) {
        const response = await fetch(api.endpoint, {
            method: 'POST',
            headers: api.headers,
            body: JSON.stringify({
                inputs: input,
                parameters: {
                    max_length: 100,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HuggingFace API error: ${response.status}`);
        }

        const data = await response.json();
        return data[0]?.generated_text || null;
    }

    generateFallbackResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Predefined responses for common queries
        const responses = {
            services: "We offer comprehensive AI integration services including chatbots, voice bots, predictive analytics, and custom AI solutions. Our services help businesses automate processes, improve customer experience, and drive growth.",
            pricing: "Our pricing is tailored to your specific needs. We offer free consultations, flexible pricing models starting from $2,000/month, and ROI-focused solutions. Would you like to schedule a free consultation?",
            contact: "You can reach us at hello@ainexuspro.com or call us at +1 (555) 123-4567. We're available 24/7 for support and consultations.",
            chatbot: "Our AI chatbots provide 24/7 customer support, handle complex queries, and integrate seamlessly with your existing systems. They can reduce response times by up to 80%.",
            voice: "Our voice bots offer natural conversation capabilities, real-time transcription, and seamless human handoff. Perfect for customer service and sales calls.",
            benefits: "AI integration can increase efficiency by 40%, reduce costs by 30%, and improve customer satisfaction by 50%. Our solutions deliver measurable ROI within 6-12 months."
        };

        // Find the best matching response
        for (const [key, response] of Object.entries(responses)) {
            if (lowerInput.includes(key)) {
                return response;
            }
        }

        // Default response
        return "Thank you for your interest in AI Nexus Pro! I'm here to help you explore AI solutions for your business. Could you tell me more about your specific needs or questions?";
    }

    async generateVoiceResponse(input) {
        // For voice responses, we can use text-to-speech APIs
        // For now, return a text response that can be converted to speech
        const response = await this.generateChatResponse(input);
        return {
            text: response,
            audio: null // In a real implementation, this would contain audio data
        };
    }

    async analyzeText(input) {
        // Simple text analysis for sentiment and intent
        const analysis = {
            sentiment: this.analyzeSentiment(input),
            intent: this.analyzeIntent(input),
            keywords: this.extractKeywords(input),
            confidence: 0.8
        };
        
        return analysis;
    }

    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'interested', 'helpful'];
        const negativeWords = ['bad', 'terrible', 'hate', 'dislike', 'expensive', 'difficult', 'problem'];
        
        const lowerText = text.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (lowerText.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (lowerText.includes(word)) score -= 1;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }

    analyzeIntent(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
            return 'pricing_inquiry';
        }
        if (lowerText.includes('service') || lowerText.includes('offer') || lowerText.includes('what do you do')) {
            return 'service_inquiry';
        }
        if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('phone')) {
            return 'contact_request';
        }
        if (lowerText.includes('book') || lowerText.includes('schedule') || lowerText.includes('appointment')) {
            return 'booking_request';
        }
        
        return 'general_inquiry';
    }

    extractKeywords(text) {
        const commonKeywords = [
            'ai', 'artificial intelligence', 'chatbot', 'voice bot', 'automation',
            'integration', 'business', 'solution', 'service', 'consultation',
            'pricing', 'cost', 'roi', 'benefit', 'efficiency', 'productivity'
        ];
        
        const lowerText = text.toLowerCase();
        return commonKeywords.filter(keyword => lowerText.includes(keyword));
    }

    // Public method to request AI assistance
    async requestAI(type, input) {
        return new Promise((resolve) => {
            document.dispatchEvent(new CustomEvent('ai-request', {
                detail: { type, input, callback: resolve }
            }));
        });
    }
}

// Initialize AI Integration
const aiIntegration = new AIIntegration();

// Export for use in other scripts
window.AIIntegration = aiIntegration; 