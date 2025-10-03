// Sample data for equipment - matching the structure from equipment page
const equipmentDataArray = [
    { id: 'treadmill', name: "Treadmill", category: "Cardio", status: "available" },
    { id: 'bench-press', name: "Bench Press", category: "Strength", status: "in-use" },
    { id: 'dumbbells', name: "Dumbbells", category: "Free Weights", status: "available" },
    { id: 'leg-press', name: "Leg Press Machine", category: "Strength", status: "available" },
    { id: 'rowing-machine', name: "Rowing Machine", category: "Cardio", status: "available" },
    { id: 'cable-machine', name: "Cable Machine", category: "Strength", status: "in-use" },
    { id: 'smith-machine', name: "Smith Machine", category: "Strength", status: "available" },
    { id: 'kettlebells', name: "Kettlebells", category: "Functional", status: "available" }
];

// Membership data
const membershipData = {
    status: "active",
    startDate: "Oct 1, 2025",
    endDate: "Nov 30, 2025",
    daysRemaining: 31,
    monthlyFee: 300,
    paymentStatus: "paid"
};

// Monthly Slot Data (30 total slots)
const slotData = {
    morning: {
        total: 10,
        booked: 3,
        available: 7,
        timeRange: "5:00 AM - 7:00 AM"
    },
    evening: {
        total: 10,
        booked: 5,
        available: 5,
        timeRange: "5:00 PM - 7:00 PM"
    },
    night: {
        total: 10,
        booked: 4,
        available: 6,
        timeRange: "8:00 PM - 10:00 PM"
    }
};

// User's current bookings (for demonstration)
let userBookings = {
    morning: false,
    evening: true, // User already booked evening slot
    night: false
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    
    setupSidebarToggle();
    loadEquipment();
    setupNavigation();
    setupQuickActions();
    updateMembershipDisplay();
    setupNotifications();
    
    // Slot booking system
    initializeSlotSystem();
    updateSlotDisplay();
    setupSlotBooking();
    
    console.log('Dashboard initialized successfully');
});

// Initialize slot booking system
function initializeSlotSystem() {
    updateSlotDisplay();
    updateTotalSlotsAvailable();
}

// Update slot display with current data
function updateSlotDisplay() {
    // Morning slot
    document.getElementById('morning-available').textContent = slotData.morning.available;
    updateProgressBar('morning', slotData.morning.booked, slotData.morning.total);
    updateBookedInfo('morning', slotData.morning.booked);
    
    // Evening slot
    document.getElementById('evening-available').textContent = slotData.evening.available;
    updateProgressBar('evening', slotData.evening.booked, slotData.evening.total);
    updateBookedInfo('evening', slotData.evening.booked);
    
    // Night slot
    document.getElementById('night-available').textContent = slotData.night.available;
    updateProgressBar('night', slotData.night.booked, slotData.night.total);
    updateBookedInfo('night', slotData.night.booked);
    
    // Update summary
    updateSlotSummary();
    
    // Update button states based on user bookings
    updateBookingButtons();
}

// Update progress bar
function updateProgressBar(period, booked, total) {
    const percentage = (booked / total) * 100;
    const progressBar = document.getElementById(`${period}-progress`);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Update booked info text
function updateBookedInfo(period, booked) {
    const card = document.querySelector(`.slot-period-card.${period}`);
    if (card) {
        const bookedInfo = card.querySelector('.booked-info');
        if (bookedInfo) {
            bookedInfo.innerHTML = `<i class="fas fa-user"></i> ${booked} Booked`;
        }
    }
}

// Update slot summary section
function updateSlotSummary() {
    const totalBooked = slotData.morning.booked + slotData.evening.booked + slotData.night.booked;
    const totalAvailable = slotData.morning.available + slotData.evening.available + slotData.night.available;
    const totalCapacity = 30;
    const occupancyRate = ((totalBooked / totalCapacity) * 100).toFixed(0);
    
    const totalBookedEl = document.getElementById('total-booked');
    const totalRemainingEl = document.getElementById('total-remaining');
    const occupancyRateEl = document.getElementById('occupancy-rate');
    
    if (totalBookedEl) totalBookedEl.textContent = totalBooked;
    if (totalRemainingEl) totalRemainingEl.textContent = totalAvailable;
    if (occupancyRateEl) occupancyRateEl.textContent = `${occupancyRate}%`;
}

// Update total slots available in stat card
function updateTotalSlotsAvailable() {
    const totalAvailable = slotData.morning.available + slotData.evening.available + slotData.night.available;
    const totalSlotsEl = document.getElementById('total-slots-available');
    if (totalSlotsEl) {
        totalSlotsEl.textContent = totalAvailable;
    }
}

// Update booking button states
function updateBookingButtons() {
    const buttons = document.querySelectorAll('.book-slot-btn');
    
    buttons.forEach(button => {
        const slot = button.dataset.slot;
        
        // Check if user already booked this slot
        if (userBookings[slot]) {
            button.textContent = '✓ Booked';
            button.disabled = true;
            button.style.opacity = '0.6';
        } else if (slotData[slot].available === 0) {
            button.innerHTML = '<i class="fas fa-times-circle"></i> Fully Booked';
            button.disabled = true;
            button.style.opacity = '0.6';
        } else {
            button.innerHTML = `<i class="fas fa-plus-circle"></i> Book ${capitalize(slot)} Slot`;
            button.disabled = false;
            button.style.opacity = '1';
        }
    });
}

// Setup slot booking functionality
function setupSlotBooking() {
    const bookingButtons = document.querySelectorAll('.book-slot-btn');
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const slot = this.dataset.slot;
            handleSlotBooking(slot);
        });
    });
}

