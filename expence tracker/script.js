// DOM Elements
const balanceAmount = document.getElementById('balance');
const incomeAmount = document.getElementById('income');
const expenseAmount = document.getElementById('expense');
const addBtn = document.getElementById('add-btn');
const transactionList = document.getElementById('transaction-list');

// Sample Data (Replace with localStorage later)
let transactions = [
    { id: 1, type: 'expense', description: 'Dinner at Restaurant', category: 'Food', amount: 850, date: 'Today, 8:30 PM' },
    { id: 2, type: 'expense', description: 'Grocery Shopping', category: 'Shopping', amount: 1250, date: 'Yesterday, 5:45 PM' },
    { id: 3, type: 'income', description: 'Monthly Salary', category: 'Salary', amount: 30000, date: 'May 1, 10:00 AM' }
];

// Initialize App
function init() {
    updateSummary();
    renderTransactions();
    initCharts();
}

// Update Balance, Income, Expense
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;
    
    balanceAmount.textContent = `₹${balance.toLocaleString('en-IN')}`;
    incomeAmount.textContent = `+₹${income.toLocaleString('en-IN')}`;
    expenseAmount.textContent = `-₹${expense.toLocaleString('en-IN')}`;
}

// Render Transactions
function renderTransactions() {
    transactionList.innerHTML = '';
    
    transactions.forEach(transaction => {
        const iconClass = getIconClass(transaction.category);
        const sign = transaction.type === 'income' ? '+' : '-';
        const amountClass = transaction.type === 'income' ? 'income-text' : 'expense-text';
        
        const transactionItem = document.createElement('li');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.description}</div>
                <div class="transaction-category">${transaction.category}</div>
            </div>
            <div class="transaction-amount ${amountClass}">${sign}₹${transaction.amount.toLocaleString('en-IN')}</div>
            <div class="transaction-date">${transaction.date}</div>
        `;
        
        transactionList.appendChild(transactionItem);
    });
}

// Get Icon Class for Category
function getIconClass(category) {
    const icons = {
        'Food': 'fa-utensils',
        'Transport': 'fa-car',
        'Shopping': 'fa-shopping-bag',
        'Entertainment': 'fa-gamepad',
        'Bills': 'fa-file-invoice-dollar',
        'Salary': 'fa-money-bill-wave'
    };
    return icons[category] || 'fa-wallet';
}

// Initialize Charts
function initCharts() {
    // Expense Chart
    const expenseCtx = document.getElementById('expenseChart').getContext('2d');
    new Chart(expenseCtx, {
        type: 'doughnut',
        data: getExpenseChartData(),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Expense Breakdown', font: { size: 16 } }
            }
        }
    });
    
    // Income Chart
    const incomeCtx = document.getElementById('incomeChart').getContext('2d');
    new Chart(incomeCtx, {
        type: 'bar',
        data: getIncomeChartData(),
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Monthly Income', font: { size: 16 } }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Get Data for Expense Chart
function getExpenseChartData() {
    const categories = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
    
    return {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderWidth: 1
        }]
    };
}

// Get Data for Income Chart
function getIncomeChartData() {
    // Sample data - replace with your actual income data
    return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Income',
            data: [28000, 32000, 29000, 31000, 35000],
            backgroundColor: '#2ecc71',
            borderWidth: 1
        }]
    };
}


// Add New Transaction
addBtn.addEventListener('click', function() {
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!description || !amount) {
        alert('Please fill all fields');
        return;
    }
    
    // Create new transaction
    const newTransaction = {
        id: Date.now(),
        type,
        description,
        category,
        amount,
        date: new Date().toLocaleTimeString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    };
    // ====== DOM Elements ======
const balanceAmount = document.getElementById('balance');
const incomeAmount = document.getElementById('income');
const expenseAmount = document.getElementById('expense');
const addBtn = document.getElementById('add-btn');
const transactionList = document.getElementById('transaction-list');
const typeSelect = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');
const amountInput = document.getElementById('amount');

// ====== Data Management ======
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ====== Chart Instances ======
let expenseChart, incomeChart;

// ====== Initialize App ======
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated() && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Load username if available
    const authData = getAuthData();
    if (authData && authData.username) {
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) usernameDisplay.textContent = authData.username;
    }

    // Initialize app components
    init();
});

// ====== Core Functions ======
function init() {
    updateSummary();
    renderTransactions();
    initCharts();
    updateBudgets();
    setupEventListeners();
}

function setupEventListeners() {
    // Add transaction
    if (addBtn) {
        addBtn.addEventListener('click', addTransaction);
    }

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            navigate(this.getAttribute('data-page'));
        });
    });
}

function navigate(page) {
    // Highlight active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });

    // Update page title
    const mainTitle = document.querySelector('.main-content h1');
    if (mainTitle) {
        mainTitle.textContent = page.charAt(0).toUpperCase() + page.slice(1);
    }

    // In a real app, this would load different content or pages
    console.log(`Navigating to ${page}`);
}

function logout() {
    sessionStorage.removeItem('expenseTrackerAuth');
    window.location.href = 'login.html';
}

// ====== Transaction Functions ======
function addTransaction() {
    const type = typeSelect.value;
    const description = descriptionInput.value.trim();
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);

    // Validation
    if (!description || isNaN(amount) || amount <= 0) {
        alert('Please enter valid description and amount');
        return;
    }

    // Create transaction
    const transaction = {
        id: Date.now(),
        type,
        description,
        category,
        amount: type === 'income' ? amount : -amount,
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // Add to transactions array
    transactions.unshift(transaction);
    saveTransactions();

    // Update UI
    updateSummary();
    renderTransactions();
    updateBudgets();
    updateCharts();

    // Clear form
    descriptionInput.value = '';
    amountInput.value = '';
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    init(); // Refresh all UI components
}

// ====== UI Update Functions ======
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = income - expense;

    if (balanceAmount) balanceAmount.textContent = `₹${balance.toFixed(2)}`;
    if (incomeAmount) incomeAmount.textContent = `+₹${income.toFixed(2)}`;
    if (expenseAmount) expenseAmount.textContent = `-₹${expense.toFixed(2)}`;
}

function renderTransactions() {
    if (!transactionList) return;

    // Clear existing transactions
    transactionList.innerHTML = '';

    // Show empty state if no transactions
    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet. Add your first transaction!</p>
            </div>
        `;
        return;
    }

    // Render transactions (limit to 5 for dashboard)
    const transactionsToShow = window.location.pathname.endsWith('index.html') 
        ? transactions.slice(0, 5) 
        : transactions;

    transactionsToShow.forEach(transaction => {
        const transactionItem = document.createElement('li');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <i class="fas ${getCategoryIcon(transaction.category)}"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-title">${transaction.description}</div>
                <div class="transaction-category">${transaction.category}</div>
            </div>
            <div class="transaction-amount ${transaction.type === 'income' ? 'income-text' : 'expense-text'}">
                ${transaction.type === 'income' ? '+' : '-'}₹${Math.abs(transaction.amount).toFixed(2)}
            </div>
            <div class="transaction-date">${transaction.date}</div>
            <div class="transaction-actions">
                <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        transactionList.appendChild(transactionItem);
    });
}

