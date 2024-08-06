document.getElementById('login-toggle').addEventListener('click', () => {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-toggle').classList.add('active');
    document.getElementById('register-toggle').classList.remove('active');
});

document.getElementById('register-toggle').addEventListener('click', () => {
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-toggle').classList.add('active');
    document.getElementById('login-toggle').classList.remove('active');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
    document.getElementById('login-toggle').classList.add('active');
    document.getElementById('register-toggle').classList.remove('active');
});

document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('register-toggle').classList.add('active');
    document.getElementById('login-toggle').classList.remove('active');
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (response.ok) {
        alert('User registered');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('login-toggle').classList.add('active');
        document.getElementById('register-toggle').classList.remove('active');
    } else {
        alert('Registration failed');
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        window.location.href = '../FinanceTracker/finance.html'; // Redirect to finance tracking page
    } else {
        alert('Login failed');
    }
});
