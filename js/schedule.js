// Sample data - In production, this would come from a backend
let schedules = [
    {
        id: 1,
        member: 'Tshering Yangdon',
        memberInitials: 'TY',
        equipment: 'Treadmill',
        date: '2025-10-08',
        time: '06:00 AM',
        duration: '60',
        status: 'upcoming',
        notes: 'Cardio session for weight loss'
    },
    {
        id: 2,
        member: 'Tshewang Dorji',
        memberInitials: 'TD',
        equipment: 'Bench Press',
        date: '2025-10-05',
        time: '05:00 PM',
        duration: '45',
        status: 'today',
        notes: 'Upper body strength training'
    },
    {
        id: 3,
        member: 'Pema Lhaden',
        memberInitials: 'PL',
        equipment: 'Leg Press',
        date: '2025-10-03',
        time: '07:00 AM',
        duration: '60',
        status: 'completed',
        notes: 'Leg day workout'
    },
    {
        id: 4,
        member: 'Kinley Wangchuk',
        memberInitials: 'KW',
        equipment: 'Dumbbells',
        date: '2025-10-02',
        time: '06:00 PM',
        duration: '30',
        status: 'cancelled',
        notes: 'Member requested cancellation'
    },
    {
        id: 5,
        member: 'Sonam Choden',
        memberInitials: 'SC',
        equipment: 'Rowing Machine',
        date: '2025-10-09',
        time: '07:00 PM',
        duration: '45',
        status: 'upcoming',
        notes: 'Cardio and endurance training'
    }
];

let currentFilter = 'all';
let editingId = null;

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Filter Tabs
const filterTabs = document.querySelectorAll('.tab-btn');
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.getAttribute('data-filter');
        renderSchedules();
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredSchedules = schedules.filter(schedule => 
            schedule.member.toLowerCase().includes(searchTerm) ||
            schedule.equipment.toLowerCase().includes(searchTerm)
        );
        renderSchedules(filteredSchedules);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSchedules();
    updateStats();
    setMinDate();
});

// Update Statistics
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        total: schedules.length,
        upcoming: schedules.filter(s => s.status === 'upcoming').length,
        today: schedules.filter(s => s.date === today).length,
        completed: schedules.filter(s => s.status === 'completed').length
    };
    
    document.getElementById('totalBookings').textContent = stats.total;
    document.getElementById('upcomingBookings').textContent = stats.upcoming;
    document.getElementById('todayBookings').textContent = stats.today;
    document.getElementById('completedBookings').textContent = stats.completed;
}

