// Google Calendar and Calendly Integration
class CalendarIntegration {
    constructor() {
        this.isInitialized = false;
        this.calendarConfig = {
            googleCalendar: {
                apiKey: 'YOUR_GOOGLE_CALENDAR_API_KEY',
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                calendarId: 'primary', // or your specific calendar ID
                timezone: 'America/New_York'
            },
            calendly: {
                username: 'ainexuspro', // Replace with your Calendly username
                eventTypes: {
                    consultation: '30min',
                    discovery: '60min',
                    technical: '45min'
                }
            }
        };
        
        this.availableSlots = [];
        this.bookedAppointments = [];
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.setupCalendarUI();
        this.setupEventListeners();
        this.loadCalendarData();
        this.isInitialized = true;
        console.log('Calendar Integration initialized');
    }

    setupCalendarUI() {
        // Create calendar scheduling interface
        const calendarUI = document.createElement('div');
        calendarUI.id = 'calendar-integration';
        calendarUI.className = 'calendar-integration';
        calendarUI.innerHTML = `
            <div class="calendar-toggle" id="calendarToggle">
                <div class="calendar-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="calendar-status">
                    <span class="status-text">Schedule Consultation</span>
                    <span class="status-indicator"></span>
                </div>
            </div>
            
            <div class="calendar-panel" id="calendarPanel">
                <div class="calendar-header">
                    <h3>Schedule Your AI Consultation</h3>
                    <button class="calendar-close" id="calendarClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="calendar-content">
                    <div class="calendar-tabs">
                        <button class="calendar-tab active" data-tab="calendly">
                            <i class="fas fa-calendar-check"></i>
                            Calendly
                        </button>
                        <button class="calendar-tab" data-tab="google">
                            <i class="fab fa-google"></i>
                            Google Calendar
                        </button>
                    </div>
                    
                    <div class="calendar-tab-content">
                        <div class="tab-pane active" id="calendly-tab">
                            <div class="calendly-content">
                                <div class="event-types">
                                    <h4>Select Consultation Type</h4>
                                    <div class="event-type-options">
                                        <div class="event-type" data-type="consultation">
                                            <div class="event-icon">
                                                <i class="fas fa-comments"></i>
                                            </div>
                                            <div class="event-details">
                                                <h5>Free Consultation</h5>
                                                <p>30 minutes • Free</p>
                                                <span class="event-description">Discuss your AI needs and get a custom strategy</span>
                                            </div>
                                        </div>
                                        <div class="event-type" data-type="discovery">
                                            <div class="event-icon">
                                                <i class="fas fa-search"></i>
                                            </div>
                                            <div class="event-details">
                                                <h5>Discovery Session</h5>
                                                <p>60 minutes • $99</p>
                                                <span class="event-description">Deep dive into your business and AI opportunities</span>
                                            </div>
                                        </div>
                                        <div class="event-type" data-type="technical">
                                            <div class="event-icon">
                                                <i class="fas fa-cogs"></i>
                                            </div>
                                            <div class="event-details">
                                                <h5>Technical Review</h5>
                                                <p>45 minutes • $149</p>
                                                <span class="event-description">Technical assessment and implementation planning</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="calendly-widget" id="calendlyWidget">
                                    <!-- Calendly inline widget will be loaded here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="tab-pane" id="google-tab">
                            <div class="google-calendar-content">
                                <div class="calendar-auth">
                                    <div class="auth-status" id="authStatus">
                                        <i class="fas fa-user-circle"></i>
                                        <span>Sign in to Google Calendar</span>
                                    </div>
                                    <button class="auth-btn" id="googleAuthBtn">
                                        <i class="fab fa-google"></i>
                                        Sign in with Google
                                    </button>
                                </div>
                                
                                <div class="calendar-view" id="calendarView" style="display: none;">
                                    <div class="calendar-controls">
                                        <button class="calendar-nav" id="prevMonth">
                                            <i class="fas fa-chevron-left"></i>
                                        </button>
                                        <h4 id="currentMonth">December 2024</h4>
                                        <button class="calendar-nav" id="nextMonth">
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                    
                                    <div class="calendar-grid" id="calendarGrid">
                                        <!-- Calendar grid will be generated here -->
                                    </div>
                                    
                                    <div class="time-slots" id="timeSlots">
                                        <h4>Available Times</h4>
                                        <div class="slots-container" id="slotsContainer">
                                            <!-- Time slots will be loaded here -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="calendar-footer">
                        <div class="calendar-info">
                            <p><i class="fas fa-info-circle"></i> All consultations include a free AI assessment report</p>
                        </div>
                        <div class="calendar-actions">
                            <button class="calendar-action-btn" id="rescheduleBtn" style="display: none;">
                                <i class="fas fa-calendar-plus"></i>
                                Reschedule
                            </button>
                            <button class="calendar-action-btn" id="cancelBtn" style="display: none;">
                                <i class="fas fa-calendar-times"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(calendarUI);
    }

    setupEventListeners() {
        const calendarToggle = document.getElementById('calendarToggle');
        const calendarClose = document.getElementById('calendarClose');
        const calendarTabs = document.querySelectorAll('.calendar-tab');
        const eventTypes = document.querySelectorAll('.event-type');
        const googleAuthBtn = document.getElementById('googleAuthBtn');
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');

        if (calendarToggle) {
            calendarToggle.addEventListener('click', () => this.toggleCalendarPanel());
        }

        if (calendarClose) {
            calendarClose.addEventListener('click', () => this.closeCalendarPanel());
        }

        calendarTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchCalendarTab(targetTab);
            });
        });

        eventTypes.forEach(eventType => {
            eventType.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.selectEventType(type);
            });
        });

        if (googleAuthBtn) {
            googleAuthBtn.addEventListener('click', () => this.authenticateGoogle());
        }

        if (prevMonth) {
            prevMonth.addEventListener('click', () => this.navigateMonth(-1));
        }

        if (nextMonth) {
            nextMonth.addEventListener('click', () => this.navigateMonth(1));
        }
    }

    toggleCalendarPanel() {
        const calendarPanel = document.getElementById('calendarPanel');
        if (calendarPanel) {
            calendarPanel.classList.toggle('active');
        }
    }

    closeCalendarPanel() {
        const calendarPanel = document.getElementById('calendarPanel');
        if (calendarPanel) {
            calendarPanel.classList.remove('active');
        }
    }

    switchCalendarTab(tabName) {
        const tabs = document.querySelectorAll('.calendar-tab');
        const tabPanes = document.querySelectorAll('.tab-pane');

        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update active tab pane
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${tabName}-tab`);
        });

        // Load tab-specific content
        if (tabName === 'calendly') {
            this.loadCalendlyWidget();
        } else if (tabName === 'google') {
            this.loadGoogleCalendar();
        }
    }

    selectEventType(type) {
        const eventTypes = document.querySelectorAll('.event-type');
        eventTypes.forEach(et => et.classList.remove('selected'));
        
        const selectedType = document.querySelector(`[data-type="${type}"]`);
        if (selectedType) {
            selectedType.classList.add('selected');
        }

        // Load Calendly widget for selected event type
        this.loadCalendlyWidget(type);
    }

    loadCalendlyWidget(eventType = 'consultation') {
        const calendlyWidget = document.getElementById('calendlyWidget');
        if (!calendlyWidget) return;

        // Clear existing widget
        calendlyWidget.innerHTML = '';

        // Create Calendly inline widget
        const widgetUrl = `https://calendly.com/${this.calendarConfig.calendly.username}/${this.calendarConfig.calendly.eventTypes[eventType]}`;
        
        const iframe = document.createElement('iframe');
        iframe.src = widgetUrl;
        iframe.width = '100%';
        iframe.height = '600px';
        iframe.frameBorder = '0';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '10px';
        
        calendlyWidget.appendChild(iframe);

        // Track event type selection
        this.trackCalendarEvent('event_type_selected', { type: eventType });
    }

    async authenticateGoogle() {
        try {
            // Initialize Google Calendar API
            await this.initGoogleCalendarAPI();
            
            // Authenticate user
            const authResult = await this.googleAuth();
            
            if (authResult.success) {
                this.currentUser = authResult.user;
                this.showGoogleCalendar();
                this.loadGoogleCalendarData();
            } else {
                console.error('Google authentication failed:', authResult.error);
            }
        } catch (error) {
            console.error('Google Calendar authentication error:', error);
        }
    }

    async initGoogleCalendarAPI() {
        // Load Google Calendar API
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                gapi.load('client:auth2', async () => {
                    try {
                        await gapi.client.init({
                            apiKey: this.calendarConfig.googleCalendar.apiKey,
                            clientId: this.calendarConfig.googleCalendar.clientId,
                            scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events'
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            } else {
                reject(new Error('Google API not loaded'));
            }
        });
    }

    async googleAuth() {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            
            return {
                success: true,
                user: {
                    id: user.getId(),
                    name: user.getBasicProfile().getName(),
                    email: user.getBasicProfile().getEmail()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    showGoogleCalendar() {
        const authStatus = document.getElementById('authStatus');
        const authBtn = document.getElementById('googleAuthBtn');
        const calendarView = document.getElementById('calendarView');

        if (authStatus && this.currentUser) {
            authStatus.innerHTML = `
                <i class="fas fa-user-check"></i>
                <span>Signed in as ${this.currentUser.name}</span>
            `;
        }

        if (authBtn) authBtn.style.display = 'none';
        if (calendarView) calendarView.style.display = 'block';
    }

    async loadGoogleCalendarData() {
        try {
            // Load calendar events
            await this.loadCalendarEvents();
            
            // Generate calendar grid
            this.generateCalendarGrid();
            
            // Load available time slots
            await this.loadAvailableSlots();
        } catch (error) {
            console.error('Failed to load Google Calendar data:', error);
        }
    }

    async loadCalendarEvents() {
        const now = new Date();
        const endDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

        const response = await gapi.client.calendar.events.list({
            calendarId: this.calendarConfig.googleCalendar.calendarId,
            timeMin: now.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        this.bookedAppointments = response.result.items || [];
    }

    generateCalendarGrid() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Generate calendar HTML
        const calendarHTML = this.createCalendarHTML(year, month);
        calendarGrid.innerHTML = calendarHTML;

        // Update current month display
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = currentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
        }
    }

    createCalendarHTML(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let html = `
            <div class="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>
            <div class="calendar-days">
        `;

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const hasAppointment = this.hasAppointmentOnDate(date);

            html += `
                <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${hasAppointment ? 'has-appointment' : ''}" 
                     data-date="${date.toISOString().split('T')[0]}">
                    <span class="day-number">${date.getDate()}</span>
                    ${hasAppointment ? '<span class="appointment-indicator"></span>' : ''}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    hasAppointmentOnDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return this.bookedAppointments.some(appointment => {
            const appointmentDate = appointment.start.dateTime ? 
                new Date(appointment.start.dateTime).toISOString().split('T')[0] :
                appointment.start.date;
            return appointmentDate === dateString;
        });
    }

    async loadAvailableSlots() {
        const slotsContainer = document.getElementById('slotsContainer');
        if (!slotsContainer) return;

        // Generate available time slots for the next 7 days
        const slots = this.generateTimeSlots();
        
        slotsContainer.innerHTML = slots.map(slot => `
            <div class="time-slot ${slot.available ? 'available' : 'booked'}" 
                 data-time="${slot.time}" 
                 data-date="${slot.date}">
                <span class="slot-time">${slot.time}</span>
                <span class="slot-date">${slot.dateDisplay}</span>
                ${slot.available ? 
                    '<button class="book-slot-btn">Book</button>' : 
                    '<span class="slot-status">Booked</span>'
                }
            </div>
        `).join('');

        // Add event listeners to book buttons
        const bookButtons = slotsContainer.querySelectorAll('.book-slot-btn');
        bookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slot = e.target.closest('.time-slot');
                const time = slot.dataset.time;
                const date = slot.dataset.date;
                this.bookAppointment(date, time);
            });
        });
    }

    generateTimeSlots() {
        const slots = [];
        const now = new Date();
        
        for (let day = 0; day < 7; day++) {
            const date = new Date(now);
            date.setDate(date.getDate() + day);
            
            // Business hours: 9 AM to 5 PM
            for (let hour = 9; hour < 17; hour++) {
                const time = `${hour.toString().padStart(2, '0')}:00`;
                const slotDateTime = new Date(date);
                slotDateTime.setHours(hour, 0, 0, 0);
                
                const isAvailable = !this.isSlotBooked(slotDateTime);
                
                slots.push({
                    time,
                    date: date.toISOString().split('T')[0],
                    dateDisplay: date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    }),
                    available: isAvailable
                });
            }
        }
        
        return slots;
    }

    isSlotBooked(dateTime) {
        return this.bookedAppointments.some(appointment => {
            const appointmentStart = new Date(appointment.start.dateTime);
            const appointmentEnd = new Date(appointment.end.dateTime);
            return dateTime >= appointmentStart && dateTime < appointmentEnd;
        });
    }

    async bookAppointment(date, time) {
        try {
            // Create calendar event
            const event = {
                summary: 'AI Consultation - AI Nexus Pro',
                description: 'AI consultation session with AI Nexus Pro team',
                start: {
                    dateTime: `${date}T${time}:00`,
                    timeZone: this.calendarConfig.googleCalendar.timezone
                },
                end: {
                    dateTime: `${date}T${this.addMinutes(time, 30)}:00`,
                    timeZone: this.calendarConfig.googleCalendar.timezone
                },
                attendees: [
                    { email: this.currentUser.email }
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };

            const response = await gapi.client.calendar.events.insert({
                calendarId: this.calendarConfig.googleCalendar.calendarId,
                resource: event
            });

            if (response.status === 200) {
                this.showBookingConfirmation(response.result);
                this.trackCalendarEvent('appointment_booked', { 
                    date, 
                    time, 
                    eventId: response.result.id 
                });
            }
        } catch (error) {
            console.error('Failed to book appointment:', error);
            this.showBookingError(error.message);
        }
    }

    addMinutes(time, minutes) {
        const [hours, mins] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMins = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    }

    showBookingConfirmation(event) {
        const confirmation = document.createElement('div');
        confirmation.className = 'booking-confirmation';
        confirmation.innerHTML = `
            <div class="confirmation-content">
                <i class="fas fa-check-circle"></i>
                <h4>Appointment Booked!</h4>
                <p>Your consultation has been scheduled for ${new Date(event.start.dateTime).toLocaleString()}</p>
                <p>You'll receive a confirmation email shortly.</p>
                <button class="confirmation-btn" onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        document.body.appendChild(confirmation);
    }

    showBookingError(message) {
        const error = document.createElement('div');
        error.className = 'booking-error';
        error.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <h4>Booking Failed</h4>
                <p>${message}</p>
                <button class="error-btn" onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        document.body.appendChild(error);
    }

    navigateMonth(direction) {
        const currentMonthElement = document.getElementById('currentMonth');
        if (!currentMonthElement) return;

        const currentText = currentMonthElement.textContent;
        const [month, year] = currentText.split(' ');
        const currentDate = new Date(`${month} 1, ${year}`);
        
        currentDate.setMonth(currentDate.getMonth() + direction);
        
        this.generateCalendarGrid();
        this.loadAvailableSlots();
    }

    // Analytics and tracking
    trackCalendarEvent(event, data) {
        const calendarEvent = {
            event,
            data,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            userId: this.currentUser?.id
        };

        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calendar_' + event, {
                event_category: 'calendar',
                event_label: event,
                value: 1
            });
        }

        console.log('Calendar event tracked:', calendarEvent);
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('calendar_session_id');
        if (!sessionId) {
            sessionId = 'calendar_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('calendar_session_id', sessionId);
        }
        return sessionId;
    }

    // Public methods for external integration
    getUpcomingAppointments() {
        return this.bookedAppointments.filter(appointment => {
            const startTime = new Date(appointment.start.dateTime);
            return startTime > new Date();
        });
    }

    async rescheduleAppointment(eventId, newDateTime) {
        try {
            const response = await gapi.client.calendar.events.patch({
                calendarId: this.calendarConfig.googleCalendar.calendarId,
                eventId: eventId,
                resource: {
                    start: { dateTime: newDateTime },
                    end: { dateTime: this.addMinutes(newDateTime, 30) }
                }
            });
            
            return { success: true, event: response.result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async cancelAppointment(eventId) {
        try {
            await gapi.client.calendar.events.delete({
                calendarId: this.calendarConfig.googleCalendar.calendarId,
                eventId: eventId
            });
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize Calendar Integration
let calendarIntegration;
document.addEventListener('DOMContentLoaded', () => {
    calendarIntegration = new CalendarIntegration();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalendarIntegration;
} 