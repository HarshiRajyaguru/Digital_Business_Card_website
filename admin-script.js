// Load saved data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    setupColorPickers();
    setupCharCounter();
    setupFormValidation();
});

// Load saved data from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('businessCardData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Populate form fields
        document.getElementById('name').value = data.name || '';
        document.getElementById('title').value = data.title || '';
        document.getElementById('company').value = data.company || '';
        document.getElementById('about').value = data.about || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('website').value = data.website || '';
        document.getElementById('location').value = data.location || '';
        document.getElementById('linkedin').value = data.linkedin || '';
        document.getElementById('github').value = data.github || '';
        document.getElementById('twitter').value = data.twitter || '';
        document.getElementById('instagram').value = data.instagram || '';
        document.getElementById('primaryColor').value = data.primaryColor || '#667eea';
        document.getElementById('secondaryColor').value = data.secondaryColor || '#764ba2';
        
        updateColorValues();
    }
}

// Setup color picker listeners
function setupColorPickers() {
    const primaryColor = document.getElementById('primaryColor');
    const secondaryColor = document.getElementById('secondaryColor');
    
    primaryColor.addEventListener('input', updateColorValues);
    secondaryColor.addEventListener('input', updateColorValues);
}

// Update color value displays
function updateColorValues() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    
    document.getElementById('primaryColorText').value = primaryColor;
    document.getElementById('secondaryColorText').value = secondaryColor;
    
    // Live preview of gradient in navbar
    const gradient = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    document.querySelector('.navbar').style.background = gradient;
    document.querySelector('.admin-header').style.background = gradient;
}

// Character counter for About field
function setupCharCounter() {
    const aboutField = document.getElementById('about');
    const charCount = document.getElementById('charCount');
    
    aboutField.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 500) {
            charCount.style.color = '#dc3545';
            this.value = this.value.substring(0, 500);
        } else {
            charCount.style.color = '#667eea';
        }
    });
}

// Form validation with Bootstrap
function setupFormValidation() {
    const form = document.getElementById('adminForm');
    
    // Setup URL validation for all URL fields
    setupURLValidation();
    
    // Setup phone validation
    setupPhoneValidation();
    
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            
            // Focus on first invalid field
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        form.classList.add('was-validated');
    }, false);
}

// Setup URL validation for website and social media fields
function setupURLValidation() {
    const urlFields = [
        { id: 'website', required: false },
        { id: 'linkedin', required: false },
        { id: 'github', required: false },
        { id: 'twitter', required: false },
        { id: 'instagram', required: false }
    ];
    
    urlFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('input', function() {
                validateURL(this, field.required);
            });
            
            input.addEventListener('blur', function() {
                validateURL(this, field.required);
            });
        }
    });
}

// Validate URL format
function validateURL(input, required) {
    const value = input.value.trim();
    
    // If empty and not required, it's valid
    if (!value && !required) {
        input.setCustomValidity('');
        return true;
    }
    
    // If empty and required, it's invalid
    if (!value && required) {
        input.setCustomValidity('This field is required');
        return false;
    }
    
    // Check if it's a valid URL
    try {
        const url = new URL(value);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            input.setCustomValidity('');
            return true;
        } else {
            input.setCustomValidity('URL must start with http:// or https://');
            return false;
        }
    } catch (error) {
        input.setCustomValidity('Please enter a valid URL (e.g., https://example.com)');
        return false;
    }
}

// Setup phone validation
function setupPhoneValidation() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            validatePhone(this);
        });
        
        phoneInput.addEventListener('blur', function() {
            validatePhone(this);
        });
    }
}

// Validate phone number format
function validatePhone(input) {
    const value = input.value.trim();
    
    // If empty and required, let HTML5 validation handle it
    if (!value) {
        input.setCustomValidity('');
        return true;
    }
    
    // Phone validation pattern - allows various international formats
    // Accepts: digits, spaces, dashes, plus sign, parentheses
    // Minimum 7 characters for valid phone number
    const phonePattern = /^[\d\s\-\+\(\)]{7,}$/;
    
    if (phonePattern.test(value)) {
        input.setCustomValidity('');
        return true;
    } else {
        input.setCustomValidity('Please enter a valid phone number (e.g., +1 (234) 567-890 or 1234567890)');
        return false;
    }
}

// Form submission handler
document.getElementById('adminForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        about: document.getElementById('about').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        twitter: document.getElementById('twitter').value,
        instagram: document.getElementById('instagram').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('businessCardData', JSON.stringify(formData));
    
    // Show success message
    showSuccessMessage('Changes saved successfully! Your business card has been updated.');
});

// Show success message using Bootstrap Toast
function showSuccessMessage(message) {
    const toastEl = document.getElementById('successToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    
    const toast = new bootstrap.Toast(toastEl, {
        animation: true,
        autohide: true,
        delay: 3000
    });
    
    toast.show();
}

// Preview function
function previewCard() {
    // Save current form data temporarily to sessionStorage (not localStorage)
    const formData = {
        name: document.getElementById('name').value,
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        about: document.getElementById('about').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        location: document.getElementById('location').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        twitter: document.getElementById('twitter').value,
        instagram: document.getElementById('instagram').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value
    };
    
    // Store in sessionStorage for preview (will be cleared after viewing)
    sessionStorage.setItem('cardPreviewData', JSON.stringify(formData));
    
    // Open preview page
    window.open('card-preview.html', '_blank');
}

// Reset form with loading state
function resetForm() {
    if (confirm('Are you sure you want to reset all fields? This will clear unsaved changes.')) {
        const resetBtn = event.target;
        resetBtn.classList.add('loading');
        
        setTimeout(() => {
            document.getElementById('adminForm').reset();
            document.getElementById('adminForm').classList.remove('was-validated');
            localStorage.removeItem('businessCardData');
            updateColorValues();
            document.getElementById('charCount').textContent = '0';
            resetBtn.classList.remove('loading');
            showSuccessMessage('Form has been reset.');
        }, 500);
    }
}

// Export data
function exportData() {
    const data = localStorage.getItem('businessCardData');
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'business-card-data.json';
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('No data to export. Please save your changes first.');
    }
}

// Import data
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem('businessCardData', JSON.stringify(data));
            loadSavedData();
            showSuccessMessage('Data imported successfully!');
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}
