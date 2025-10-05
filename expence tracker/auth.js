// ====== Authentication Configuration ======
const AuthConfig = {
    sessionKey: 'expenseTrackerAuth',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    demoCredentials: {
        username: 'admin',
        password: 'password123' // In production, use proper hashing
    }
};

// ====== Authentication Service ======
const AuthService = {
    // Initialize auth system
    init: function() {
        this.cleanExpiredSessions();
        this.setupEventListeners();
    },

    // Check if user is authenticated
    isAuthenticated: function() {
        const authData = this.getAuthData();
        return authData && new Date().getTime() < authData.expiry;
    },

    // Login user
    login: function(username, password) {
        // Demo validation - replace with server-side auth in production
        if (username === AuthConfig.demoCredentials.username && 
            password === AuthConfig.demoCredentials.password) {
            
            const authData = {
                username: username,
                token: this.generateToken(),
                expiry: new Date().getTime() + AuthConfig.tokenExpiry,
                lastLogin: new Date().toISOString()
            };
            
            this.setAuthData(authData);
            return true;
        }
        return false;
    },

    // Logout user
    logout: function() {
        sessionStorage.removeItem(AuthConfig.sessionKey);
    },

    // Get current auth data
    getAuthData: function() {
        const authData = sessionStorage.getItem(AuthConfig.sessionKey);
        return authData ? JSON.parse(authData) : null;
    },

    // Set auth data
    setAuthData: function(data) {
        sessionStorage.setItem(AuthConfig.sessionKey, JSON.stringify(data));
    },

    // Generate secure token
    generateToken: function() {
        return 'tk_' + window.crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + 
               Date.now().toString(36);
    },

    // Clean expired sessions
    cleanExpiredSessions: function() {
        const authData = this.getAuthData();
        if (authData && new Date().getTime() >= authData.expiry) {
            this.logout();
        }
    },

    // Protect routes
    protectRoute: function() {
        if (!this.isAuthenticated() && !window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    },

    // Setup form listeners
    setupEventListeners: function() {
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value.trim();
                const errorElement = document.getElementById('login-error');

                if (this.login(username, password)) {
                    window.location.href = 'index.html';
                } else {
                    errorElement.textContent = 'Invalid username or password';
                    document.getElementById('password').value = '';
                }
            });
        }

        // Auto-redirect if already logged in
        if (window.location.pathname.endsWith('login.html') && this.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }
};

// ====== Initialize on DOM Load ======
document.addEventListener('DOMContentLoaded', function() {
    AuthService.init();
    
    // Protect all routes except login
    if (!window.location.pathname.endsWith('login.html')) {
        AuthService.protectRoute();
    }

    // Display username if logged in
    const authData = AuthService.getAuthData();
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay && authData) {
        usernameDisplay.textContent = authData.username;
    }
});

// ====== Make AuthService available globally ======
window.AuthService = AuthService;
window.logout = AuthService.logout;