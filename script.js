// Load existing transactions from localStorage
let transactions = JSON.parse(sessionStorage.getItem('transactions')) || [];
let currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
let incomeExpensesChart; // Chart variable

// Function to populate month options
function populateMonths() {
    const monthSelect = document.getElementById('month');
    const currentDate = new Date();
    for (let i = -5; i <= 5; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const option = document.createElement('option');
        option.value = monthYear;
        option.text = monthYear;
        if (monthYear === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    }
}

// Function to update summary
function updateSummary() {
    const selectedMonth = document.getElementById('month').value;
    const monthTransactions = transactions.filter(t => t.month === selectedMonth);
    const income = monthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = monthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const balance = income - expenses;

    document.getElementById('income').textContent = income.toFixed(2);
    document.getElementById('expenses').textContent = expenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
    
    // Update chart with new data
    updateChart(income, expenses);
}

// Function to initialize the chart
function initializeChart() {
    const ctx = document.getElementById('incomeExpensesChart').getContext('2d');
    
    incomeExpensesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Expenses', 'Income'],
            datasets: [{
                label: 'Amount ($)',
                data: [0, 0], // Initial data, will be updated
                backgroundColor: [
                    '#0066cc', // Blue for expenses
                    '#0066cc'  // Blue for income
                ],
                borderColor: [
                    '#0059b3',
                    '#0059b3'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ecf0f1'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ecf0f1'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Function to update chart data
function updateChart(income, expenses) {
    if (incomeExpensesChart) {
        incomeExpensesChart.data.datasets[0].data = [expenses, income];
        incomeExpensesChart.update();
    }
}

// Load and display transactions
function loadTransactions() {
    const table = document.getElementById('transactionTable');
    table.innerHTML = `
        <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Month</th>
        </tr>
    `;
    const selectedMonth = document.getElementById('month').value;
    const monthTransactions = transactions.filter(t => t.month === selectedMonth);
    monthTransactions.forEach((t, index) => {
        const row = table.insertRow(-1);
        row.innerHTML = `
            <td>${t.type}</td>
            <td>${t.category}</td>
            <td>${t.amount}</td>
            <td>${t.date}</td>
            <td>${t.month}</td>
        `;
    });
    updateSummary();
}

// Add new transaction
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const month = document.getElementById('month').value;

    const newTransaction = { type, category, amount: amount.toFixed(2), date, month };
    transactions.push(newTransaction);
    sessionStorage.setItem('transactions', JSON.stringify(transactions));

    loadTransactions();
    this.reset();
    document.getElementById('type').value = 'Income'; // Reset to default
});

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    populateMonths();           // Populate month dropdown first
    initializeChart();          // Then initialize the chart
    loadTransactions();         // Load and display transactions (this will also update the chart)
});

// Initial load
populateMonths();
loadTransactions();

// Update when month changes
document.getElementById('month').addEventListener('change', loadTransactions);