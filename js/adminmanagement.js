// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const addAdminForm = document.getElementById('add-admin-form');
const adminsList = document.getElementById('admins-list');
const adminSearch = document.getElementById('admin-search');
const adminCount = document.getElementById('admin-count');

// Modals
const editModal = document.getElementById('edit-modal');
const passwordModal = document.getElementById('password-modal');
const deleteModal = document.getElementById('delete-modal');

// Sample Admins Data
let admins = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@jnecfitness.com",
        role: "super",
        permissions: ["members", "equipment", "schedule", "announcements", "reports", "settings"],
        status: "active",
        created: "2025-01-15T10:30:00",
        lastLogin: "2025-10-20T14:25:00"
    },
    {
        id: 2,
        name: "Tshering Dorji",
        email: "tshering@jnecfitness.com",
        role: "manager",
        permissions: ["members", "equipment", "schedule", "announcements"],
        status: "active",
        created: "2025-03-20T09:15:00",
        lastLogin: "2025-10-19T16:45:00"
    },
    {
        id: 3,
        name: "Dechen Wangmo",
        email: "dechen@jnecfitness.com",
        role: "support",
        permissions: ["members", "schedule"],
        status: "active",
        created: "2025-06-10T14:20:00",
        lastLogin: "2025-10-20T11:30:00"
    },
    {
        id: 4,
        name: "Karma Tenzin",
        email: "karma@jnecfitness.com",
        role: "support",
        permissions: ["equipment", "announcements"],
        status: "inactive",
        created: "2025-08-05T16:45:00",
        lastLogin: "2025-09-15T13:20:00"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadAdmins();
    updateAdminCount();
});

function initializePage() {
    // Set up password strength indicators
    setupPasswordStrength('admin-password', 'password-strength-fill', 'password-strength-text');
    setupPasswordStrength('new-password', 'new-password-strength-fill', 'new-password-strength-text');
    
    // Set up password confirmation
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordMatch = document.getElementById('password-match');
    
    confirmPassword.addEventListener('input', function() {
        if (newPassword.value && confirmPassword.value) {
            if (newPassword.value === confirmPassword.value) {
                passwordMatch.classList.add('show');
            } else {
                passwordMatch.classList.remove('show');
            }
        } else {
            passwordMatch.classList.remove('show');
        }
    });
}

function setupEventListeners() {
    // Menu Toggle
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // Add Admin Form
    addAdminForm.addEventListener('submit', handleAddAdmin);
    
    // Password Toggles - Initialize with slash eye
    document.getElementById('toggle-password').innerHTML = '<i class="fas fa-eye-slash"></i>';
    document.getElementById('toggle-new-password').innerHTML = '<i class="fas fa-eye-slash"></i>';
    document.getElementById('toggle-confirm-password').innerHTML = '<i class="fas fa-eye-slash"></i>';
    
    // Password Toggle Event Listeners
    document.getElementById('toggle-password').addEventListener('click', function() {
        togglePasswordVisibility('admin-password', this);
    });
    
    document.getElementById('toggle-new-password').addEventListener('click', function() {
        togglePasswordVisibility('new-password', this);
    });
    
    document.getElementById('toggle-confirm-password').addEventListener('click', function() {
        togglePasswordVisibility('confirm-password', this);
    });
    
    // Search Functionality
    adminSearch.addEventListener('input', handleAdminSearch);
    
    // Modal Close Buttons
    document.getElementById('close-edit-modal').addEventListener('click', () => closeModal(editModal));
    document.getElementById('close-password-modal').addEventListener('click', () => closeModal(passwordModal));
    document.getElementById('close-delete-modal').addEventListener('click', () => closeModal(deleteModal));
    
    // Modal Cancel Buttons
    document.getElementById('cancel-edit').addEventListener('click', () => closeModal(editModal));
    document.getElementById('cancel-password').addEventListener('click', () => closeModal(passwordModal));
    document.getElementById('cancel-delete').addEventListener('click', () => closeModal(deleteModal));
    
    // Modal Save Buttons
    document.getElementById('save-edit').addEventListener('click', handleSaveEdit);
    document.getElementById('save-password').addEventListener('click', handleSavePassword);
    document.getElementById('confirm-delete').addEventListener('click', handleDeleteAdmin);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleSidebar();
            }
        }
    });
}

