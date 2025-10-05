document.addEventListener('DOMContentLoaded', function () {
  const registrationForm = document.getElementById('registrationForm');
  const submitButton = document.querySelector('.btn-register');
  const userTypeSelect = document.getElementById('userType');
  const studentFields = document.querySelectorAll('.student-field');
  const staffFields = document.querySelectorAll('.staff-field');
  const yearSelect = document.getElementById('year');
  const courseSelect = document.getElementById('course');
  const departmentSelect = document.getElementById('department');

  // User type change handler - Show/Hide fields based on selection
  userTypeSelect.addEventListener('change', function () {
    const userType = this.value;
    
    if (userType === 'student') {
      // Show student fields
      studentFields.forEach(field => {
        field.style.display = 'block';
        // Make them required
        yearSelect.setAttribute('required', 'required');
        courseSelect.setAttribute('required', 'required');
      });
      
      // Hide staff fields
      staffFields.forEach(field => {
        field.style.display = 'none';
        // Remove required
        departmentSelect.removeAttribute('required');
        departmentSelect.value = '';
        clearFieldError(departmentSelect);
      });
    } else if (userType === 'staff') {
      // Show staff fields
      staffFields.forEach(field => {
        field.style.display = 'block';
        // Make them required
        departmentSelect.setAttribute('required', 'required');
      });
      
      // Hide student fields
      studentFields.forEach(field => {
        field.style.display = 'none';
        // Remove required
        yearSelect.removeAttribute('required');
        courseSelect.removeAttribute('required');
        yearSelect.value = '';
        courseSelect.value = '';
        clearFieldError(yearSelect);
        clearFieldError(courseSelect);
      });
    }
  });

  // Form submission handling
  registrationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    if (validateForm()) {
      // Show loading state
      showLoadingState();
      
      // Collect form data
      const formData = collectFormData();
      console.log('Form Data:', formData);
      
      // Simulate API call
      setTimeout(() => {
        showSuccessState();
        
        // Redirect after success message
        setTimeout(() => {
          window.location.href = '../HTML/passwordcreation.html';
        }, 1500);
      }, 1500);
    } else {
      // Shake form on validation error
      shakeForm();
    }
  });

  // Collect form data
  function collectFormData() {
    const userType = userTypeSelect.value;
    const data = {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      gender: document.getElementById('gender').value,
      userType: userType
    };
    
    if (userType === 'student') {
      data.year = yearSelect.value;
      data.course = courseSelect.value;
    } else if (userType === 'staff') {
      data.department = departmentSelect.value;
    }
    
    return data;
  }

  // Form Validation
  function validateForm() {
    let isValid = true;
    
    // Clear all previous errors
    clearAllErrors();
    
    // Validate Full Name
    const fullName = document.getElementById('fullName');
    if (!fullName.value.trim()) {
      showError(fullName, 'Full name is required');
      isValid = false;
    } else if (!isValidName(fullName.value.trim())) {
      showError(fullName, 'Please enter a valid name (letters and spaces only, 2-50 characters)');
      isValid = false;
    }
    
    // Validate Email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate Phone
    const phone = document.getElementById('phone');
    if (!phone.value.trim()) {
      showError(phone, 'Phone number is required');
      isValid = false;
    } else if (!isValidPhone(phone.value.trim())) {
      showError(phone, 'Please enter a valid 8-digit phone number');
      isValid = false;
    }
    
    // Validate Gender
    const gender = document.getElementById('gender');
    if (!gender.value) {
      showError(gender, 'Please select your gender');
      isValid = false;
    }
    
    // Validate User Type
    const userType = userTypeSelect;
    if (!userType.value) {
      showError(userType, 'Please select user type');
      isValid = false;
    }
    
    // Validate conditional fields
    if (userType.value === 'student') {
      if (!yearSelect.value) {
        showError(yearSelect, 'Please select your year');
        isValid = false;
      }
      if (!courseSelect.value) {
        showError(courseSelect, 'Please select your course');
        isValid = false;
      }
    } else if (userType.value === 'staff') {
      if (!departmentSelect.value) {
        showError(departmentSelect, 'Please select your department');
        isValid = false;
      }
    }
    
    return isValid;
  }

  // Validation Helper Functions
  function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\d{8}$/;
    return phoneRegex.test(phone);
  }

  // Error Display Functions
  function showError(field, message) {
    field.classList.add('is-invalid');
    
    // Handle input-group fields
    const inputGroup = field.closest('.input-group');
    const container = inputGroup || field.parentElement;
    
    // Remove existing error message
    const existingError = container.querySelector('.invalid-feedback');
    if (existingError) {
      existingError.remove();
    }
    
    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.style.display = 'block';
    errorElement.textContent = message;
    
    container.appendChild(errorElement);
  }

  function clearFieldError(field) {
    field.classList.remove('is-invalid');
    field.classList.remove('is-valid');
    
    const inputGroup = field.closest('.input-group');
    const container = inputGroup || field.parentElement;
    
    const errorElement = container.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.remove();
    }
  }

  function clearAllErrors() {
    const invalidFields = registrationForm.querySelectorAll('.is-invalid');
    const errorMessages = registrationForm.querySelectorAll('.invalid-feedback');
    
    invalidFields.forEach(field => {
      field.classList.remove('is-invalid');
      field.classList.remove('is-valid');
    });
    
    errorMessages.forEach(error => error.remove());
  }

  // Real-time Validation on Blur
  const formInputs = registrationForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select');
  
  formInputs.forEach(input => {
    // Validate on blur if field has value
    input.addEventListener('blur', function () {
      if (this.value.trim() || this.hasAttribute('required')) {
        validateSingleField(this);
      }
    });
    
    // Clear error on input
    input.addEventListener('input', function () {
      if (this.classList.contains('is-invalid')) {
        clearFieldError(this);
      }
    });
    
    // For select elements, validate on change
    if (this.tagName === 'SELECT') {
      input.addEventListener('change', function () {
        validateSingleField(this);
      });
    }
  });

  // Single Field Validation
  function validateSingleField(field) {
    const fieldId = field.id;
    let isValid = true;
    
    clearFieldError(field);
    
    switch (fieldId) {
      case 'fullName':
        if (!field.value.trim()) {
          showError(field, 'Full name is required');
          isValid = false;
        } else if (!isValidName(field.value.trim())) {
          showError(field, 'Please enter a valid name (letters and spaces only, 2-50 characters)');
          isValid = false;
        }
        break;
        
      case 'email':
        if (!field.value.trim()) {
          showError(field, 'Email is required');
          isValid = false;
        } else if (!isValidEmail(field.value.trim())) {
          showError(field, 'Please enter a valid email address');
          isValid = false;
        }
        break;
        
      case 'phone':
        if (!field.value.trim()) {
          showError(field, 'Phone number is required');
          isValid = false;
        } else if (!isValidPhone(field.value.trim())) {
          showError(field, 'Please enter a valid 8-digit phone number');
          isValid = false;
        }
        break;
        
      case 'gender':
      case 'userType':
      case 'year':
      case 'course':
      case 'department':
        if (field.hasAttribute('required') && !field.value) {
          showError(field, 'This field is required');
          isValid = false;
        }
        break;
    }
    
    if (isValid && field.value.trim()) {
      field.classList.add('is-valid');
      setTimeout(() => {
        field.classList.remove('is-valid');
      }, 2000);
    }
    
    return isValid;
  }

  // Button State Functions
  function showLoadingState() {
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      <span class="btn-text">Processing...</span>
    `;
  }

  function showSuccessState() {
    submitButton.innerHTML = `
      <i class="fas fa-check-circle me-2"></i>
      <span class="btn-text">Success!</span>
    `;
    submitButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
  }

  function resetButtonState() {
    submitButton.disabled = false;
    submitButton.innerHTML = `
      <span class="btn-text">Continue</span>
      <i class="fas fa-arrow-right ms-2"></i>
    `;
    submitButton.style.background = 'linear-gradient(135deg, #45686e 0%, #2c5f6f 100%)';
  }

  // Form Animation Functions
  function shakeForm() {
    const card = document.querySelector('.registration-card');
    card.classList.add('shake');
    
    setTimeout(() => {
      card.classList.remove('shake');
    }, 500);
  }

  // Input Enhancement - Hover Effects
  formInputs.forEach(input => {
    input.addEventListener('mouseenter', function () {
      if (!this.classList.contains('is-invalid') && !this.matches(':focus')) {
        this.style.boxShadow = '0 4px 12px rgba(69, 104, 110, 0.15)';
      }
    });
    
    input.addEventListener('mouseleave', function () {
      if (!this.matches(':focus')) {
        this.style.boxShadow = '';
      }
    });
  });

  // Phone Number Input - Allow only digits
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 8) {
      this.value = this.value.slice(0, 8);
    }
  });

  // Full Name Input - Allow only letters and spaces
  const fullNameInput = document.getElementById('fullName');
  fullNameInput.addEventListener('input', function (e) {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
  });

  // Prevent form submission on Enter key except on submit button
  registrationForm.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
    }
  });

  // Add smooth scroll to first error
  function scrollToFirstError() {
    const firstError = registrationForm.querySelector('.is-invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
  }

  // Auto-capitalize first letter of each word in full name
  fullNameInput.addEventListener('blur', function () {
    if (this.value) {
      this.value = this.value
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  });

  // Email input - Convert to lowercase
  const emailInput = document.getElementById('email');
  emailInput.addEventListener('blur', function () {
    this.value = this.value.toLowerCase().trim();
  });

  // Add CSS for animations dynamically
  const style = document.createElement('style');
  style.textContent = `
    .is-valid {
      border-color: #28a745 !important;
    }
    
    .is-valid:focus {
      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
    }
  `;
  document.head.appendChild(style);

  // Console log for debugging
  console.log('Registration form initialized successfully');
});