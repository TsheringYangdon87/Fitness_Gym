// Sample schedule data
let schedules = [
    {
        id: 'SCH12345678',
        equipment: 'Treadmill',
        date: '2025-10-02',
        time: '07:00 AM',
        duration: 60,
        status: 'today',
        notes: 'Cardio morning session'
    },
    {
        id: 'SCH23456789',
        equipment: 'Bench Press',
        date: '2025-10-03',
        time: '06:00 PM',
        duration: 45,
        status: 'upcoming',
        notes: ''
    },
    {
        id: 'SCH34567890',
        equipment: 'Leg Press',
        date: '2025-10-04',
        time: '08:00 AM',
        duration: 60,
        status: 'upcoming',
        notes: 'Leg day workout'
    },
    {
        id: 'SCH45678901',
        equipment: 'Dumbbells',
        date: '2025-09-29',
        time: '05:00 PM',
        duration: 60,
        status: 'completed',
        notes: ''
    },
    {
        id: 'SCH56789012',
        equipment: 'Rowing Machine',
        date: '2025-09-28',
        time: '07:00 AM',
        duration: 30,
        status: 'completed',
        notes: 'Cardio session'
    },
    {
        id: 'SCH67890123',
        equipment: 'Smith Machine',
        date: '2025-09-27',
        time: '06:00 PM',
        duration: 45,
        status: 'cancelled',
        notes: 'Cancelled due to conflict'
    }
];

let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSchedules();
    setupEventListeners();
    setupSidebarToggle();
    setMinDate();
});

function setupEventListeners() {
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            filterSchedules(filter);
        });
    });

    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        confirmBooking();
    });
}

