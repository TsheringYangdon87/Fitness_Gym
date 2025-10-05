// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
    
    // Close sidebar when clicking on overlay
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });

    // Initialize eye icons as slash (closed eye) by default
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    });

    // Password visibility toggle
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Password strength indicator
    const newPasswordInput = document.getElementById('newPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const strengthScore = document.getElementById('strengthScore');

    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        
        if (password.length === 0) {
            passwordStrength.style.display = 'none';
            return;
        }
        
        passwordStrength.style.display = 'block';
        
        let strength = 0;
        const requirements = {
            length: password.length >= 8,
            case: /[a-z]/.test(password) && /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[^a-zA-Z\d]/.test(password)
        };
        
        // Calculate strength
        if (requirements.length) strength++;
        if (password.length >= 12) strength++;
        if (requirements.case) strength++;
        if (requirements.number) strength++;
        if (requirements.special) strength++;
        
        // Update strength bar
        const percentage = (strength / 5) * 100;
        strengthFill.style.width = percentage + '%';
        
        // Update color and text
        let color, text;
        if (strength <= 1) {
            color = '#e53e3e';
            text = 'Weak';
        } else if (strength <= 3) {
            color = '#fbbf24';
            text = 'Medium';
        } else {
            color = '#48bb78';
            text = 'Strong';
        }
        
        strengthFill.style.backgroundColor = color;
        strengthText.style.color = color;
        strengthText.textContent = 'Password Strength: ' + text;
        strengthScore.textContent = strength + '/5';
        
        // Update requirements list
        updateRequirementsList(requirements);
    });

    // Update requirements list
    function updateRequirementsList(requirements) {
        const reqLength = document.getElementById('req-length');
        const reqCase = document.getElementById('req-case');
        const reqNumber = document.getElementById('req-number');
        const reqSpecial = document.getElementById('req-special');
        
        requirements.length ? reqLength.classList.add('met') : reqLength.classList.remove('met');
        requirements.case ? reqCase.classList.add('met') : reqCase.classList.remove('met');
        requirements.number ? reqNumber.classList.add('met') : reqNumber.classList.remove('met');
        requirements.special ? reqSpecial.classList.add('met') : reqSpecial.classList.remove('met');
    }

    // Confirm password match check
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatchError = document.getElementById('passwordMatchError');
    
    confirmPasswordInput.addEventListener('input', function() {
        if (this.value.length === 0) {
            passwordMatchError.style.display = 'none';
            return;
        }
        
        if (this.value !== newPasswordInput.value) {
            passwordMatchError.style.display = 'flex';
        } else {
            passwordMatchError.style.display = 'none';
        }
    });

    // Form submission
    const passwordForm = document.getElementById('passwordForm');
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validation
        if (currentPassword.trim() === '') {
            showToast('Please enter your current password', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        if (currentPassword === newPassword) {
            showToast('New password must be different from current password', 'error');
            return;
        }
        
        // In a real application, send this to your backend
        // For demo purposes, we'll just show success message
        showToast('Password changed successfully!');
        
        // Redirect back to settings after 1.5 seconds
        setTimeout(() => {
            window.history.back();
        }, 1500);
    });

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = type === 'error' ? 'toast toast-error' : 'toast';
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});