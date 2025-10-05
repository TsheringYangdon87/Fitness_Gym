// Sample notifications data
const notificationsData = [
    {
        id: 1,
        type: 'equipment',
        icon: 'fas fa-dumbbell',
        title: 'New Equipment Arrival',
        message: 'The gym coordinator has added a new Elliptical Machine to the cardio section. Available for use starting tomorrow.',
        time: '2 hours ago',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false
    },
    {
        id: 2,
        type: 'reminder',
        icon: 'far fa-clock',
        title: 'Membership Renewal Reminder',
        message: 'Your membership expires in 31 days (Nov 30, 2025). Renew now to continue enjoying uninterrupted access.',
        time: '5 hours ago',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isRead: false
    },
    {
        id: 3,
        type: 'announcement',
        icon: 'fas fa-bullhorn',
        title: 'Extended Opening Hours',
        message: 'Great news! We are now open from 5:00 AM to 11:00 PM on weekdays. Updated schedule effective immediately.',
        time: '1 day ago',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: false
    },
    {
        id: 4,
        type: 'equipment',
        icon: 'fas fa-tools',
        title: 'Equipment Maintenance Complete',
        message: 'Treadmill #2 maintenance has been completed. The equipment is now available for use.',
        time: '1 day ago',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        isRead: true
    },
    {
        id: 5,
        type: 'reminder',
        icon: 'far fa-calendar-check',
        title: 'Scheduled Workout Reminder',
        message: 'You have a workout scheduled for tomorrow at 6:00 AM. Don\'t forget your water bottle!',
        time: '2 days ago',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        isRead: true
    },
    {
        id: 6,
        type: 'payment',
        icon: 'fas fa-dollar-sign',
        title: 'Payment Confirmation',
        message: 'Your membership payment of Nu. 300 has been successfully received. Thank you!',
        time: '2 days ago',
        timestamp: new Date(Date.now() - 50 * 60 * 60 * 1000),
        isRead: true
    },
    {
        id: 7,
        type: 'announcement',
        icon: 'fas fa-star',
        title: 'New Fitness Program Launched',
        message: 'Check out our new 30-day transformation program! Contact the coordinator for details.',
        time: '3 days ago',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        isRead: true
    },
    {
        id: 8,
        type: 'reminder',
        icon: 'fas fa-heartbeat',
        title: 'Workout Streak Achievement',
        message: 'Congratulations! You\'ve maintained a 7-day workout streak. Keep up the great work!',
        time: '4 days ago',
        timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000),
        isRead: true
    },
    {
        id: 9,
        type: 'equipment',
        icon: 'fas fa-plus-circle',
        title: 'New Equipment: Smith Machine',
        message: 'A Smith Machine has been added to the strength training area. Perfect for safe, guided barbell exercises.',
        time: '5 days ago',
        timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000),
        isRead: true
    },
    {
        id: 10,
        type: 'membership',
        icon: 'fas fa-id-card',
        title: 'Membership Activated',
        message: 'Your membership has been successfully activated. Welcome to JNEC Fitness!',
        time: '1 week ago',
        timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000),
        isRead: true
    }
];

let currentFilter = 'all';
let notifications = [...notificationsData];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupSidebarToggle();
    loadNotifications();
    updateNotificationCounts();
    setupTabFilters();
    setupActionButtons();
    setupSearch();
    updateTopbarBadge();
});

// Setup sidebar toggle functionality
function setupSidebarToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Load and display notifications
function loadNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    const emptyState = document.getElementById('empty-state');
    
    let filteredNotifications = notifications;
    
    if (currentFilter === 'unread') {
        filteredNotifications = notifications.filter(n => !n.isRead);
    } else if (currentFilter === 'announcements') {
        filteredNotifications = notifications.filter(n => n.type === 'announcement');
    } else if (currentFilter === 'reminders') {
        filteredNotifications = notifications.filter(n => n.type === 'reminder');
    }
    
    if (filteredNotifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        notificationsList.style.display = 'flex';
        emptyState.style.display = 'none';
        
        notificationsList.innerHTML = filteredNotifications.map(notification => `
            <div class="notification-item ${notification.isRead ? '' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon-wrapper ${notification.type}">
                    <i class="${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        ${!notification.isRead ? '<span class="notification-unread-dot"></span>' : ''}
                        ${notification.title}
                    </div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-footer">
                        <span class="notification-time">
                            <i class="far fa-clock"></i>
                            ${notification.time}
                        </span>
                        <span class="notification-type-badge ${notification.type}">
                            ${notification.type}
                        </span>
                        </div>
                </div>
                <div class="notification-actions-inline">
                    ${!notification.isRead ? `
                        <button class="action-icon-btn mark-read-btn" data-id="${notification.id}" title="Mark as read">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="action-icon-btn delete-btn" data-id="${notification.id}" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to notification items
        attachNotificationListeners();
    }
}

// Attach event listeners to notification items
function attachNotificationListeners() {
    // Mark as read buttons
    document.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            markAsRead(id);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            deleteNotification(id);
        });
    });
    
    // Notification item click
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const notification = notifications.find(n => n.id === id);
            
            if (!notification.isRead) {
                markAsRead(id);
            }
            
            showNotificationDetails(notification);
        });
    });
}

