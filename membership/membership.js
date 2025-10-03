document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeSidebar();
    initializeMembershipInfo();
    initializeModal();
    initializeFileUpload();
});

// ============= SIDEBAR FUNCTIONALITY =============
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// ============= MEMBERSHIP INFO FUNCTIONALITY =============
function initializeMembershipInfo() {
    updateMembershipInfo();
}

function updateMembershipInfo() {
    const endDateElement = document.getElementById('end-date');
    const expiryDateBannerElement = document.getElementById('expiry-date');
    const daysRemainingElement = document.getElementById('days-remaining');
    const membershipBanner = document.getElementById('membership-banner');

    const endDateStr = endDateElement.textContent;
    const endDate = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    daysRemainingElement.textContent = `${diffDays} days`;

    if (diffDays <= 0) {
        daysRemainingElement.textContent = 'Expired';
        daysRemainingElement.style.color = '#e53e3e';
        membershipBanner.classList.remove('active');
        membershipBanner.classList.add('expired');

        const bannerTitle = membershipBanner.querySelector('.banner-content h2');
        const bannerSubtitle = membershipBanner.querySelector('.banner-content p');
        const statusIcon = membershipBanner.querySelector('.status-icon i');

        bannerTitle.textContent = 'Membership Expired';
        bannerSubtitle.textContent = 'Please renew your membership to continue accessing facilities.';
        statusIcon.classList.remove('fa-check-circle');
        statusIcon.classList.add('fa-exclamation-circle');
    } else if (diffDays <= 7) {
        daysRemainingElement.style.color = '#dd6b20';
    } else {
        daysRemainingElement.style.color = '#48bb78';
    }

    expiryDateBannerElement.textContent = endDateStr;
}

// ============= MODAL FUNCTIONALITY =============
function initializeModal() {
    const renewBtn = document.getElementById('renew-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const renewalModal = document.getElementById('renewal-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const submitRequestBtn = document.getElementById('submit-request-btn');

    renewBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    
    // Close modal if clicking outside
    renewalModal.addEventListener('click', (e) => {
        if (e.target === renewalModal) {
            closeModal();
        }
    });

    // Handle submit request
    submitRequestBtn.addEventListener('click', submitMembershipRequest);

    // Cancel membership button (placeholder)
    cancelBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel your membership?')) {
            alert('Membership cancellation request submitted. Admin will contact you shortly.');
        }
    });
}

function openModal() {
    const renewalModal = document.getElementById('renewal-modal');
    renewalModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const renewalModal = document.getElementById('renewal-modal');
    renewalModal.classList.remove('active');
    document.body.style.overflow = '';
    clearFileUpload();
}

// ============= PLAN SELECTION =============
window.selectPlan = (months, amount, planName) => {
    const currentExpiryStr = document.getElementById('end-date').textContent;
    const currentExpiry = new Date(currentExpiryStr);

    let newExpiry = new Date(currentExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + months);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById('modal-plan').textContent = planName;
    document.getElementById('modal-current-expiry').textContent = currentExpiry.toLocaleDateString('en-US', options);
    document.getElementById('modal-new-expiry').textContent = newExpiry.toLocaleDateString('en-US', options);
    document.getElementById('modal-total').textContent = `Nu. ${amount}`;
    
    openModal();
};

// ============= FILE UPLOAD FUNCTIONALITY =============
let uploadedFiles = [];
const maxFileSize = 5 * 1024 * 1024; // 5MB
const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

function initializeFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previews = document.getElementById('previews');

    // Click to select files
    dropZone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'LABEL') {
            fileInput.click();
        }
    });

    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Paste from clipboard
    document.addEventListener('paste', handlePaste);
}

function handleDragOver(e) {
    e.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    const dropZone = document.getElementById('dropZone');
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('dragover');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = '';
}

function handlePaste(e) {
    const modal = document.getElementById('renewal-modal');
    if (!modal.classList.contains('active')) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    const files = [];
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (file) {
                files.push(file);
            }
        }
    }

    if (files.length > 0) {
        e.preventDefault();
        processFiles(files);
    }
}

function processFiles(files) {
    hideError();

    files.forEach(file => {
        if (!validateFile(file)) {
            return;
        }

        if (isDuplicate(file)) {
            showError(`File "${file.name}" has already been added.`);
            return;
        }

        uploadedFiles.push(file);
        createPreview(file);
    });

    updateUploadUI();
}

function validateFile(file) {
    if (!allowedTypes.includes(file.type)) {
        showError(`File "${file.name}" is not supported. Use PNG, JPG, JPEG, or WebP.`);
        return false;
    }

    if (file.size > maxFileSize) {
        showError(`File "${file.name}" exceeds 5MB limit.`);
        return false;
    }

    return true;
}

function isDuplicate(file) {
    return uploadedFiles.some(existingFile => 
        existingFile.name === file.name && 
        existingFile.size === file.size
    );
}

function createPreview(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const previews = document.getElementById('previews');
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.dataset.fileName = file.name;
        
        previewItem.innerHTML = `
            <img src="${e.target.result}" alt="Preview" class="preview-image">
            <div class="preview-info">
                <div class="preview-name">${file.name}</div>
                <div class="preview-size">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="preview-remove" aria-label="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;

        const removeBtn = previewItem.querySelector('.preview-remove');
        removeBtn.addEventListener('click', () => removeFile(file.name));

        previews.appendChild(previewItem);
    };

    reader.readAsDataURL(file);
}

function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    const previews = document.getElementById('previews');
    const previewItem = previews.querySelector(`[data-file-name="${fileName}"]`);
    if (previewItem) {
        previewItem.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => previewItem.remove(), 300);
    }
    
    updateUploadUI();
}

function clearFileUpload() {
    uploadedFiles = [];
    const previews = document.getElementById('previews');
    previews.innerHTML = '';
    updateUploadUI();
    hideError();
}

function updateUploadUI() {
    const submitBtn = document.getElementById('submit-request-btn');
    submitBtn.disabled = uploadedFiles.length === 0;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============= SUBMIT REQUEST =============
async function submitMembershipRequest() {
    if (uploadedFiles.length === 0) {
        showError('Please upload at least one payment screenshot.');
        return;
    }

    const submitBtn = document.getElementById('submit-request-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
        // Simulate upload delay
        await simulateUpload();

        // Get form data
        const plan = document.getElementById('modal-plan').textContent;
        const timing = document.getElementById('timingPreference').value;
        const amount = document.getElementById('modal-total').textContent;
        const newExpiry = document.getElementById('modal-new-expiry').textContent;

        // Create booking request
        const bookingRequest = {
            id: 'BR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
            plan: plan,
            timing: timing,
            amount: amount,
            newExpiry: newExpiry,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
        };

        // Save to simulated database
        const adminRequests = JSON.parse(localStorage.getItem('adminBookingRequests') || '[]');
        adminRequests.push(bookingRequest);
        localStorage.setItem('adminBookingRequests', JSON.stringify(adminRequests));
        localStorage.setItem('pendingBookingRequest', JSON.stringify(bookingRequest));

        // Show success
        alert('Membership renewal request submitted successfully!\n\nYour request is pending admin approval. You will be notified once processed.');
        
        closeModal();
        clearFileUpload();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

    } catch (error) {
        showError('Failed to submit request. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function simulateUpload() {
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });
}

// ============= ERROR HANDLING =============
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
    errorMsg.style.display = 'block';
    
    setTimeout(() => {
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function hideError() {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.classList.remove('show');
    errorMsg.style.display = 'none';
}