// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const announcementForm = document.getElementById('announcement-form');
const announcementsContainer = document.getElementById('announcements-container');
const deleteModal = document.getElementById('delete-modal');
const closeDeleteModal = document.getElementById('close-delete-modal');
const cancelDelete = document.getElementById('cancel-delete');
const confirmDelete = document.getElementById('confirm-delete');
const feedbackModal = document.getElementById('feedback-modal');
const closeFeedbackModal = document.getElementById('close-feedback-modal');
const closeFeedbackDetail = document.getElementById('close-feedback-detail');
const feedbackTbody = document.getElementById('feedback-tbody');
const searchInput = document.getElementById('search-input');
const ratingFilter = document.getElementById('rating-filter');
const categoryFilter = document.getElementById('category-filter');

// Data Storage
let announcements = [
    {
        id: 1,
        title: "New Treadmills Arrived",
        type: "equipment",
        content: "We have just received 5 new premium treadmills with advanced features. Members can now enjoy the latest technology for their cardio workouts.",
        date: "2025-10-15",
        expiry: "2025-11-15",
        created: "2025-10-15T10:30:00"
    },
    {
        id: 2,
        title: "Gym Maintenance Schedule",
        type: "maintenance",
        content: "The gym will undergo routine maintenance on October 20th from 8 PM to 10 PM. Some equipment may be temporarily unavailable during this time.",
        date: "2025-10-16",
        expiry: "2025-10-21",
        created: "2025-10-16T09:15:00"
    },
    {
        id: 3,
        title: "Welcome New Members",
        type: "general",
        content: "A warm welcome to all our new members who joined this month! We're excited to have you as part of our fitness community.",
        date: "2025-10-10",
        expiry: null,
        created: "2025-10-10T14:20:00"
    }
];

let feedbackData = [
    {
        id: 1,
        member: "Jane Smith",
        rating: 5,
        category: "Trainers",
        date: "2025-10-01",
        feedback: "Trainer Leo is exceptional! Great motivation and personalized workout plans. I've seen amazing results in just 2 months."
    },
    {
        id: 2,
        member: "John Doe",
        rating: 2,
        category: "Equipment",
        date: "2025-09-30",
        feedback: "Treadmill #4 has been broken for 2 weeks. This is frustrating as it's one of the most popular machines. Please fix it soon."
    },
    {
        id: 3,
        member: "Alex Lee",
        rating: 4,
        category: "Facilities",
        date: "2025-09-29",
        feedback: "Great space and cleanliness is top-notch. The water fountain pressure is a bit slow though. Otherwise, very satisfied."
    },
    {
        id: 4,
        member: "Sarah Johnson",
        rating: 5,
        category: "Service",
        date: "2025-09-28",
        feedback: "Outstanding customer service! The staff is always friendly and helpful. The new member orientation was very thorough."
    },
    {
        id: 5,
        member: "Mike Wilson",
        rating: 3,
        category: "Equipment",
        date: "2025-09-27",
        feedback: "Good variety of equipment but some machines need maintenance. The rowing machines are getting old and squeaky."
    }
];

let currentDeleteId = null;
let currentFeedback = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadAnnouncements();
    loadFeedback();
});

function initializePage() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('announcement-date').value = today;
}

function setupEventListeners() {
    // Menu Toggle
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // Tab Navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Announcement Form
    announcementForm.addEventListener('submit', handleAnnouncementSubmit);
    
    // Delete Modal
    closeDeleteModal.addEventListener('click', closeDeleteModalHandler);
    cancelDelete.addEventListener('click', closeDeleteModalHandler);
    confirmDelete.addEventListener('click', handleDeleteAnnouncement);
    
    // Feedback Modal
    closeFeedbackModal.addEventListener('click', closeFeedbackModalHandler);
    closeFeedbackDetail.addEventListener('click', closeFeedbackModalHandler);
    
    // Search
    searchInput.addEventListener('input', handleSearch);
    
    // Filters
    ratingFilter.addEventListener('change', filterFeedback);
    categoryFilter.addEventListener('change', filterFeedback);
    
    // Export Button
    document.getElementById('export-feedback').addEventListener('click', exportFeedback);
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleSidebar();
            }
        }
    });
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update search placeholder
    if (tabName === 'announcements') {
        searchInput.placeholder = 'Search announcements...';
    } else {
        searchInput.placeholder = 'Search feedback...';
    }
}

