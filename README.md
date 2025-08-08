# AI Business Integration Website

A comprehensive AI business integration website featuring multiple AI-powered tools and integrations for modern businesses.

## 🚀 Features

### 1. **AI Chatbot (Live AI Integration)**
- **Live AI Assistant**: Real-time AI responses using free APIs (OpenAI, Gemini, HuggingFace)
- **Intelligent FAQ System**: Natural language processing with categorized questions
- **Fallback System**: Works without external APIs using intelligent keyword matching
- **Analytics Tracking**: Monitor conversations and user interactions
- **Professional Positioning**: Located in top-right corner for easy access

### 2. **Voice Bot (Professional Integration)**
- **AI-Powered Voice Assistant**: Real-time voice conversations with live AI
- **Professional Positioning**: Located in bottom-right corner for clear visibility
- **Real-time Transcription**: Live conversation tracking and management
- **Multiple Conversation Flows**: Services, Pricing, Consultation, Support
- **Call Transfer Capabilities**: Seamless handoff to human agents

### 3. **Smart Calendar (Google Calendar + Calendly)**
- **Dual Calendar System**: Calendly + Google Calendar integration
- **Multiple Consultation Types**: Free, Discovery, Technical consultations
- **Real-time Availability**: Live availability checking and booking
- **Appointment Management**: Automated scheduling and reminders
- **Calendar Synchronization**: Seamless integration with existing calendars

### 4. **Payment System (Stripe Integration)**
- **Secure Payment Processing**: Stripe-powered payment system
- **Multiple Service Tiers**: Starter, Professional, Enterprise plans
- **Payment Link Generation**: Quick and custom payment links
- **Subscription Management**: Automated billing and renewals
- **Analytics Dashboard**: Payment tracking and reporting

### 5. **Admin Dashboard (Google Sheets Integration)**
- **Comprehensive Analytics**: Real-time business insights and metrics
- **Lead Management**: Track and manage leads throughout sales funnel
- **Appointment Tracking**: Monitor schedules and customer interactions
- **Payment Analytics**: Revenue tracking and financial reporting
- **Google Sheets Sync**: Live data synchronization with spreadsheets

### 6. **Separate Feature Pages**
- **Dedicated Pages**: Each feature has its own professional page
- **No Button Collisions**: Properly positioned widgets and controls
- **Enhanced User Experience**: Focused functionality for each feature
- **Professional Layout**: Clean, modern design for each page

## 🛠️ Setup Instructions

### Prerequisites
- Modern web browser
- Web server (local or hosted)
- API keys for the services you want to use

### 1. **Basic Setup**

1. Clone or download the project files
2. Place all files in your web server directory
3. Open `index.html` in your browser

### 2. **FAQ Chatbot Setup (Tiledesk)**

