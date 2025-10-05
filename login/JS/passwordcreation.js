document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle password buttons
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the ID of the target input field from the data-target attribute
            const targetId = this.dataset.target;
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            // Toggle the type attribute
            const currentType = passwordInput.getAttribute('type');
            
            if (currentType === 'password') {
                // Show password: change to text and show eye icon
                passwordInput.setAttribute('type', 'text');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                // Hide password: change to password and show eye-slash icon
                passwordInput.setAttribute('type', 'password');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Handle form submission
    const passwordForm = document.getElementById('passwordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            // Prevent default form submission
            event.preventDefault();
            
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            
            // Comprehensive validation
            const validationResult = validatePassword(password, confirmPassword);
            
            if (!validationResult.isValid) {
                showAlert(validationResult.message, 'danger');
                return;
            }
            
            // Show loading state
            showLoading(true);
            
            // Simulate processing time (remove this in production)
            setTimeout(() => {
                showLoading(false);
                // Redirect to success page
                window.location.href = '../HTML/accountsuccess.html';
            }, 1000);
        });
    }
    
    // Real-time password validation and matching feedback
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', function() {
            validatePasswordRealTime(this.value);
            checkPasswordMatch();
        });
        
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        
        // Add paste event listeners to handle pasted passwords
        passwordInput.addEventListener('paste', function() {
            setTimeout(() => {
                validatePasswordRealTime(this.value);
                checkPasswordMatch();
            }, 10);
        });
        
        confirmPasswordInput.addEventListener('paste', function() {
            setTimeout(checkPasswordMatch, 10);
        });
    }
    
    function validatePassword(password, confirmPassword) {
        // Check if passwords are empty
        if (!password || !confirmPassword) {
            return {
                isValid: false,
                message: 'Please enter both password and confirm password.'
            };
        }
        
        // Check minimum length
        if (password.length < 8) {
            return {
                isValid: false,
                message: 'Password must be at least 8 characters long.'
            };
        }
        
        // Check maximum length to prevent DoS attacks
        if (password.length > 128) {
            return {
                isValid: false,
                message: 'Password must not exceed 128 characters.'
            };
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            return {
                isValid: false,
                message: 'Passwords do not match!'
            };
        }
        
        // Strong password validation
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!hasLowerCase) {
            return {
                isValid: false,
                message: 'Password must contain at least one lowercase letter (a-z).'
            };
        }
        
        if (!hasUpperCase) {
            return {
                isValid: false,
                message: 'Password must contain at least one uppercase letter (A-Z).'
            };
        }
        
        if (!hasNumbers) {
            return {
                isValid: false,
                message: 'Password must contain at least one number (0-9).'
            };
        }
        
        if (!hasSpecialChar) {
            return {
                isValid: false,
                message: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;\':",./<>?).'
            };
        }
        
        // Check for common weak patterns
        const commonPatterns = [
            /(.)\1{2,}/,  // Three or more consecutive identical characters
            /123456/,     // Sequential numbers
            /abcdef/,     // Sequential letters
            /qwerty/i,    // Common keyboard patterns
            /password/i,  // Contains "password"
            /admin/i,     // Contains "admin"
            /user/i,      // Contains "user"
            /login/i      // Contains "login"
        ];
        
        for (let pattern of commonPatterns) {
            if (pattern.test(password)) {
                return {
                    isValid: false,
                    message: 'Password contains common patterns. Please choose a more secure password.'
                };
            }
        }
        
        // Check for dictionary words (basic check)
        const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'hello', 'world', 'test', 'demo'];
        const passwordLower = password.toLowerCase();
        
        for (let word of commonWords) {
            if (passwordLower.includes(word)) {
                return {
                    isValid: false,
                    message: 'Password should not contain common dictionary words.'
                };
            }
        }
        
        return { isValid: true, message: 'Password is valid!' };
    }
    
    function validatePasswordRealTime(password) {
        const strengthIndicator = document.getElementById('password-strength');
        
        if (!password) {
            strengthIndicator.innerHTML = '';
            strengthIndicator.style.display = 'none';
            return;
        }
        
        let strength = 0;
        let feedback = [];
        
        // Length check
        if (password.length >= 8) {
            strength += 20;
        } else {
            feedback.push('At least 8 characters');
        }
        
        // Character type checks
        if (/[a-z]/.test(password)) {
            strength += 20;
        } else {
            feedback.push('Lowercase letter');
        }
        
        if (/[A-Z]/.test(password)) {
            strength += 20;
        } else {
            feedback.push('Uppercase letter');
        }
        
        if (/\d/.test(password)) {
            strength += 20;
        } else {
            feedback.push('Number');
        }
        
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            strength += 20;
        } else {
            feedback.push('Special character');
        }
        
        // Update strength indicator
        updateStrengthIndicator(strengthIndicator, strength, feedback);
    }
    
    function updateStrengthIndicator(indicator, strength, feedback) {
        let strengthText = 'Very Weak';
        let strengthClass = 'text-danger';
        
        if (strength >= 100) {
            strengthText = 'Strong';
            strengthClass = 'text-success';
        } else if (strength >= 80) {
            strengthText = 'Good';
            strengthClass = 'text-success';
        } else if (strength >= 60) {
            strengthText = 'Fair';
            strengthClass = 'text-warning';
        } else if (strength >= 40) {
            strengthText = 'Weak';
            strengthClass = 'text-warning';
        } else if (strength >= 20) {
            strengthText = 'Very Weak';
            strengthClass = 'text-danger';
        }
        
        indicator.style.display = 'block';
        indicator.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <small><strong>Password Strength:</strong> <span class="${strengthClass}">${strengthText}</span></small>
                <small class="${strengthClass}"><strong>${strength}%</strong></small>
            </div>
            <div class="progress">
                <div class="progress-bar ${strengthClass.replace('text-', 'bg-')}" 
                     role="progressbar" 
                     style="width: ${strength}%" 
                     aria-valuenow="${strength}" 
                     aria-valuemin="0" 
                     aria-valuemax="100">
                </div>
            </div>
            ${feedback.length > 0 ? `<small class="text-muted mt-2 d-block">Missing: ${feedback.join(', ')}</small>` : '<small class="text-success mt-2 d-block"><i class="fas fa-check-circle"></i> Password meets all requirements</small>'}
        `;
    }
    
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Remove any existing match indicator
        const existingIndicator = document.querySelector('.password-match-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        if (confirmPassword === '') {
            confirmPasswordInput.style.borderColor = '#e5e7eb';
            return;
        }
        
        const confirmPasswordGroup = confirmPasswordInput.closest('.form-group');
        const indicator = document.createElement('small');
        indicator.className = 'password-match-indicator';
        
        if (password === confirmPassword && password !== '') {
            confirmPasswordInput.style.borderColor = '#10b981';
            indicator.classList.add('text-success');
            indicator.innerHTML = '<i class="fas fa-check-circle"></i> Passwords match';
        } else {
            confirmPasswordInput.style.borderColor = '#ef4444';
            indicator.classList.add('text-danger');
            indicator.innerHTML = '<i class="fas fa-times-circle"></i> Passwords do not match';
        }
        
        confirmPasswordGroup.appendChild(indicator);
    }
    
    function showAlert(message, type) {
        // Remove existing alerts
        const alertContainer = document.getElementById('alertContainer');
        alertContainer.appendChild(alert);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 150);
            }
        }, 5000);
        
        // Scroll to top to show alert
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function showLoading(show) {
        const button = document.querySelector('.create-account-btn');
        
        if (show) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Creating Account...';
        } else {
            button.disabled = false;
            button.innerHTML = 'Create Account <i class="fas fa-arrow-right ms-2"></i>';
        }
    }
});innerHTML = '';
        
        // Create and show alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            <i class="fas ${type === 'danger' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> 
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        alertContainer