function updateBudgets() {
    // Update food budget
    const foodSpent = getCategoryTotal('Food');
    const foodBudget = 5000;
    const foodPercentage = Math.min(100, (foodSpent / foodBudget) * 100);
    updateBudgetElement('food', foodSpent, foodBudget, foodPercentage);

    // Update transport budget
    const transportSpent = getCategoryTotal('Transport');
    const transportBudget = 3000;
    const transportPercentage = Math.min(100, (transportSpent / transportBudget) * 100);
    updateBudgetElement('transport', transportSpent, transportBudget, transportPercentage);
}

function updateBudgetElement(prefix, spent, budget, percentage) {
    const progressBar = document.getElementById(`${prefix}-progress`);
    const budgetText = document.getElementById(`${prefix}-budget`);
    const percentText = document.getElementById(`${prefix}-percent`);

    if (progressBar && budgetText && percentText) {
        progressBar.style.width = `${percentage}%`;
        progressBar.style.backgroundColor = percentage > 100 ? '#e74c3c' : '#4a6491';
        budgetText.textContent = `₹${spent.toFixed(2)}/₹${budget.toFixed(2)}`;
        percentText.textContent = percentage > 100 
            ? `${Math.floor(percentage)}% over budget` 
            : `${Math.floor(percentage)}% spent`;
        percentText.style.color = percentage > 100 ? '#e74c3c' : '#6c757d';
    }
}

// ====== Chart Functions ======
function initCharts() {
    // Expense Chart
    const expenseCtx = document.getElementById('expenseChart');
    if (expenseCtx) {
        expenseChart = new Chart(expenseCtx, {
            type: 'doughnut',
            data: getExpenseChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    title: { 
                        display: true, 
                        text: 'Expense Breakdown',
                        font: { size: 16 }
                    }
                }
            }
        });
    }

    // Income Chart
    const incomeCtx = document.getElementById('incomeChart');
    if (incomeCtx) {
        incomeChart = new Chart(incomeCtx, {
            type: 'bar',
            data: getIncomeChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { 
                        display: true, 
                        text: 'Monthly Income',
                        font: { size: 16 }
                    }
                },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function updateCharts() {
    if (expenseChart) {
        expenseChart.data = getExpenseChartData();
        expenseChart.update();
    }
    if (incomeChart) {
        incomeChart.data = getIncomeChartData();
        incomeChart.update();
    }
}

function getExpenseChartData() {
    const categories = {};
    
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
        });
    
    return {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', 
                '#4BC0C0', '#9966FF', '#FF9F40'
            ],
            borderWidth: 1
        }]
    };
}

function getIncomeChartData() {
    // Group by month (simplified example)
    const monthlyIncome = {
        'Jan': 28000,
        'Feb': 32000,
        'Mar': 29000,
        'Apr': 31000,
        'May': transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
    };
    
    return {
        labels: Object.keys(monthlyIncome),
        datasets: [{
            label: 'Income',
            data: Object.values(monthlyIncome),
            backgroundColor: '#2ecc71',
            borderWidth: 1
        }]
    };
}

// ====== Helper Functions ======
function getCategoryIcon(category) {
    const icons = {
        'Food': 'fa-utensils',
        'Transport': 'fa-car',
        'Shopping': 'fa-shopping-bag',
        'Entertainment': 'fa-gamepad',
        'Bills': 'fa-file-invoice-dollar',
        'Salary': 'fa-money-bill-wave',
        'Other': 'fa-wallet'
    };
    return icons[category] || 'fa-wallet';
}

function getCategoryTotal(category) {
    return transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function isAuthenticated() {
    const authData = sessionStorage.getItem('expenseTrackerAuth');
    return !!authData;
}

function getAuthData() {
    const authData = sessionStorage.getItem('expenseTrackerAuth');
    return authData ? JSON.parse(authData) : null;
}

// ====== Make functions available globally ======
window.removeTransaction = removeTransaction;
window.logout = logout;
window.navigate = navigate;
    transactions.unshift(newTransaction);
    updateSummary();
    renderTransactions();
    
    // Clear form
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
});

// Check auth on page load
if (!checkAuth()) {
  window.location.href = "login.html";
}
// Initialize the app
init();