function setActiveFilter(filter) {
    currentFilter = filter;
    const filterTabs = document.querySelectorAll('.tab-btn');
    filterTabs.forEach(tab => {
        if (tab.getAttribute('data-filter') === filter) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function loadSchedules() {
    filterSchedules(currentFilter);
}

function filterSchedules(filter) {
    let filteredSchedules = [];

    switch(filter) {
        case 'all':
            filteredSchedules = schedules;
            break;
        case 'upcoming':
            filteredSchedules = schedules.filter(schedule => 
                schedule.status === 'upcoming' || schedule.status === 'today'
            );
            break;
        case 'today':
            filteredSchedules = schedules.filter(schedule => 
                schedule.status === 'today'
            );
            break;
        case 'completed':
            filteredSchedules = schedules.filter(schedule => 
                schedule.status === 'completed'
            );
            break;
        case 'cancelled':
            filteredSchedules = schedules.filter(schedule => 
                schedule.status === 'cancelled'
            );
            break;
        default:
            filteredSchedules = schedules;
    }

    // Sort schedules: upcoming first (by date), then completed/cancelled (by date, newest first)
    filteredSchedules.sort((a, b) => {
        const dateA = new Date(`${a.date}T${convertTo24Hour(a.time)}`);
        const dateB = new Date(`${b.date}T${convertTo24Hour(b.time)}`);
        
        // Separate upcoming/today from completed/cancelled
        const aIsUpcoming = a.status === 'upcoming' || a.status === 'today';
        const bIsUpcoming = b.status === 'upcoming' || b.status === 'today';
        
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        
        // Within same category, sort by date
        if (aIsUpcoming) {
            return dateA - dateB; // Ascending for upcoming
        } else {
            return dateB - dateA; // Descending for completed/cancelled
        }
    });

    displaySchedules(filteredSchedules);
}

function displaySchedules(schedulesToDisplay) {
    const scheduleContainer = document.getElementById('scheduleContainer');
    const emptyState = document.getElementById('emptyState');
    
    scheduleContainer.innerHTML = '';

    if (schedulesToDisplay.length === 0) {
        emptyState.style.display = 'block';
        scheduleContainer.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    scheduleContainer.style.display = 'flex';

    schedulesToDisplay.forEach(schedule => {
        const scheduleItem = createScheduleItem(schedule);
        scheduleContainer.appendChild(scheduleItem);
    });
}

function createScheduleItem(schedule) {
    const item = document.createElement('div');
    item.className = `schedule-item ${schedule.status}`;

    // Icon based on status
    let iconClass = 'fas fa-dumbbell';
    if (schedule.status === 'completed') iconClass = 'fas fa-check-circle';
    if (schedule.status === 'cancelled') iconClass = 'fas fa-times-circle';
    if (schedule.status === 'today') iconClass = 'fas fa-clock';

    let actionButtons = '';
    if (schedule.status !== 'completed' && schedule.status !== 'cancelled') {
        actionButtons = `
            <button class="action-btn btn-reschedule" onclick="rescheduleSession('${schedule.id}')">
                <i class="fas fa-calendar-plus"></i>
                <span>Reschedule</span>
            </button>
            <button class="action-btn btn-cancel" onclick="cancelSession('${schedule.id}')">
                <i class="fas fa-times"></i>
                <span>Cancel</span>
            </button>
        `;
    }

    item.innerHTML = `
        <div class="schedule-icon">
            <i class="${iconClass}"></i>
        </div>
        
        <div class="schedule-details">
            <div class="detail-column">
                <div class="detail-label">Equipment</div>
                <div class="detail-value large">${schedule.equipment}</div>
            </div>
            
            <div class="detail-column">
                <div class="detail-label">Date</div>
                <div class="detail-value">${formatDate(schedule.date)}</div>
            </div>
            
            <div class="detail-column">
                <div class="detail-label">Time</div>
                <div class="detail-value">${schedule.time}</div>
            </div>
            
            <div class="detail-column">
                <div class="detail-label">Duration</div>
                <div class="detail-value">${schedule.duration} min</div>
            </div>
            
            <div class="detail-column">
                <div class="detail-label">Status</div>
                <div class="status-badge ${schedule.status}">
                    ${schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                </div>
            </div>
        </div>
        
        <div class="schedule-actions">
            ${actionButtons}
            <button class="action-btn btn-details" onclick="viewSessionDetails('${schedule.id}')">
                <i class="fas fa-info-circle"></i>
                <span>Details</span>
            </button>
        </div>
    `;

    return item;
}

function calculateTimeRemaining(date, time) {
    const now = new Date();
    const sessionDateTime = new Date(`${date}T${convertTo24Hour(time)}`);
    
    if (sessionDateTime < now) {
        return 'Session passed';
    }
    
    const diffMs = sessionDateTime - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
    } else {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
    }
}

function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours}:${minutes}`;
}

function formatDate(dateString) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setMinDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;
    
    document.getElementById('date').min = minDate;
}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('show');
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    document.getElementById('bookingForm').reset();
}

function confirmBooking() {
    const equipment = document.getElementById('equipment').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value;
    const notes = document.getElementById('notes').value;

    if (!equipment || !date || !time || !duration) {
        alert('Please fill in all required fields');
        return;
    }

    const bookingId = 'SCH' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const today = new Date().toISOString().split('T')[0];
    let status = 'upcoming';
    if (date === today) {
        status = 'today';
    }

    const newSchedule = {
        id: bookingId,
        equipment: equipment,
        date: date,
        time: time,
        duration: parseInt(duration),
        status: status,
        notes: notes
    };

    schedules.unshift(newSchedule);

    closeBookingModal();
    filterSchedules(currentFilter);

    alert(`Booking confirmed!\nYour booking ID: ${bookingId}`);
}

function rescheduleSession(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        document.getElementById('equipment').value = schedule.equipment;
        document.getElementById('date').value = schedule.date;
        document.getElementById('time').value = schedule.time;
        document.getElementById('duration').value = schedule.duration;
        document.getElementById('notes').value = schedule.notes;
        
        openBookingModal();
        
        schedules = schedules.filter(s => s.id !== scheduleId);
    }
}

function cancelSession(scheduleId) {
    if (confirm('Are you sure you want to cancel this session?')) {
        const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
        if (scheduleIndex !== -1) {
            schedules[scheduleIndex].status = 'cancelled';
            filterSchedules(currentFilter);
            alert('Session cancelled successfully');
        }
    }
}

function viewSessionDetails(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        const details = `
Equipment: ${schedule.equipment}
Date: ${formatDate(schedule.date)}
Time: ${schedule.time}
Duration: ${schedule.duration} minutes
Status: ${schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
Booking ID: ${schedule.id}
${schedule.notes ? `Notes: ${schedule.notes}` : ''}
        `.trim();
        
        alert(details);
    }
}

// Setup sidebar toggle functionality
function setupSidebarToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (!menuToggle || !sidebar || !overlay) {
        return;
    }
    
    // Toggle sidebar when menu button is clicked
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Change icon
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close sidebar when overlay is clicked
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        
        // Reset icon
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
    
    // Close sidebar when a nav link is clicked on mobile
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                
                // Reset icon
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}