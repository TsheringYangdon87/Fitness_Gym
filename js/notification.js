// Notification System
const notificationDropdown = document.getElementById('notification-dropdown');
const notificationList = document.getElementById('notification-list');
const markAllReadBtn = document.getElementById('mark-all-read');

// Sample Notifications Data
let notifications = [
    {
        id: 1,
        type: 'email',
        icon: 'fa-envelope',
        title: 'Email Notifications',
        message: 'Receive admin alerts via email',
        time: '2 minutes ago',
        unread: true
    },
    {
        id: 2,
        type: 'member',
        icon: 'fa-user-plus',
        title: 'New Member Alerts',
        message: 'Get notified when new members register',
        time: '15 minutes ago',
        unread: true
    },
    {
        id: 3,
        type: 'feedback',
        icon: 'fa-comment-dots',
        title: 'Feedback Notifications',
        message: 'Alert when members submit feedback',
        time: '1 hour ago',
        unread: true
    },
    {
        id: 4,
        type: 'maintenance',
        icon: 'fa-exclamation-triangle',
        title: 'Equipment Maintenance Alerts',
        message: 'Notify about equipment requiring maintenance',
        time: '2 hours ago',
        unread: false
    },
    {
        id: 5,
        type: 'member',
        icon: 'fa-user-check',
        title: 'Membership Renewal',
        message: 'Tshering\'s membership expires in 3 days',
        time: '3 hours ago',
        unread: false
    },
    {
        id: 6,
        type: 'warning',
        icon: 'fa-exclamation-circle',
        title: 'Slot Capacity Warning',
        message: 'Evening slot is 90% full',
        time: '5 hours ago',
        unread: false
    }
];

// Initialize notification system
function initNotificationSystem() {
    loadNotifications();
    updateNotificationBadge();
}

// Load notifications into dropdown
function loadNotifications() {
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="no-notifications">
                <i class="far fa-bell-slash"></i>
                <p>No notifications</p>
            </div>
        `;
        return;
    }

    notificationList.innerHTML = '';
    
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.unread ? 'unread' : ''}`;
        notificationElement.setAttribute('data-id', notification.id);
        
        notificationElement.innerHTML = `
            <div class="notification-icon ${notification.type}">
                <i class="fas ${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        
        // Add click event to mark as read
        notificationElement.addEventListener('click', function() {
            markNotificationAsRead(notification.id);
        });
        
        notificationList.appendChild(notificationElement);
    });
}

// Toggle notification dropdown
notificationBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.remove('active');
    }
});

// Mark single notification as read
function markNotificationAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.unread = false;
        loadNotifications();
        updateNotificationBadge();
    }
}

// Mark all notifications as read
markAllReadBtn.addEventListener('click', function() {
    notifications.forEach(notification => {
        notification.unread = false;
    });
    loadNotifications();
    updateNotificationBadge();
});

// Update notification badge count
function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => n.unread).length;
    const badge = document.querySelector('.notification-badge');
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Add new notification (for demo purposes)
function addNotification(type, icon, title, message) {
    const newNotification = {
        id: Date.now(),
        type: type,
        icon: icon,
        title: title,
        message: message,
        time: 'Just now',
        unread: true
    };
    
    notifications.unshift(newNotification);
    loadNotifications();
    updateNotificationBadge();
    
    // Show toast notification
    showNotification(`New: ${title}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initNotificationSystem();
});