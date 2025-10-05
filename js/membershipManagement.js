// Sample Data Storage
let members = [
    {
        id: generateId(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '17123456',
        gender: 'male',
        userType: 'student',
        year: 'Second year',
        course: 'csn',
        department: '',
        plan: '3 Months',
        timing: 'Morning (5 AM - 7 AM)',
        startDate: '2025-08-01',
        endDate: '2025-11-01',
        status: 'active',
        joinedDate: '2025-08-01',
        amount: 'Nu. 900'
    },
    {
        id: generateId(),
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '17234567',
        gender: 'female',
        userType: 'staff',
        year: '',
        course: '',
        department: 'administration',
        plan: '1 Month',
        timing: 'Evening (5 PM - 7 PM)',
        startDate: '2025-09-15',
        endDate: '2025-10-15',
        status: 'expired',
        joinedDate: '2025-09-15',
        amount: 'Nu. 300'
    },
    {
        id: generateId(),
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        phone: '17345678',
        gender: 'male',
        userType: 'student',
        year: 'Third year',
        course: 'E',
        department: '',
        plan: '6 Months',
        timing: 'Night (8 PM - 10 PM)',
        startDate: '2025-05-01',
        endDate: '2025-11-01',
        status: 'active',
        joinedDate: '2025-05-01',
        amount: 'Nu. 1,200'
    }
];

let pendingRequests = [
    {
        id: 'BR1698765432ABC',
        memberId: 'M001',
        memberName: 'John Doe',
        plan: '3 Months',
        timing: 'Morning (5 AM - 7 AM)',
        amount: 'Nu. 900',
        newExpiry: 'February 1, 2026',
        status: 'pending',
        submittedAt: '2025-10-01T10:30:00',
        screenshot: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZmFmYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM3MTgwOTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBheW1lbnQgU2NyZWVuc2hvdDwvdGV4dD48L3N2Zz4='
    }
];

let currentMember = null;
let currentRequest = null;
let isEditing = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeTabs();
    loadMembers();
    loadRequests();
    setupSearch();
    updateNotificationCount();
});

// Utility Functions
function generateId() {
    return 'M' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateTime(dateTimeString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
}

function formatRelativeTime(dateTimeString) {
    const now = new Date();
    const time = new Date(dateTimeString);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(dateTimeString);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span class="notification-text">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Sidebar Functions
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        
        if (sidebar.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
}

// Tab Functions
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchToTab(tabName);
        });
    });
}

function switchToTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Members Functions
function loadMembers() {
    const tbody = document.getElementById('members-tbody');
    const filteredMembers = getFilteredMembers();
    
    if (filteredMembers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <i class="fas fa-users-slash"></i>
                        <h3>No Members Found</h3>
                        <p>No members match your current filters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredMembers.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>+975 ${member.phone}</td>
            <td>${member.userType.charAt(0).toUpperCase() + member.userType.slice(1)}</td>
            <td>${member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</td>
            <td>${member.plan}</td>
            <td>${member.timing}</td>
            <td>${formatDate(member.startDate)}</td>
            <td>${formatDate(member.endDate)}</td>
            <td>
                <span class="status-badge ${member.status}">
                    ${member.status === 'active' ? '<i class="fas fa-check-circle"></i>' : ''}
                    ${member.status === 'expired' ? '<i class="fas fa-times-circle"></i>' : ''}
                    ${member.status === 'expiring' ? '<i class="fas fa-exclamation-circle"></i>' : ''}
                    ${member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editMember('${member.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteMember('${member.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getFilteredMembers() {
    let filtered = [...members];
    
    const statusFilter = document.getElementById('status-filter').value;
    const planFilter = document.getElementById('plan-filter').value;
    const userTypeFilter = document.getElementById('user-type-filter').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    if (statusFilter !== 'all') {
        filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    if (planFilter !== 'all') {
        filtered = filtered.filter(m => m.plan.includes(planFilter));
    }
    
    if (userTypeFilter !== 'all') {
        filtered = filtered.filter(m => m.userType === userTypeFilter);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(m => 
            m.name.toLowerCase().includes(searchQuery) ||
            m.email.toLowerCase().includes(searchQuery) ||
            m.phone.includes(searchQuery)
        );
    }
    
    return filtered;
}

function resetFilters() {
    document.getElementById('status-filter').value = 'all';
    document.getElementById('plan-filter').value = 'all';
    document.getElementById('user-type-filter').value = 'all';
    document.getElementById('search-input').value = '';
    loadMembers();
}

// Search Setup
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const planFilter = document.getElementById('plan-filter');
    const userTypeFilter = document.getElementById('user-type-filter');
    
    searchInput.addEventListener('input', loadMembers);
    statusFilter.addEventListener('change', loadMembers);
    planFilter.addEventListener('change', loadMembers);
    userTypeFilter.addEventListener('change', loadMembers);
}

// Member Modal Functions
function openAddMemberModal() {
    isEditing = false;
    currentMember = null;
    
    document.getElementById('modal-title').textContent = 'Add New Member';
    document.getElementById('member-form').reset();
    
    // Hide user-specific fields
    document.getElementById('student-fields').style.display = 'none';
    document.getElementById('staff-fields').style.display = 'none';
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('edit-start-date').value = today;
    
    // Calculate end date for 1 month by default
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    document.getElementById('edit-end-date').value = endDate.toISOString().split('T')[0];
    
    document.getElementById('member-modal').classList.add('active');
}

function editMember(memberId) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    isEditing = true;
    currentMember = member;
    
    document.getElementById('modal-title').textContent = 'Edit Member';
    
    // Fill form with member data
    document.getElementById('edit-name').value = member.name;
    document.getElementById('edit-email').value = member.email;
    document.getElementById('edit-phone').value = member.phone;
    document.getElementById('edit-gender').value = member.gender;
    document.getElementById('edit-user-type').value = member.userType;
    document.getElementById('edit-plan').value = member.plan;
    document.getElementById('edit-timing').value = member.timing;
    document.getElementById('edit-start-date').value = member.startDate;
    document.getElementById('edit-end-date').value = member.endDate;
    document.getElementById('edit-status').value = member.status;
    
    // Show user-specific fields and fill them
    toggleUserFields();
    if (member.userType === 'student') {
        document.getElementById('edit-year').value = member.year || '';
        document.getElementById('edit-course').value = member.course || '';
    } else if (member.userType === 'staff') {
        document.getElementById('edit-department').value = member.department || '';
    }
    
    document.getElementById('member-modal').classList.add('active');
}

function toggleUserFields() {
    const userType = document.getElementById('edit-user-type').value;
    const studentFields = document.getElementById('student-fields');
    const staffFields = document.getElementById('staff-fields');
    
    studentFields.style.display = userType === 'student' ? 'block' : 'none';
    staffFields.style.display = userType === 'staff' ? 'block' : 'none';
    
    // Clear fields when switching user types
    if (userType !== 'student') {
        document.getElementById('edit-year').value = '';
        document.getElementById('edit-course').value = '';
    }
    if (userType !== 'staff') {
        document.getElementById('edit-department').value = '';
    }
}

function saveMember() {
    const form = document.getElementById('member-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const memberData = {
        id: isEditing ? currentMember.id : generateId(),
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        gender: document.getElementById('edit-gender').value,
        userType: document.getElementById('edit-user-type').value,
        year: document.getElementById('edit-year').value || '',
        course: document.getElementById('edit-course').value || '',
        department: document.getElementById('edit-department').value || '',
        plan: document.getElementById('edit-plan').value,
        timing: document.getElementById('edit-timing').value,
        startDate: document.getElementById('edit-start-date').value,
        endDate: document.getElementById('edit-end-date').value,
        status: document.getElementById('edit-status').value,
        joinedDate: isEditing ? currentMember.joinedDate : new Date().toISOString().split('T')[0],
        amount: calculateAmount(document.getElementById('edit-plan').value)
    };
    
    if (isEditing) {
        // Update existing member
        const index = members.findIndex(m => m.id === currentMember.id);
        if (index !== -1) {
            members[index] = { ...members[index], ...memberData };
        }
        showNotification('Member updated successfully', 'success');
    } else {
        // Add new member
        members.push(memberData);
        showNotification('Member added successfully', 'success');
    }
    
    closeMemberModal();
    loadMembers();
    updateNotificationCount();
}

function calculateAmount(plan) {
    switch(plan) {
        case '1 Month': return 'Nu. 300';
        case '3 Months': return 'Nu. 900';
        case '6 Months': return 'Nu. 1,200';
        default: return 'Nu. 300';
    }
}

function deleteMember(memberId) {
    const member = members.find(m => m.id === memberId);
    if (!member) return;
    
    if (confirm(`Are you sure you want to delete ${member.name}? This action cannot be undone.`)) {
        members = members.filter(m => m.id !== memberId);
        loadMembers();
        updateNotificationCount();
        showNotification('Member deleted successfully', 'success');
    }
}

function closeMemberModal() {
    document.getElementById('member-modal').classList.remove('active');
    currentMember = null;
    isEditing = false;
}

// Requests Functions
function loadRequests() {
    const requestsGrid = document.getElementById('requests-grid');
    
    if (pendingRequests.length === 0) {
        requestsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No Pending Requests</h3>
                <p>All membership requests have been processed.</p>
            </div>
        `;
        return;
    }
    
    requestsGrid.innerHTML = pendingRequests.map(request => `
        <div class="request-card">
            <div class="request-header">
                <div class="request-info">
                    <h3>${request.memberName}</h3>
                    <p>Request ID: ${request.id}</p>
                </div>
                <span class="request-time">${formatRelativeTime(request.submittedAt)}</span>
            </div>
            
            <div class="request-details">
                <div class="request-detail-item">
                    <span class="request-detail-label">Plan</span>
                    <span class="request-detail-value">${request.plan}</span>
                </div>
                <div class="request-detail-item">
                    <span class="request-detail-label">Timing</span>
                    <span class="request-detail-value">${request.timing}</span>
                </div>
                <div class="request-detail-item">
                    <span class="request-detail-label">Amount</span>
                    <span class="request-detail-value">${request.amount}</span>
                </div>
            </div>
            
            <div class="request-screenshot">
                <img src="${request.screenshot}" alt="Payment Screenshot" onclick="viewRequest('${request.id}')">
            </div>
            
            <div class="request-actions">
                <button class="btn btn-danger" onclick="rejectRequest('${request.id}')">
                    <i class="fas fa-times"></i> Reject
                </button>
                <button class="btn btn-success" onclick="approveRequest('${request.id}')">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-secondary" onclick="viewRequest('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

function viewRequest(requestId) {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;
    
    currentRequest = request;
    
    document.getElementById('req-id').textContent = request.id;
    document.getElementById('req-member').textContent = `${request.memberName}`;
    document.getElementById('req-plan').textContent = request.plan;
    document.getElementById('req-timing').textContent = request.timing;
    document.getElementById('req-amount').textContent = request.amount;
    document.getElementById('req-submitted').textContent = formatDateTime(request.submittedAt);
    document.getElementById('payment-screenshot').src = request.screenshot;
    
    document.getElementById('request-modal').classList.add('active');
}

function closeRequestModal() {
    document.getElementById('request-modal').classList.remove('active');
    currentRequest = null;
}

function approveRequest(requestId) {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Find the member and update their membership
    const member = members.find(m => m.id === request.memberId);
    if (member) {
        // Update member's end date based on the plan
        const currentEndDate = new Date(member.endDate);
        let extensionMonths = 0;
        
        if (request.plan.includes('1')) extensionMonths = 1;
        else if (request.plan.includes('3')) extensionMonths = 3;
        else if (request.plan.includes('6')) extensionMonths = 6;
        
        const newEndDate = new Date(currentEndDate);
        newEndDate.setMonth(newEndDate.getMonth() + extensionMonths);
        
        member.endDate = newEndDate.toISOString().split('T')[0];
        member.status = 'active';
        member.plan = request.plan;
        member.timing = request.timing;
        
        // Remove from pending requests
        pendingRequests = pendingRequests.filter(r => r.id !== requestId);
        
        // Update UI
        loadRequests();
        loadMembers();
        updateNotificationCount();
        
        showNotification(`Membership approved for ${request.memberName}`, 'success');
    }
    
    closeRequestModal();
}

function rejectRequest(requestId) {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;
    
    if (confirm(`Are you sure you want to reject ${request.memberName}'s membership request?`)) {
        // Remove from pending requests
        pendingRequests = pendingRequests.filter(r => r.id !== requestId);
        
        // Update UI
        loadRequests();
        updateNotificationCount();
        
        showNotification(`Membership request rejected for ${request.memberName}`, 'error');
    }
    
    closeRequestModal();
}

function updateNotificationCount() {
    const pendingCount = pendingRequests.length;
    document.getElementById('requests-badge').textContent = pendingCount;
    document.getElementById('notification-count').textContent = pendingCount;
}

// Export Functionality
function exportMemberData() {
    const dataToExport = getFilteredMembers();
    
    if (dataToExport.length === 0) {
        showNotification('No data to export with current filters', 'error');
        return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Gender', 'User Type', 'Year', 'Course', 'Department', 'Plan', 'Timing', 'Start Date', 'End Date', 'Status'];
    const csvContent = [
        headers.join(','),
        ...dataToExport.map(member => [
            `"${member.name}"`,
            member.email,
            `"+975 ${member.phone}"`,
            member.gender,
            member.userType,
            member.year,
            member.course,
            member.department,
            member.plan,
            `"${member.timing}"`,
            member.startDate,
            member.endDate,
            member.status
        ].join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification(`Exported ${dataToExport.length} members to CSV`, 'success');
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const memberModal = document.getElementById('member-modal');
    const requestModal = document.getElementById('request-modal');
    
    if (event.target === memberModal) {
        closeMemberModal();
    }
    
    if (event.target === requestModal) {
        closeRequestModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMemberModal();
        closeRequestModal();
    }
});