// Sidebar Toggle
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Announcement Functions
function handleAnnouncementSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('announcement-title').value;
    const type = document.getElementById('announcement-type').value;
    const content = document.getElementById('announcement-content').value;
    const date = document.getElementById('announcement-date').value;
    const expiry = document.getElementById('announcement-expiry').value;
    
    const newAnnouncement = {
        id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
        title,
        type,
        content,
        date,
        expiry: expiry || null,
        created: new Date().toISOString()
    };
    
    announcements.unshift(newAnnouncement);
    loadAnnouncements();
    announcementForm.reset();
    initializePage();
    showNotification('Announcement published successfully!');
}

function loadAnnouncements() {
    announcementsContainer.innerHTML = '';
    
    if (announcements.length === 0) {
        announcementsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bullhorn"></i>
                <h3>No Announcements Yet</h3>
                <p>Create your first announcement to keep members informed.</p>
            </div>
        `;
        return;
    }
    
    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.created) - new Date(a.created));
    
    sortedAnnouncements.forEach(announcement => {
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement-card';
        announcementElement.innerHTML = `
            <div class="announcement-header">
                <h3 class="announcement-title">${announcement.title}</h3>
                <div class="announcement-meta">
                    <span class="announcement-date">${formatDate(announcement.date)}</span>
                    <span class="announcement-type type-${announcement.type}">
                        <i class="fas ${getTypeIcon(announcement.type)}"></i>
                        ${getTypeLabel(announcement.type)}
                    </span>
                </div>
            </div>
            <div class="announcement-body">
                <p class="announcement-content">${announcement.content}</p>
                ${announcement.expiry ? `<p><strong>Expires:</strong> ${formatDate(announcement.expiry)}</p>` : ''}
            </div>
            <div class="announcement-footer">
                <span>Created: ${formatDateTime(announcement.created)}</span>
                <div class="announcement-actions">
                    <button class="btn-icon edit" data-id="${announcement.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" data-id="${announcement.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        announcementsContainer.appendChild(announcementElement);
    });
    
    document.querySelectorAll('.btn-icon.edit').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editAnnouncement(id);
        });
    });
    
    document.querySelectorAll('.btn-icon.delete').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openDeleteModal(id);
        });
    });
}

function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id === id);
    if (!announcement) return;
    
    document.getElementById('announcement-title').value = announcement.title;
    document.getElementById('announcement-type').value = announcement.type;
    document.getElementById('announcement-content').value = announcement.content;
    document.getElementById('announcement-date').value = announcement.date;
    document.getElementById('announcement-expiry').value = announcement.expiry || '';
    
    announcements = announcements.filter(a => a.id !== id);
    loadAnnouncements();
    
    document.getElementById('announcement-form').scrollIntoView({ behavior: 'smooth' });
    showNotification('Announcement loaded for editing');
}

function openDeleteModal(id) {
    currentDeleteId = id;
    deleteModal.classList.add('active');
}

function closeDeleteModalHandler() {
    deleteModal.classList.remove('active');
    currentDeleteId = null;
}

function handleDeleteAnnouncement() {
    if (currentDeleteId) {
        announcements = announcements.filter(a => a.id !== currentDeleteId);
        loadAnnouncements();
        closeDeleteModalHandler();
        showNotification('Announcement deleted successfully');
    }
}

