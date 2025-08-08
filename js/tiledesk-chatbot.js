// Tiledesk FAQ Chatbot Integration
class TiledeskChatbot {
    constructor() {
        this.isInitialized = false;
        this.faqData = {
            services: [
                {
                    question: "What AI services do you offer?",
                    answer: "We offer comprehensive AI integration services including Mobile AI, Web AI, Enterprise AI, and Custom AI Development. Our services cover chatbots, predictive analytics, natural language processing, and more.",
                    keywords: ["services", "offer", "ai", "what", "do"]
                },
                {
                    question: "How much do your AI services cost?",
                    answer: "Our pricing is tailored to your specific needs. We offer free consultations, flexible pricing models starting from $2,000/month, and ROI-focused solutions. Contact us for a custom quote.",
                    keywords: ["cost", "price", "pricing", "how much", "money"]
                },
                {
                    question: "How long does AI integration take?",
                    answer: "Typical AI integration projects take 4-12 weeks depending on complexity. Mobile AI: 4-6 weeks, Web AI: 6-8 weeks, Enterprise AI: 8-12 weeks. We provide detailed timelines during consultation.",
                    keywords: ["time", "duration", "how long", "weeks", "months"]
                }
            ],
            technical: [
                {
                    question: "What technologies do you use?",
                    answer: "We use cutting-edge technologies including OpenAI GPT, Google Gemini, TensorFlow, PyTorch, React, Node.js, Python, and cloud platforms like AWS and Azure.",
                    keywords: ["technology", "tech", "tools", "platforms", "what"]
                },
                {
                    question: "Do you provide ongoing support?",
                    answer: "Yes! We provide 24/7 technical support, regular updates, performance monitoring, and continuous optimization. Our support includes maintenance, troubleshooting, and feature enhancements.",
                    keywords: ["support", "help", "maintenance", "ongoing", "24/7"]
                },
                {
                    question: "Is my data secure?",
                    answer: "Absolutely. We implement enterprise-grade security with bank-level encryption, SOC 2 compliance, GDPR adherence, and secure cloud infrastructure. Your data is protected at every level.",
                    keywords: ["security", "secure", "data", "privacy", "encryption"]
                }
            ],
            business: [
                {
                    question: "What ROI can I expect?",
                    answer: "Our clients typically see 300% average ROI within 6-12 months. Specific benefits include 80% faster response times, 40% increased customer satisfaction, and 50% reduction in operational costs.",
                    keywords: ["roi", "return", "benefit", "results", "expect"]
                },
                {
                    question: "Do you work with small businesses?",
                    answer: "Yes! We work with businesses of all sizes, from startups to Fortune 500 companies. We have scalable solutions and flexible pricing to accommodate different business needs and budgets.",
                    keywords: ["small", "business", "startup", "company", "size"]
                },
                {
                    question: "Can you integrate with existing systems?",
                    answer: "Absolutely. We specialize in seamless integration with existing systems including CRMs, ERPs, websites, mobile apps, and custom software. We ensure minimal disruption to your operations.",
                    keywords: ["integrate", "existing", "systems", "crm", "erp"]
                }
            ]
        };
        
        this.conversationHistory = [];
        this.userIntent = null;
        this.init();
    }

    init() {
        this.setupTiledeskWidget();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('Tiledesk FAQ Chatbot initialized');
    }

    setupTiledeskWidget() {
        // Tiledesk Widget Configuration
        const tiledeskConfig = {
            projectid: "YOUR_TILEDESK_PROJECT_ID", // Replace with your Tiledesk project ID
            apiurl: "https://api.tiledesk.com/v2/",
            theme: {
                primaryColor: "#667eea",
                secondaryColor: "#764ba2",
                backgroundColor: "#ffffff",
                textColor: "#333333"
            },
            welcomeMessage: "👋 Hi! I'm your AI business assistant. How can I help you today?",
            position: "bottom-right",
            size: "medium",
            enableNotifications: true,
            enableSound: true,
            enableFileUpload: true,
            enableVoiceMessages: true
        };

        // Initialize Tiledesk widget
        if (typeof Tiledesk !== 'undefined') {
            Tiledesk.init(tiledeskConfig);
        } else {
            // Fallback to custom FAQ system if Tiledesk is not available
            this.setupCustomFAQWidget();
        }
    }

