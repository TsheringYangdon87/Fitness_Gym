document.addEventListener('DOMContentLoaded', function() {
    // Get all form elements
    const methodForm = document.getElementById('methodForm');
    const verifyForm = document.getElementById('verifyForm');
    const codeForm = document.getElementById('codeForm');
    const passwordForm = document.getElementById('passwordForm');
    
    // Get all steps
    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
        success: document.getElementById('successStep')
    };

    // Store selected method
    let selectedMethod = 'email';
    let userContact = '';
    let resendTimer = null;
    let resendSeconds = 60;

    // Step 1: Method Selection
    if (methodForm) {
        const methodRadios = document.querySelectorAll('input[name="resetMethod"]');
        
        methodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                selectedMethod = this.value;
            });
        });

        methodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showStep('step2', selectedMethod);
        });
    }

    // Step 2: Enter Email/Phone
    if (verifyForm) {
        verifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearAllErrors();
            let isValid = false;

            if (selectedMethod === 'email') {
                const email = document.getElementById('email').value.trim();
                isValid = validateEmail(email);
                if (isValid) {
                    userContact = email;
                }
            } else {
                const phone = document.getElementById('phone').value.trim();
                isValid = validatePhone(phone);
                if (isValid) {
                    userContact = phone;
                }
            }

            if (isValid) {
                sendResetCode();
            }
        });
    }

    // Step 3: Verification Code
    if (codeForm) {
        const codeInputs = document.querySelectorAll('.code-input');
        
        // Handle code input
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', function(e) {
                clearError('code');
                
                if (this.value.length === 1) {
                    // Move to next input
                    if (index < codeInputs.length - 1) {
                        codeInputs[index + 1].focus();
                    }
                }
            });

            input.addEventListener('keydown', function(e) {
                // Handle backspace
                if (e.key === 'Backspace' && !this.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });

            // Only allow numbers
            input.addEventListener('keypress', function(e) {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            });

            // Handle paste
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                const digits = pastedData.replace(/\D/g, '').slice(0, 6);
                
                digits.split('').forEach((digit, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = digit;
                    }
                });
                
                if (digits.length > 0) {
                    const lastIndex = Math.min(digits.length, 6) - 1;
                    codeInputs[lastIndex].focus();
                }
            });
        });

        codeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const code = Array.from(codeInputs).map(input => input.value).join('');
            
            if (code.length !== 6) {
                showError('code', 'Please enter the complete 6-digit code');
                codeInputs.forEach(input => input.classList.add('error'));
                return;
            }

            verifyCode(code);
        });

        // Resend code
        const resendBtn = document.getElementById('resendBtn');
        if (resendBtn) {
            resendBtn.addEventListener('click', function() {
                if (!this.disabled) {
                    resendResetCode();
                }
            });
        }
    }

    // Step 4: New Password
    if (passwordForm) {
        const newPassword = document.getElementById('newPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        const toggleButtons = document.querySelectorAll('.toggle-password');

        // Toggle password visibility
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
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

        // Password strength validation
        if (newPassword) {
            newPassword.addEventListener('input', function() {
                clearError('newPassword');
                validatePasswordStrength(this.value);
            });
        }

        if (confirmPassword) {
            confirmPassword.addEventListener('input', function() {
                clearError('confirmPassword');
            });
        }

        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearAllErrors();
            
            const newPass = newPassword.value;
            const confirmPass = confirmPassword.value;
            let isValid = true;

            // Validate new password
            if (!newPass) {
                showError('newPassword', 'Please enter a new password');
                isValid = false;
            } else if (!isPasswordStrong(newPass)) {
                showError('newPassword', 'Password does not meet requirements');
                isValid = false;
            }

            // Validate confirm password
            if (!confirmPass) {
                showError('confirmPassword', 'Please confirm your password');
                isValid = false;
            } else if (newPass !== confirmPass) {
                showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            }

            if (isValid) {
                resetPassword(newPass);
            }
        });
    }

    // Navigation
    document.getElementById('backToStep1')?.addEventListener('click', function(e) {
        e.preventDefault();
        showStep('step1');
    });

    document.getElementById('backToStep2')?.addEventListener('click', function(e) {
        e.preventDefault();
        showStep('step2', selectedMethod);
    });

    // Helper Functions
    function showStep(stepId, method = null) {
        // Hide all steps
        Object.values(steps).forEach(step => {
            if (step) step.classList.remove('active');
        });

        // Show selected step
        if (steps[stepId]) {
            steps[stepId].classList.add('active');
        }

        // Update step 2 based on method
        if (stepId === 'step2' && method) {
            const emailGroup = document.getElementById('emailGroup');
            const phoneGroup = document.getElementById('phoneGroup');
            const step2Description = document.getElementById('step2Description');

            if (method === 'email') {
                emailGroup.classList.remove('hidden');
                phoneGroup.classList.add('hidden');
                step2Description.textContent = 'Enter your email address to receive the reset code';
            } else {
                emailGroup.classList.add('hidden');
                phoneGroup.classList.remove('hidden');
                step2Description.textContent = 'Enter your phone number to receive the reset code';
            }
        }

        // Update step 3 description
        if (stepId === 'step3') {
            const step3Description = document.getElementById('step3Description');
            const maskedContact = maskContact(userContact, selectedMethod);
            step3Description.textContent = `We've sent a 6-digit code to ${maskedContact}`;
            startResendTimer();
        }
    }

    function validateEmail(email) {
        if (!email) {
            showError('email', 'Please enter your email address');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            return false;
        }

        return true;
    }

    function validatePhone(phone) {
        if (!phone) {
            showError('phone', 'Please enter your phone number');
            return false;
        }

        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(phone.replace(/[\s-()]/g, ''))) {
            showError('phone', 'Please enter a valid phone number');
            return false;
        }

        return true;
    }

    function validatePasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        };

        Object.keys(requirements).forEach(req => {
            const element = document.querySelector(`[data-requirement="${req}"]`);
            if (element) {
                if (requirements[req]) {
                    element.classList.add('met');
                } else {
                    element.classList.remove('met');
                }
            }
        });

        return Object.values(requirements).every(val => val === true);
    }

    function isPasswordStrong(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[a-z]/.test(password) &&
               /[0-9]/.test(password);
    }

    function maskContact(contact, method) {
        if (method === 'email') {
            const parts = contact.split('@');
            const username = parts[0];
            const domain = parts[1];
            const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
            return `${maskedUsername}@${domain}`;
        } else {
            const length = contact.length;
            return '*'.repeat(length - 4) + contact.slice(-4);
        }
    }

    function sendResetCode() {
        const submitBtn = verifyForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('i');

        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Sending...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log(`Reset code sent to: ${userContact} via ${selectedMethod}`);
            
            // Reset button state
            submitBtn.classList.remove('loading');
            btnText.textContent = 'Send Reset Code';
            btnIcon.className = 'fas fa-paper-plane';
            submitBtn.disabled = false;

            // Move to step 3
            showStep('step3');
        }, 1500);
    }

    function verifyCode(code) {
        const submitBtn = codeForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('i');

        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Verifying...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // For demo, accept any 6-digit code
            console.log(`Verifying code: ${code}`);
            
            // Reset button state
            submitBtn.classList.remove('loading');
            btnText.textContent = 'Verify Code';
            btnIcon.className = 'fas fa-check';
            submitBtn.disabled = false;

            // Clear timer
            if (resendTimer) {
                clearInterval(resendTimer);
            }

            // Move to step 4
            showStep('step4');
        }, 1500);
    }

    function resetPassword(password) {
        const submitBtn = passwordForm.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('i');

        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = 'Resetting...';
        btnIcon.className = 'fas fa-spinner fa-spin';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log('Password reset successful');
            
            // Show success step
            showStep('success');
        }, 1500);
    }

    function resendResetCode() {
        const resendBtn = document.getElementById('resendBtn');
        
        console.log(`Resending code to: ${userContact} via ${selectedMethod}`);
        
        // Show feedback
        const originalText = resendBtn.textContent;
        resendBtn.textContent = 'Code Sent!';
        
        setTimeout(() => {
            startResendTimer();
        }, 1000);
    }

    function startResendTimer() {
        const resendBtn = document.getElementById('resendBtn');
        const timerSpan = document.getElementById('timer');
        
        resendSeconds = 60;
        resendBtn.disabled = true;
        
        if (resendTimer) {
            clearInterval(resendTimer);
        }

        resendTimer = setInterval(() => {
            resendSeconds--;
            timerSpan.textContent = `(${resendSeconds}s)`;
            resendBtn.textContent = `Resend Code (${resendSeconds}s)`;

            if (resendSeconds <= 0) {
                clearInterval(resendTimer);
                resendBtn.disabled = false;
                resendBtn.textContent = 'Resend Code';
                timerSpan.textContent = '';
            }
        }, 1000);
    }

    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const input = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        
        if (input) {
            input.classList.add('error');
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        }

        // For code inputs
        if (fieldId === 'code') {
            document.querySelectorAll('.code-input').forEach(input => {
                input.classList.add('error');
            });
        }
    }

    function clearError(fieldId) {
        const errorElement = document.getElementById(`${fieldId}-error`);
        const input = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        if (input) {
            input.classList.remove('error');
        }

        // For code inputs
        if (fieldId === 'code') {
            document.querySelectorAll('.code-input').forEach(input => {
                input.classList.remove('error');
            });
        }
    }

    function clearAllErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
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

    console.log('Reset password page loaded successfully');
});