// Feedback Functions
function loadFeedback() {
    feedbackTbody.innerHTML = '';
    
    const filteredFeedback = getFilteredFeedback();
    
    if (filteredFeedback.length === 0) {
        feedbackTbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <i class="fas fa-comment-slash"></i>
                        <h3>No Feedback Found</h3>
                        <p>No feedback matches your current filters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredFeedback.forEach(feedback => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${feedback.member}</td>
            <td><span class="star-rating ${feedback.rating <= 2 ? 'low-rating' : ''}">${getStars(feedback.rating)}</span></td>
            <td>${feedback.category}</td>
            <td>${formatDate(feedback.date)}</td>
            <td class="feedback-text" title="${feedback.feedback}">${truncateText(feedback.feedback, 50)}</td>
            <td><button class="view-btn" data-id="${feedback.id}">View</button></td>
        `;
        feedbackTbody.appendChild(row);
    });
    
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            viewFeedbackDetail(id);
        });
    });
}

function getFilteredFeedback() {
    let filtered = [...feedbackData];
    
    const ratingValue = ratingFilter.value;
    const categoryValue = categoryFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    
    if (ratingValue !== 'all') {
        filtered = filtered.filter(f => f.rating === parseInt(ratingValue));
    }
    
    if (categoryValue !== 'all') {
        filtered = filtered.filter(f => f.category === categoryValue);
    }
    
    if (searchValue) {
        filtered = filtered.filter(f => 
            f.member.toLowerCase().includes(searchValue) ||
            f.feedback.toLowerCase().includes(searchValue) ||
            f.category.toLowerCase().includes(searchValue)
        );
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function filterFeedback() {
    loadFeedback();
}

function viewFeedbackDetail(id) {
    const feedback = feedbackData.find(f => f.id === id);
    if (!feedback) return;
    
    currentFeedback = feedback;
    
    const detailBody = document.getElementById('feedback-detail-body');
    detailBody.innerHTML = `
        <div class="feedback-detail">
            <div class="feedback-detail-row">
                <div class="feedback-detail-label">Member:</div>
                <div class="feedback-detail-value">${feedback.member}</div>
            </div>
            <div class="feedback-detail-row">
                <div class="feedback-detail-label">Rating:</div>
                <div class="feedback-detail-value">
                    <span class="star-rating ${feedback.rating <= 2 ? 'low-rating' : ''}">${getStars(feedback.rating)}</span>
                    (${feedback.rating}/5)
                </div>
            </div>
            <div class="feedback-detail-row">
                <div class="feedback-detail-label">Category:</div>
                <div class="feedback-detail-value">${feedback.category}</div>
            </div>
            <div class="feedback-detail-row">
                <div class="feedback-detail-label">Date:</div>
                <div class="feedback-detail-value">${formatDate(feedback.date)}</div>
            </div>
            <div class="feedback-detail-row">
                <div class="feedback-detail-label">Feedback:</div>
                <div class="feedback-detail-value">${feedback.feedback}</div>
            </div>
        </div>
    `;
    
    feedbackModal.classList.add('active');
}

function closeFeedbackModalHandler() {
    feedbackModal.classList.remove('active');
    currentFeedback = null;
}

function exportFeedback() {
    const csv = convertToCSV(feedbackData);
    downloadCSV(csv, 'feedback_export.csv');
    showNotification('Feedback data exported successfully!');
}

function convertToCSV(data) {
    const headers = ['Member', 'Rating', 'Category', 'Date', 'Feedback'];
    const rows = data.map(f => [
        f.member,
        f.rating,
        f.category,
        f.date,
        `"${f.feedback.replace(/"/g, '""')}"`
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Search Function
function handleSearch() {
    const activeTab = document.querySelector('.tab-content.active').id;
    
    if (activeTab === 'feedback-tab') {
        loadFeedback();
    } else {
        const searchValue = searchInput.value.toLowerCase();
        const cards = announcementsContainer.querySelectorAll('.announcement-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.announcement-title').textContent.toLowerCase();
            const content = card.querySelector('.announcement-content').textContent.toLowerCase();
            
            if (title.includes(searchValue) || content.includes(searchValue)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Utility Functions
function getTypeIcon(type) {
    const icons = {
        equipment: 'fa-dumbbell',
        maintenance: 'fa-tools',
        general: 'fa-info-circle',
        urgent: 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-bullhorn';
}

function getTypeLabel(type) {
    const labels = {
        equipment: 'New Equipment',
        maintenance: 'Maintenance',
        general: 'General',
        urgent: 'Urgent'
    };
    return labels[type] || 'Announcement';
}

function getStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}