document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMe = document.getElementById('rememberMe');
    const googleBtn = document.querySelector('.btn-google');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type');
            const newType = type === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', newType);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            if (icon) {
                if (newType === 'text') {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                } else {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                }
            }
        });
    }

    // Form validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearAllErrors();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            let isValid = true;

            // Validate username
            if (!username) {
                showError('username', 'Please enter your username or email');
                isValid = false;
            } else if (username.length < 3) {
                showError('username', 'Username must be at least 3 characters');
                isValid = false;
            }

            // Validate password
            if (!password) {
                showError('password', 'Please enter your password');
                isValid = false;
            } else if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                isValid = false;
            }

            if (isValid) {
                handleLogin(username, password);
            }
        });
    }

    // Handle login process
    function handleLogin(username, password) {
        const submitBtn = document.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('i');
        
        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Logging in...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual authentication)
        setTimeout(() => {
            // Check if remember me is checked
            if (rememberMe.checked) {
                localStorage.setItem('rememberMe', 'true');
                // In production, you'd store a secure token
            }

            // Success - redirect to dashboard
            console.log('Login successful:', { username, rememberMe: rememberMe.checked });
            
            // Redirect to dashboard
            window.location.href = '../HTML/Dashboard.html';
            
        }, 1500);
    }

    // Error handling functions
    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (input && errorElement) {
            input.classList.add('error');
            errorElement.textContent = message;
            
            // Add shake animation
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        }
    }

    function clearError(fieldId) {
        const input = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        
        if (input && errorElement) {
            input.classList.remove('error');
            errorElement.textContent = '';
        }
    }

    function clearAllErrors() {
        clearError('username');
        clearError('password');
    }

    // Clear error on input
    usernameInput?.addEventListener('input', function() {
        if (this.value.trim()) {
            clearError('username');
        }
    });

    passwordInput?.addEventListener('input', function() {
        if (this.value.trim()) {
            clearError('password');
        }
    });

    // Google login
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            console.log('Redirecting to Google OAuth...');
            // In production, implement actual Google OAuth
            alert('Google login functionality will be implemented here');
        });
    }

    // Check if user was remembered
    if (localStorage.getItem('rememberMe') === 'true' && rememberMe) {
        rememberMe.checked = true;
    }

    // Add input focus effects
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-submit, .btn-social');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add CSS for ripple effect dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);

    console.log('Login page loaded successfully');
});