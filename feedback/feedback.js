// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

// Close sidebar when clicking a link on mobile
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 480) {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Rating System
let selectedRating = 0;
const stars = document.querySelectorAll('.star');
const ratingText = document.getElementById('ratingText');

const ratingMessages = {
    1: 'Poor - We can do better',
    2: 'Fair - Needs improvement',
    3: 'Good - Met expectations',
    4: 'Very Good - Exceeded expectations',
    5: 'Excellent - Outstanding!'
};

// Star rating functionality
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        selectedRating = index + 1;
        updateStars(selectedRating);
        ratingText.textContent = ratingMessages[selectedRating];
        ratingText.style.color = '#2d3748';
    });

    star.addEventListener('mouseenter', () => {
        highlightStars(index + 1);
    });

    star.addEventListener('mouseleave', () => {
        if (selectedRating > 0) {
            updateStars(selectedRating);
        } else {
            clearStars();
        }
    });
});

function updateStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
            star.classList.remove('hovered');
        } else {
            star.classList.remove('selected', 'hovered');
        }
    });
}

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('hovered');
        } else {
            star.classList.remove('hovered');
        }
    });
}

function clearStars() {
    stars.forEach(star => {
        star.classList.remove('selected', 'hovered');
    });
}

// Character counter
const feedbackTextarea = document.getElementById('feedbackText');
const charCount = document.getElementById('charCount');
const maxChars = 500;

feedbackTextarea.addEventListener('input', (e) => {
    const length = e.target.value.length;
    charCount.textContent = `${length} / ${maxChars}`;
    
    if (length > maxChars) {
        charCount.style.color = '#e53e3e';
        feedbackTextarea.value = feedbackTextarea.value.substring(0, maxChars);
    } else if (length > maxChars * 0.9) {
        charCount.style.color = '#d97706';
    } else {
        charCount.style.color = '#a0aec0';
    }
});

// Form submission
const feedbackForm = document.getElementById('feedbackForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModal');

if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        console.log('Form submitted');
        console.log('Selected rating:', selectedRating);
        
        // Validate rating
        if (selectedRating === 0) {
            alert('Please select a rating before submitting');
            return;
        }
        
        // Get form data
        const categoryElement = document.querySelector('input[name="category"]:checked');
        const feedbackValue = feedbackTextarea.value.trim();
        const anonymousChecked = document.getElementById('anonymous').checked;
        
        console.log('Category:', categoryElement?.value);
        console.log('Feedback:', feedbackValue);
        
        // Validate category
        if (!categoryElement) {
            alert('Please select a category for your feedback');
            return;
        }
        
        // Validate feedback text
        if (!feedbackValue) {
            alert('Please write your feedback before submitting');
            return;
        }
        
        const formData = {
            rating: selectedRating,
            category: categoryElement.value,
            feedback: feedbackValue,
            anonymous: anonymousChecked,
            timestamp: new Date().toISOString()
        };
        
        // Here you would typically send data to server
        console.log('Feedback submitted successfully:', formData);
        
        // Show success modal
        if (successModal) {
            successModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        
        // Reset form
        feedbackForm.reset();
        selectedRating = 0;
        clearStars();
        ratingText.textContent = 'Select a rating';
        ratingText.style.color = '#718096';
        charCount.textContent = '0 / 500';
        charCount.style.color = '#a0aec0';
        
        // Add to recent feedback (if not anonymous)
        if (!formData.anonymous) {
            addRecentFeedback(formData);
        }
    });
}

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

function closeModal() {
    if (successModal) {
        successModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking overlay
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal || e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
});

// Recent Feedback Display
const recentFeedbackData = [
    {
        user: 'Sarah Johnson',
        avatar: 'SJ',
        rating: 5,
        category: 'Equipment',
        feedback: 'The new equipment is fantastic! Really impressed with the quality and variety. The staff is also very helpful in explaining how to use everything properly.',
        date: '2 days ago'
    },
    {
        user: 'Mike Chen',
        avatar: 'MC',
        rating: 4,
        category: 'Trainers',
        feedback: 'Great personal training sessions. My trainer is knowledgeable and motivating. Would love to see more group class options though.',
        date: '5 days ago'
    },
    {
        user: 'Emily Davis',
        avatar: 'ED',
        rating: 5,
        category: 'Facilities',
        feedback: 'Clean, modern facilities with excellent maintenance. The locker rooms are always spotless and well-stocked. Keep up the great work!',
        date: '1 week ago'
    },
    {
        user: 'Anonymous',
        avatar: '?',
        rating: 3,
        category: 'Service',
        feedback: 'Good gym overall, but sometimes the front desk staff could be more attentive. Waiting times can be long during peak hours.',
        date: '1 week ago'
    }
];

function loadRecentFeedback() {
    const feedbackList = document.getElementById('feedbackList');
    
    if (recentFeedbackData.length === 0) {
        feedbackList.innerHTML = '<p style="text-align: center; color: #a0aec0; padding: 40px;">No feedback yet. Be the first to share your experience!</p>';
        return;
    }
    
    feedbackList.innerHTML = recentFeedbackData.map(item => {
        const filledStars = '<i class="fas fa-star"></i>'.repeat(item.rating);
        const emptyStars = '<i class="far fa-star"></i>'.repeat(5 - item.rating);
        
        return `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="feedback-user">
                        <div class="feedback-avatar">${item.avatar}</div>
                        <div class="feedback-user-info">
                            <h4>${item.user}</h4>
                            <span class="feedback-date">${item.date}</span>
                        </div>
                    </div>
                    <div class="feedback-rating">
                        ${filledStars}${emptyStars}
                    </div>
                </div>
                <p class="feedback-text">${item.feedback}</p>
                <span class="feedback-category">${item.category}</span>
            </div>
        `;
    }).join('');
}

function addRecentFeedback(data) {
    const newFeedback = {
        user: 'John Doe',
        avatar: 'JD',
        rating: data.rating,
        category: capitalizeFirst(data.category),
        feedback: data.feedback,
        date: 'Just now'
    };
    
    recentFeedbackData.unshift(newFeedback);
    
    // Keep only last 5 feedback items
    if (recentFeedbackData.length > 5) {
        recentFeedbackData.pop();
    }
    
    loadRecentFeedback();
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize recent feedback on page load
loadRecentFeedback();

// View All button
const viewAllBtn = document.querySelector('.view-all-btn');
viewAllBtn.addEventListener('click', () => {
    alert('View all feedback feature coming soon!');
});

// Auto-resize textarea
feedbackTextarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Add smooth scroll animations
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

// Observe stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
});

// Add animation delays to stat cards
document.querySelectorAll('.stat-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 480) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

console.log('Feedback page initialized successfully!');