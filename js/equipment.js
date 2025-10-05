// Equipment Data Storage
let equipmentData = [
    {
        id: 'bench-press',
        name: 'Bench Press',
        description: 'Chest & Triceps primary lift.',
        category: 'strength',
        imageUrl: '../images/bench press.jpg',
        muscles: ['Chest (Pectorals)', 'Triceps', 'Shoulders (Anterior Deltoids)'],
        difficulty: 'intermediate',
        status: 'available',
        instructions: [
            'Lie on the bench with your feet flat on the floor and grip the barbell slightly wider than shoulder-width.',
            'Unrack the bar and hold it steady above your chest with arms fully extended.',
            'Lower the bar slowly to your mid-chest, keeping your elbows tucked in at a 45-degree angle.',
            'Pause briefly, then powerfully push the bar back up to the starting position.',
            'Repeat for your desired number of repetitions.'
        ]
    },
    {
        id: 'barbells',
        name: 'Barbells',
        description: 'Free weights for compound movements.',
        category: 'free-weights',
        imageUrl: '../images/Barbells.png',
        muscles: ['Full Body', 'Various'],
        difficulty: 'beginner-to-advanced',
        status: 'available',
        instructions: [
            'Select the appropriate weight plates for your workout.',
            'Load the plates evenly on both sides of the barbell and secure them with collars.',
            'Use proper form and control for all lifts (e.g., squat, deadlift, overhead press).',
            'Always have a spotter for heavy lifts, especially bench press.',
            'Return the barbell and weights to the rack after use.'
        ]
    },
    {
        id: 'abdominal-bench',
        name: 'Abdominal Bench',
        description: 'Core Training machine.',
        category: 'strength',
        imageUrl: '../images/Abdominal Bench.png',
        muscles: ['Abdominals', 'Obliques'],
        difficulty: 'beginner',
        status: 'available',
        instructions: [
            'Sit on the bench and secure your legs under the foam pads.',
            'Adjust the incline to your desired difficulty level (steeper is harder).',
            'Place your hands behind your head or crossed over your chest.',
            'Engage your core to lift your shoulders off the pad, crunching your abs.',
            'Lower yourself back down slowly and with control.'
        ]
    },
    {
        id: 'leg-press',
        name: 'Leg Press Machine',
        description: 'Lower Body power building.',
        category: 'strength',
        imageUrl: '../images/leg press.png',
        muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
        difficulty: 'intermediate',
        status: 'maintenance',
        instructions: [
            'Sit in the machine, place your feet on the platform shoulder-width apart, and release the safety catches.',
            'Push the platform away from you until your legs are fully extended (do not lock your knees).',
            'Slowly lower the platform back down, bending your knees until they reach a 90-degree angle.',
            'Push back up to the starting position.',
            'Re-engage the safety catches when finished with your set.'
        ]
    },
    {
        id: 'treadmill',
        name: 'Treadmill',
        description: 'Cardio Equipment for running and walking.',
        category: 'cardio',
        imageUrl: '../images/Treadmill.png',
        muscles: ['Legs (General)', 'Cardiovascular System'],
        difficulty: 'beginner',
        status: 'available',
        instructions: [
            'Start the machine at a slow speed (e.g., 1.0 - 2.0 mph).',
            'Increase the speed or incline gradually to your desired intensity.',
            'Maintain a natural running or walking stride and look straight ahead.',
            'Do not step off the treadmill until the belt has fully stopped.',
            'Use the emergency stop clip attached to your clothing.'
        ]
    },
    {
        id: 'rowing-machine',
        name: 'Rowing Machine',
        description: 'Full Body Cardio workout.',
        category: 'cardio',
        imageUrl: '../images/Rowing Machine.png',
        muscles: ['Legs', 'Back', 'Core', 'Arms', 'Cardiovascular System'],
        difficulty: 'beginner-to-intermediate',
        status: 'available',
        instructions: [
            'Start in the catch position (knees bent, arms extended).',
            'The drive is a sequence: PUSH with your legs, then SWING your back, then PULL with your arms.',
            'The recovery is the reverse: EXTEND your arms, then SWING your back, then BEND your knees.',
            'The power should be 60% legs, 20% core/back, and 20% arms.',
            'Focus on a smooth, rhythmic motion.'
        ]
    }
];

let currentEquipment = null;
let currentView = 'grid';
let currentCategory = 'all';
let currentDifficulty = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    loadEquipment();
    setupFilters();
    updateStats();
});

