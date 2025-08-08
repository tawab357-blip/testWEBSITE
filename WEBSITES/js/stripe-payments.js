// Stripe Payment Integration
class StripePayments {
    constructor() {
        this.isInitialized = false;
        this.stripe = null;
        this.elements = null;
        this.paymentElement = null;
        this.clientSecret = null;
        
        this.stripeConfig = {
            publishableKey: 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY', // Replace with your Stripe publishable key
            secretKey: 'sk_test_YOUR_STRIPE_SECRET_KEY', // For server-side operations
            currency: 'usd',
            paymentMethods: ['card', 'bank_transfer', 'us_bank_account'],
            supportedCountries: ['US', 'CA', 'GB', 'AU']
        };
        
        this.products = {
            consultation: {
                id: 'prod_consultation',
                name: 'AI Consultation',
                description: '30-minute AI strategy consultation',
                price: 0,
                priceId: 'price_consultation_free'
            },
            discovery: {
                id: 'prod_discovery',
                name: 'Discovery Session',
                description: '60-minute deep dive into your AI opportunities',
                price: 99,
                priceId: 'price_discovery_99'
            },
            technical: {
                id: 'prod_technical',
                name: 'Technical Review',
                description: '45-minute technical assessment and planning',
                price: 149,
                priceId: 'price_technical_149'
            },
            mobile_ai: {
                id: 'prod_mobile_ai',
                name: 'Mobile AI Integration',
                description: 'Complete mobile AI integration service',
                price: 2500,
                priceId: 'price_mobile_ai_2500'
            },
            web_ai: {
                id: 'prod_web_ai',
                name: 'Web AI Integration',
                description: 'Complete web AI integration service',
                price: 3000,
                priceId: 'price_web_ai_3000'
            },
            enterprise_ai: {
                id: 'prod_enterprise_ai',
                name: 'Enterprise AI Solution',
                description: 'Comprehensive enterprise AI solution',
                price: 5000,
                priceId: 'price_enterprise_ai_5000'
            }
        };
        
        this.subscriptions = {
            basic: {
                id: 'sub_basic',
                name: 'Basic AI Support',
                price: 99,
                interval: 'month',
                features: ['Email support', 'Basic AI integration', 'Monthly reports']
            },
            professional: {
                id: 'sub_professional',
                name: 'Professional AI Support',
                price: 299,
                interval: 'month',
                features: ['Priority support', 'Advanced AI features', 'Weekly reports', 'Custom integrations']
            },
            enterprise: {
                id: 'sub_enterprise',
                name: 'Enterprise AI Support',
                price: 999,
                interval: 'month',
                features: ['24/7 support', 'Full AI suite', 'Daily reports', 'Dedicated account manager', 'Custom development']
            }
        };
        
        this.init();
    }

    init() {
        this.setupStripe();
        this.setupPaymentUI();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('Stripe Payments initialized');
    }

    setupStripe() {
        // Initialize Stripe
        if (typeof Stripe !== 'undefined') {
            this.stripe = Stripe(this.stripeConfig.publishableKey);
        } else {
            console.warn('Stripe.js not loaded. Payment features will be limited.');
        }
    }

