// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const pageTitle = document.getElementById('page-title');
const notificationBtn = document.getElementById('notification-btn');
const userProfile = document.getElementById('user-profile');
const searchBox = document.querySelector('.search-box input');

// Sample Data with Bhutanese names
const sampleMembers = [
    { id: 1, name: 'Tshering', email: 'tshering@example.com', joinDate: '2025-10-15', status: 'active', slot: 'morning', plan: '1 Month' },
    { id: 2, name: 'Dorji', email: 'dorji@example.com', joinDate: '2025-10-14', status: 'active', slot: 'evening', plan: '3 Months' },
    { id: 3, name: 'Dechen', email: 'dechen@example.com', joinDate: '2025-10-13', status: 'pending', slot: 'night', plan: '1 Month' },
    { id: 4, name: 'Leki Choden', email: 'leki@example.com', joinDate: '2025-10-12', status: 'active', slot: 'morning', plan: '6 Months' },
    { id: 5, name: 'Jigme Lhaden', email: 'jigme@example.com', joinDate: '2025-10-11', status: 'active', slot: 'evening', plan: '1 Month' },
    { id: 6, name: 'Tshewang Dorji', email: 'tshewang@example.com', joinDate: '2025-10-10', status: 'active', slot: 'evening', plan: '3 Months' },
    { id: 7, name: 'Yangdon', email: 'yangdon@example.com', joinDate: '2025-10-09', status: 'active', slot: 'night', plan: '1 Month' },
    { id: 8, name: 'Dawa', email: 'dawa@example.com', joinDate: '2025-10-08', status: 'active', slot: 'morning', plan: '6 Months' },
    { id: 9, name: 'Nima', email: 'nima@example.com', joinDate: '2025-10-07', status: 'pending', slot: 'evening', plan: '1 Month' },
    { id: 10, name: 'Lhamo', email: 'lhamo@example.com', joinDate: '2025-10-06', status: 'active', slot: 'morning', plan: '3 Months' }
];

const sampleEquipment = [
    { id: 1, name: 'Treadmill 1', type: 'Cardio', lastMaintenance: '2025-09-20', status: 'operational' },
    { id: 2, name: 'Elliptical Trainer', type: 'Cardio', lastMaintenance: '2025-10-01', status: 'maintenance' },
    { id: 3, name: 'Bench Press', type: 'Strength', lastMaintenance: '2025-09-15', status: 'operational' },
    { id: 4, name: 'Leg Press Machine', type: 'Strength', lastMaintenance: '2025-08-30', status: 'broken' },
    { id: 5, name: 'Dumbbell Set', type: 'Free Weights', lastMaintenance: '2025-10-10', status: 'operational' }
];

const sampleFeedback = [
    { id: 1, user: 'Tshering', date: '2025-10-15', rating: 5, content: 'Great facilities and friendly staff! The morning slot is perfect for my schedule.' },
    { id: 2, user: 'Dorji', date: '2025-10-14', rating: 4, content: 'Love the new equipment. Would be great to have more evening slots available.' },
    { id: 3, user: 'Dechen', date: '2025-10-13', rating: 3, content: 'Good overall, but the locker rooms could be cleaner.' },
    { id: 4, user: 'Leki Choden', date: '2025-10-12', rating: 5, content: 'The 6-month plan is excellent value for money. Highly recommended!' }
];

// Membership pricing
const membershipPricing = {
    '1 Month': 300,
    '3 Months': 900,
    '6 Months': 1200
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadSampleData();
    updateRevenueStats();
});

