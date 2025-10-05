document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animation trigger
    const successContainer = document.querySelector('.success-container');
    const successIcon = document.querySelector('.success-icon');
    const continueBtn = document.querySelector('.continue-btn');
    const successTitle = document.querySelector('.success-title');
    const successMessage = document.querySelector('.success-message');
    
    // Initialize page elements
    initializePage();
    
    function initializePage() {
        // Set initial state for animations
        if (successContainer) {
            successContainer.style.transform = 'scale(0.8)';
            successContainer.style.opacity = '0';
            successContainer.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }
        
        // Trigger entrance animations
        setTimeout(() => {
            if (successContainer) {
                successContainer.style.transform = 'scale(1)';
                successContainer.style.opacity = '1';
            }
        }, 200);
        
        // Add success icon animation
        if (successIcon) {
            successIcon.style.transform = 'scale(0)';
            successIcon.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                successIcon.style.transform = 'scale(1)';
            }, 600);
        }
        
        // Animate text elements
        if (successTitle) {
            successTitle.style.opacity = '0';
            successTitle.style.transform = 'translateY(20px)';
            successTitle.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                successTitle.style.opacity = '1';
                successTitle.style.transform = 'translateY(0)';
            }, 800);
        }
        
        if (successMessage) {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';
            successMessage.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 1000);
        }
        
        if (continueBtn) {
            continueBtn.style.opacity = '0';
            continueBtn.style.transform = 'translateY(20px)';
            continueBtn.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                continueBtn.style.opacity = '1';
                continueBtn.style.transform = 'translateY(0)';
            }, 1200);
        }
    }
    
    // Enhanced continue button interactions
    if (continueBtn) {
        // Click animation
        continueBtn.addEventListener('click', function(event) {
            // Add ripple effect
            createRippleEffect(event, this);
            
            // Add click animation
            this.style.transform = 'translateY(0px) scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(0px) scale(1)';
            }, 150);
        });
        
        // Hover effects
        continueBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.3)';
        });
        
        continueBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0px) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Keyboard navigation support
        continueBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
        
        // Focus styles
        continueBtn.addEventListener('focus', function() {
            this.style.outline = '3px solid rgba(0, 123, 255, 0.3)';
            this.style.outlineOffset = '2px';
        });
        
        continueBtn.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    }
    
    // Create ripple effect for button clicks
    function createRippleEffect(event, element) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        
        const rect = element.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');
        
        // Add ripple styles
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 600ms linear;
                    background-color: rgba(255, 255, 255, 0.6);
                    pointer-events: none;
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        const ripple = element.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }
        
        element.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }
    
    // Add confetti effect
    function createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#74b9ff', '#fd79a8'];
        const confettiCount = 80;
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                const size = Math.random() * 10 + 5;
                const left = Math.random() * 100;
                const animationDuration = Math.random() * 3 + 2;
                const delay = Math.random() * 2;
                
                confetti.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${left}%;
                    top: -10px;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    animation: confettiFall ${animationDuration}s linear ${delay}s forwards;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, (animationDuration + delay) * 1000 + 1000);
            }, i * 50);
        }
        
        // Remove container after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.remove();
            }
        }, 8000);
    }
    
    // Add confetti CSS animation
    if (!document.querySelector('#confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add success sound effect (web-friendly)
    function playSuccessSound() {
        try {
            // Create a simple success sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a more pleasant success sound
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                const startTime = audioContext.currentTime + (index * 0.1);
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.4);
            });
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }
    
    // Add accessibility improvements
    if (successTitle) {
        successTitle.setAttribute('aria-live', 'polite');
        successTitle.setAttribute('role', 'status');
        successTitle.setAttribute('tabindex', '-1');
    }
    
    if (successMessage) {
        successMessage.setAttribute('aria-live', 'polite');
    }
    
    // Focus management for accessibility
    setTimeout(() => {
        if (successTitle) {
            successTitle.focus();
        }
    }, 1500);
    
    // Set focus to continue button after animations
    setTimeout(() => {
        if (continueBtn) {
            continueBtn.focus();
        }
    }, 2000);
    
    // Trigger effects
    setTimeout(() => {
        playSuccessSound();
        createConfetti();
    }, 1000);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'Escape':
                // Optional: Add escape functionality
                console.log('Escape pressed - could navigate back');
                break;
            case 'Enter':
                if (document.activeElement !== continueBtn && continueBtn) {
                    continueBtn.click();
                }
                break;
        }
    });
    
    // Prevent accidental navigation away
    let hasInteracted = false;
    
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            hasInteracted = true;
        });
    }
    
    // Optional: Auto-redirect after extended time (uncomment if needed)
    /*
    setTimeout(() => {
        if (!hasInteracted && continueBtn && continueBtn.href) {
            const userConfirmed = confirm('You will be automatically redirected to the login page. Continue?');
            if (userConfirmed) {
                window.location.href = continueBtn.href;
            }
        }
    }, 30000); // 30 seconds
    */
    
    // Add page visibility change handler
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible' && !hasInteracted) {
            // Re-trigger some animations if user comes back to tab
            if (successIcon) {
                successIcon.style.animation = 'pulse 2s ease-in-out';
                setTimeout(() => {
                    successIcon.style.animation = '';
                }, 2000);
            }
        }
    });
    
    // Add pulse animation for success icon
    if (!document.querySelector('#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
});