// Utility Functions
function generateId() {
    return 'eq-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
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

// Equipment Functions
function loadEquipment() {
    const equipmentGrid = document.getElementById('equipment-grid');
    const filteredEquipment = getFilteredEquipment();
    
    if (filteredEquipment.length === 0) {
        equipmentGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-dumbbell"></i>
                <h3>No Equipment Found</h3>
                <p>No equipment matches your current filters.</p>
                <button class="btn btn-primary" onclick="openAddEquipmentModal()">
                    <i class="fas fa-plus"></i> Add First Equipment
                </button>
            </div>
        `;
        return;
    }
    
    equipmentGrid.innerHTML = filteredEquipment.map(equipment => `
        <div class="equipment-item" data-category="${equipment.category}" data-difficulty="${equipment.difficulty}">
            <div class="equipment-card">
                <div class="equipment-actions">
                    <button class="btn-icon edit" onclick="editEquipment('${equipment.id}')" title="Edit Equipment">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete" onclick="deleteEquipment('${equipment.id}')" title="Delete Equipment">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="equipment-image-container">
                    <img src="${equipment.imageUrl}" class="equipment-img" alt="${equipment.name}">
                </div>
                <div class="equipment-info">
                    <h3 class="equipment-name">${equipment.name}</h3>
                    <p class="equipment-description">${equipment.description}</p>
                    <div class="equipment-meta">
                        <span class="equipment-badge category">
                            <i class="fas fa-tag"></i> ${equipment.category.replace('-', ' ')}
                        </span>
                        <span class="equipment-badge difficulty">
                            <i class="fas fa-star"></i> ${equipment.difficulty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span class="equipment-badge status ${equipment.status}">
                            <i class="fas fa-circle"></i> ${equipment.status.replace('-', ' ')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Apply view mode
    equipmentGrid.className = `equipment-grid ${currentView === 'list' ? 'list-view' : ''}`;
    
    updateStats();
}

function getFilteredEquipment() {
    let filtered = [...equipmentData];
    
    const categoryFilter = document.getElementById('category-filter').value;
    const difficultyFilter = document.getElementById('difficulty-filter').value;
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(e => e.category === categoryFilter);
    }
    
    if (difficultyFilter !== 'all') {
        filtered = filtered.filter(e => e.difficulty === difficultyFilter);
    }
    
    if (searchQuery) {
        filtered = filtered.filter(e => 
            e.name.toLowerCase().includes(searchQuery) ||
            e.description.toLowerCase().includes(searchQuery) ||
            e.muscles.some(m => m.toLowerCase().includes(searchQuery))
        );
    }
    
    return filtered;
}

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const searchInput = document.getElementById('search-input');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    categoryFilter.addEventListener('change', loadEquipment);
    difficultyFilter.addEventListener('change', loadEquipment);
    searchInput.addEventListener('input', loadEquipment);
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.getAttribute('data-view');
            loadEquipment();
        });
    });
}

function resetFilters() {
    document.getElementById('category-filter').value = 'all';
    document.getElementById('difficulty-filter').value = 'all';
    document.getElementById('search-input').value = '';
    loadEquipment();
}

function updateStats() {
    const totalCount = equipmentData.length;
    const availableCount = equipmentData.filter(e => e.status === 'available').length;
    
    document.getElementById('total-count').textContent = totalCount;
    document.getElementById('available-count').textContent = availableCount;
}

// Equipment Detail Modal
function viewEquipment(equipmentId) {
    const equipment = equipmentData.find(e => e.id === equipmentId);
    if (!equipment) return;
    
    currentEquipment = equipment;
    
    document.getElementById('modal-equipment-name').textContent = equipment.name;
    document.getElementById('detail-name').textContent = equipment.name;
    document.getElementById('detail-description').textContent = equipment.description;
    document.getElementById('detail-category').textContent = equipment.category.replace('-', ' ');
    document.getElementById('detail-difficulty').textContent = equipment.difficulty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Muscles
    const musclesContainer = document.getElementById('detail-muscles');
    musclesContainer.innerHTML = equipment.muscles.map(muscle => 
        `<span class="muscle-tag">${muscle}</span>`
    ).join('');
    
    // Image
    document.getElementById('detail-image').src = equipment.imageUrl;
    document.getElementById('detail-image').alt = equipment.name;
    
    // Instructions
    const instructionsContainer = document.getElementById('detail-instructions');
    instructionsContainer.innerHTML = equipment.instructions.map(instruction => 
        `<li>${instruction}</li>`
    ).join('');
    
    document.getElementById('equipment-modal').classList.add('active');
}

