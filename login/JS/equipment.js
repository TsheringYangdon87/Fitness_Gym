// Equipment data with detailed information
const equipmentData = {
    'bench-press': {
        name: 'Bench Press',
        category: 'Strength',
        description: 'The bench press is a compound exercise that primarily targets the chest, shoulders, and triceps. It\'s one of the most popular exercises for building upper body strength.',
        muscles: ['Chest', 'Triceps', 'Shoulders'],
        difficulty: 'intermediate',
        instructions: [
            'Lie flat on the bench with your feet firmly on the ground',
            'Grip the barbell slightly wider than shoulder-width apart',
            'Lower the bar to your chest in a controlled manner',
            'Press the bar back up to the starting position',
            'Keep your core engaged throughout the movement'
        ]
    },
    'barbells': {
        name: 'Barbells',
        category: 'Free Weights',
        description: 'Barbells are versatile free weight equipment used for a wide variety of exercises including squats, deadlifts, and overhead presses.',
        muscles: ['Full Body', 'Variable'],
        difficulty: 'beginner-to-advanced',
        instructions: [
            'Always use proper form and start with lighter weights',
            'Ensure the barbell is balanced before lifting',
            'Keep your core tight during all movements',
            'Use collars to secure weight plates',
            'Practice the movement pattern before adding heavy weight'
        ]
    },
    'abdominal-bench': {
        name: 'Abdominal Bench',
        category: 'Strength',
        description: 'The abdominal bench is designed for core strengthening exercises, particularly sit-ups and crunches with added resistance.',
        muscles: ['Abs', 'Core', 'Hip Flexors'],
        difficulty: 'beginner',
        instructions: [
            'Secure your feet under the foot pads',
            'Start with your back flat on the bench',
            'Engage your core and lift your upper body',
            'Lower back down with control',
            'Avoid pulling on your neck during the movement'
        ]
    },
    'leg-press': {
        name: 'Leg Press Machine',
        category: 'Strength',
        description: 'The leg press machine is excellent for building lower body strength, targeting the quadriceps, hamstrings, and glutes with reduced stress on the lower back.',
        muscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
        difficulty: 'beginner',
        instructions: [
            'Sit on the machine with your back against the pad',
            'Place your feet shoulder-width apart on the platform',
            'Lower the weight by bending your knees to 90 degrees',
            'Push through your heels to extend your legs',
            'Keep your lower back pressed against the pad'
        ]
    },
    'smith-machine': {
        name: 'Smith Machine',
        category: 'Strength',
        description: 'The Smith Machine features a barbell fixed within steel rails, allowing for vertical or near-vertical movement. Great for controlled strength training.',
        muscles: ['Variable', 'Full Body'],
        difficulty: 'beginner-to-intermediate',
        instructions: [
            'Adjust the bar height to your starting position',
            'Position yourself correctly under the bar',
            'Twist the bar to unlock it from the safety catches',
            'Perform your exercise with controlled movement',
            'Twist the bar to lock it back when finished'
        ]
    },
    'dumbbells': {
        name: 'Dumbbells',
        category: 'Free Weights',
        description: 'Dumbbells are essential free weights that allow for unilateral training and a wide range of motion for various exercises.',
        muscles: ['Full Body', 'Variable'],
        difficulty: 'beginner-to-advanced',
        instructions: [
            'Start with a weight you can control properly',
            'Maintain proper posture throughout exercises',
            'Move through a full range of motion',
            'Keep your core engaged for stability',
            'Progress gradually to heavier weights'
        ]
    },
    'pulldown-machine': {
        name: 'Pulldown Machine',
        category: 'Strength',
        description: 'The lat pulldown machine is perfect for developing back strength and width, particularly targeting the latissimus dorsi muscles.',
        muscles: ['Lats', 'Biceps', 'Upper Back', 'Shoulders'],
        difficulty: 'beginner',
        instructions: [
            'Adjust the knee pad to secure your legs',
            'Grip the bar slightly wider than shoulder-width',
            'Pull the bar down to your upper chest',
            'Squeeze your shoulder blades together',
            'Control the weight back to starting position'
        ]
    },
    'punching-bag': {
        name: 'Punching Bag',
        category: 'Cardio',
        description: 'The punching bag provides an excellent cardio workout while building upper body strength, speed, and hand-eye coordination.',
        muscles: ['Shoulders', 'Arms', 'Core', 'Legs'],
        difficulty: 'intermediate',
        instructions: [
            'Wrap your hands or wear boxing gloves',
            'Maintain a proper boxing stance',
            'Keep your guard up between punches',
            'Rotate your hips for power in your punches',
            'Mix different punch combinations and footwork'
        ]
    },
    'kettlebells': {
        name: 'Kettlebells',
        category: 'Functional',
        description: 'Kettlebells are cast-iron weights used for ballistic exercises that combine cardiovascular, strength, and flexibility training.',
        muscles: ['Full Body', 'Core', 'Posterior Chain'],
        difficulty: 'intermediate',
        instructions: [
            'Start with a lighter kettlebell to learn proper form',
            'Keep your wrist straight during exercises',
            'Use your hips to generate power in swings',
            'Maintain a neutral spine position',
            'Control the kettlebell throughout the entire movement'
        ]
    },
    'treadmill': {
        name: 'Treadmill',
        category: 'Cardio',
        description: 'The treadmill is a staple cardio machine that allows for walking, jogging, or running indoors with adjustable speed and incline.',
        muscles: ['Legs', 'Cardiovascular System'],
        difficulty: 'beginner',
        instructions: [
            'Start with a warm-up walk at low speed',
            'Gradually increase speed as you warm up',
            'Maintain good posture with shoulders back',
            'Land mid-foot and avoid overstriding',
            'Use the emergency stop clip for safety'
        ]
    },
    'cable-machine': {
        name: 'Cable Machine',
        category: 'Strength',
        description: 'The cable machine offers constant tension throughout exercises and allows for a variety of angles and movements for comprehensive training.',
        muscles: ['Variable', 'Full Body'],
        difficulty: 'beginner-to-advanced',
        instructions: [
            'Adjust the cable height to your exercise needs',
            'Select appropriate weight on the stack',
            'Stand with a stable base of support',
            'Move through the full range of motion',
            'Control both the pulling and releasing phases'
        ]
    },
    'rowing-machine': {
        name: 'Rowing Machine',
        category: 'Cardio',
        description: 'The rowing machine provides a full-body, low-impact cardio workout that builds endurance and strengthens multiple muscle groups simultaneously.',
        muscles: ['Back', 'Legs', 'Core', 'Arms', 'Shoulders'],
        difficulty: 'beginner-to-intermediate',
        instructions: [
            'Sit on the seat and secure your feet in the straps',
            'Start with your knees bent and arms extended',
            'Push with your legs first, then lean back slightly',
            'Pull the handle to your lower chest',
            'Reverse the motion smoothly to return to start'
        ]
    }
};

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const filterButtons = document.querySelectorAll('.filter-btn');
const viewButtons = document.querySelectorAll('.view-btn');
const equipmentGrid = document.getElementById('equipment-grid');
const equipmentItems = document.querySelectorAll('.equipment-item');
const searchInput = document.getElementById('search-input');

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
});

