document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html'; // Redirect to login page if not logged in
    } else {
        fetchTransactions();
    }
});

document.getElementById('transaction-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, category, type }),
    });
    if (response.ok) {
        alert('Transaction added');
        fetchTransactions();
    } else {
        alert('Failed to add transaction');
    }
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/Users/niharikapatil/Downloads/Niharika/Finance tracker/Index/index.html'; // Redirect to login page
});

async function fetchTransactions() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/transactions', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (response.ok) {
        const transactions = await response.json();
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = '';
        transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.textContent = `${transaction.description}: ${transaction.amount} (${transaction.category} - ${transaction.type})`;
            transactionList.appendChild(li);
        });
        updateCharts(transactions);
    } else {
        alert('Failed to fetch transactions');
    }
}

function updateCharts(transactions) {
    const expenseData = transactions.filter(t => t.type === 'expense').map(t => t.amount);
    const incomeData = transactions.filter(t => t.type === 'income').map(t => t.amount);
    const expenseCategories = transactions.filter(t => t.type === 'expense').map(t => t.category);
    const incomeCategories = transactions.filter(t => t.type === 'income').map(t => t.category);

    const ctxExpense = document.getElementById('expense-chart').getContext('2d');
    const ctxIncome = document.getElementById('income-chart').getContext('2d');

    new Chart(ctxExpense, {
        type: 'pie',
        data: {
            labels: expenseCategories,
            datasets: [{
                label: 'Expenses',
                data: expenseData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        }
    });

    new Chart(ctxIncome, {
        type: 'pie',
        data: {
            labels: incomeCategories,
            datasets: [{
                label: 'Income',
                data: incomeData,
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            }]
        }
    });
}