// Render Schedules
function renderSchedules(schedulesToRender = null) {
    const container = document.getElementById('scheduleContainer');
    const emptyState = document.getElementById('emptyState');
    
    let filteredSchedules = schedulesToRender || schedules;
    
    // Apply filter
    if (currentFilter !== 'all' && !schedulesToRender) {
        filteredSchedules = schedules.filter(s => s.status === currentFilter);
    }
    
    // Sort by date and time
    filteredSchedules.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB - dateA;
    });
    
    if (filteredSchedules.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = filteredSchedules.map(schedule => `
        <div class="schedule-card">
            <div class="schedule-header">
                <div class="schedule-member">
                    <div class="member-avatar">${schedule.memberInitials}</div>
                    <div class="member-info">
                        <h4>${schedule.member}</h4>
                        <p>${schedule.equipment}</p>
                    </div>
                </div>
                <span class="schedule-status status-${schedule.status}">${schedule.status}</span>
            </div>
            
            <div class="schedule-details">
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="detail-info">
                        <span>Date</span>
                        <strong>${formatDate(schedule.date)}</strong>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="detail-info">
                        <span>Time</span>
                        <strong>${schedule.time}</strong>
                    </div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-icon">
                        <i class="fas fa-stopwatch"></i>
                    </div>
                    <div class="detail-info">
                        <span>Duration</span>
                        <strong>${schedule.duration} mins</strong>
                    </div>
                </div>
            </div>
            
            ${schedule.notes ? `
                <div class="schedule-notes">
                    <p><i class="fas fa-sticky-note"></i> ${schedule.notes}</p>
                </div>
            ` : ''}
            
            <div class="schedule-actions">
                <button class="action-btn btn-view" onclick="viewDetails(${schedule.id})">
                    <i class="fas fa-eye"></i>
                    View
                </button>
                <button class="action-btn btn-edit" onclick="editBooking(${schedule.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="action-btn btn-delete" onclick="deleteBooking(${schedule.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Format Date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Set Minimum Date
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Open Booking Modal
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    const modalTitle = document.getElementById('modalTitle');
    const saveButtonText = document.getElementById('saveButtonText');
    
    editingId = null;
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingId').value = '';
    
    modalTitle.textContent = 'Add New Booking';
    saveButtonText.textContent = 'Save Booking';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Booking Modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    editingId = null;
}

// Save Booking
function saveBooking() {
    const form = document.getElementById('bookingForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const member = document.getElementById('member').value;
    const equipment = document.getElementById('equipment').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value;
    const status = document.getElementById('status').value;
    const notes = document.getElementById('notes').value;
    
    // Get member initials
    const memberInitials = member.split(' ').map(n => n[0]).join('');
    
    if (editingId) {
        // Update existing booking
        const index = schedules.findIndex(s => s.id === editingId);
        if (index !== -1) {
            schedules[index] = {
                ...schedules[index],
                member,
                memberInitials,
                equipment,
                date,
                time,
                duration,
                status,
                notes
            };
            showNotification('Booking updated successfully!', 'success');
        }
    } else {
        // Add new booking
        const newBooking = {
            id: Date.now(),
            member,
            memberInitials,
            equipment,
            date,
            time,
            duration,
            status,
            notes
        };
        schedules.push(newBooking);
        showNotification('Booking created successfully!', 'success');
    }
    
    closeBookingModal();
    renderSchedules();
    updateStats();
}

// Edit Booking
function editBooking(id) {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    editingId = id;
    
    document.getElementById('bookingId').value = schedule.id;
    document.getElementById('member').value = schedule.member;
    document.getElementById('equipment').value = schedule.equipment;
    document.getElementById('date').value = schedule.date;
    document.getElementById('time').value = schedule.time;
    document.getElementById('duration').value = schedule.duration;
    document.getElementById('status').value = schedule.status;
    document.getElementById('notes').value = schedule.notes || '';
    
    document.getElementById('modalTitle').textContent = 'Edit Booking';
    document.getElementById('saveButtonText').textContent = 'Update Booking';
    
    document.getElementById('bookingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Delete Booking
function deleteBooking(id) {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
        schedules = schedules.filter(s => s.id !== id);
        showNotification('Booking deleted successfully!', 'success');
        renderSchedules();
        updateStats();
    }
}

// View Details
function viewDetails(id) {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
        <div class="detail-row">
            <i class="fas fa-user"></i>
            <div class="detail-text">
                <label>Member Name</label>
                <strong>${schedule.member}</strong>
            </div>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-dumbbell"></i>
            <div class="detail-text">
                <label>Equipment</label>
                <strong>${schedule.equipment}</strong>
            </div>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-calendar-alt"></i>
            <div class="detail-text">
                <label>Date</label>
                <strong>${formatDate(schedule.date)}</strong>
            </div>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-clock"></i>
            <div class="detail-text">
                <label>Time</label>
                <strong>${schedule.time}</strong>
            </div>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-stopwatch"></i>
            <div class="detail-text">
                <label>Duration</label>
                <strong>${schedule.duration} minutes</strong>
            </div>
        </div>
        
        <div class="detail-row">
            <i class="fas fa-info-circle"></i>
            <div class="detail-text">
                <label>Status</label>
                <strong style="text-transform: capitalize">${schedule.status}</strong>
            </div>
        </div>
        
        ${schedule.notes ? `
            <div class="detail-row">
                <i class="fas fa-sticky-note"></i>
                <div class="detail-text">
                    <label>Notes</label>
                    <strong>${schedule.notes}</strong>
                </div>
            </div>
        ` : ''}
    `;
    
    document.getElementById('detailsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Details Modal
function closeDetailsModal() {
    document.getElementById('detailsModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Export Schedule
function exportSchedule() {
    let filteredSchedules = schedules;
    if (currentFilter !== 'all') {
        filteredSchedules = schedules.filter(s => s.status === currentFilter);
    }
    
    // Create CSV content
    const headers = ['Member', 'Equipment', 'Date', 'Time', 'Duration', 'Status', 'Notes'];
    const csvContent = [
        headers.join(','),
        ...filteredSchedules.map(s => [
            s.member,
            s.equipment,
            s.date,
            s.time,
            s.duration,
            s.status,
            s.notes || ''
        ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule_${currentFilter}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Schedule exported successfully!', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
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

// Add notification styles
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