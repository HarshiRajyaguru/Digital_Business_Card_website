/**
 * Shared Form Validation Script
 * Provides consistent validation across all forms in the application
 */

// Form validation utility
class FormValidator {
    constructor(formId, options = {}) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.error(`Form with id "${formId}" not found`);
            return;
        }
        
        this.options = {
            showToast: options.showToast !== undefined ? options.showToast : true,
            submitCallback: options.submitCallback || null,
            validateOnInput: options.validateOnInput !== undefined ? options.validateOnInput : true,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Add Bootstrap validation classes
        this.form.classList.add('needs-validation');
        
        // Prevent default submission and validate
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            if (this.validateForm()) {
                this.form.classList.add('was-validated');
                this.handleSuccess();
            } else {
                this.form.classList.add('was-validated');
                this.handleErrors();
            }
        }, false);
        
        // Optional: Real-time validation on input
        if (this.options.validateOnInput) {
            this.setupRealTimeValidation();
        }
        
        // Setup custom validators
        this.setupCustomValidators();
    }
    
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (this.form.classList.contains('was-validated')) {
                    this.validateField(input);
                }
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    setupCustomValidators() {
        // Email validation
        const emailInputs = this.form.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value && !this.isValidEmail(input.value)) {
                    input.setCustomValidity('Please enter a valid email address');
                } else {
                    input.setCustomValidity('');
                }
            });
        });
        
        // URL validation
        const urlInputs = this.form.querySelectorAll('input[type="url"]');
        urlInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value && !this.isValidURL(input.value)) {
                    input.setCustomValidity('Please enter a valid URL (e.g., https://example.com)');
                } else {
                    input.setCustomValidity('');
                }
            });
        });
        
        // Phone validation
        const phoneInputs = this.form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value && input.hasAttribute('required') && !this.isValidPhone(input.value)) {
                    input.setCustomValidity('Please enter a valid phone number');
                } else {
                    input.setCustomValidity('');
                }
            });
        });
        
        // File input validation
        const fileInputs = this.form.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const maxSize = input.getAttribute('data-max-size') || 5242880; // 5MB default
                    const allowedTypes = input.getAttribute('accept')?.split(',').map(t => t.trim()) || [];
                    
                    if (file.size > maxSize) {
                        input.setCustomValidity(`File size must be less than ${this.formatBytes(maxSize)}`);
                    } else if (allowedTypes.length > 0 && !this.isAllowedFileType(file, allowedTypes)) {
                        input.setCustomValidity(`Please upload a valid file type: ${allowedTypes.join(', ')}`);
                    } else {
                        input.setCustomValidity('');
                    }
                }
            });
        });
    }
    
    validateForm() {
        return this.form.checkValidity();
    }
    
    validateField(field) {
        if (!field.checkValidity()) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }
    
    handleSuccess() {
        if (this.options.submitCallback) {
            this.options.submitCallback(this.getFormData());
        }
        
        if (this.options.showToast) {
            this.showToast('Success! Your form has been submitted.', 'success');
        }
    }
    
    handleErrors() {
        const firstInvalid = this.form.querySelector(':invalid');
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        if (this.options.showToast) {
            this.showToast('Please fill in all required fields correctly.', 'danger');
        }
    }
    
    getFormData() {
        const formData = {};
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.name) {
                if (input.type === 'checkbox') {
                    formData[input.name] = input.checked;
                } else if (input.type === 'file') {
                    formData[input.name] = input.files[0] || null;
                } else {
                    formData[input.name] = input.value;
                }
            }
        });
        return formData;
    }
    
    // Validation helper methods
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isValidURL(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }
    
    isValidPhone(phone) {
        // Basic phone validation - allows various formats
        const re = /^[\d\s\-\+\(\)]{7,}$/;
        return re.test(phone);
    }
    
    isAllowedFileType(file, allowedTypes) {
        return allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            return file.type.match(new RegExp(type.replace('*', '.*')));
        });
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    showToast(message, type = 'success') {
        // Create toast if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }
        
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, {
            animation: true,
            autohide: true,
            delay: 3000
        });
        
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
    
    reset() {
        this.form.reset();
        this.form.classList.remove('was-validated');
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
