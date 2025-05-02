const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const dashboardSection = document.getElementById('dashboard');
const toLoginLink = document.getElementById('to-login');
const toSignupLink = document.getElementById('to-signup');

function showSection(section) {
    
    [signupForm, loginForm, dashboardSection].forEach(el => {
        if (el) el.classList.remove('active');
    });

    if (section) section.classList.add('active');
}

window.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    const loggedInFromUrl = urlParams.get('loggedIn');

    const sessionData = JSON.parse(localStorage.getItem('session'));

    if ((loggedInFromUrl === 'true') || (sessionData && sessionData.loggedIn)) {
        loadDashboard();
        return;
    }

    if (urlParams.get('registered') === 'true') {
        const email = urlParams.get('email');
        if (email) {
            document.getElementById('login-email').value = email;
            showSection(loginForm);
            return;
        }
    }

    showSection(signupForm);
});

toLoginLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(loginForm);
});

toSignupLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSection(signupForm);
});

document.querySelector('#signup-form form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    const user = {
        fullname,
        email,
        password,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(user));

    alert('Registration successful! You can now login.');

    document.getElementById('fullname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';

    document.getElementById('login-email').value = email;

    showSection(loginForm);
});

document.querySelector('#login-form form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        const sessionData = {
            email: email,
            loggedIn: true,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('session', JSON.stringify(sessionData));

        alert('Login successful!');
        loadDashboard();
    } else {
        alert('Invalid email or password!');
    }
});

function loadDashboard() {
    const userData = JSON.parse(localStorage.getItem('user'));
    const sessionData = JSON.parse(localStorage.getItem('session'));

    if (userData && sessionData && sessionData.loggedIn) {
        document.getElementById('user-name').textContent = userData.fullname || 'User';
        document.getElementById('user-email').textContent = userData.email;

        const createdDate = userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString();

        const accountDetails = document.getElementById('account-details');
        accountDetails.innerHTML = `
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Account created:</strong> ${createdDate}</p>
            <p><strong>Last login:</strong> ${new Date(sessionData.loginTime).toLocaleString()}</p>
        `;

        showSection(dashboardSection);
    } else {
        showSection(loginForm);
    }
}

if (document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.removeItem('session');
        alert('You have been logged out.');
        showSection(loginForm);
    });
}