    setupPaymentUI() {
        // Create payment interface
        const paymentUI = document.createElement('div');
        paymentUI.id = 'stripe-payments';
        paymentUI.className = 'stripe-payments';
        paymentUI.innerHTML = `
            <div class="payment-toggle" id="paymentToggle">
                <div class="payment-icon">
                    <i class="fas fa-credit-card"></i>
                </div>
                <div class="payment-status">
                    <span class="status-text">Payment Options</span>
                    <span class="status-indicator"></span>
                </div>
            </div>
            
            <div class="payment-panel" id="paymentPanel">
                <div class="payment-header">
                    <h3>Payment & Pricing</h3>
                    <button class="payment-close" id="paymentClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="payment-content">
                    <div class="payment-tabs">
                        <button class="payment-tab active" data-tab="services">
                            <i class="fas fa-cogs"></i>
                            Services
                        </button>
                        <button class="payment-tab" data-tab="subscriptions">
                            <i class="fas fa-sync"></i>
                            Subscriptions
                        </button>
                        <button class="payment-tab" data-tab="payment-links">
                            <i class="fas fa-link"></i>
                            Payment Links
                        </button>
                    </div>
                    
                    <div class="payment-tab-content">
                        <div class="tab-pane active" id="services-tab">
                            <div class="services-grid">
                                <div class="service-card" data-product="consultation">
                                    <div class="service-header">
                                        <h4>Free Consultation</h4>
                                        <div class="service-price">
                                            <span class="price-amount">$0</span>
                                            <span class="price-period">One-time</span>
                                        </div>
                                    </div>
                                    <p>30-minute AI strategy consultation to discuss your needs</p>
                                    <ul class="service-features">
                                        <li><i class="fas fa-check"></i> AI opportunity assessment</li>
                                        <li><i class="fas fa-check"></i> Custom strategy recommendations</li>
                                        <li><i class="fas fa-check"></i> Implementation roadmap</li>
                                    </ul>
                                    <button class="service-btn free-btn">
                                        <i class="fas fa-calendar"></i>
                                        Schedule Free
                                    </button>
                                </div>
                                
                                <div class="service-card" data-product="discovery">
                                    <div class="service-header">
                                        <h4>Discovery Session</h4>
                                        <div class="service-price">
                                            <span class="price-amount">$99</span>
                                            <span class="price-period">One-time</span>
                                        </div>
                                    </div>
                                    <p>60-minute deep dive into your business and AI opportunities</p>
                                    <ul class="service-features">
                                        <li><i class="fas fa-check"></i> Business process analysis</li>
                                        <li><i class="fas fa-check"></i> ROI projections</li>
                                        <li><i class="fas fa-check"></i> Detailed implementation plan</li>
                                        <li><i class="fas fa-check"></i> Technical architecture review</li>
                                    </ul>
                                    <button class="service-btn paid-btn">
                                        <i class="fas fa-credit-card"></i>
                                        Pay $99
                                    </button>
                                </div>
                                
                                <div class="service-card" data-product="technical">
                                    <div class="service-header">
                                        <h4>Technical Review</h4>
                                        <div class="service-price">
                                            <span class="price-amount">$149</span>
                                            <span class="price-period">One-time</span>
                                        </div>
                                    </div>
                                    <p>45-minute technical assessment and implementation planning</p>
                                    <ul class="service-features">
                                        <li><i class="fas fa-check"></i> Technical feasibility analysis</li>
                                        <li><i class="fas fa-check"></i> Integration planning</li>
                                        <li><i class="fas fa-check"></i> Technology stack recommendations</li>
                                        <li><i class="fas fa-check"></i> Timeline and resource planning</li>
                                    </ul>
                                    <button class="service-btn paid-btn">
                                        <i class="fas fa-credit-card"></i>
                                        Pay $149
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="subscriptions-tab">
                            <div class="subscriptions-grid">
                                <div class="subscription-card" data-subscription="basic">
                                    <div class="subscription-header">
                                        <h4>Basic AI Support</h4>
                                        <div class="subscription-price">
                                            <span class="price-amount">$99</span>
                                            <span class="price-period">/month</span>
                                        </div>
                                    </div>
                                    <ul class="subscription-features">
                                        <li><i class="fas fa-check"></i> Email support</li>
                                        <li><i class="fas fa-check"></i> Basic AI integration</li>
                                        <li><i class="fas fa-check"></i> Monthly reports</li>
                                        <li><i class="fas fa-check"></i> Standard maintenance</li>
                                    </ul>
                                    <button class="subscription-btn">
                                        <i class="fas fa-credit-card"></i>
                                        Subscribe $99/month
                                    </button>
                                </div>
                                
                                <div class="subscription-card featured" data-subscription="professional">
                                    <div class="subscription-badge">Most Popular</div>
                                    <div class="subscription-header">
                                        <h4>Professional AI Support</h4>
                                        <div class="subscription-price">
                                            <span class="price-amount">$299</span>
                                            <span class="price-period">/month</span>
                                        </div>
                                    </div>
                                    <ul class="subscription-features">
                                        <li><i class="fas fa-check"></i> Priority support</li>
                                        <li><i class="fas fa-check"></i> Advanced AI features</li>
                                        <li><i class="fas fa-check"></i> Weekly reports</li>
                                        <li><i class="fas fa-check"></i> Custom integrations</li>
                                        <li><i class="fas fa-check"></i> Performance optimization</li>
                                    </ul>
                                    <button class="subscription-btn featured-btn">
                                        <i class="fas fa-credit-card"></i>
                                        Subscribe $299/month
                                    </button>
                                </div>
                                
                                <div class="subscription-card" data-subscription="enterprise">
                                    <div class="subscription-header">
                                        <h4>Enterprise AI Support</h4>
                                        <div class="subscription-price">
                                            <span class="price-amount">$999</span>
                                            <span class="price-period">/month</span>
                                        </div>
                                    </div>
                                    <ul class="subscription-features">
                                        <li><i class="fas fa-check"></i> 24/7 support</li>
                                        <li><i class="fas fa-check"></i> Full AI suite</li>
                                        <li><i class="fas fa-check"></i> Daily reports</li>
                                        <li><i class="fas fa-check"></i> Dedicated account manager</li>
                                        <li><i class="fas fa-check"></i> Custom development</li>
                                        <li><i class="fas fa-check"></i> SLA guarantees</li>
                                    </ul>
                                    <button class="subscription-btn">
                                        <i class="fas fa-credit-card"></i>
                                        Subscribe $999/month
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="payment-links-tab">
                            <div class="payment-links-content">
                                <div class="links-header">
                                    <h4>Quick Payment Links</h4>
                                    <p>Use these links for quick payments or share with clients</p>
                                </div>
                                
                                <div class="payment-links-grid">
                                    <div class="payment-link-card">
                                        <div class="link-info">
                                            <h5>Discovery Session</h5>
                                            <p>60-minute consultation</p>
                                            <span class="link-price">$99</span>
                                        </div>
                                        <button class="copy-link-btn" data-link="https://buy.stripe.com/discovery_99">
                                            <i class="fas fa-copy"></i>
                                            Copy Link
                                        </button>
                                    </div>
                                    
                                    <div class="payment-link-card">
                                        <div class="link-info">
                                            <h5>Technical Review</h5>
                                            <p>45-minute assessment</p>
                                            <span class="link-price">$149</span>
                                        </div>
                                        <button class="copy-link-btn" data-link="https://buy.stripe.com/technical_149">
                                            <i class="fas fa-copy"></i>
                                            Copy Link
                                        </button>
                                    </div>
                                    
                                    <div class="payment-link-card">
                                        <div class="link-info">
                                            <h5>Mobile AI Integration</h5>
                                            <p>Complete service</p>
                                            <span class="link-price">$2,500</span>
                                        </div>
                                        <button class="copy-link-btn" data-link="https://buy.stripe.com/mobile_ai_2500">
                                            <i class="fas fa-copy"></i>
                                            Copy Link
                                        </button>
                                    </div>
                                    
                                    <div class="payment-link-card">
                                        <div class="link-info">
                                            <h5>Web AI Integration</h5>
                                            <p>Complete service</p>
                                            <span class="link-price">$3,000</span>
                                        </div>
                                        <button class="copy-link-btn" data-link="https://buy.stripe.com/web_ai_3000">
                                            <i class="fas fa-copy"></i>
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="create-link-section">
                                    <h5>Create Custom Payment Link</h5>
                                    <div class="create-link-form">
                                        <div class="form-group">
                                            <label>Product Name</label>
                                            <input type="text" id="customProductName" placeholder="e.g., Custom AI Solution">
                                        </div>
                                        <div class="form-group">
                                            <label>Amount ($)</label>
                                            <input type="number" id="customAmount" placeholder="0.00" min="0" step="0.01">
                                        </div>
                                        <button class="create-link-btn" id="createCustomLink">
                                            <i class="fas fa-plus"></i>
                                            Create Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Modal -->
                <div class="payment-modal" id="paymentModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 id="modalTitle">Complete Payment</h4>
                            <button class="modal-close" id="modalClose">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div class="modal-body">
                            <div class="payment-summary" id="paymentSummary">
                                <!-- Payment summary will be displayed here -->
                            </div>
                            
                            <form id="payment-form">
                                <div id="payment-element">
                                    <!-- Stripe Payment Element will be inserted here -->
                                </div>
                                
                                <div class="payment-actions">
                                    <button type="submit" id="submit-payment" class="payment-submit-btn">
                                        <div class="spinner" id="spinner" style="display: none;"></div>
                                        <span id="button-text">Pay Now</span>
                                    </button>
                                </div>
                                
                                <div id="payment-message" class="payment-message" style="display: none;"></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(paymentUI);
    }

    setupEventListeners() {
        const paymentToggle = document.getElementById('paymentToggle');
        const paymentClose = document.getElementById('paymentClose');
        const paymentTabs = document.querySelectorAll('.payment-tab');
        const serviceButtons = document.querySelectorAll('.service-btn');
        const subscriptionButtons = document.querySelectorAll('.subscription-btn');
        const copyLinkButtons = document.querySelectorAll('.copy-link-btn');
        const createCustomLink = document.getElementById('createCustomLink');
        const modalClose = document.getElementById('modalClose');
        const paymentForm = document.getElementById('payment-form');

        if (paymentToggle) {
            paymentToggle.addEventListener('click', () => this.togglePaymentPanel());
        }

        if (paymentClose) {
            paymentClose.addEventListener('click', () => this.closePaymentPanel());
        }

        paymentTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchPaymentTab(targetTab);
            });
        });

        serviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = e.target.closest('.service-card').dataset.product;
                this.handleServicePayment(product);
            });
        });

        subscriptionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subscription = e.target.closest('.subscription-card').dataset.subscription;
                this.handleSubscriptionPayment(subscription);
            });
        });

        copyLinkButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const link = e.target.dataset.link;
                this.copyPaymentLink(link);
            });
        });

        if (createCustomLink) {
            createCustomLink.addEventListener('click', () => this.createCustomPaymentLink());
        }

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closePaymentModal());
        }

        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));
        }
    }

    togglePaymentPanel() {
        const paymentPanel = document.getElementById('paymentPanel');
        if (paymentPanel) {
            paymentPanel.classList.toggle('active');
        }
    }

    closePaymentPanel() {
        const paymentPanel = document.getElementById('paymentPanel');
        if (paymentPanel) {
            paymentPanel.classList.remove('active');
        }
    }

    switchPaymentTab(tabName) {
        const tabs = document.querySelectorAll('.payment-tab');
        const tabPanes = document.querySelectorAll('.tab-pane');

        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update active tab pane
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });
    }

    async handleServicePayment(productId) {
        const product = this.products[productId];
        if (!product) return;

        if (product.price === 0) {
            // Free service - redirect to calendar
            this.redirectToCalendar(product);
        } else {
            // Paid service - show payment modal
            await this.showPaymentModal(product);
        }
    }

    async handleSubscriptionPayment(subscriptionId) {
        const subscription = this.subscriptions[subscriptionId];
        if (!subscription) return;

        await this.showSubscriptionModal(subscription);
    }

    redirectToCalendar(product) {
        // Close payment panel and open calendar
        this.closePaymentPanel();
        
        // Trigger calendar integration
        if (typeof calendarIntegration !== 'undefined') {
            calendarIntegration.toggleCalendarPanel();
        }
    }

    async showPaymentModal(product) {
        const modal = document.getElementById('paymentModal');
        const modalTitle = document.getElementById('modalTitle');
        const paymentSummary = document.getElementById('paymentSummary');

        if (modalTitle) modalTitle.textContent = `Pay for ${product.name}`;
        
        if (paymentSummary) {
            paymentSummary.innerHTML = `
                <div class="summary-item">
                    <span class="item-name">${product.name}</span>
                    <span class="item-price">$${product.price}</span>
                </div>
                <div class="summary-total">
                    <span class="total-label">Total</span>
                    <span class="total-amount">$${product.price}</span>
                </div>
            `;
        }

        // Create payment intent
        await this.createPaymentIntent(product);
        
        // Show modal
        if (modal) modal.style.display = 'flex';
    }

    async showSubscriptionModal(subscription) {
        const modal = document.getElementById('paymentModal');
        const modalTitle = document.getElementById('modalTitle');
        const paymentSummary = document.getElementById('paymentSummary');

        if (modalTitle) modalTitle.textContent = `Subscribe to ${subscription.name}`;
        
        if (paymentSummary) {
            paymentSummary.innerHTML = `
                <div class="summary-item">
                    <span class="item-name">${subscription.name}</span>
                    <span class="item-price">$${subscription.price}/${subscription.interval}</span>
                </div>
                <div class="summary-features">
                    <h5>Includes:</h5>
                    <ul>
                        ${subscription.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="summary-total">
                    <span class="total-label">Monthly Total</span>
                    <span class="total-amount">$${subscription.price}</span>
                </div>
            `;
        }

        // Create subscription
        await this.createSubscription(subscription);
        
        // Show modal
        if (modal) modal.style.display = 'flex';
    }

    closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) modal.style.display = 'none';
    }

    async createPaymentIntent(product) {
        try {
            // In a real implementation, this would call your server
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product: product.id,
                    amount: product.price * 100, // Convert to cents
                    currency: this.stripeConfig.currency
                })
            });

            const data = await response.json();
            this.clientSecret = data.clientSecret;

            // Set up Stripe Elements
            this.setupStripeElements();
        } catch (error) {
            console.error('Failed to create payment intent:', error);
            // Fallback for demo
            this.setupDemoPayment();
        }
    }

    async createSubscription(subscription) {
        try {
            // In a real implementation, this would call your server
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscription: subscription.id,
                    priceId: subscription.priceId
                })
            });

            const data = await response.json();
            this.clientSecret = data.clientSecret;

            // Set up Stripe Elements
            this.setupStripeElements();
        } catch (error) {
            console.error('Failed to create subscription:', error);
            // Fallback for demo
            this.setupDemoPayment();
        }
    }

    setupStripeElements() {
        if (!this.stripe || !this.clientSecret) return;

        this.elements = this.stripe.elements({
            clientSecret: this.clientSecret,
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#667eea',
                    colorBackground: '#ffffff',
                    colorText: '#30313d',
                    colorDanger: '#df1b41',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px'
                }
            }
        });

        this.paymentElement = this.elements.create('payment');
        this.paymentElement.mount('#payment-element');
    }

    setupDemoPayment() {
        // Demo payment form for testing
        const paymentElement = document.getElementById('payment-element');
        if (paymentElement) {
            paymentElement.innerHTML = `
                <div class="demo-payment-form">
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" placeholder="4242 4242 4242 4242" class="demo-input">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" class="demo-input">
                        </div>
                        <div class="form-group">
                            <label>CVC</label>
                            <input type="text" placeholder="123" class="demo-input">
                        </div>
                    </div>
                </div>
            `;
        }
    }

    async handlePaymentSubmit(event) {
        event.preventDefault();

        if (!this.stripe || !this.elements) {
            this.showPaymentMessage('Payment system not initialized', 'error');
            return;
        }

        this.setLoading(true);

        const { error } = await this.stripe.confirmPayment({
            elements: this.elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            }
        });

        if (error) {
            this.showPaymentMessage(error.message, 'error');
        } else {
            this.showPaymentMessage('Payment successful!', 'success');
            setTimeout(() => {
                this.closePaymentModal();
                this.showPaymentSuccess();
            }, 2000);
        }

        this.setLoading(false);
    }

    setLoading(isLoading) {
        const submitButton = document.getElementById('submit-payment');
        const spinner = document.getElementById('spinner');
        const buttonText = document.getElementById('button-text');

        if (submitButton) submitButton.disabled = isLoading;
        if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
        if (buttonText) buttonText.textContent = isLoading ? 'Processing...' : 'Pay Now';
    }

    showPaymentMessage(message, type) {
        const messageElement = document.getElementById('payment-message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `payment-message ${type}`;
            messageElement.style.display = 'block';
        }
    }

    showPaymentSuccess() {
        const success = document.createElement('div');
        success.className = 'payment-success';
        success.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>Payment Successful!</h4>
                <p>Thank you for your payment. You'll receive a confirmation email shortly.</p>
                <button class="success-btn" onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        document.body.appendChild(success);
    }

    copyPaymentLink(link) {
        navigator.clipboard.writeText(link).then(() => {
            this.showNotification('Payment link copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy link', 'error');
        });
    }

    async createCustomPaymentLink() {
        const productName = document.getElementById('customProductName').value;
        const amount = document.getElementById('customAmount').value;

        if (!productName || !amount) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        try {
            // In a real implementation, this would call your server
            const response = await fetch('/api/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productName,
                    amount: parseFloat(amount) * 100,
                    currency: this.stripeConfig.currency
                })
            });

            const data = await response.json();
            
            if (data.url) {
                this.copyPaymentLink(data.url);
                this.showNotification('Custom payment link created and copied!', 'success');
            }
        } catch (error) {
            console.error('Failed to create payment link:', error);
            this.showNotification('Failed to create payment link', 'error');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `payment-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
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
            closeBtn.addEventListener('click', () => notification.remove());
        }
    }

    // Analytics and tracking
    trackPaymentEvent(event, data) {
        const paymentEvent = {
            event,
            data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };

        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'payment_' + event, {
                event_category: 'payment',
                event_label: event,
                value: data.amount || 0
            });
        }

        console.log('Payment event tracked:', paymentEvent);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('payment_session_id');
        if (!sessionId) {
            sessionId = 'payment_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('payment_session_id', sessionId);
        }
        return sessionId;
    }

    // Public methods for external integration
    getProductInfo(productId) {
        return this.products[productId] || null;
    }

    getSubscriptionInfo(subscriptionId) {
        return this.subscriptions[subscriptionId] || null;
    }

    async createCheckoutSession(productId, successUrl, cancelUrl) {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId,
                    successUrl,
                    cancelUrl
                })
            });

            const data = await response.json();
            return data.sessionUrl;
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            return null;
        }
    }
}

// Initialize Stripe Payments
let stripePayments;
document.addEventListener('DOMContentLoaded', () => {
    stripePayments = new StripePayments();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StripePayments;
} 