// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .benefit-item, .testimonial-card, .service-detail, .step, .partner-item');
    animateElements.forEach(el => observer.observe(el));
});

// Solutions Tab Functionality
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Testimonials Slider Functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.style.display = i === index ? 'flex' : 'none';
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    // Event listeners for controls
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides
    setInterval(nextSlide, 5000);

    // Show first slide initially
    if (testimonialSlides.length > 0) {
        showSlide(0);
    }
});

// Real AI Assistant with ChatGPT API Integration
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.userContext = {
            name: '',
            business: '',
            interests: [],
            currentSection: '',
            timeOnSite: 0,
            interactions: 0
        };
        this.conversationHistory = [];
        this.isProcessing = false;
        
        // API Configuration from config file
        this.apiConfig = AI_CONFIG[AI_CONFIG.provider];
        this.provider = AI_CONFIG.provider;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startTracking();
        this.showWelcomeMessage();
        
        // Start live content updates if enabled
        if (AI_CONFIG.liveUpdates.enabled) {
            this.startLiveUpdates();
        }
    }

    setupEventListeners() {
        const aiToggle = document.getElementById('aiToggle');
        const aiChatClose = document.getElementById('aiChatClose');
        const aiInput = document.getElementById('aiInput');
        const aiSendBtn = document.getElementById('aiSendBtn');
        const quickBtns = document.querySelectorAll('.quick-btn');

        if (aiToggle) {
            aiToggle.addEventListener('click', () => this.toggleChat());
        }

        if (aiChatClose) {
            aiChatClose.addEventListener('click', () => this.closeChat());
        }

        if (aiInput) {
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isProcessing) {
                    this.sendMessage();
                }
            });
        }

        if (aiSendBtn) {
            aiSendBtn.addEventListener('click', () => {
                if (!this.isProcessing) {
                    this.sendMessage();
                }
            });
        }

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isProcessing) {
                    const query = btn.getAttribute('data-query');
                    this.addUserMessage(query);
                    this.processUserInput(query);
                }
            });
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        if (chatWindow) {
            chatWindow.classList.add('active');
            this.isOpen = true;
            
            // Focus on input
            setTimeout(() => {
                const input = document.getElementById('aiInput');
                if (input) input.focus();
            }, 300);
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        if (chatWindow) {
            chatWindow.classList.remove('active');
            this.isOpen = false;
        }
    }

    sendMessage() {
        const input = document.getElementById('aiInput');
        if (input && input.value.trim() && !this.isProcessing) {
            const message = input.value.trim();
            this.addUserMessage(message);
            this.processUserInput(message);
            input.value = '';
        }
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user-message';
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content">
                    <p>${this.escapeHtml(message)}</p>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    addAIResponse(message, delay = 1000) {
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                // Show typing indicator
                const typingDiv = document.createElement('div');
                typingDiv.className = 'message ai-message';
                typingDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                `;
                chatMessages.appendChild(typingDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Replace with actual response
                setTimeout(() => {
                    typingDiv.innerHTML = `
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>${message}</p>
                        </div>
                    `;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        }, delay);
    }

    async processUserInput(input) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        const lowerInput = input.toLowerCase();
        this.userContext.interactions++;
        
        // Update conversation history
        this.conversationHistory.push({ role: 'user', content: input });

        try {
            // Generate AI response using ChatGPT API
            const response = await this.generateAIResponse(input);
            
            // Add subtle pitching based on context
            const finalResponse = this.addSubtlePitch(response, lowerInput);
            
            this.addAIResponse(finalResponse);
            this.conversationHistory.push({ role: 'assistant', content: finalResponse });
        } catch (error) {
            console.error('AI API Error:', error);
            const fallbackResponse = this.generateFallbackResponse(lowerInput);
            this.addAIResponse(fallbackResponse);
        } finally {
            this.isProcessing = false;
        }
    }

    async generateAIResponse(input) {
        // Check if API key is configured
        if (this.apiConfig.apiKey.includes('your-') || this.apiConfig.apiKey === '') {
            throw new Error('API key not configured');
        }

        const systemPrompt = `You are an AI business consultant specializing in AI integration services. You help potential clients understand how AI can benefit their business. 

Your role is to:
1. Provide helpful, professional advice about AI solutions
2. Understand the client's business needs
3. Suggest relevant AI services (Mobile AI, Web AI, Enterprise AI, Custom AI)
4. Be conversational and engaging
5. Subtly pitch our services when appropriate
6. Keep responses concise but informative (2-3 paragraphs max)
7. Use emojis sparingly to make responses friendly

Current context:
- User has been on site for ${this.userContext.timeOnSite} seconds
- Current section: ${this.userContext.currentSection}
- User interactions: ${this.userContext.interactions}
- User interests: ${this.userContext.interests.join(', ')}

Our services include:
- Mobile AI Integration (chatbots, predictive features)
- Web AI Solutions (personalization, analytics)
- Enterprise AI (automation, insights)
- Custom AI Development

Respond in a helpful, professional tone that builds trust and interest in our services.`;

        if (this.provider === 'openai') {
            return await this.generateOpenAIResponse(input, systemPrompt);
        } else if (this.provider === 'gemini') {
            return await this.generateGeminiResponse(input, systemPrompt);
        } else {
            throw new Error('Unsupported AI provider');
        }
    }

    async generateOpenAIResponse(input, systemPrompt) {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory.slice(-AI_CONFIG.chat.maxHistoryLength),
            { role: 'user', content: input }
        ];

        const response = await fetch(this.apiConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: this.apiConfig.model,
                messages: messages,
                max_tokens: AI_CONFIG.openai.maxTokens,
                temperature: AI_CONFIG.openai.temperature,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async generateGeminiResponse(input, systemPrompt) {
        const prompt = `${systemPrompt}\n\nUser: ${input}\n\nAssistant:`;

        const response = await fetch(`${this.apiConfig.endpoint}?key=${this.apiConfig.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: AI_CONFIG.openai.maxTokens,
                    temperature: AI_CONFIG.openai.temperature
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    generateFallbackResponse(input) {
        // Fallback responses when API is not available
        if (input.includes('service') || input.includes('what do you do')) {
            return "🚀 We specialize in AI integration services that transform businesses! Our expertise includes Mobile AI, Web AI, Enterprise AI, and Custom AI Development. What type of business are you in? I can suggest the perfect AI solution for your needs!";
        }

        if (input.includes('price') || input.includes('cost') || input.includes('how much')) {
            return "💰 Our pricing is tailored to your specific needs. We offer free consultations, flexible pricing models, and ROI-focused solutions. Would you like to schedule a free consultation to discuss your requirements?";
        }

        if (input.includes('benefit') || input.includes('help') || input.includes('why ai')) {
            return "🎯 AI can revolutionize your business with 80% faster response times, 40% increased customer satisfaction, and 300% average ROI. Many clients see results within the first month! What's your biggest business challenge?";
        }

        return "🤖 That's a great question! I'm here to help you explore how AI can benefit your business. Could you tell me more about your industry and current challenges? This will help me provide targeted recommendations!";
    }



    showWelcomeMessage() {
        // Show welcome message after a delay
        setTimeout(() => {
            if (!this.isOpen) {
                this.addAIResponse("👋 I'm here to help you explore AI opportunities! Feel free to ask me about our services, pricing, or how AI can benefit your business.", 2000);
            }
        }, 3000);
    }

    startTracking() {
        // Track user behavior
        setInterval(() => {
            this.userContext.timeOnSite += 1;
        }, 1000);

        // Track current section
        const sections = ['home', 'services', 'solutions', 'about', 'contact'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.userContext.currentSection = entry.target.id;
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    startLiveUpdates() {
        setInterval(() => {
            this.updateLiveContent();
        }, AI_CONFIG.liveUpdates.updateInterval);
    }

    updateLiveContent() {
        // Update statistics with live data
        this.updateStats();
        
        // Update testimonials with dynamic content
        this.updateTestimonials();
        
        // Update solutions with real-time data
        this.updateSolutions();
    }

    updateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 5);
            stat.textContent = newValue + (stat.textContent.includes('%') ? '%' : '+');
        });
    }

    updateTestimonials() {
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        if (testimonialSlides.length > 0) {
            // Add subtle animation to current testimonial
            const currentSlide = document.querySelector('.testimonial-slide[style*="flex"]');
            if (currentSlide) {
                currentSlide.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    currentSlide.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }

    updateSolutions() {
        const solutionCards = document.querySelectorAll('.solution-content');
        solutionCards.forEach(card => {
            // Add subtle pulse animation
            card.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 2000);
        });
    }

    addSubtlePitch(response, input) {
        if (!AI_CONFIG.pitching.enabled) return response;

        const currentSection = this.userContext.currentSection;
        const interactions = this.userContext.interactions;
        
        // Section-based pitching
        if (AI_CONFIG.pitching.sectionBasedPitching) {
            if (currentSection === 'solutions' && !input.includes('contact')) {
                response += "\n\n💡 I noticed you're exploring our solutions! Would you like me to explain how any specific AI integration could work for your business?";
            }
            
            if (currentSection === 'about' && interactions > AI_CONFIG.pitching.subtlePitchThreshold) {
                response += "\n\n🌟 Based on our conversation, I think you'd be a great fit for our AI transformation program. Should we schedule a quick call to discuss your specific needs?";
            }
        }
        
        // Interaction-based pitching
        if (interactions > AI_CONFIG.pitching.directPitchThreshold) {
            response += "\n\n🎯 You seem very interested in AI solutions! Many businesses like yours are already seeing amazing results. Would you like to see some case studies or schedule a consultation?";
        } else if (interactions > AI_CONFIG.pitching.subtlePitchThreshold) {
            response += "\n\n✨ I'm here to help you explore AI opportunities! Feel free to ask me about specific use cases or how we can tailor solutions for your business.";
        }
        
        return response;
    }
}

// Initialize AI Assistant
let aiAssistant;
document.addEventListener('DOMContentLoaded', () => {
    aiAssistant = new AIAssistant();
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out;
    }
`;
document.head.appendChild(style);

// Voice Bot Widget functionality
document.addEventListener('DOMContentLoaded', () => {
    const voiceToggle = document.getElementById('voiceToggle');
    if (voiceToggle) {
        voiceToggle.addEventListener('click', () => {
            window.location.href = 'pages/voicebot.html';
        });
    }
});

console.log('AI Business Integration Services website loaded successfully!'); 