// Close sidebar when overlay is clicked
sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Close sidebar when a nav link is clicked on mobile
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    });
});

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        filterEquipment(category);
    });
});

function filterEquipment(category) {
    equipmentItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = '';
            }, 10);
        } else {
            item.classList.add('hidden');
        }
    });
}

// View toggle functionality (Grid/List)
viewButtons.forEach(button => {
    button.addEventListener('click', () => {
        viewButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const view = button.getAttribute('data-view');
        toggleView(view);
    });
});

function toggleView(view) {
    if (view === 'list') {
        equipmentGrid.classList.add('list-view');
    } else {
        equipmentGrid.classList.remove('list-view');
    }
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    equipmentItems.forEach(item => {
        const equipmentName = item.querySelector('.equipment-name').textContent.toLowerCase();
        const equipmentDesc = item.querySelector('.equipment-description').textContent.toLowerCase();
        
        if (equipmentName.includes(searchTerm) || equipmentDesc.includes(searchTerm)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
});

// Modal functionality
function createModal() {
    const modal = document.createElement('div');
    modal.className = 'equipment-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">Equipment Details</h2>
                <button class="close-btn" id="close-modal">&times;</button>
            </div>
            <div class="modal-body" id="modal-body">
                <!-- Content will be dynamically inserted -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('#close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(equipmentId) {
    const modal = document.querySelector('.equipment-modal');
    const equipment = equipmentData[equipmentId];
    
    if (!equipment) return;
    
    const modalTitle = modal.querySelector('#modal-title');
    const modalBody = modal.querySelector('#modal-body');
    
    modalTitle.textContent = equipment.name;
    
    modalBody.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-clipboard-list"></i> Description</h3>
            <p>${equipment.description}</p>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-dumbbell"></i> Primary Muscles</h3>
            <div class="muscle-tags">
                ${equipment.muscles.map(muscle => `<span class="muscle-tag">${muscle}</span>`).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-chart-bar"></i> Difficulty Level</h3>
            <span class="difficulty-badge ${equipment.difficulty}">${formatDifficulty(equipment.difficulty)}</span>
        </div>
        
        <div class="detail-section">
            <h3><i class="fas fa-tasks"></i> Instructions</h3>
            <ol class="instructions-list">
                ${equipment.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
        </div>
        
        <div class="modal-actions">
            <button class="action-btn">
                <i class="fas fa-calendar-plus"></i>
                Add to My Schedule
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.equipment-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function formatDifficulty(difficulty) {
    const difficultyMap = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
        'beginner-to-intermediate': 'Beginner to Intermediate',
        'beginner-to-advanced': 'Beginner to Advanced'
    };
    return difficultyMap[difficulty] || difficulty;
}

// Add click event to equipment items
equipmentItems.forEach(item => {
    item.addEventListener('click', () => {
        const equipmentId = item.getAttribute('data-id');
        openModal(equipmentId);
    });
});

// Initialize modal on page load
createModal();

// Smooth scroll animation for equipment grid
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

equipmentItems.forEach(item => {
    observer.observe(item);
});

// // Add to schedule notification
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('action-btn') || e.target.closest('.action-btn')) {
        e.preventDefault();
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 32px;
            background: #2d3748;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        notification.innerHTML = '<i class="fas fa-check-circle"></i> Equipment added to your schedule!';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Equipment page initialized successfully!');

