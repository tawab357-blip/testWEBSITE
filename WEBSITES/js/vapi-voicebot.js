// Vapi Voice Bot Integration
class VapiVoiceBot {
    constructor() {
        this.isInitialized = false;
        this.isCallActive = false;
        this.currentCall = null;
        this.voiceConfig = {
            assistant: {
                name: "AI Nexus Pro Assistant",
                voice: "jennifer", // Vapi voice options: jennifer, john, mike, emily
                language: "en-US",
                speed: 1.0,
                pitch: 1.0
            },
            callSettings: {
                maxDuration: 300, // 5 minutes
                enableRecording: false,
                enableTranscription: true,
                fallbackBehavior: "transfer_to_human"
            }
        };
        
        this.conversationFlows = {
            welcome: {
                message: "Hello! Welcome to AI Nexus Pro. I'm your AI assistant, here to help you explore our AI integration services. How can I assist you today?",
                options: ["Learn about services", "Get pricing", "Schedule consultation", "Speak with human"]
            },
            services: {
                message: "We offer four main AI integration services. Mobile AI for apps, Web AI for websites, Enterprise AI for large businesses, and Custom AI development. Which interests you most?",
                options: ["Mobile AI", "Web AI", "Enterprise AI", "Custom AI", "Back to main menu"]
            },
            pricing: {
                message: "Our pricing is tailored to your needs. We offer free consultations, flexible monthly plans starting at $2,000, and custom enterprise solutions. Would you like to schedule a free consultation?",
                options: ["Schedule consultation", "Learn more about pricing", "Speak with sales", "Back to main menu"]
            },
            consultation: {
                message: "Great! I can help you schedule a consultation. Our team will assess your needs and provide a custom AI strategy. What's the best time for a 30-minute call?",
                options: ["This week", "Next week", "Send me available times", "Speak with human"]
            }
        };
        
        this.init();
    }

    init() {
        this.setupVapiIntegration();
        this.setupVoiceUI();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('Vapi Voice Bot initialized');
    }

    setupVapiIntegration() {
        // Vapi configuration
        this.vapiConfig = {
            apiKey: 'YOUR_VAPI_API_KEY', // Replace with your Vapi API key
            assistant: {
                name: this.voiceConfig.assistant.name,
                voice: this.voiceConfig.assistant.voice,
                language: this.voiceConfig.assistant.language,
                speed: this.voiceConfig.assistant.speed,
                pitch: this.voiceConfig.assistant.pitch,
                model: {
                    provider: "openai",
                    model: "gpt-3.5-turbo",
                    systemPrompt: this.generateSystemPrompt(),
                    temperature: 0.7,
                    maxTokens: 150
                }
            },
            callSettings: this.voiceConfig.callSettings
        };

        // Initialize Vapi SDK if available
        if (typeof Vapi !== 'undefined') {
            Vapi.init(this.vapiConfig);
        } else {
            console.warn('Vapi SDK not loaded. Voice features will be limited.');
        }
    }

    generateSystemPrompt() {
        return `You are an AI business consultant for AI Nexus Pro, specializing in AI integration services. Your role is to:

1. Help potential clients understand AI opportunities for their business
2. Explain our services: Mobile AI, Web AI, Enterprise AI, and Custom AI Development
3. Guide conversations toward scheduling consultations
4. Be professional, friendly, and concise
5. Ask qualifying questions to understand their needs
6. Transfer to human agents when needed

Key information:
- We offer free consultations
- Pricing starts at $2,000/month
- Projects typically take 4-12 weeks
- We work with businesses of all sizes
- 98% client satisfaction rate

Keep responses under 30 seconds and always offer next steps.`;
    }

