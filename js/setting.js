// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Close sidebar when clicking on a nav link (mobile)
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Modal close buttons
const modalCloseButtons = document.querySelectorAll('.modal-close');
modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        closeModal(modalId);
    });
});

// Close modal when clicking outside
const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Edit Profile Button
const editProfileBtn = document.getElementById('editProfileBtn');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        showNotification('Edit Profile feature coming soon!', 'info');
    });
}

// Change Password Button
const changePasswordBtn = document.getElementById('changePasswordBtn');
if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        showNotification('Redirecting to change password page...', 'info');
        // setTimeout(() => {
        //     window.location.href = '../html/changepassword.html';
        // }, 1000);
    });
}

// Pricing Configuration
const pricingBtn = document.getElementById('pricingBtn');
if (pricingBtn) {
    pricingBtn.addEventListener('click', () => {
        openModal('pricingModal');
    });
}

const savePricingBtn = document.getElementById('savePricingBtn');
if (savePricingBtn) {
    savePricingBtn.addEventListener('click', () => {
        showNotification('Pricing updated successfully!', 'success');
        closeModal('pricingModal');
    });
}

// About System Button
const aboutSystemBtn = document.getElementById('aboutSystemBtn');
if (aboutSystemBtn) {
    aboutSystemBtn.addEventListener('click', () => {
        openModal('aboutSystemModal');
    });
}

// Data Management Buttons
const backupBtn = document.getElementById('backupBtn');
if (backupBtn) {
    backupBtn.addEventListener('click', () => {
        showNotification('Preparing data backup...', 'info');
        setTimeout(() => {
            showNotification('Backup completed successfully!', 'success');
        }, 2000);
    });
}

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        showNotification('Exporting reports...', 'info');
        setTimeout(() => {
            showNotification('Reports exported successfully!', 'success');
        }, 2000);
    });
}

const clearCacheBtn = document.getElementById('clearCacheBtn');
if (clearCacheBtn) {
    clearCacheBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the system cache?')) {
            showNotification('Clearing cache...', 'info');
            setTimeout(() => {
                showNotification('Cache cleared successfully!', 'success');
            }, 1500);
        }
    });
}

// Danger Zone Actions
const deleteInactiveBtn = document.getElementById('deleteInactiveBtn');
if (deleteInactiveBtn) {
    deleteInactiveBtn.addEventListener('click', () => {
        if (confirm('WARNING: This will permanently delete all inactive members. This action cannot be undone. Are you sure?')) {
            showNotification('Deleting inactive members...', 'info');
            setTimeout(() => {
                showNotification('Inactive members deleted successfully!', 'success');
            }, 2000);
        }
    });
}

const resetSettingsBtn = document.getElementById('resetSettingsBtn');
if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', () => {
        if (confirm('WARNING: This will reset all system settings to default values. Are you sure?')) {
            showNotification('Resetting settings...', 'info');
            setTimeout(() => {
                showNotification('Settings reset to default!', 'success');
                location.reload();
            }, 2000);
        }
    });
}

// Logout Button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = '../html/loginpage.html';
            }, 1000);
        }
    });
}

// Toggle Switches - Save state
const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const label = e.target.closest('.settings-item').querySelector('h4').textContent;
        const status = e.target.checked ? 'enabled' : 'disabled';
        showNotification(`${label} ${status}!`, 'success');
    });
});

// Max Capacity Input
const maxCapacityInput = document.getElementById('maxCapacity');
if (maxCapacityInput) {
    maxCapacityInput.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value < 1) {
            e.target.value = 1;
            showNotification('Minimum capacity is 1 member', 'warning');
        } else if (value > 50) {
            e.target.value = 50;
            showNotification('Maximum capacity is 50 members', 'warning');
        } else {
            showNotification(`Slot capacity updated to ${value} members`, 'success');
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 32px;
        background: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1200;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#48bb78',
        error: '#e53e3e',
        warning: '#ed8936',
        info: '#4299e1'
    };
    return colors[type] || colors.info;
}

// Add notification animations to head
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-success .notification-content i {
        color: #48bb78;
    }
    
    .notification-error .notification-content i {
        color: #e53e3e;
    }
    
    .notification-warning .notification-content i {
        color: #ed8936;
    }
    
    .notification-info .notification-content i {
        color: #4299e1;
    }
    
    .notification-content span {
        color: #1a202c;
        font-size: 14px;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const settingsItems = document.querySelectorAll('.settings-item');
        
        settingsItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const section = item.closest('.settings-section');
            
            if (text.includes(searchTerm)) {
                item.style.display = 'flex';
                section.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide sections with no visible items
        const sections = document.querySelectorAll('.settings-section');
        sections.forEach(section => {
            const visibleItems = section.querySelectorAll('.settings-item[style*="display: flex"]');
            if (visibleItems.length === 0 && searchTerm !== '') {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin Settings page loaded successfully');
});