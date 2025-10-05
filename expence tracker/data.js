// ====== Data Management Module ======
const DataManager = {
    // ====== Transaction Management ======
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],

    // Add a new transaction
    addTransaction: function(transaction) {
        this.transactions.unshift(transaction);
        this.saveTransactions();
        return this.transactions;
    },

    // Remove a transaction by ID
    removeTransaction: function(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        return this.transactions;
    },

    // Get all transactions
    getAllTransactions: function() {
        return this.transactions;
    },

    // Get transactions by type (income/expense)
    getTransactionsByType: function(type) {
        return this.transactions.filter(t => t.type === type);
    },

    // Get transactions by category
    getTransactionsByCategory: function(category) {
        return this.transactions.filter(t => t.category === category);
    },

    // Save transactions to localStorage
    saveTransactions: function() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    },

    // ====== Budget Management ======
    budgets: JSON.parse(localStorage.getItem('budgets')) || {
        Food: 5000,
        Transport: 3000,
        Entertainment: 2000,
        Bills: 4000,
        Shopping: 2500,
        Other: 1500
    },

    // Get all budgets
    getBudgets: function() {
        return this.budgets;
    },

    // Update a budget
    updateBudget: function(category, amount) {
        this.budgets[category] = amount;
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
        return this.budgets;
    },

    // Get budget for a category
    getBudget: function(category) {
        return this.budgets[category] || 0;
    },

    // Get spending for a category
    getSpending: function(category) {
        return this.getTransactionsByCategory(category)
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    },

    // Get budget progress (percentage)
    getBudgetProgress: function(category) {
        const budget = this.getBudget(category);
        const spent = this.getSpending(category);
        return budget > 0 ? (spent / budget) * 100 : 0;
    },

    // ====== Statistics ======
    // Get total balance
    getBalance: function() {
        return this.transactions.reduce((sum, t) => sum + t.amount, 0);
    },

    // Get total income
    getTotalIncome: function() {
        return this.getTransactionsByType('income')
            .reduce((sum, t) => sum + t.amount, 0);
    },

    // Get total expenses
    getTotalExpenses: function() {
        return this.getTransactionsByType('expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    },

    // Get monthly summary
    getMonthlySummary: function() {
        const months = {};
        const now = new Date();
        const currentYear = now.getFullYear();
        
        this.transactions.forEach(t => {
            const date = new Date(t.date || now);
            if (date.getFullYear() === currentYear) {
                const month = date.toLocaleString('default', { month: 'short' });
                if (!months[month]) {
                    months[month] = { income: 0, expense: 0 };
                }
                if (t.type === 'income') {
                    months[month].income += t.amount;
                } else {
                    months[month].expense += Math.abs(t.amount);
                }
            }
        });
        
        return months;
    },

    // Get category breakdown
    getCategoryBreakdown: function(type = 'expense') {
        const categories = {};
        
        this.getTransactionsByType(type).forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
        });
        
        return categories;
    },

    // ====== Data Export/Import ======
    exportData: function() {
        return {
            transactions: this.transactions,
            budgets: this.budgets,
            exportedAt: new Date().toISOString()
        };
    },

    importData: function(data) {
        if (data.transactions) {
            this.transactions = data.transactions;
            this.saveTransactions();
        }
        if (data.budgets) {
            this.budgets = data.budgets;
            localStorage.setItem('budgets', JSON.stringify(this.budgets));
        }
        return true;
    },

    // ====== Data Initialization ======
    initializeSampleData: function() {
        if (this.transactions.length === 0) {
            const sampleTransactions = [
                {
                    id: Date.now() - 1000,
                    type: 'income',
                    description: 'Monthly Salary',
                    category: 'Salary',
                    amount: 30000,
                    date: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                },
                {
                    id: Date.now() - 2000,
                    type: 'expense',
                    description: 'Grocery Shopping',
                    category: 'Food',
                    amount: -2500,
                    date: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                },
                {
                    id: Date.now() - 3000,
                    type: 'expense',
                    description: 'Fuel',
                    category: 'Transport',
                    amount: -1500,
                    date: new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }
            ];
            
            this.transactions = sampleTransactions;
            this.saveTransactions();
        }
    }
};

// Initialize sample data if empty
DataManager.initializeSampleData();

// ====== Authentication Module ======
const AuthManager = {
    // Check if user is authenticated
    isAuthenticated: function() {
        const authData = sessionStorage.getItem('expenseTrackerAuth');
        return !!authData;
    },

    // Login user
    login: function(username, password) {
        // In a real app, this would be a server-side check
        if (username === 'admin' && password === 'password123') {
            const authData = {
                username: username,
                token: 'demo_token_' + Math.random().toString(36).substr(2, 16),
                loggedInAt: new Date().getTime()
            };
            sessionStorage.setItem('expenseTrackerAuth', JSON.stringify(authData));
            return true;
        }
        return false;
    },

    // Logout user
    logout: function() {
        sessionStorage.removeItem('expenseTrackerAuth');
    },

    // Get current user
    getCurrentUser: function() {
        const authData = sessionStorage.getItem('expenseTrackerAuth');
        return authData ? JSON.parse(authData) : null;
    }
};

// ====== Make modules available globally ======
window.DataManager = DataManager;
window.AuthManager = AuthManager;