function closeEquipmentModal() {
    document.getElementById('equipment-modal').classList.remove('active');
    currentEquipment = null;
}

// Add/Edit Equipment Modal
function openAddEquipmentModal() {
    document.getElementById('add-edit-title').textContent = 'Add New Equipment';
    document.getElementById('equipment-form').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('add-edit-modal').classList.add('active');
}

function editEquipment(equipmentId) {
    let equipment;
    if (equipmentId) {
        equipment = equipmentData.find(e => e.id === equipmentId);
    } else {
        equipment = currentEquipment;
    }
    
    if (!equipment) return;
    
    currentEquipment = equipment;
    
    document.getElementById('add-edit-title').textContent = `Edit Equipment: ${equipment.name}`;
    document.getElementById('edit-id').value = equipment.id;
    document.getElementById('edit-name').value = equipment.name;
    document.getElementById('edit-description').value = equipment.description;
    document.getElementById('edit-category').value = equipment.category;
    document.getElementById('edit-difficulty').value = equipment.difficulty;
    document.getElementById('edit-image').value = equipment.imageUrl;
    document.getElementById('edit-muscles').value = equipment.muscles.join(', ');
    document.getElementById('edit-status').value = equipment.status;
    document.getElementById('edit-instructions').value = equipment.instructions.join('\n');
    
    document.getElementById('add-edit-modal').classList.add('active');
}

function closeAddEditModal() {
    document.getElementById('add-edit-modal').classList.remove('active');
    currentEquipment = null;
}

function saveEquipment() {
    const form = document.getElementById('equipment-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const equipmentId = document.getElementById('edit-id').value;
    const isEditing = equipmentId !== '';
    
    const equipmentDataObj = {
        id: isEditing ? equipmentId : generateId(),
        name: document.getElementById('edit-name').value,
        description: document.getElementById('edit-description').value,
        category: document.getElementById('edit-category').value,
        difficulty: document.getElementById('edit-difficulty').value,
        imageUrl: document.getElementById('edit-image').value,
        muscles: document.getElementById('edit-muscles').value.split(',').map(m => m.trim()).filter(m => m.length > 0),
        status: document.getElementById('edit-status').value,
        instructions: document.getElementById('edit-instructions').value.split('\n').map(i => i.trim()).filter(i => i.length > 0)
    };
    
    if (isEditing) {
        // Update existing equipment
        const index = equipmentData.findIndex(e => e.id === equipmentId);
        if (index !== -1) {
            equipmentData[index] = equipmentDataObj;
        }
        showNotification(`Equipment "${equipmentDataObj.name}" updated successfully`, 'success');
    } else {
        // Add new equipment
        equipmentData.push(equipmentDataObj);
        showNotification(`New equipment "${equipmentDataObj.name}" added successfully`, 'success');
    }
    
    closeAddEditModal();
    loadEquipment();
}

function deleteEquipment(equipmentId) {
    const equipment = equipmentData.find(e => e.id === equipmentId);
    if (!equipment) return;
    
    if (confirm(`Are you sure you want to delete "${equipment.name}"? This action cannot be undone.`)) {
        equipmentData = equipmentData.filter(e => e.id !== equipmentId);
        loadEquipment();
        showNotification(`Equipment "${equipment.name}" deleted successfully`, 'success');
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const equipmentModal = document.getElementById('equipment-modal');
    const addEditModal = document.getElementById('add-edit-modal');
    
    if (event.target === equipmentModal) {
        closeEquipmentModal();
    }
    
    if (event.target === addEditModal) {
        closeAddEditModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEquipmentModal();
        closeAddEditModal();
    }
});

// Add click listeners to equipment cards for viewing details
document.addEventListener('click', function(event) {
    const equipmentCard = event.target.closest('.equipment-card');
    if (equipmentCard && !event.target.closest('.equipment-actions')) {
        const equipmentItem = equipmentCard.closest('.equipment-item');
        const equipmentId = equipmentData.find(e => 
            e.name === equipmentItem.querySelector('.equipment-name').textContent
        )?.id;
        if (equipmentId) {
            viewEquipment(equipmentId);
        }
    }
});