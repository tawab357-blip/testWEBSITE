// AI Assistant Configuration
const AI_CONFIG = {
    // OpenAI API Configuration
    openai: {
        apiKey: 'your-openai-api-key-here', // Replace with your actual OpenAI API key
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 300,
        temperature: 0.7
    },
    
    // Alternative: Google Gemini API Configuration
    gemini: {
        apiKey: 'your-gemini-api-key-here', // Replace with your actual Gemini API key
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro'
    },
    
    // AI Provider (change to 'gemini' to use Google's API instead)
    provider: 'openai',
    
    // Chat settings
    chat: {
        maxHistoryLength: 10,
        typingDelay: 1000,
        responseDelay: 1500,
        welcomeDelay: 3000
    },
    
    // Live content update settings
    liveUpdates: {
        enabled: true,
        updateInterval: 5000, // Update content every 5 seconds
        sections: ['solutions', 'testimonials', 'stats']
    },
    
    // Pitching settings
    pitching: {
        enabled: true,
        subtlePitchThreshold: 3, // Start subtle pitching after 3 interactions
        directPitchThreshold: 8, // Start direct pitching after 8 interactions
        sectionBasedPitching: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
} 