1. **Sign up for Tiledesk:**
   - Go to [Tiledesk.com](https://tiledesk.com)
   - Create a free account
   - Get your project ID

2. **Configure the chatbot:**
   - Open `js/tiledesk-chatbot.js`
   - Replace `YOUR_TILEDESK_PROJECT_ID` with your actual project ID
   - Customize FAQ categories and questions as needed

3. **Alternative: Use Custom FAQ System**
   - The system includes a fallback custom FAQ system
   - No external dependencies required
   - Fully functional with the existing code

### 3. **Voice Bot Setup (Vapi)**

1. **Sign up for Vapi:**
   - Go to [Vapi.ai](https://vapi.ai)
   - Create an account
   - Get your API key

2. **Configure the voice bot:**
   - Open `js/vapi-voicebot.js`
   - Replace `YOUR_VAPI_API_KEY` with your actual API key
   - Update phone number settings
   - Customize conversation flows

3. **Demo Mode:**
   - The system includes a demo mode for testing
   - Simulates voice calls without actual phone integration
   - Perfect for development and testing

### 4. **Calendar Integration Setup**

#### Google Calendar Setup:
1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Calendar API

2. **Get API Credentials:**
   - Create OAuth 2.0 credentials
   - Get your API key and Client ID

3. **Configure Google Calendar:**
   - Open `js/calendar-integration.js`
   - Replace `YOUR_GOOGLE_CALENDAR_API_KEY` and `YOUR_GOOGLE_CLIENT_ID`
   - Update your calendar ID

#### Calendly Setup:
1. **Sign up for Calendly:**
   - Go to [Calendly.com](https://calendly.com)
   - Create a free account
   - Get your username

2. **Configure Calendly:**
   - Open `js/calendar-integration.js`
   - Replace `ainexuspro` with your Calendly username
   - Update event type URLs

### 5. **Payment System Setup (Stripe)**

1. **Sign up for Stripe:**
   - Go to [Stripe.com](https://stripe.com)
   - Create an account
   - Get your publishable and secret keys

2. **Configure Stripe:**
   - Open `js/stripe-payments.js`
   - Replace `YOUR_STRIPE_PUBLISHABLE_KEY` with your publishable key
   - Update product configurations
   - Set up webhook endpoints (for production)

3. **Create Products in Stripe Dashboard:**
   - Log into your Stripe dashboard
   - Create products matching the IDs in the code
   - Set up pricing plans

### 6. **Admin Interface Setup (Google Sheets)**

1. **Create Google Sheets:**
   - Create a new Google Sheets document
   - Add sheets for: Leads, Appointments, Payments, Analytics
   - Share the document with appropriate permissions

2. **Get Google Sheets API Credentials:**
   - Enable Google Sheets API in Google Cloud Console
   - Create service account credentials
   - Download the JSON key file

3. **Configure Admin Interface:**
   - Open `js/admin-interface.js`
   - Replace `YOUR_GOOGLE_SHEETS_API_KEY` and `YOUR_GOOGLE_CLIENT_ID`
   - Update your spreadsheet ID

## 📁 File Structure

```
ai-business-integration-website/
├── index.html                 # Main landing page
├── pages/                     # Feature pages
│   ├── chatbot.html          # AI Chatbot page
│   ├── voicebot.html         # Voice Bot page
│   ├── calendar.html         # Smart Calendar page
│   ├── payments.html         # Payment System page
│   └── admin.html            # Admin Dashboard page
├── css/
│   ├── style.css             # Main styles
│   └── integrations.css      # Integration component styles
├── js/
│   ├── config.js             # AI configuration
│   ├── ai-integration.js     # Live AI integration with free APIs
│   ├── script.js             # Main JavaScript
│   ├── tiledesk-chatbot.js   # FAQ chatbot
│   ├── vapi-voicebot.js      # Voice bot
│   ├── calendar-integration.js # Calendar system
│   ├── stripe-payments.js    # Payment system
│   └── admin-interface.js    # Admin dashboard
├── assets/
│   └── favicon.ico          # Website favicon
└── README.md                # This file
```

## 🔧 Configuration

### AI Configuration (`js/config.js`)
```javascript
const AI_CONFIG = {
    openai: {
        apiKey: 'your-openai-api-key-here',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 300,
        temperature: 0.7
    },
    provider: 'openai', // or 'gemini'
    // ... other settings
};
```

### Service Configuration
Each integration file contains its own configuration section at the top. Update these with your actual API keys and settings.

## 🎨 Customization

### Styling
- Main styles: `css/style.css`
- Integration styles: `css/integrations.css`
- All components use CSS custom properties for easy theming

### Content
- Update FAQ questions in `js/tiledesk-chatbot.js`
- Modify conversation flows in `js/vapi-voicebot.js`
- Customize services and pricing in `js/stripe-payments.js`
- Update admin dashboard sections in `js/admin-interface.js`

### Branding
- Update colors in CSS custom properties
- Replace logo and favicon in `assets/` folder
- Update company information throughout the files

## 🚀 Deployment

### Local Development
1. Use a local web server (e.g., Live Server in VS Code)
2. Configure API keys for testing
3. Test all integrations

### Production Deployment
1. Upload files to your web server
2. Configure production API keys
3. Set up SSL certificate (required for Stripe)
4. Configure webhooks for real-time updates
5. Set up Google Analytics (optional)

## 🔒 Security Considerations

1. **API Keys:** Never expose secret keys in client-side code
2. **HTTPS:** Always use HTTPS in production
3. **CORS:** Configure proper CORS settings
4. **Rate Limiting:** Implement rate limiting for API calls
5. **Data Validation:** Validate all user inputs

## 📊 Analytics & Tracking

The system includes built-in analytics tracking for:
- FAQ interactions
- Voice call events
- Calendar bookings
- Payment conversions
- Admin dashboard usage

## 🆘 Troubleshooting

### Common Issues:

1. **API Keys Not Working:**
   - Verify API keys are correct
   - Check API quotas and limits
   - Ensure proper CORS configuration

2. **Calendar Not Loading:**
   - Verify Google Calendar API is enabled
   - Check calendar permissions
   - Ensure proper authentication

3. **Payments Not Processing:**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Ensure HTTPS is enabled

4. **Admin Interface Not Loading:**
   - Verify Google Sheets API is enabled
   - Check spreadsheet permissions
   - Ensure proper authentication

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API documentation for each service
3. Check browser console for error messages
4. Verify all API keys and configurations

## 📄 License

This project is open source and available under the MIT License.

## 🔄 Updates

To keep the system updated:
1. Regularly update API keys and configurations
2. Monitor service provider updates
3. Update dependencies as needed
4. Test integrations after updates

---

**Note:** This is a comprehensive AI business integration system. Configure only the integrations you need, and ensure you have proper API access and quotas for production use. #   t e s t W E B S I T E  
 #   t e s t W E B S I T E  
 