// Admin Interface with Google Sheets Integration
class AdminInterface {
    constructor() {
        this.isInitialized = false;
        this.isAuthenticated = false;
        this.currentUser = null;
        this.sheetsData = { leads: [], appointments: [], payments: [] };
        
        this.adminConfig = {
            googleSheets: {
                apiKey: 'YOUR_GOOGLE_SHEETS_API_KEY',
                clientId: 'YOUR_GOOGLE_CLIENT_ID',
                spreadsheetId: 'YOUR_SPREADSHEET_ID'
            }
        };
        
        this.init();
    }

    init() {
        this.setupAdminUI();
        this.setupEventListeners();
        this.checkAuthentication();
        this.isInitialized = true;
        console.log('Admin Interface initialized');
    }

    setupAdminUI() {
        const adminUI = document.createElement('div');
        adminUI.id = 'admin-interface';
        adminUI.className = 'admin-interface';
        adminUI.innerHTML = `
            <div class="admin-toggle" id="adminToggle">
                <div class="admin-icon">
                    <i class="fas fa-cog"></i>
                </div>
                <div class="admin-status">
                    <span class="status-text">Admin Panel</span>
                </div>
            </div>
            
            <div class="admin-panel" id="adminPanel">
                <div class="admin-header">
                    <h3>Admin Dashboard</h3>
                    <div class="admin-user" id="adminUser">
                        <i class="fas fa-user-circle"></i>
                        <span>Not signed in</span>
                    </div>
                    <button class="admin-close" id="adminClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="admin-content">
                    <div class="admin-sidebar">
                        <nav class="admin-nav">
                            <a href="#dashboard" class="nav-item active" data-section="dashboard">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                            <a href="#leads" class="nav-item" data-section="leads">
                                <i class="fas fa-users"></i> Leads
                            </a>
                            <a href="#appointments" class="nav-item" data-section="appointments">
                                <i class="fas fa-calendar-check"></i> Appointments
                            </a>
                            <a href="#payments" class="nav-item" data-section="payments">
                                <i class="fas fa-credit-card"></i> Payments
                            </a>
                        </nav>
                    </div>
                    
                    <div class="admin-main">
                        <div class="admin-section active" id="dashboard-section">
                            <h2>Dashboard Overview</h2>
                            <div class="dashboard-stats">
                                <div class="stat-card">
                                    <h3 id="totalLeads">0</h3>
                                    <p>Total Leads</p>
                                </div>
                                <div class="stat-card">
                                    <h3 id="totalAppointments">0</h3>
                                    <p>Appointments</p>
                                </div>
                                <div class="stat-card">
                                    <h3 id="totalRevenue">$0</h3>
                                    <p>Revenue</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="admin-section" id="leads-section">
                            <h2>Lead Management</h2>
                            <div class="leads-table">
                                <table id="leadsTable">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Company</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="leadsTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="admin-section" id="appointments-section">
                            <h2>Appointment Management</h2>
                            <div class="appointments-table">
                                <table id="appointmentsTable">
                                    <thead>
                                        <tr>
                                            <th>Client</th>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="appointmentsTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="admin-section" id="payments-section">
                            <h2>Payment Management</h2>
                            <div class="payments-table">
                                <table id="paymentsTable">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Product</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody id="paymentsTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminUI);
    }

    setupEventListeners() {
        const adminToggle = document.getElementById('adminToggle');
        const adminClose = document.getElementById('adminClose');
        const navItems = document.querySelectorAll('.nav-item');

        if (adminToggle) {
            adminToggle.addEventListener('click', () => this.toggleAdminPanel());
        }

        if (adminClose) {
            adminClose.addEventListener('click', () => this.closeAdminPanel());
        }

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });
    }

    toggleAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.toggle('active');
        }
    }

    closeAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.classList.remove('active');
        }
    }

    switchSection(sectionName) {
        const sections = document.querySelectorAll('.admin-section');
        const navItems = document.querySelectorAll('.nav-item');

        sections.forEach(section => {
            section.classList.toggle('active', section.id === `${sectionName}-section`);
        });

        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionName);
        });

        this.loadSectionData(sectionName);
    }

    async checkAuthentication() {
        if (typeof gapi !== 'undefined' && gapi.auth2) {
            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance.isSignedIn.get()) {
                const user = authInstance.currentUser.get();
                this.currentUser = {
                    id: user.getId(),
                    name: user.getBasicProfile().getName(),
                    email: user.getBasicProfile().getEmail()
                };
                this.isAuthenticated = true;
                this.updateUserDisplay();
                await this.loadDashboardData();
            } else {
                this.showLoginPrompt();
            }
        } else {
            this.showLoginPrompt();
        }
    }

    showLoginPrompt() {
        const adminUser = document.getElementById('adminUser');
        if (adminUser) {
            adminUser.innerHTML = `
                <i class="fas fa-sign-in-alt"></i>
                <button class="login-btn" id="adminLogin">Sign in to Admin</button>
            `;
            
            const loginBtn = document.getElementById('adminLogin');
            if (loginBtn) {
                loginBtn.addEventListener('click', () => this.authenticateAdmin());
            }
        }
    }

    async authenticateAdmin() {
        try {
            await this.initGoogleAPI();
            const authInstance = gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            
            this.currentUser = {
                id: user.getId(),
                name: user.getBasicProfile().getName(),
                email: user.getBasicProfile().getEmail()
            };
            
            this.isAuthenticated = true;
            this.updateUserDisplay();
            await this.loadDashboardData();
            
        } catch (error) {
            console.error('Admin authentication failed:', error);
        }
    }

    async initGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                gapi.load('client:auth2', async () => {
                    try {
                        await gapi.client.init({
                            apiKey: this.adminConfig.googleSheets.apiKey,
                            clientId: this.adminConfig.googleSheets.clientId,
                            scope: 'https://www.googleapis.com/auth/spreadsheets'
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

    updateUserDisplay() {
        const adminUser = document.getElementById('adminUser');
        if (adminUser && this.currentUser) {
            adminUser.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${this.currentUser.name}</span>
                <button class="logout-btn" id="adminLogout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            `;
            
            const logoutBtn = document.getElementById('adminLogout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logoutAdmin());
            }
        }
    }

    logoutAdmin() {
        if (typeof gapi !== 'undefined' && gapi.auth2) {
            gapi.auth2.getAuthInstance().signOut();
        }
        
        this.isAuthenticated = false;
        this.currentUser = null;
        this.showLoginPrompt();
        this.clearDashboardData();
    }

    async loadSectionData(sectionName) {
        if (!this.isAuthenticated) return;

        switch (sectionName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'leads':
                await this.loadLeadsData();
                break;
            case 'appointments':
                await this.loadAppointmentsData();
                break;
            case 'payments':
                await this.loadPaymentsData();
                break;
        }
    }

    async loadDashboardData() {
        try {
            await this.loadSheetsData();
            this.updateDashboardStats();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async loadSheetsData() {
        try {
            const spreadsheetId = this.adminConfig.googleSheets.spreadsheetId;
            
            // Load sample data for demo
            this.sheetsData.leads = [
                { name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', status: 'new' },
                { name: 'Jane Smith', email: 'jane@example.com', company: 'AI Solutions', status: 'contacted' }
            ];
            
            this.sheetsData.appointments = [
                { client_name: 'John Doe', type: 'consultation', date: '2024-01-15', status: 'scheduled' },
                { client_name: 'Jane Smith', type: 'discovery', date: '2024-01-16', status: 'completed' }
            ];
            
            this.sheetsData.payments = [
                { customer_name: 'John Doe', product: 'Discovery Session', amount: '99', status: 'succeeded' },
                { customer_name: 'Jane Smith', product: 'Technical Review', amount: '149', status: 'succeeded' }
            ];
            
        } catch (error) {
            console.error('Failed to load sheets data:', error);
        }
    }

    updateDashboardStats() {
        const totalLeads = document.getElementById('totalLeads');
        const totalAppointments = document.getElementById('totalAppointments');
        const totalRevenue = document.getElementById('totalRevenue');

        if (totalLeads) totalLeads.textContent = this.sheetsData.leads.length;
        if (totalAppointments) totalAppointments.textContent = this.sheetsData.appointments.length;
        
        const revenue = this.sheetsData.payments.reduce((sum, payment) => {
            return sum + (parseFloat(payment.amount) || 0);
        }, 0);
        
        if (totalRevenue) totalRevenue.textContent = `$${revenue}`;
    }

    async loadLeadsData() {
        const tableBody = document.getElementById('leadsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = this.sheetsData.leads.map(lead => `
            <tr>
                <td>${lead.name || ''}</td>
                <td>${lead.email || ''}</td>
                <td>${lead.company || ''}</td>
                <td>
                    <span class="status-badge status-${lead.status || 'new'}">
                        ${lead.status || 'new'}
                    </span>
                </td>
                <td>
                    <button class="action-btn" onclick="adminInterface.editLead('${lead.name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadAppointmentsData() {
        const tableBody = document.getElementById('appointmentsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = this.sheetsData.appointments.map(appointment => `
            <tr>
                <td>${appointment.client_name || ''}</td>
                <td>${appointment.type || ''}</td>
                <td>${new Date(appointment.date).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge status-${appointment.status || 'scheduled'}">
                        ${appointment.status || 'scheduled'}
                    </span>
                </td>
                <td>
                    <button class="action-btn" onclick="adminInterface.editAppointment('${appointment.client_name}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadPaymentsData() {
        const tableBody = document.getElementById('paymentsTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = this.sheetsData.payments.map(payment => `
            <tr>
                <td>${payment.customer_name || ''}</td>
                <td>${payment.product || ''}</td>
                <td>$${payment.amount || '0'}</td>
                <td>
                    <span class="status-badge status-${payment.status || 'pending'}">
                        ${payment.status || 'pending'}
                    </span>
                </td>
                <td>${new Date().toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    editLead(leadName) {
        alert(`Edit lead: ${leadName}`);
    }

    editAppointment(clientName) {
        alert(`Edit appointment: ${clientName}`);
    }

    clearDashboardData() {
        const elements = ['totalLeads', 'totalAppointments', 'totalRevenue'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = '0';
        });
    }
}

// Initialize Admin Interface
let adminInterface;
document.addEventListener('DOMContentLoaded', () => {
    adminInterface = new AdminInterface();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminInterface;
} 