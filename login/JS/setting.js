// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    // Toggle sidebar on menu button click
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
    
    // Close sidebar when clicking on overlay
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
    
    // Modal functionality
    const aboutUsBtn = document.getElementById('aboutUsBtn');
    const rateAppBtn = document.getElementById('rateAppBtn');
    const appFeedbackBtn = document.getElementById('appFeedbackBtn');
    
    const aboutUsModal = document.getElementById('aboutUsModal');
    const rateAppModal = document.getElementById('rateAppModal');
    const appFeedbackModal = document.getElementById('appFeedbackModal');
    
    // Open modals
    aboutUsBtn.addEventListener('click', function() {
        aboutUsModal.classList.add('active');
    });
    
    rateAppBtn.addEventListener('click', function() {
        rateAppModal.classList.add('active');
    });
    
    appFeedbackBtn.addEventListener('click', function() {
        appFeedbackModal.classList.add('active');
    });
    
    // Close modals
    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            document.getElementById(modalId).classList.remove('active');
        });
    });
    
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Rating stars functionality
    const ratingStars = document.querySelectorAll('.rating-stars i');
    let currentRating = 0;
    
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            
            // Update stars appearance
            ratingStars.forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.classList.add('active');
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('active');
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
        });
    });
    
    // Submit rating
    const submitRatingBtn = document.getElementById('submitRatingBtn');
    submitRatingBtn.addEventListener('click', function() {
        if (currentRating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }
        
        // In a real app, you would send this to your backend
        showToast(`Thank you for your ${currentRating}-star rating!`);
        rateAppModal.classList.remove('active');
        
        // Reset stars
        ratingStars.forEach(star => {
            star.classList.remove('active');
            star.classList.remove('fas');
            star.classList.add('far');
        });
        currentRating = 0;
    });
    
    // Submit feedback
    const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
    submitFeedbackBtn.addEventListener('click', function() {
        const feedbackText = document.getElementById('feedbackTextarea').value.trim();
        
        if (feedbackText === '') {
            showToast('Please enter your feedback', 'error');
            return;
        }
        
        // In a real app, you would send this to your backend
        showToast('Thank you for your feedback!');
        appFeedbackModal.classList.remove('active');
        document.getElementById('feedbackTextarea').value = '';
    });
    
    // Change password button
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    changePasswordBtn.addEventListener('click', function() {
        // In a real app, this would open a password change form
        showToast('Password change feature coming soon!');
    });
    
    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = type === 'error' ? 'toast toast-error' : 'toast';
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});