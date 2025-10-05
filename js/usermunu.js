// User Menu System
const userMenuDropdown = document.getElementById('user-menu-dropdown');
const userProfileBtn = document.getElementById('user-profile');

// User menu items
const userMenuItems = document.querySelectorAll('.user-menu-item');

// Toggle user menu dropdown
userProfileBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Close notification dropdown if open
    const notificationDropdown = document.getElementById('notification-dropdown');
    if (notificationDropdown && notificationDropdown.classList.contains('active')) {
        notificationDropdown.classList.remove('active');
    }
    
    userMenuDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!userMenuDropdown.contains(e.target) && !userProfileBtn.contains(e.target)) {
        userMenuDropdown.classList.remove('active');
    }
});

// Handle menu item clicks
userMenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.getAttribute('data-action');
        handleUserMenuAction(action);
    });
});

// Handle different menu actions
function handleUserMenuAction(action) {
    switch(action) {
        case 'profile':
            showNotification('Opening profile page...');
            // Navigate to profile page
            setTimeout(() => {
                // window.location.href = 'profile.html';
            }, 500);
            break;
            
        case 'settings':
            showNotification('Opening account settings...');
            // Navigate to settings page
            setTimeout(() => {
                window.location.href = 'setting.html';
            }, 500);
            break;
            
        case 'notifications':
            showNotification('Opening notification settings...');
            // Open notification settings modal or page
            break;
            
        case 'security':
            showNotification('Opening security settings...');
            // Open security settings modal or page
            break;
            
        case 'activity':
            showNotification('Loading activity log...');
            // Open activity log modal or page
            break;
            
        case 'help':
            showNotification('Opening help center...');
            // Open help documentation
            break;
            
        default:
            console.log('Unknown action:', action);
    }
    
    // Close the menu after action
    userMenuDropdown.classList.remove('active');
}

// Update user info (can be called when user data is loaded)
function updateUserMenuInfo(name, email, avatarInitials) {
    const userMenuAvatar = document.querySelector('.user-menu-avatar');
    const userMenuName = document.querySelector('.user-menu-info h3');
    const userMenuEmail = document.querySelector('.user-menu-info p');
    const topbarAvatar = document.querySelector('.user-avatar');
    const topbarName = document.querySelector('.user-name');
    
    if (userMenuAvatar) userMenuAvatar.textContent = avatarInitials;
    if (userMenuName) userMenuName.textContent = name;
    if (userMenuEmail) userMenuEmail.textContent = email;
    if (topbarAvatar) topbarAvatar.textContent = avatarInitials;
    if (topbarName) topbarName.textContent = name;
}

// Load user data (example - replace with actual API call)
function loadUserData() {
    // Example user data - replace with actual API call
    const userData = {
        name: 'Admin User',
        email: 'admin@jnecfitness.com',
        avatarInitials: 'AD',
        role: 'Administrator'
    };
    
    updateUserMenuInfo(userData.name, userData.email, userData.avatarInitials);
}

// Initialize user menu
function initUserMenu() {
    loadUserData();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initUserMenu();
});

// Export functions for use in other scripts
window.userMenuFunctions = {
    updateUserMenuInfo,
    loadUserData
};