// Update notification counts
function updateNotificationCounts() {
    const allCount = notifications.length;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const announcementsCount = notifications.filter(n => n.type === 'announcement').length;
    const remindersCount = notifications.filter(n => n.type === 'reminder').length;
    
    document.getElementById('all-count').textContent = allCount;
    document.getElementById('unread-count').textContent = unreadCount;
    document.getElementById('announcements-count').textContent = announcementsCount;
    document.getElementById('reminders-count').textContent = remindersCount;
}

// Setup tab filters
function setupTabFilters() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update filter
            currentFilter = this.dataset.filter;
            
            // Reload notifications
            loadNotifications();
        });
    });
}

// Setup action buttons
function setupActionButtons() {
    const markAllReadBtn = document.getElementById('mark-all-read');
    const clearAllBtn = document.getElementById('clear-all');
    
    markAllReadBtn.addEventListener('click', function() {
        markAllAsRead();
    });
    
    clearAllBtn.addEventListener('click', function() {
        clearAllNotifications();
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('search-notifications');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            const filteredNotifications = notificationsData.filter(notification => 
                notification.title.toLowerCase().includes(searchTerm) ||
                notification.message.toLowerCase().includes(searchTerm) ||
                notification.type.toLowerCase().includes(searchTerm)
            );
            
            notifications = filteredNotifications;
        } else {
            notifications = [...notificationsData];
        }
        
        loadNotifications();
        updateNotificationCounts();
    });
}

// Mark notification as read
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.isRead = true;
        
        // Also update in original data
        const original = notificationsData.find(n => n.id === id);
        if (original) {
            original.isRead = true;
        }
        
        loadNotifications();
        updateNotificationCounts();
        updateTopbarBadge();
        showToast('Notification marked as read');
    }
}

// Delete notification
function deleteNotification(id) {
    if (confirm('Are you sure you want to delete this notification?')) {
        notifications = notifications.filter(n => n.id !== id);
        
        // Also remove from original data
        const index = notificationsData.findIndex(n => n.id === id);
        if (index !== -1) {
            notificationsData.splice(index, 1);
        }
        
        loadNotifications();
        updateNotificationCounts();
        updateTopbarBadge();
        showToast('Notification deleted');
    }
}

// Mark all as read
function markAllAsRead() {
    notifications.forEach(n => n.isRead = true);
    notificationsData.forEach(n => n.isRead = true);
    
    loadNotifications();
    updateNotificationCounts();
    updateTopbarBadge();
    showToast('All notifications marked as read');
}

// Clear all notifications
function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
        notifications = [];
        notificationsData.length = 0;
        
        loadNotifications();
        updateNotificationCounts();
        updateTopbarBadge();
        showToast('All notifications cleared');
    }
}

// Show notification details
function showNotificationDetails(notification) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 100%;
            padding: 32px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        ">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <div class="notification-icon-wrapper ${notification.type}" style="width: 56px; height: 56px; font-size: 24px;">
                    <i class="${notification.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h3 style="font-size: 20px; font-weight: 600; color: #2d3748; margin-bottom: 4px;">
                        ${notification.title}
                    </h3>
                    <span class="notification-type-badge ${notification.type}">
                        ${notification.type}
                    </span>
                </div>
            </div>
            
            <p style="color: #718096; line-height: 1.6; margin-bottom: 20px; font-size: 15px;">
                ${notification.message}
            </p>
            
            <div style="display: flex; align-items: center; gap: 8px; color: #a0aec0; font-size: 14px; margin-bottom: 24px;">
                <i class="far fa-clock"></i>
                <span>${notification.time}</span>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button onclick="this.closest('div[style*=fixed]').remove()" style="
                    padding: 10px 20px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #2d3748;
                ">Close</button>
                <button onclick="deleteNotification(${notification.id}); this.closest('div[style*=fixed]').remove()" style="
                    padding: 10px 20px;
                    border: none;
                    background: #e53e3e;
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                ">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update topbar notification badge
function updateTopbarBadge() {
    const badge = document.querySelector('.notification-badge');
    const unreadCount = notificationsData.filter(n => !n.isRead).length;
    
    if (unreadCount > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 32px;
        background: #2d3748;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    const style = document.createElement('style');
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
    
    if (!document.querySelector('style[data-toast]')) {
        style.setAttribute('data-toast', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Simulate receiving new notifications
function simulateNewNotification() {
    const newNotification = {
        id: notifications.length + 1,
        type: 'reminder',
        icon: 'fas fa-bell',
        title: 'New Notification',
        message: 'This is a simulated notification to show real-time updates.',
        time: 'Just now',
        timestamp: new Date(),
        isRead: false
    };
    
    notifications.unshift(newNotification);
    notificationsData.unshift(newNotification);
    
    loadNotifications();
    updateNotificationCounts();
    updateTopbarBadge();
    showToast('You have a new notification!');
}

// Setup notification button in topbar
const notificationBtn = document.getElementById('notification-btn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
        // If we're already on notifications page, simulate new notification
        simulateNewNotification();
    });
}

// User profile dropdown
const userProfile = document.getElementById('user-profile');
if (userProfile) {
    userProfile.addEventListener('click', function() {
        showToast('Profile menu coming soon...');
    });
}

// Log initialization
console.log('JNEC Online Fitness Gym - Notifications Page Initialized');
console.log('Total Notifications:', notificationsData.length);
console.log('Unread Notifications:', notificationsData.filter(n => !n.isRead).length);