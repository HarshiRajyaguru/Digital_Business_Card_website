// Download vCard function
function downloadVCard() {
    const data = window.businessCardData || {};
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name || 'Your Name'}
ORG:${data.company || 'Company Name'}
TITLE:${data.title || 'Your Job Title'}
TEL;TYPE=WORK,VOICE:${data.phone || '+1234567890'}
EMAIL;TYPE=PREF,INTERNET:${data.email || 'your.email@example.com'}
URL:${data.website || 'https://yourwebsite.com'}
ADR;TYPE=WORK:;;${data.location || 'City, Country'}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Share card function
function shareCard() {
    if (navigator.share) {
        navigator.share({
            title: 'Digital Business Card',
            text: 'Check out my digital business card!',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy link to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
}

// Load data from localStorage or preview
document.addEventListener('DOMContentLoaded', function() {
    loadBusinessCardData();
    addHoverEffects();
    checkAdminMode();
    loadProfileImage();
    initParticles();
    addScrollAnimations();
    initCardInteractions();
});

function loadBusinessCardData() {
    // Check if in preview mode
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';
    
    const storageKey = isPreview ? 'businessCardDataPreview' : 'businessCardData';
    const savedData = localStorage.getItem(storageKey);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Update personal info
        const nameElements = document.querySelectorAll('.name, .print-name');
        const titleElements = document.querySelectorAll('.title, .print-title');
        const companyElements = document.querySelectorAll('.company, .print-company');
        
        nameElements.forEach(el => { if (data.name) el.textContent = data.name; });
        titleElements.forEach(el => { if (data.title) el.textContent = data.title; });
        companyElements.forEach(el => {
            if (data.company) {
                if (el.querySelector('i')) {
                    el.innerHTML = `<i class="fas fa-building me-2"></i>${data.company}`;
                } else {
                    el.textContent = data.company;
                }
            }
        });
        
        if (data.about) {
            const aboutEl = document.querySelector('.about-text');
            if (aboutEl) aboutEl.textContent = data.about;
        }
        
        // Update contact info
        const contactItems = document.querySelectorAll('.contact-item');
        if (data.email) {
            contactItems[0].href = `mailto:${data.email}`;
            contactItems[0].querySelector('span').textContent = data.email;
            const printEmail = document.querySelector('.print-email');
            if (printEmail) printEmail.textContent = data.email;
        }
        if (data.phone) {
            contactItems[1].href = `tel:${data.phone}`;
            contactItems[1].querySelector('span').textContent = data.phone;
            const printPhone = document.querySelector('.print-phone');
            if (printPhone) printPhone.textContent = data.phone;
        }
        if (data.website) {
            contactItems[2].href = data.website;
            contactItems[2].querySelector('span').textContent = data.website.replace(/^https?:\/\//, '');
            const printWebsite = document.querySelector('.print-website');
            if (printWebsite) printWebsite.textContent = data.website.replace(/^https?:\/\//, '');
        }
        if (data.location) {
            contactItems[3].querySelector('span').textContent = data.location;
            const printLocation = document.querySelector('.print-location');
            if (printLocation) printLocation.textContent = data.location;
        }
        
        // Update social links
        const socialLinks = document.querySelectorAll('.social-btn');
        if (data.linkedin) {
            socialLinks[0].href = data.linkedin;
            const printLI = document.getElementById('printLinkedIn');
            if (printLI) printLI.textContent = 'LinkedIn: ' + data.linkedin.split('/').pop();
        }
        if (data.github) {
            socialLinks[1].href = data.github;
            const printGH = document.getElementById('printGitHub');
            if (printGH) printGH.textContent = 'GitHub: ' + data.github.split('/').pop();
        }
        if (data.twitter) {
            socialLinks[2].href = data.twitter;
            const printTW = document.getElementById('printTwitter');
            if (printTW) printTW.textContent = 'Twitter: ' + data.twitter.split('/').pop();
        }
        if (data.instagram) socialLinks[3].href = data.instagram;
        
        // Update colors
        if (data.primaryColor && data.secondaryColor) {
            document.documentElement.style.setProperty('--primary-color', data.primaryColor);
            document.documentElement.style.setProperty('--secondary-color', data.secondaryColor);
            
            const gradientBg = `linear-gradient(135deg, ${data.primaryColor} 0%, ${data.secondaryColor} 100%)`;
            document.documentElement.style.setProperty('--gradient', gradientBg);
            
            const cardHeader = document.querySelector('.card-header-section');
            if (cardHeader) cardHeader.style.background = gradientBg;
            
            const navbar = document.querySelector('.navbar');
            if (navbar) navbar.style.background = gradientBg;
            
            const printFront = document.querySelector('.print-front');
            if (printFront) printFront.style.background = gradientBg;
        }
        
        // Update vCard data
        window.businessCardData = data;
    }
}

function addHoverEffects() {
    // Disabled tilt effects to keep cards stable
}

// Check if admin mode (show image upload)
function checkAdminMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true';
    const isPreview = urlParams.get('preview') === 'true';
    
    if (isAdmin) {
        document.body.classList.add('is-admin');
        const uploadSection = document.getElementById('imageUploadSection');
        if (uploadSection) uploadSection.style.display = 'block';
        const inlineUpload = document.getElementById('inlineImageUpload');
        if (inlineUpload) inlineUpload.style.display = 'flex';
    }
    
    if (isPreview) {
        const backBtn = document.getElementById('backToAdminBtn');
        if (backBtn) backBtn.style.display = 'block';
    }
}

// Go back to admin page
function goBackToAdmin() {
    window.close();
    if (!window.closed) {
        window.location.href = 'admin.html';
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            
            // Save to localStorage
            localStorage.setItem('profileImage', imageData);
            
            // Update images
            updateProfileImages(imageData);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file smaller than 5MB');
    }
}

// Load profile image
function loadProfileImage() {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        updateProfileImages(savedImage);
    }
}

// Update all profile images
function updateProfileImages(imageData) {
    const profileImg = document.getElementById('profileImage');
    const printProfileImg = document.getElementById('printProfileImage');
    const placeholder = document.querySelector('.profile-placeholder');
    
    if (profileImg) {
        profileImg.src = imageData;
        profileImg.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    }
    
    if (printProfileImg) {
        printProfileImg.src = imageData;
        printProfileImg.style.display = 'block';
    }
}

// Initialize floating particles effect
function initParticles() {
    const container = document.querySelector('.screen-view');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 5 + 2;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(102,126,234,0.4) 100%);
        border-radius: 50%;
        left: ${startX}px;
        top: -20px;
        pointer-events: none;
        z-index: 1;
        animation: fall ${duration}s linear ${delay}s infinite;
        opacity: 0.6;
        box-shadow: 0 0 10px rgba(255,255,255,0.5);
    `;
    
    container.appendChild(particle);
}

// Add scroll-based animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    const elements = document.querySelectorAll('.info-card, .contact-item, .social-btn');
    elements.forEach(el => observer.observe(el));
}

// Initialize card interactions
function initCardInteractions() {
    const businessCard = document.querySelector('.business-card');
    if (!businessCard) return;
    
    // Parallax effect disabled to prevent random movement
    
    // Add click ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                left: ${x}px;
                top: ${y}px;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .pulse-btn {
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
        }
        50% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
        }
    }
    
    .back-btn {
        animation: slideIn 0.5s ease-out;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