    setupVoiceUI() {
        // Create voice interaction UI
        const voiceUI = document.createElement('div');
        voiceUI.id = 'voice-bot-ui';
        voiceUI.className = 'voice-bot-ui';
        voiceUI.innerHTML = `
            <div class="voice-toggle" id="voiceToggle">
                <div class="voice-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="voice-status">
                    <span class="status-text">Call AI Assistant</span>
                    <span class="status-indicator"></span>
                </div>
            </div>
            
            <div class="voice-panel" id="voicePanel">
                <div class="voice-header">
                    <h3>AI Voice Assistant</h3>
                    <button class="voice-close" id="voiceClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="voice-content">
                    <div class="call-status" id="callStatus">
                        <div class="status-message">Ready to call</div>
                        <div class="call-timer" id="callTimer" style="display: none;">00:00</div>
                    </div>
                    
                    <div class="voice-actions">
                        <button class="voice-action-btn" id="startCall">
                            <i class="fas fa-phone"></i>
                            Start Call
                        </button>
                        <button class="voice-action-btn" id="endCall" style="display: none;">
                            <i class="fas fa-phone-slash"></i>
                            End Call
                        </button>
                    </div>
                    
                    <div class="voice-transcript" id="voiceTranscript">
                        <h4>Call Transcript</h4>
                        <div class="transcript-content" id="transcriptContent"></div>
                    </div>
                    
                    <div class="voice-options">
                        <h4>Quick Actions</h4>
                        <div class="option-buttons">
                            <button class="option-btn" data-action="services">
                                <i class="fas fa-cogs"></i>
                                Services
                            </button>
                            <button class="option-btn" data-action="pricing">
                                <i class="fas fa-dollar-sign"></i>
                                Pricing
                            </button>
                            <button class="option-btn" data-action="consultation">
                                <i class="fas fa-calendar"></i>
                                Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(voiceUI);
    }

    setupEventListeners() {
        const voiceToggle = document.getElementById('voiceToggle');
        const voiceClose = document.getElementById('voiceClose');
        const startCall = document.getElementById('startCall');
        const endCall = document.getElementById('endCall');
        const optionButtons = document.querySelectorAll('.option-btn');

        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => this.toggleVoicePanel());
        }

        if (voiceClose) {
            voiceClose.addEventListener('click', () => this.closeVoicePanel());
        }

        if (startCall) {
            startCall.addEventListener('click', () => this.startVoiceCall());
        }

        if (endCall) {
            endCall.addEventListener('click', () => this.endVoiceCall());
        }

        optionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Handle Vapi events if available
        if (typeof Vapi !== 'undefined') {
            Vapi.on('call-started', (call) => this.handleCallStarted(call));
            Vapi.on('call-ended', (call) => this.handleCallEnded(call));
            Vapi.on('transcript', (transcript) => this.handleTranscript(transcript));
            Vapi.on('error', (error) => this.handleError(error));
        }
    }

    toggleVoicePanel() {
        const voicePanel = document.getElementById('voicePanel');
        if (voicePanel) {
            voicePanel.classList.toggle('active');
        }
    }

    closeVoicePanel() {
        const voicePanel = document.getElementById('voicePanel');
        if (voicePanel) {
            voicePanel.classList.remove('active');
        }
    }

    async startVoiceCall() {
        if (this.isCallActive) {
            console.log('Call already in progress');
            return;
        }

        try {
            this.updateCallStatus('Initiating call...', 'connecting');
            
            if (typeof Vapi !== 'undefined') {
                // Use Vapi SDK for actual voice call
                this.currentCall = await Vapi.call({
                    phoneNumber: '+1234567890', // Replace with your business number
                    assistant: this.vapiConfig.assistant,
                    callSettings: this.vapiConfig.callSettings
                });
            } else {
                // Fallback: simulate voice call
                this.simulateVoiceCall();
            }
        } catch (error) {
            console.error('Failed to start voice call:', error);
            this.updateCallStatus('Call failed. Please try again.', 'error');
        }
    }

    simulateVoiceCall() {
        // Simulate voice call for demo purposes
        this.isCallActive = true;
        this.currentCall = {
            id: 'simulated-call-' + Date.now(),
            status: 'active',
            startTime: new Date()
        };

        this.updateCallStatus('Call connected', 'active');
        this.startCallTimer();
        this.showCallControls();

        // Simulate conversation flow
        setTimeout(() => {
            this.addTranscriptEntry('assistant', this.conversationFlows.welcome.message);
        }, 1000);

        // Simulate user responses
        setTimeout(() => {
            this.addTranscriptEntry('user', 'I want to learn about your AI services');
            setTimeout(() => {
                this.addTranscriptEntry('assistant', this.conversationFlows.services.message);
            }, 2000);
        }, 3000);
    }

    endVoiceCall() {
        if (!this.isCallActive) return;

        this.isCallActive = false;
        this.stopCallTimer();
        this.hideCallControls();
        this.updateCallStatus('Call ended', 'ended');

        if (typeof Vapi !== 'undefined' && this.currentCall) {
            Vapi.hangup(this.currentCall.id);
        }

        this.currentCall = null;
    }

    handleCallStarted(call) {
        this.isCallActive = true;
        this.currentCall = call;
        this.updateCallStatus('Call connected', 'active');
        this.startCallTimer();
        this.showCallControls();
        this.addTranscriptEntry('system', 'Call started');
    }

    handleCallEnded(call) {
        this.isCallActive = false;
        this.currentCall = null;
        this.stopCallTimer();
        this.hideCallControls();
        this.updateCallStatus('Call ended', 'ended');
        this.addTranscriptEntry('system', 'Call ended');
    }

    handleTranscript(transcript) {
        if (transcript.role === 'user') {
            this.addTranscriptEntry('user', transcript.text);
        } else if (transcript.role === 'assistant') {
            this.addTranscriptEntry('assistant', transcript.text);
        }
    }

    handleError(error) {
        console.error('Vapi error:', error);
        this.updateCallStatus('Call error: ' + error.message, 'error');
    }

    updateCallStatus(message, status) {
        const statusElement = document.getElementById('callStatus');
        const statusMessage = document.querySelector('.status-message');
        
        if (statusElement && statusMessage) {
            statusMessage.textContent = message;
            statusElement.className = `call-status status-${status}`;
        }
    }

    startCallTimer() {
        const timerElement = document.getElementById('callTimer');
        if (timerElement) {
            timerElement.style.display = 'block';
            this.callStartTime = Date.now();
            this.timerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.callStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }

    stopCallTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    showCallControls() {
        const startBtn = document.getElementById('startCall');
        const endBtn = document.getElementById('endCall');
        
        if (startBtn) startBtn.style.display = 'none';
        if (endBtn) endBtn.style.display = 'block';
    }

    hideCallControls() {
        const startBtn = document.getElementById('startCall');
        const endBtn = document.getElementById('endCall');
        
        if (startBtn) startBtn.style.display = 'block';
        if (endBtn) endBtn.style.display = 'none';
    }

    addTranscriptEntry(role, text) {
        const transcriptContent = document.getElementById('transcriptContent');
        if (!transcriptContent) return;

        const entry = document.createElement('div');
        entry.className = `transcript-entry transcript-${role}`;
        
        const icon = role === 'user' ? 'fas fa-user' : 
                    role === 'assistant' ? 'fas fa-robot' : 'fas fa-info-circle';
        
        entry.innerHTML = `
            <div class="transcript-icon">
                <i class="${icon}"></i>
            </div>
            <div class="transcript-text">
                <span class="transcript-role">${role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <p>${text}</p>
            </div>
        `;
        
        transcriptContent.appendChild(entry);
        transcriptContent.scrollTop = transcriptContent.scrollHeight;
    }

    handleQuickAction(action) {
        if (!this.isCallActive) {
            this.startVoiceCall();
            setTimeout(() => {
                this.processQuickAction(action);
            }, 2000);
        } else {
            this.processQuickAction(action);
        }
    }

    processQuickAction(action) {
        let response = '';
        
        switch (action) {
            case 'services':
                response = this.conversationFlows.services.message;
                break;
            case 'pricing':
                response = this.conversationFlows.pricing.message;
                break;
            case 'consultation':
                response = this.conversationFlows.consultation.message;
                break;
            default:
                response = this.conversationFlows.welcome.message;
        }

        this.addTranscriptEntry('assistant', response);
        
        // Send to Vapi if available
        if (typeof Vapi !== 'undefined' && this.currentCall) {
            Vapi.sendMessage(this.currentCall.id, response);
        }
    }

    // Analytics and tracking
    trackCallEvent(event, data) {
        const callEvent = {
            event,
            data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            callId: this.currentCall?.id
        };

        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'voice_call_' + event, {
                event_category: 'voice_bot',
                event_label: event,
                value: 1
            });
        }

        console.log('Voice call event tracked:', callEvent);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('voice_session_id');
        if (!sessionId) {
            sessionId = 'voice_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('voice_session_id', sessionId);
        }
        return sessionId;
    }

    // Public methods for external integration
    getCallStatus() {
        return {
            isActive: this.isCallActive,
            callId: this.currentCall?.id,
            duration: this.currentCall ? Math.floor((Date.now() - this.callStartTime) / 1000) : 0
        };
    }

    transferToHuman() {
        if (this.isCallActive) {
            this.addTranscriptEntry('system', 'Transferring to human agent...');
            this.trackCallEvent('transfer_to_human', { reason: 'user_request' });
            
            // In a real implementation, this would transfer the call
            setTimeout(() => {
                this.endVoiceCall();
            }, 2000);
        }
    }
}

// Initialize Vapi Voice Bot
let vapiVoiceBot;
document.addEventListener('DOMContentLoaded', () => {
    vapiVoiceBot = new VapiVoiceBot();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VapiVoiceBot;
} 