// Handle slot booking
function handleSlotBooking(slot) {
    // Check if user already has a booking
    const hasExistingBooking = Object.values(userBookings).some(booked => booked === true);
    
    if (hasExistingBooking && !userBookings[slot]) {
        showNotification('You already have a slot booked for this month. Please cancel your current booking first.', 'warning');
        return;
    }
    
    // Check if slot is available
    if (slotData[slot].available === 0) {
        showNotification('This slot is fully booked. Please choose another time slot.', 'error');
        return;
    }
    
    // Check membership status
    if (membershipData.status !== 'active') {
        showNotification('Please activate your membership to book a slot.', 'error');
        return;
    }
    
    // Confirm booking
    const slotName = capitalize(slot);
    const timeRange = slotData[slot].timeRange;
    const confirmation = confirm(`Confirm booking for ${slotName} Slot (${timeRange})?\n\nThis will be your workout time for the entire month.`);
    
    if (confirmation) {
        // Book the slot
        slotData[slot].booked++;
        slotData[slot].available--;
        userBookings[slot] = true;
        
        // Update display
        updateSlotDisplay();
        updateTotalSlotsAvailable();
        
        // Show success message
        showNotification(`Successfully booked ${slotName} Slot (${timeRange})!`, 'success');
        
        // Log booking
        console.log(`Slot booked: ${slot}`, slotData[slot]);
    }
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Setup sidebar toggle functionality
function setupSidebarToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (!menuToggle || !sidebar || !overlay) return;
    
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

// Load equipment into the grid
function loadEquipment() {
    const equipmentGrid = document.getElementById('equipment-grid');
    
    // Check if element exists
    if (!equipmentGrid) {
        console.error('Equipment grid element not found');
        return;
    }
    
    // Clear existing content
    equipmentGrid.innerHTML = '';
    
    // Add equipment items
    equipmentDataArray.forEach(equipment => {
        const equipmentItem = document.createElement('div');
        equipmentItem.className = 'equipment-item';
        equipmentItem.dataset.id = equipment.id;
        
        equipmentItem.innerHTML = `
            <div class="equipment-header">
                <span class="equipment-name">${equipment.name}</span>
                <span class="equipment-status ${equipment.status}">
                    ${equipment.status === 'available' ? 'Available' : 'In Use'}
                </span>
            </div>
            <div class="equipment-category">${equipment.category}</div>
        `;
        
        // Add click listener
        equipmentItem.addEventListener('click', function() {
            showEquipmentDetails(equipment.id);
        });
        
        equipmentGrid.appendChild(equipmentItem);
    });
    
    console.log('Equipment loaded:', equipmentDataArray.length + ' items');
}

// Setup navigation between pages
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitle = document.getElementById('page-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const page = this.dataset.page;
                const titles = {
                    'dashboard': 'Dashboard',
                    'membership': 'My Membership',
                    'equipment': 'Equipment',
                    'schedule': 'My Schedule',
                    'progress': 'Progress Tracker',
                    'feedback': 'Feedback',
                    'settings': 'Settings'
                };
                
                if (pageTitle) {
                    pageTitle.textContent = titles[page] || 'Dashboard';
                }
                showNotification(`${titles[page]} feature coming soon...`);
            }
        });
    });
}

// Setup quick action buttons
function setupQuickActions() {
    const renewBtn = document.getElementById('renew-btn');
    const scheduleBtn = document.getElementById('schedule-btn');
    const feedbackBtn = document.getElementById('feedback-btn');
    
    if (renewBtn) {
        renewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRenewalDialog();
        });
    }
    
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Opening your workout schedule...');
        });
    }
    
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Opening feedback form...');
        });
    }
}

