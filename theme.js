// Theme Management System
(function() {
    'use strict';

    // Default theme
    const defaultTheme = {
        primary: '#06b6d4',
        secondary: '#0891b2',
        darkMode: false,
        reducedMotion: false
    };

    // Load saved theme from localStorage
    function loadTheme() {
        const saved = localStorage.getItem('siteTheme');
        return saved ? JSON.parse(saved) : defaultTheme;
    }

    // Save theme to localStorage
    function saveTheme(theme) {
        localStorage.setItem('siteTheme', JSON.stringify(theme));
    }

    // Apply theme colors to CSS variables
    function applyTheme(primary, secondary) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', primary);
        root.style.setProperty('--secondary-color', secondary);
        root.style.setProperty('--gradient', `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`);
        root.style.setProperty('--gradient-alt', `linear-gradient(135deg, ${adjustBrightness(primary, 20)} 0%, ${primary} 100%)`);
        
        // Update preview if on settings page
        updatePreview();
    }

    // Adjust color brightness
    function adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                     (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                     (B < 255 ? B < 1 ? 0 : B : 255))
                     .toString(16).slice(1);
    }

    // Apply dark mode
    function applyDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Apply reduced motion
    function applyReducedMotion(enabled) {
        if (enabled) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    // Update theme preview
    function updatePreview() {
        const previewPrimary = document.getElementById('previewPrimary');
        const previewSecondary = document.getElementById('previewSecondary');
        const previewGradient = document.getElementById('previewGradient');
        
        if (previewPrimary) {
            previewPrimary.style.background = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        }
        if (previewSecondary) {
            previewSecondary.style.background = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
        }
        if (previewGradient) {
            previewGradient.style.background = getComputedStyle(document.documentElement).getPropertyValue('--primary-gradient');
        }
    }

    // Initialize theme on page load
    function init() {
        const theme = loadTheme();
        applyTheme(theme.primary, theme.secondary);
        applyDarkMode(theme.darkMode);
        applyReducedMotion(theme.reducedMotion);

        // Update form controls if on settings page
        const primaryInput = document.getElementById('primaryColor');
        const secondaryInput = document.getElementById('secondaryColor');
        const darkModeSwitch = document.getElementById('darkModeSwitch');
        const reducedMotionSwitch = document.getElementById('reducedMotion');

        if (primaryInput) primaryInput.value = theme.primary;
        if (secondaryInput) secondaryInput.value = theme.secondary;
        if (darkModeSwitch) darkModeSwitch.checked = theme.darkMode;
        if (reducedMotionSwitch) reducedMotionSwitch.checked = theme.reducedMotion;

        // Setup dark mode toggle button
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            updateDarkModeButton(darkModeToggle, theme.darkMode);
            darkModeToggle.addEventListener('click', function() {
                theme.darkMode = !theme.darkMode;
                applyDarkMode(theme.darkMode);
                updateDarkModeButton(darkModeToggle, theme.darkMode);
                saveTheme(theme);
                if (darkModeSwitch) darkModeSwitch.checked = theme.darkMode;
            });
        }

        // Setup settings page controls
        if (primaryInput && secondaryInput) {
            // Theme preset buttons
            const presetButtons = document.querySelectorAll('.theme-preset');
            presetButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const primary = this.dataset.primary;
                    const secondary = this.dataset.secondary;
                    primaryInput.value = primary;
                    secondaryInput.value = secondary;
                    applyTheme(primary, secondary);
                    
                    // Update button states
                    presetButtons.forEach(b => {
                        const icon = b.querySelector('i');
                        if (icon) icon.className = 'fas fa-palette me-2';
                    });
                    const icon = this.querySelector('i');
                    if (icon) icon.className = 'fas fa-check me-2';
                });
            });

            // Custom theme button
            document.getElementById('applyCustomTheme')?.addEventListener('click', function() {
                applyTheme(primaryInput.value, secondaryInput.value);
            });

            // Real-time color picker updates
            primaryInput.addEventListener('input', function() {
                document.getElementById('previewPrimary').style.background = this.value;
            });
            secondaryInput.addEventListener('input', function() {
                document.getElementById('previewSecondary').style.background = this.value;
            });

            // Dark mode switch
            darkModeSwitch?.addEventListener('change', function() {
                applyDarkMode(this.checked);
            });

            // Reduced motion switch
            reducedMotionSwitch?.addEventListener('change', function() {
                applyReducedMotion(this.checked);
            });

            // Save settings button
            document.getElementById('saveSettings')?.addEventListener('click', function() {
                const newTheme = {
                    primary: primaryInput.value,
                    secondary: secondaryInput.value,
                    darkMode: darkModeSwitch.checked,
                    reducedMotion: reducedMotionSwitch.checked
                };
                saveTheme(newTheme);
                applyTheme(newTheme.primary, newTheme.secondary);
                
                // Show success message
                const btn = this;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check me-2"></i>Saved!';
                btn.classList.add('btn-success');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });

            // Reset button
            document.getElementById('resetTheme')?.addEventListener('click', function() {
                if (confirm('Reset all theme settings to default?')) {
                    saveTheme(defaultTheme);
                    location.reload();
                }
            });
        }
    }

    // Update dark mode button appearance
    function updateDarkModeButton(button, isDark) {
        const icon = button.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-sun';
            button.setAttribute('title', 'Switch to Light Mode');
        } else {
            icon.className = 'fas fa-moon';
            button.setAttribute('title', 'Switch to Dark Mode');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
