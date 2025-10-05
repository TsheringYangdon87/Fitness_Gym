// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Toggle sidebar on mobile
mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
});

// Close sidebar when clicking on overlay
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Avatar Upload Functionality
const avatarInput = document.getElementById('avatarInput');
const avatarImage = document.getElementById('avatarImage');
const avatarPlaceholder = document.getElementById('avatarPlaceholder');
const removeAvatar = document.getElementById('removeAvatar');
const avatarPreview = document.getElementById('avatarPreview');

// Handle avatar upload
avatarInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarImage.src = e.target.result;
            avatarImage.style.display = 'block';
            avatarPlaceholder.style.display = 'none';
            removeAvatar.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
});

// Handle avatar removal
removeAvatar.addEventListener('click', function(e) {
    e.preventDefault();
    avatarInput.value = '';
    avatarImage.style.display = 'none';
    avatarPlaceholder.style.display = 'flex';
    removeAvatar.style.display = 'none';
});

// User Type Change Handler
const userTypeSelect = document.getElementById('userType');
const dynamicFieldGroup = document.getElementById('dynamicFieldGroup');
const dynamicFieldLabel = document.getElementById('dynamicFieldLabel');
const dynamicField = document.getElementById('dynamicField');
const courseFieldGroup = document.getElementById('courseFieldGroup');
const departmentFieldGroup = document.getElementById('departmentFieldGroup');
const courseSelect = document.getElementById('course');
const departmentSelect = document.getElementById('department');

// Handle user type change
userTypeSelect.addEventListener('change', function() {
    const userType = this.value;
    
    if (userType === 'student') {
        // Show year and course fields for students
        dynamicFieldGroup.style.display = 'block';
        dynamicFieldLabel.textContent = 'Year';
        
        // Clear and populate year options
        dynamicField.innerHTML = `
            <option value="" disabled selected>Select Year</option>
            <option value="1st-year">1st Year</option>
            <option value="2nd-year">2nd Year</option>
            <option value="3rd-year">3rd Year</option>
            <option value="4th-year">4th Year</option>
        `;
        
        // Show course field, hide department
        courseFieldGroup.style.display = 'block';
        departmentFieldGroup.style.display = 'none';
        
        // Make course required, department not required
        courseSelect.required = true;
        departmentSelect.required = false;
        departmentSelect.value = '';
        
    } else if (userType === 'staff') {
        // Hide year field for staff
        dynamicFieldGroup.style.display = 'none';
        dynamicField.value = '';
        dynamicField.required = false;
        
        // Show department field, hide course
        departmentFieldGroup.style.display = 'block';
        courseFieldGroup.style.display = 'none';
        
        // Make department required, course not required
        departmentSelect.required = true;
        courseSelect.required = false;
        courseSelect.value = '';
    }
    
    // Update select colors
    updateSelectColors();
});

// Form Submission
const editProfileForm = document.getElementById('editProfileForm');

editProfileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const gender = document.getElementById('gender').value;
    const userType = userTypeSelect.value;
    
    // Basic validation
    if (!fullName || !email || !phoneNumber || !gender || !userType) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Phone number validation (Bhutan format - 8 digits)
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
        showNotification('Please enter a valid 8-digit phone number', 'error');
        return;
    }
    
    // User type specific validation
    if (userType === 'student') {
        const year = dynamicField.value;
        const course = courseSelect.value;
        
        if (!year || !course) {
            showNotification('Please select your year and course', 'error');
            return;
        }
    } else if (userType === 'staff') {
        const department = departmentSelect.value;
        
        if (!department) {
            showNotification('Please select your department', 'error');
            return;
        }
    }
    
    // Simulate form submission
    const submitButton = editProfileForm.querySelector('.btn-save');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('Profile updated successfully!', 'success');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        formHasChanges = false;
        
        // In a real application, you would redirect or update the UI here
        // setTimeout(() => {
        //     window.location.href = 'setting.html';
        // }, 1500);
    }, 2000);
});

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 32px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#2d3748'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    // Add animation styles if not already added
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Enhanced select dropdown styling
function updateSelectColors() {
    document.querySelectorAll('.custom-select select').forEach(select => {
        if (select.value) {
            select.style.color = 'var(--text-primary)';
        } else {
            select.style.color = 'var(--text-secondary)';
        }
    });
}

document.querySelectorAll('.custom-select select').forEach(select => {
    select.addEventListener('change', updateSelectColors);
});

// Track form changes
let formHasChanges = false;

editProfileForm.addEventListener('input', function() {
    formHasChanges = true;
});

// Handle back button with confirmation
const backButton = document.querySelector('.back-button');
const cancelButton = document.querySelector('.btn-cancel');

function handleNavigation(e) {
    if (formHasChanges) {
        const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmLeave) {
            e.preventDefault();
            return false;
        }
    }
    return true;
}

backButton.addEventListener('click', function(e) {
    if (formHasChanges) {
        e.preventDefault();
        const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (confirmLeave) {
            formHasChanges = false;
            window.history.back();
        }
    }
});

cancelButton.addEventListener('click', function(e) {
    if (formHasChanges) {
        e.preventDefault();
        const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
        if (confirmLeave) {
            formHasChanges = false;
            window.history.back();
        }
    } else {
        window.history.back();
    }
});

// Warn before leaving page
window.addEventListener('beforeunload', function(e) {
    if (formHasChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Close sidebar when clicking on nav items (mobile)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Initialize form state
document.addEventListener('DOMContentLoaded', function() {
    // Set initial values (in a real app, this would come from an API)
    document.getElementById('fullName').value = 'Tshewang Dorji';
    document.getElementById('email').value = '05240156.jnec@rub.edu.bt';
    document.getElementById('phoneNumber').value = '77123456';
    document.getElementById('gender').value = 'male';
    document.getElementById('userType').value = 'student';
    
    // Trigger user type change to show appropriate fields
    userTypeSelect.dispatchEvent(new Event('change'));
    
    // Set student-specific values
    document.getElementById('dynamicField').value = '2nd-year';
    document.getElementById('course').value = 'csn';
    document.getElementById('fitnessGoal').value = 'muscle-gain';
    document.getElementById('experienceLevel').value = 'intermediate';
    
    // Update select colors
    updateSelectColors();
    
    // Reset form change tracking after initialization
    setTimeout(() => {
        formHasChanges = false;
    }, 100);
});