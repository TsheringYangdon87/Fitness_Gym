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

// Time Period Filter
const timePeriodSelect = document.getElementById('timePeriod');
const customDateRange = document.getElementById('customDateRange');

if (timePeriodSelect) {
    timePeriodSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
            updateReports(e.target.value);
        }
    });
}

// Date Range Inputs
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

if (startDateInput && endDateInput) {
    startDateInput.addEventListener('change', () => {
        if (startDateInput.value && endDateInput.value) {
            updateReports('custom');
        }
    });
    
    endDateInput.addEventListener('change', () => {
        if (startDateInput.value && endDateInput.value) {
            updateReports('custom');
        }
    });
}

// Update Reports Based on Time Period
function updateReports(period) {
    showNotification(`Reports updated for ${getPeriodLabel(period)}`, 'info');
    // In production, this would fetch new data from backend
    // For now, we'll just show a notification
}

function getPeriodLabel(period) {
    const labels = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year',
        custom: 'Custom Range'
    };
    return labels[period] || period;
}

// Export Report Function
function exportReport() {
    const period = timePeriodSelect.value;
    
    // Create report data
    const reportData = {
        period: getPeriodLabel(period),
        generatedDate: new Date().toLocaleDateString(),
        metrics: {
            totalMembers: 10,
            monthlyRevenue: 'Nu. 4,200',
            totalBookings: 156,
            attendanceRate: '92%'
        },
        slotUtilization: {
            morning: '40%',
            evening: '70%',
            night: '30%'
        }
    };
    
    // Create CSV content
    const csvContent = [
        ['JNEC Fitness Gym - Analytics Report'],
        ['Period:', reportData.period],
        ['Generated:', reportData.generatedDate],
        [''],
        ['Key Metrics'],
        ['Total Members', reportData.metrics.totalMembers],
        ['Monthly Revenue', reportData.metrics.monthlyRevenue],
        ['Total Bookings', reportData.metrics.totalBookings],
        ['Attendance Rate', reportData.metrics.attendanceRate],
        [''],
        ['Slot Utilization'],
        ['Morning (5-7 AM)', reportData.slotUtilization.morning],
        ['Evening (5-7 PM)', reportData.slotUtilization.evening],
        ['Night (8-10 PM)', reportData.slotUtilization.night]
    ].map(row => row.join(',')).join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JNEC_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Report exported successfully!', 'success');
}

// Initialize Charts
document.addEventListener('DOMContentLoaded', () => {
    initializeRevenueChart();
    initializeMembershipChart();
});

// Revenue Chart
function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'Revenue',
                data: [2100, 2400, 2800, 3200, 3600, 3400, 3800, 4000, 3900, 4200],
                borderColor: '#4299e1',
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#4299e1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1a202c',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#4299e1',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Nu. ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#718096',
                        callback: function(value) {
                            return 'Nu. ' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#718096'
                    }
                }
            }
        }
    });
}

// Membership Growth Chart
function initializeMembershipChart() {
    const ctx = document.getElementById('membershipChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'New Members',
                data: [1, 2, 1, 3, 2, 1, 2, 3, 1, 2],
                backgroundColor: '#48bb78',
                borderRadius: 8,
                barThickness: 24
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1a202c',
                    padding: 12,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#48bb78',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' new member' + (context.parsed.y !== 1 ? 's' : '');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#718096',
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#718096'
                    }
                }
            }
        }
    });
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

// Auto-update stats (simulate real-time updates)
setInterval(() => {
    // In production, this would fetch real data from backend
    // For demo purposes, we'll just log
    console.log('Stats updated');
}, 30000); // Update every 30 seconds