    setupCustomFAQWidget() {
        // Create custom FAQ widget as fallback
        const faqWidget = document.createElement('div');
        faqWidget.id = 'custom-faq-widget';
        faqWidget.className = 'faq-widget';
        faqWidget.innerHTML = `
            <div class="faq-toggle" id="faqToggle">
                <i class="fas fa-question-circle"></i>
                <span>FAQ Assistant</span>
            </div>
            <div class="faq-window" id="faqWindow">
                <div class="faq-header">
                    <h3>Frequently Asked Questions</h3>
                    <button class="faq-close" id="faqClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="faq-content" id="faqContent">
                    <div class="faq-categories">
                        <button class="faq-category active" data-category="services">Services</button>
                        <button class="faq-category" data-category="technical">Technical</button>
                        <button class="faq-category" data-category="business">Business</button>
                    </div>
                    <div class="faq-questions" id="faqQuestions"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(faqWidget);
        this.loadFAQQuestions('services');
    }

    setupEventListeners() {
        // FAQ widget event listeners
        const faqToggle = document.getElementById('faqToggle');
        const faqClose = document.getElementById('faqClose');
        const faqCategories = document.querySelectorAll('.faq-category');

        if (faqToggle) {
            faqToggle.addEventListener('click', () => this.toggleFAQWidget());
        }

        if (faqClose) {
            faqClose.addEventListener('click', () => this.closeFAQWidget());
        }

        faqCategories.forEach(category => {
            category.addEventListener('click', (e) => {
                const categoryName = e.target.dataset.category;
                this.loadFAQQuestions(categoryName);
                
                // Update active category
                faqCategories.forEach(cat => cat.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Handle incoming messages from Tiledesk
        if (typeof Tiledesk !== 'undefined') {
            Tiledesk.on('message', (message) => {
                this.handleIncomingMessage(message);
            });
        }
    }

    toggleFAQWidget() {
        const faqWindow = document.getElementById('faqWindow');
        if (faqWindow) {
            faqWindow.classList.toggle('active');
        }
    }

    closeFAQWidget() {
        const faqWindow = document.getElementById('faqWindow');
        if (faqWindow) {
            faqWindow.classList.remove('active');
        }
    }

    loadFAQQuestions(category) {
        const questionsContainer = document.getElementById('faqQuestions');
        if (!questionsContainer) return;

        const questions = this.faqData[category] || [];
        questionsContainer.innerHTML = '';

        questions.forEach((faq, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'faq-question';
            questionElement.innerHTML = `
                <div class="faq-question-header" onclick="tiledeskChatbot.toggleAnswer(${index})">
                    <span>${faq.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer" id="faq-answer-${index}">
                    <p>${faq.answer}</p>
                    <button class="faq-action-btn" onclick="tiledeskChatbot.askFollowUp('${faq.question}')">
                        <i class="fas fa-comment"></i>
                        Ask Follow-up
                    </button>
                </div>
            `;
            questionsContainer.appendChild(questionElement);
        });
    }

    toggleAnswer(index) {
        const answer = document.getElementById(`faq-answer-${index}`);
        const icon = answer.previousElementSibling.querySelector('i');
        
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
        } else {
            answer.style.display = 'block';
            icon.className = 'fas fa-chevron-up';
        }
    }

    askFollowUp(question) {
        // Open chat with pre-filled question
        if (typeof Tiledesk !== 'undefined') {
            Tiledesk.open();
            setTimeout(() => {
                Tiledesk.sendMessage(`I have a follow-up question about: ${question}`);
            }, 500);
        } else {
            // Fallback to contact form
            this.redirectToContact(question);
        }
    }

    redirectToContact(question) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pre-fill the message field
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = `Follow-up question: ${question}\n\n`;
                messageField.focus();
            }
        }
    }

    handleIncomingMessage(message) {
        // Process incoming messages and provide intelligent responses
        const userMessage = message.text.toLowerCase();
        this.conversationHistory.push({ role: 'user', content: userMessage });

        // Analyze user intent
        this.analyzeIntent(userMessage);

        // Generate appropriate response
        const response = this.generateResponse(userMessage);
        
        // Send response back
        this.sendResponse(response);
    }

    analyzeIntent(message) {
        // Simple intent analysis based on keywords
        if (message.includes('service') || message.includes('offer') || message.includes('what')) {
            this.userIntent = 'services';
        } else if (message.includes('price') || message.includes('cost') || message.includes('money')) {
            this.userIntent = 'pricing';
        } else if (message.includes('time') || message.includes('duration') || message.includes('how long')) {
            this.userIntent = 'timeline';
        } else if (message.includes('contact') || message.includes('call') || message.includes('speak')) {
            this.userIntent = 'contact';
        } else {
            this.userIntent = 'general';
        }
    }

    generateResponse(message) {
        // Find the best matching FAQ
        const bestMatch = this.findBestFAQMatch(message);
        
        if (bestMatch) {
            return {
                text: bestMatch.answer,
                type: 'faq',
                confidence: bestMatch.confidence
            };
        }

        // Generate contextual response based on intent
        return this.generateContextualResponse(message);
    }

    findBestFAQMatch(message) {
        let bestMatch = null;
        let highestConfidence = 0;

        // Search through all FAQ categories
        Object.values(this.faqData).forEach(category => {
            category.forEach(faq => {
                const confidence = this.calculateMatchConfidence(message, faq);
                if (confidence > highestConfidence && confidence > 0.3) {
                    highestConfidence = confidence;
                    bestMatch = { ...faq, confidence };
                }
            });
        });

        return bestMatch;
    }

    calculateMatchConfidence(message, faq) {
        const messageWords = message.split(' ');
        const faqKeywords = faq.keywords;
        const questionWords = faq.question.toLowerCase().split(' ');

        let matches = 0;
        let totalWords = Math.max(messageWords.length, faqKeywords.length);

        // Check keyword matches
        faqKeywords.forEach(keyword => {
            if (message.includes(keyword)) {
                matches++;
            }
        });

        // Check question word matches
        questionWords.forEach(word => {
            if (message.includes(word) && word.length > 3) {
                matches++;
            }
        });

        return matches / totalWords;
    }

    generateContextualResponse(message) {
        switch (this.userIntent) {
            case 'services':
                return {
                    text: "We offer comprehensive AI integration services including Mobile AI, Web AI, Enterprise AI, and Custom AI Development. Would you like me to explain any specific service in detail?",
                    type: 'intent',
                    confidence: 0.8
                };
            case 'pricing':
                return {
                    text: "Our pricing is tailored to your specific needs. We offer free consultations and flexible pricing models. Would you like to schedule a free consultation to discuss your requirements?",
                    type: 'intent',
                    confidence: 0.8
                };
            case 'timeline':
                return {
                    text: "Typical AI integration projects take 4-12 weeks depending on complexity. We provide detailed timelines during our consultation. Would you like to discuss your project timeline?",
                    type: 'intent',
                    confidence: 0.8
                };
            case 'contact':
                return {
                    text: "I'd be happy to connect you with our team! You can call us at +1 (555) 123-4567, email hello@ainexuspro.com, or schedule a consultation through our website. What works best for you?",
                    type: 'intent',
                    confidence: 0.9
                };
            default:
                return {
                    text: "That's a great question! I'm here to help you explore AI opportunities for your business. Could you tell me more about your specific needs or challenges?",
                    type: 'general',
                    confidence: 0.6
                };
        }
    }

    sendResponse(response) {
        if (typeof Tiledesk !== 'undefined') {
            Tiledesk.sendMessage(response.text);
        } else {
            // Fallback: show response in custom widget
            this.showCustomResponse(response.text);
        }

        // Add to conversation history
        this.conversationHistory.push({ role: 'assistant', content: response.text });
    }

    showCustomResponse(response) {
        const faqContent = document.getElementById('faqContent');
        if (faqContent) {
            const responseElement = document.createElement('div');
            responseElement.className = 'faq-response';
            responseElement.innerHTML = `
                <div class="response-bubble">
                    <p>${response}</p>
                </div>
            `;
            faqContent.appendChild(responseElement);
            
            // Auto-scroll to response
            responseElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Analytics and tracking
    trackInteraction(type, data) {
        // Track user interactions for analytics
        const interaction = {
            type,
            data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };

        // Send to analytics service (replace with your analytics endpoint)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_interaction', {
                event_category: 'chatbot',
                event_label: type,
                value: 1
            });
        }

        console.log('FAQ Interaction tracked:', interaction);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('faq_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('faq_session_id', sessionId);
        }
        return sessionId;
    }
}

// Initialize Tiledesk Chatbot
let tiledeskChatbot;
document.addEventListener('DOMContentLoaded', () => {
    tiledeskChatbot = new TiledeskChatbot();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TiledeskChatbot;
} 