function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

function setupPasswordStrength(passwordFieldId, strengthFillId, strengthTextId) {
    const passwordField = document.getElementById(passwordFieldId);
    const strengthFill = document.getElementById(strengthFillId);
    const strengthText = document.getElementById(strengthTextId);
    
    passwordField.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthFill.className = 'strength-fill ' + strength.level;
        strengthFill.style.width = strength.percentage + '%';
        
        // Update strength text
        strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
        strengthText.className = 'strength-text ' + strength.level;
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { level: 'weak', percentage: 33 };
    if (score <= 4) return { level: 'medium', percentage: 66 };
    return { level: 'strong', percentage: 100 };
}

function togglePasswordVisibility(passwordFieldId, toggleButton) {
    const passwordField = document.getElementById(passwordFieldId);
    const icon = toggleButton.querySelector('i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'fas fa-eye'; // Remove slash when password is visible
    } else {
        passwordField.type = 'password';
        icon.className = 'fas fa-eye-slash'; // Add slash when password is hidden
    }
}

function handleAddAdmin(e) {
    e.preventDefault();
    
    const name = document.getElementById('admin-name').value;
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const role = document.getElementById('admin-role').value;
    
    // Get selected permissions
    const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]:checked');
    const permissions = Array.from(permissionCheckboxes).map(cb => cb.value);
    
    // Create new admin object
    const newAdmin = {
        id: admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1,
        name,
        email,
        role,
        permissions,
        status: "active",
        created: new Date().toISOString(),
        lastLogin: null
    };
    
    // Add to admins array
    admins.push(newAdmin);
    
    // Reload admins list
    loadAdmins();
    updateAdminCount();
    
    // Reset form
    addAdminForm.reset();
    
    // Reset password toggle to default state
    document.getElementById('toggle-password').innerHTML = '<i class="fas fa-eye-slash"></i>';
    
    // Show success notification
    showNotification('Admin added successfully!');
}