function initializeDashboard() {
    // Set current date in slot occupancy
    const currentDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    document.querySelector('.full-width-card .card-title').innerHTML = 
        `<i class="fas fa-chart-pie"></i> Slot Occupancy - ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

function setupEventListeners() {
    // Menu Toggle
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavigation(this);
        });
    });
    
    // Notification Button
    notificationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showNotifications();
    });
    
    // User Profile
    userProfile.addEventListener('click', function() {
        toggleUserMenu();
    });
    
    // Search Functionality
    searchBox.addEventListener('input', handleSearch);
    
    // Quick Action Buttons
    document.getElementById('add-member-btn').addEventListener('click', addNewMember);
    document.getElementById('announcement-btn').addEventListener('click', createAnnouncement);
    document.getElementById('report-btn').addEventListener('click', generateReport);
    
    // Plan Selection Buttons
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.closest('.plan-card').querySelector('h3').textContent;
            selectMembershipPlan(plan);
        });
    });
    
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

function handleNavigation(clickedLink) {
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    clickedLink.classList.add('active');
    
    // Update page title
    const pageName = clickedLink.getAttribute('data-page');
    const title = clickedLink.querySelector('span').textContent;
    pageTitle.textContent = title;
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
    
    // Show notification for demo purposes
    showNotification(`Navigated to ${title}`);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 2) {
        // In a real application, this would make an API call
        console.log('Searching for:', searchTerm);
        showNotification(`Searching for: ${searchTerm}`);
        
        // Filter members based on search term
        const filteredMembers = sampleMembers.filter(member => 
            member.name.toLowerCase().includes(searchTerm) ||
            member.email.toLowerCase().includes(searchTerm)
        );
        
        if (filteredMembers.length > 0) {
            loadMembers(filteredMembers);
        }
    } else if (searchTerm.length === 0) {
        // Reload all members when search is cleared
        loadMembers(sampleMembers);
    }
}

function loadSampleData() {
    loadMembers(sampleMembers);
    loadEquipment();
    loadFeedback();
}

function loadMembers(members = sampleMembers) {
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = '';
    
    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'member-item';
        memberElement.innerHTML = `
            <div class="member-avatar">${member.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-details">${member.email} • ${member.slot} Slot • ${member.plan}</div>
            </div>
            <div class="member-status ${member.status === 'active' ? 'status-active' : 'status-pending'}">
                ${member.status === 'active' ? 'Active' : 'Pending'}
            </div>
        `;
        membersList.appendChild(memberElement);
    });
}

function loadEquipment() {
    const equipmentList = document.getElementById('equipment-status-list');
    equipmentList.innerHTML = '';
    
    sampleEquipment.forEach(equipment => {
        const equipmentElement = document.createElement('div');
        equipmentElement.className = 'equipment-item';
        equipmentElement.innerHTML = `
            <div class="equipment-icon">
                <i class="fas fa-dumbbell"></i>
            </div>
            <div class="equipment-info">
                <div class="equipment-name">${equipment.name}</div>
                <div class="equipment-details">${equipment.type} • Last maintenance: ${formatDate(equipment.lastMaintenance)}</div>
            </div>
            <div class="equipment-status status-${equipment.status}">
                ${equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
            </div>
        `;
        equipmentList.appendChild(equipmentElement);
    });
}

function loadFeedback() {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';
    
    sampleFeedback.forEach(feedback => {
        const feedbackElement = document.createElement('div');
        feedbackElement.className = 'feedback-item';
        feedbackElement.innerHTML = `
            <div class="feedback-header">
                <span class="feedback-user">${feedback.user}</span>
                <span class="feedback-date">${formatDate(feedback.date)}</span>
            </div>
            <div class="feedback-content">${feedback.content}</div>
            <div class="feedback-rating">
                ${getRatingStars(feedback.rating)}
            </div>
        `;
        feedbackList.appendChild(feedbackElement);
    });
}

function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star filled"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function updateRevenueStats() {
    // Calculate total monthly revenue from active members
    const activeMembers = sampleMembers.filter(member => member.status === 'active');
    let monthlyRevenue = 0;
    
    activeMembers.forEach(member => {
        const planPrice = membershipPricing[member.plan];
        // Convert to monthly equivalent
        if (member.plan === '3 Months') {
            monthlyRevenue += planPrice / 3;
        } else if (member.plan === '6 Months') {
            monthlyRevenue += planPrice / 6;
        } else {
            monthlyRevenue += planPrice;
        }
    });
    
    // Update the revenue display
    document.getElementById('monthly-revenue').textContent = `Nu. ${Math.round(monthlyRevenue)}`;
    
    // Update slot occupancy
    updateSlotOccupancy();
}

function updateSlotOccupancy() {
    const activeMembers = sampleMembers.filter(member => member.status === 'active');
    
    const morningMembers = activeMembers.filter(member => member.slot === 'morning').length;
    const eveningMembers = activeMembers.filter(member => member.slot === 'evening').length;
    const nightMembers = activeMembers.filter(member => member.slot === 'night').length;
    
    // Update slot counts
    document.querySelector('.morning .booked-count').textContent = morningMembers;
    document.querySelector('.evening .booked-count').textContent = eveningMembers;
    document.querySelector('.night .booked-count').textContent = nightMembers;
    
    // Update progress bars
    document.querySelector('.morning-progress').style.width = `${(morningMembers / 10) * 100}%`;
    document.querySelector('.evening-progress').style.width = `${(eveningMembers / 10) * 100}%`;
    document.querySelector('.night-progress').style.width = `${(nightMembers / 10) * 100}%`;
    
    // Update available slots
    document.querySelector('.morning .available-info').innerHTML = 
        `<i class="fas fa-check-circle"></i> ${10 - morningMembers} Available`;
    document.querySelector('.evening .available-info').innerHTML = 
        `<i class="fas fa-exclamation-triangle"></i> ${10 - eveningMembers} Available`;
    document.querySelector('.night .available-info').innerHTML = 
        `<i class="fas fa-check-circle"></i> ${10 - nightMembers} Available`;
    
    // Update summary
    const totalBookings = morningMembers + eveningMembers + nightMembers;
    const totalRevenue = activeMembers.reduce((total, member) => {
        const planPrice = membershipPricing[member.plan];
        if (member.plan === '3 Months') {
            return total + (planPrice / 3);
        } else if (member.plan === '6 Months') {
            return total + (planPrice / 6);
        } else {
            return total + planPrice;
        }
    }, 0);
    
    document.querySelector('.summary-item:nth-child(1) span').innerHTML = 
        `Total Bookings: <strong>${totalBookings}</strong> / 30`;
    document.querySelector('.summary-item:nth-child(2) span').innerHTML = 
        `Remaining Slots: <strong>${30 - totalBookings}</strong>`;
    document.querySelector('.summary-item:nth-child(3) span').innerHTML = 
        `Overall Occupancy: <strong>${Math.round((totalBookings / 30) * 100)}%</strong>`;
    document.querySelector('.summary-item:nth-child(4) span').innerHTML = 
        `Monthly Revenue: <strong>Nu. ${Math.round(totalRevenue)}</strong>`;
}

function selectMembershipPlan(plan) {
    const price = membershipPricing[plan];
    showNotification(`Selected ${plan} plan for Nu. ${price}`);
    
    // In a real application, this would open a payment/member registration form
}

function showNotifications() {
    // In a real application, this would show actual notifications
    showNotification('You have 3 new notifications');
}

function toggleUserMenu() {
    // In a real application, this would toggle a user menu dropdown
    showNotification('User menu clicked');
}

function addNewMember() {
    showNotification('Opening Add New Member form...');
    // In a real application, this would open a modal or navigate to member creation page
}

function createAnnouncement() {
    showNotification('Opening Announcement creation form...');
    // In a real application, this would open a modal for creating announcements
}

function generateReport() {
    showNotification('Generating monthly report...');
    // In a real application, this would trigger report generation and download
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
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
        border-left: 4px solid #48bb78;
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

// Update member count
function updateMemberStats() {
    const totalMembers = sampleMembers.length;
    const activeMembers = sampleMembers.filter(member => member.status === 'active').length;
    const pendingMembers = sampleMembers.filter(member => member.status === 'pending').length;
    
    document.getElementById('total-members').textContent = totalMembers;
    document.getElementById('active-memberships').textContent = activeMembers;
    document.getElementById('pending-approvals').textContent = pendingMembers;
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if(this.getAttribute('href') !== "#") {
            window.location.href = this.getAttribute('href');
        }
    });
});


// Initialize stats
updateMemberStats();
updateRevenueStats();