// Update membership display based on status
function updateMembershipDisplay() {
    const alert = document.getElementById('membership-alert');
    const statusValue = document.getElementById('membership-status');
    const daysValue = document.getElementById('days-remaining');
    
    if (!alert || !statusValue || !daysValue) return;
    
    if (membershipData.status === 'active') {
        alert.classList.add('active');
        alert.classList.remove('expired');
        statusValue.textContent = 'Active';
        daysValue.textContent = membershipData.daysRemaining;
    } else {
        alert.classList.add('expired');
        alert.classList.remove('active');
        statusValue.textContent = 'Expired';
        daysValue.textContent = '0';
        
        const alertText = alert.querySelector('.alert-text p');
        const alertDays = alert.querySelector('.alert-days');
        
        if (alertText) {
            alertText.textContent = 'Your membership has expired. Please renew to continue accessing the gym.';
        }
        if (alertDays) {
            alertDays.textContent = 'Expired';
            alertDays.style.background = '#fff5f5';
            alertDays.style.color = '#e53e3e';
        }
    }
}

// Setup notification button
function setupNotifications() {
    const notificationBtn = document.getElementById('notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('You have 2 new notifications');
        });
    }
}

// Show equipment details
function showEquipmentDetails(equipmentId) {
    const equipment = equipmentDataArray.find(e => e.id === equipmentId);
    if (equipment) {
        showNotification(`${equipment.name} - ${equipment.status === 'available' ? 'Available for use' : 'Currently in use'}`);
    }
}

// Show renewal dialog
function showRenewalDialog() {
    const renewal = confirm(`Renew your membership for another month?\n\nMonthly Fee: Nu. ${membershipData.monthlyFee}\nNew End Date: ${getNextMonthDate()}`);
    
    if (renewal) {
        showNotification('Redirecting to payment page...');
    }
}

// Get next month's date
function getNextMonthDate() {
    const date = new Date(membershipData.endDate);
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Show notification with type
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    let bgColor = '#2d3748';
    let icon = 'fas fa-info-circle';
    
    if (type === 'success') {
        bgColor = '#48bb78';
        icon = 'fas fa-check-circle';
    } else if (type === 'error' || type === 'warning') {
        bgColor = '#e53e3e';
        icon = 'fas fa-exclamation-circle';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 32px;
        background: ${bgColor};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    notification.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
    
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
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            const filteredEquipment = equipmentDataArray.filter(equipment => 
                equipment.name.toLowerCase().includes(searchTerm) ||
                equipment.category.toLowerCase().includes(searchTerm)
            );
            
            const equipmentGrid = document.getElementById('equipment-grid');
            if (equipmentGrid) {
                if (filteredEquipment.length > 0) {
                    equipmentGrid.innerHTML = '';
                    filteredEquipment.forEach(equipment => {
                        const equipmentItem = document.createElement('div');
                        equipmentItem.className = 'equipment-item';
                        equipmentItem.dataset.id = equipment.id;
                        
                        equipmentItem.innerHTML = `
                            <div class="equipment-header">
                                <span class="equipment-name">${equipment.name}</span>
                                <span class="equipment-status ${equipment.status}">
                                    ${equipment.status === 'available' ? 'Available' : 'In Use'}
                                </span>
                            </div>
                            <div class="equipment-category">${equipment.category}</div>
                        `;
                        
                        equipmentItem.addEventListener('click', function() {
                            showEquipmentDetails(equipment.id);
                        });
                        
                        equipmentGrid.appendChild(equipmentItem);
                    });
                } else {
                    equipmentGrid.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">No equipment found</p>';
                }
            }
        } else {
            loadEquipment();
        }
    });
}

// User profile dropdown
const userProfile = document.getElementById('user-profile');
if (userProfile) {
    userProfile.addEventListener('click', function() {
        showNotification('Profile menu coming soon...');
    });
}

// Simulate real-time updates
setInterval(function() {
    equipmentDataArray.forEach(equipment => {
        if (Math.random() > 0.8) {
            equipment.status = equipment.status === 'available' ? 'in-use' : 'available';
        }
    });
    loadEquipment();
}, 30000);

// Log system info
console.log('JNEC Online Fitness Gym - Dashboard Initialized');
console.log('Membership Status:', membershipData.status);
console.log('Total Equipment:', equipmentDataArray.length);
console.log('Days Remaining:', membershipData.daysRemaining);
console.log('Slot Availability:', slotData);
console.log('User Bookings:', userBookings);