function loadAdmins(filteredAdmins = null) {
    const adminsToDisplay = filteredAdmins || admins;
    adminsList.innerHTML = '';
    
    if (adminsToDisplay.length === 0) {
        adminsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-shield"></i>
                <h3>No Admins Found</h3>
                <p>Add your first admin to get started.</p>
            </div>
        `;
        return;
    }
    
    // Create admin cards
    adminsToDisplay.forEach(admin => {
        const adminElement = document.createElement('div');
        adminElement.className = 'admin-item';
        adminElement.innerHTML = `
            <div class="admin-avatar ${admin.role}">${getInitials(admin.name)}</div>
            <div class="admin-info">
                <div class="admin-name">${admin.name}</div>
                <div class="admin-details">
                    <span class="admin-email">
                        <i class="fas fa-envelope"></i> ${admin.email}
                    </span>
                    <span class="admin-role role-${admin.role}">
                        <i class="fas ${getRoleIcon(admin.role)}"></i>
                        ${getRoleLabel(admin.role)}
                    </span>
                    <span class="admin-status status-${admin.status}">
                        <i class="fas ${admin.status === 'active' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${admin.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    ${admin.lastLogin ? `
                        <span class="last-login">
                            <i class="fas fa-clock"></i> Last login: ${formatDate(admin.lastLogin)}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="admin-actions">
                <button class="btn btn-sm btn-secondary edit-admin" data-id="${admin.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-secondary change-password" data-id="${admin.id}">
                    <i class="fas fa-key"></i> Password
                </button>
                ${admin.id !== 1 ? `
                    <button class="btn btn-sm btn-danger delete-admin" data-id="${admin.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                ` : ''}
            </div>
        `;
        
        adminsList.appendChild(adminElement);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-admin').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openEditModal(id);
        });
    });
    
    document.querySelectorAll('.change-password').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openPasswordModal(id);
        });
    });
    
    document.querySelectorAll('.delete-admin').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openDeleteModal(id);
        });
    });
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getRoleIcon(role) {
    switch(role) {
        case 'super': return 'fa-crown';
        case 'manager': return 'fa-user-tie';
        case 'support': return 'fa-headset';
        default: return 'fa-user';
    }
}

function getRoleLabel(role) {
    switch(role) {
        case 'super': return 'Super Admin';
        case 'manager': return 'Manager';
        case 'support': return 'Support Staff';
        default: return 'Admin';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function updateAdminCount() {
    const count = admins.length;
    adminCount.textContent = `${count} Admin${count !== 1 ? 's' : ''}`;
}

function handleAdminSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
        const filteredAdmins = admins.filter(admin => 
            admin.name.toLowerCase().includes(searchTerm) ||
            admin.email.toLowerCase().includes(searchTerm) ||
            getRoleLabel(admin.role).toLowerCase().includes(searchTerm)
        );
        loadAdmins(filteredAdmins);
    } else {
        loadAdmins();
    }
}

function openEditModal(id) {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;
    
    // Populate form with admin data
    document.getElementById('edit-admin-id').value = admin.id;
    document.getElementById('edit-admin-name').value = admin.name;
    document.getElementById('edit-admin-email').value = admin.email;
    document.getElementById('edit-admin-role').value = admin.role;
    
    // Set permissions
    const permissionCheckboxes = document.querySelectorAll('input[name="edit-permissions"]');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.checked = admin.permissions.includes(checkbox.value);
    });
    
    // Show modal
    editModal.classList.add('active');
}

function openPasswordModal(id) {
    document.getElementById('password-admin-id').value = id;
    
    // Reset password fields
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('password-match').classList.remove('show');
    
    // Reset strength indicators
    document.getElementById('new-password-strength-fill').className = 'strength-fill';
    document.getElementById('new-password-strength-fill').style.width = '0%';
    document.getElementById('new-password-strength-text').textContent = 'Weak';
    document.getElementById('new-password-strength-text').className = 'strength-text';
    
    // Reset toggle buttons to default state
    document.getElementById('toggle-new-password').innerHTML = '<i class="fas fa-eye-slash"></i>';
    document.getElementById('toggle-confirm-password').innerHTML = '<i class="fas fa-eye-slash"></i>';
    
    // Show modal
    passwordModal.classList.add('active');
}

function openDeleteModal(id) {
    deleteModal.setAttribute('data-id', id);
    deleteModal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

function handleSaveEdit() {
    const id = parseInt(document.getElementById('edit-admin-id').value);
    const name = document.getElementById('edit-admin-name').value;
    const email = document.getElementById('edit-admin-email').value;
    const role = document.getElementById('edit-admin-role').value;
    
    // Get selected permissions
    const permissionCheckboxes = document.querySelectorAll('input[name="edit-permissions"]:checked');
    const permissions = Array.from(permissionCheckboxes).map(cb => cb.value);
    
    // Update admin in array
    const adminIndex = admins.findIndex(a => a.id === id);
    if (adminIndex !== -1) {
        admins[adminIndex] = {
            ...admins[adminIndex],
            name,
            email,
            role,
            permissions
        };
        
        // Reload admins
        loadAdmins();
        
        // Close modal
        closeModal(editModal);
        
        // Show notification
        showNotification('Admin updated successfully!');
    }
}

function handleSavePassword() {
    const id = parseInt(document.getElementById('password-admin-id').value);
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Validate password strength
    const strength = calculatePasswordStrength(newPassword);
    if (strength.level === 'weak') {
        showNotification('Please choose a stronger password!', 'error');
        return;
    }
    
    // In a real application, you would send this to your backend
    // For this demo, we'll just show a success message
    
    // Close modal
    closeModal(passwordModal);
    
    // Show notification
    showNotification('Password updated successfully!');
}

function handleDeleteAdmin() {
    const id = parseInt(deleteModal.getAttribute('data-id'));
    
    // Don't allow deleting the first super admin (id: 1)
    if (id === 1) {
        showNotification('Cannot delete the primary super admin!', 'error');
        closeModal(deleteModal);
        return;
    }
    
    // Remove admin from array
    admins = admins.filter(a => a.id !== id);
    
    // Reload admins
    loadAdmins();
    updateAdminCount();
    
    // Close modal
    closeModal(deleteModal);
    
    // Show notification
    showNotification('Admin removed successfully');
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 32px;
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${type === 'success' ? '#48bb78' : '#e53e3e'};
        z-index: 1001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}