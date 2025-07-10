// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initViewportHeight(); // Initialize viewport height management first
    initSmoothScrolling();
    initScrollAnimations();
    initCounterAnimations();
    initMobileMenu();
    initFormHandler();
    initHeaderScroll();
    initSectionSnap();
    initServicesCarousel();
    initVideoBackground();
    initProgressBars();
    initCasesCarousel();
    initLogoScrollToTop();
    initLogoSizeForce(); // Force logo size
});

// Force logo size - prevent any dynamic changes
function initLogoSizeForce() {
    const logoImg = document.getElementById('logoImg');
    if (logoImg) {
        // Force logo size immediately
        logoImg.style.height = '75px';
        logoImg.style.width = 'auto';
        logoImg.style.maxWidth = '400px';
        logoImg.style.transform = 'none';
        logoImg.style.minHeight = '75px';
        
        // Create observer to reset any changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Reset logo size if it's changed
                    logoImg.style.height = '75px';
                    logoImg.style.width = 'auto';
                    logoImg.style.maxWidth = '400px';
                    logoImg.style.transform = 'none';
                    logoImg.style.minHeight = '75px';
                }
            });
        });
        
        observer.observe(logoImg, { attributes: true });
    }
}

// Logo scroll to top functionality with particle burst
function initLogoScrollToTop() {
    const logoLink = document.getElementById('logoLink');
    let lastHover = 0;
    let lastClick = 0;
    const hoverCooldown = 500; // 500ms cooldown for hover
    const clickCooldown = 1000; // 1000ms cooldown for click
    
    if (logoLink) {
        // Add hover particle effect with throttling
        logoLink.addEventListener('mouseenter', function() {
            const now = Date.now();
            if (now - lastHover > hoverCooldown) {
                createParticleBurst(this, false);
                lastHover = now;
            }
        });
        
        logoLink.addEventListener('click', function(e) {
            const now = Date.now();
            console.log('🎯 Logo clicked! Creating explosion...');
            e.preventDefault();
            
            // Throttle click effects
            if (now - lastClick < clickCooldown) {
                console.log('⏰ Click cooldown active, skipping explosion');
                return;
            }
            lastClick = now;
            
            // Simple explosion effect - create immediately
            try {
                createParticleBurst(this, true);
                console.log('✅ Explosion effect triggered successfully');
            } catch (error) {
                console.error('❌ Explosion effect failed:', error);
            }
            
            // Add immediate visual feedback
            this.style.filter = 'brightness(2) drop-shadow(0 0 20px #ffeb3b)';
            const resetFilter = () => {
                this.style.filter = '';
                console.log('🔄 Filter reset complete');
            };
            setTimeout(resetFilter, 200);
            
            // Smooth scroll to top
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 300);
            
            // Optional: Add a subtle animation to the logo
            const logoImg = document.getElementById('logoImg');
            if (logoImg) {
                logoImg.style.transform = 'scale(0.9)';
                const resetTransform = () => {
                    logoImg.style.transform = 'none';
                    console.log('🔄 Transform reset complete');
                };
                setTimeout(resetTransform, 150);
            }
            
            // Ensure touch events are not blocked after click (mobile fix)
            setTimeout(() => {
                // Complete reset of all scroll-blocking styles
                document.body.style.touchAction = '';
                document.documentElement.style.touchAction = '';
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.body.style.overflowY = '';
                document.documentElement.style.overflowY = '';
                document.body.style.pointerEvents = '';
                document.documentElement.style.pointerEvents = '';
                document.body.style.userSelect = '';
                document.documentElement.style.userSelect = '';
                
                // Force scroll restoration
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                
                console.log('📱 Complete scroll restoration applied');
            }, 500);
        });
    }
}

// Create dynamic particle burst effect (All devices)
function createParticleBurst(element, isClick = false) {
    // Only disable on very small screens (actual phones)
    const isSmallMobile = window.innerWidth <= 480;
    if (isSmallMobile) {
        console.log('📱 Small mobile detected - particle effects disabled');
        
        // Even on small mobile, ensure scroll is working after click
        if (isClick) {
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                document.body.style.touchAction = '';
                document.documentElement.style.touchAction = '';
                console.log('📱 Mobile scroll restoration applied even without particles');
            }, 500);
        }
        return;
    }
    
    console.log(`🚀 createParticleBurst called with isClick: ${isClick}`);
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Consistent settings for all screen sizes - small particles, wide spread, more count
    const particleCount = isClick ? 20 : 6; // More particles for explosion
    const baseDistance = isClick ? 100 : 20; // Base distance 
    const randomDistance = isClick ? 150 : 30; // Wide spread
    const baseSize = isClick ? 6 : 4; // Small particles
    const randomSize = isClick ? 4 : 2; // Small variation
    
    console.log(`💥 Creating ${isClick ? 'EXPLOSION' : 'hover'} effect with ${particleCount} particles at (${centerX}, ${centerY})`);
    
    // Create particle container for easier cleanup
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 9999 !important;
        overflow: hidden !important;
    `;
    document.body.appendChild(particleContainer);
    
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = isClick ? 'explosion-particle' : 'dynamic-particle';
        
        // Random position around the logo - completely random for wide spread
        const angle = isClick ? 
            Math.random() * 360 : // Completely random angle for explosion
            (360 / particleCount) * i + (Math.random() - 0.5) * 90; // Structured for hover
        const distance = baseDistance + Math.random() * randomDistance;
        const deltaX = Math.cos(angle * Math.PI / 180) * distance;
        const deltaY = Math.sin(angle * Math.PI / 180) * distance;
        
        const particleSize = baseSize + Math.random() * randomSize;
        const animationDuration = isClick ? (2.0 + Math.random() * 1.0) : 1.2; // Longer duration for desktop
        
        // Set styles individually for better CSS variable support
        particle.style.position = 'absolute';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = particleSize + 'px';
        particle.style.height = particleSize + 'px';
        particle.style.background = isClick ? '#ff6b35' : 'rgba(255, 255, 255, 0.9)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.boxShadow = isClick ? '0 0 8px #ff6b35, 0 0 16px #ffeb3b' : '0 0 6px rgba(255, 255, 255, 0.8)';
        particle.style.animation = `${isClick ? 'explosionParticle' : 'dynamicParticle'} ${animationDuration}s ease-out forwards`;
        
        // Set CSS variables properly
        particle.style.setProperty('--delta-x', deltaX + 'px');
        particle.style.setProperty('--delta-y', deltaY + 'px');
        
        console.log(`Particle ${i}: Start(${centerX}, ${centerY}) -> Delta(${Math.round(deltaX)}, ${Math.round(deltaY)}), Distance: ${Math.round(distance)}px`);
        
        particleContainer.appendChild(particle);
        particles.push(particle);
    }
    
    // Add screen flash effect for explosion
    if (isClick) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            pointer-events: none !important;
            background: radial-gradient(circle at ${centerX}px ${centerY}px, rgba(255, 235, 59, 0.2) 0%, transparent 40%) !important;
            animation: flashEffect 0.3s ease-out forwards !important;
        `;
        particleContainer.appendChild(flash);
    }
    
    // Clean up all particles and container after animation
    const maxDuration = isClick ? 3500 : 1500; // Longer for desktop explosion
    setTimeout(() => {
        if (particleContainer.parentNode) {
            particleContainer.parentNode.removeChild(particleContainer);
            console.log('🧹 All particles cleaned up');
            
            // Verify scroll is working after cleanup
            console.log('🖱️ Scroll check - body overflow:', document.body.style.overflow || 'default');
            console.log('🖱️ Scroll check - html overflow:', document.documentElement.style.overflow || 'default');
            
            // Ensure touch events are fully restored (mobile fix)
            document.body.style.touchAction = '';
            document.documentElement.style.touchAction = '';
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.overflowY = '';
            document.documentElement.style.overflowY = '';
            document.body.style.pointerEvents = '';
            document.documentElement.style.pointerEvents = '';
            document.body.style.userSelect = '';
            document.documentElement.style.userSelect = '';
            
            // Force scroll restoration
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            
            console.log('📱 Complete scroll restoration applied after cleanup');
        }
    }, maxDuration);
}

// LIG-style viewport height management with CSS variables
function initViewportHeight() {
    function setViewportHeight() {
        // Get the actual viewport height
        const vh = window.innerHeight * 0.01;
        
        // Set --initVh CSS variable for consistent height across devices
        document.documentElement.style.setProperty('--initVh', `${vh}px`);
        
        // Also set --vh for backward compatibility
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Debug log for development (remove in production)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Viewport height updated: ${window.innerHeight}px, --initVh: ${vh}px`);
        }
    }
    
    // Set initial height
    setViewportHeight();
    
    // Update on window resize
    window.addEventListener('resize', setViewportHeight);
    
    // Update on orientation change (mobile devices)
    window.addEventListener('orientationchange', () => {
        // Delay to ensure proper orientation change completion
        setTimeout(setViewportHeight, 100);
    });
    
    // Handle mobile browser address bar changes
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                setViewportHeight();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Visual viewport API support for modern browsers
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', requestTick);
    }
    
    // Legacy support for older mobile browsers
    window.addEventListener('scroll', requestTick);
}

// Video Background with Fallback
function initVideoBackground() {
    const video = document.getElementById('heroVideo');
    const fallback = document.getElementById('videoFallback');
    
    if (!video || !fallback) return;
    
    // Show fallback immediately
    fallback.classList.add('active');
    
    // Try to load video
    video.addEventListener('loadeddata', function() {
        // Video loaded successfully, hide fallback
        fallback.classList.remove('active');
    });
    
    video.addEventListener('error', function() {
        // Video failed to load, keep fallback
        fallback.classList.add('active');
        console.log('Hero video failed to load, using fallback background');
    });
    
    // If video doesn't load within 5 seconds, use fallback
    setTimeout(() => {
        if (video.readyState < 2) { // Less than HAVE_CURRENT_DATA
            fallback.classList.add('active');
            console.log('Hero video load timeout, using fallback background');
        }
    }, 5000);
}

// Smooth Scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            // Only prevent default and smooth scroll if target element exists
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 0; // No offset - header top aligns with section top
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Use requestAnimationFrame to ensure smooth scrolling after header updates
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                });
            }
        });
    });
}

// Enhanced LIG-style scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with staggered delay for child elements
                entry.target.classList.add('animate-in');
                
                // Animate child elements with staggered delays
                const animatableElements = entry.target.querySelectorAll('.animate-item');
                animatableElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('animate-in');
                    }, index * 100); // 100ms delay between elements
                });
                
                // Trigger counter animation if it's a KPI section
                if (entry.target.classList.contains('kpi-highlights')) {
                    setTimeout(() => {
                        animateCounters();
                    }, 300);
                }
            }
        });
    }, observerOptions);
    
    // Observe sections (excluding hero section which should be immediately visible)
    const sections = document.querySelectorAll('.section:not(.hero)');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual elements that should animate
    const animatableElements = document.querySelectorAll('.animate-item');
    animatableElements.forEach(element => {
        observer.observe(element);
    });
    
    // Hero section should be immediately visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.classList.add('animate-in');
    }
}

// Progress Bar Animations
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                // Set CSS custom property for animation
                progressBar.style.setProperty('--progress-width', progress + '%');
                
                // Trigger animation
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 200);
                
                // Unobserve after animation
                observer.unobserve(progressBar);
            }
        });
    }, {
        threshold: 0.3
    });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize counter animations with intersection observer
function initCounterAnimations() {
    const counters = document.querySelectorAll('.kpi-item__value[data-count]');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Counter animations for KPI numbers with improved easing
function animateCounter(counter) {
    if (counter.classList.contains('animated')) return; // Prevent re-animation
    
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const originalText = counter.textContent;
    
    // Mark as animated
    counter.classList.add('animated');
    
    // Easing function for smooth animation
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);
        
        // Format the number based on the original text content
        if (originalText.includes('%')) {
            counter.textContent = current + '%';
        } else if (originalText.includes('K')) {
            counter.textContent = current + 'K+';
        } else if (originalText.includes('点')) {
            counter.textContent = current + '点';
        } else {
            counter.textContent = current;
        }
        
        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Ensure exact final value
            if (originalText.includes('%')) {
                counter.textContent = target + '%';
            } else if (originalText.includes('K')) {
                counter.textContent = target + 'K+';
            } else if (originalText.includes('点')) {
                counter.textContent = target + '点';
            } else {
                counter.textContent = target;
            }
        }
    }
    
    // Start animation
    requestAnimationFrame(animate);
}

// Legacy function for backward compatibility
function animateCounters() {
    const counters = document.querySelectorAll('.kpi-item__value[data-count]');
    counters.forEach(counter => {
        animateCounter(counter);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const toggle = document.getElementById('headerToggle');
    const nav = document.getElementById('headerNav');
    const overlay = document.getElementById('mobileOverlay');
    const navClose = document.getElementById('navClose');
    
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            const isOpen = nav.classList.contains('mobile-open');
            
            // Toggle mobile menu
            if (isOpen) {
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            } else {
                nav.classList.add('mobile-open');
                toggle.classList.add('active');
                if (overlay) overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close menu when clicking on a link (mobile only)
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu when clicking nav link
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside or on overlay
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close menu with close button
        if (navClose) {
            navClose.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                toggle.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }
}

// Contact form handler
function initFormHandler() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateForm(data)) {
                return;
            }
            
            // Disable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Show success message
                showNotification('お問い合わせを受け付けました。24時間以内にご返信いたします。', 'success');
                
                // Reset form
                form.reset();
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // In real implementation, you would send data to your backend
                console.log('Form data:', data);
                
            }, 2000);
        });
    }
}

// Form validation
function validateForm(data) {
    const errors = [];
    
    if (!data.company || data.company.trim().length < 2) {
        errors.push('会社名を正しく入力してください');
    }
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('お名前を正しく入力してください');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('有効なメールアドレスを入力してください');
    }
    
    if (!data.service) {
        errors.push('ご相談内容を選択してください');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <p>${message.replace(/\n/g, '<br>')}</p>
            <button class="notification__close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#007BFF'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Header scroll effect with section-aware styling
function initHeaderScroll() {
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('.section, .hero');
    let lastScrollTop = 0;
    
    function getCurrentSection() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop - 50 && scrollTop < sectionBottom - 50) {
                return section;
            }
        }
        return sections[0]; // Default to first section
    }
    
    function updateHeaderStyle() {
        const currentSection = getCurrentSection();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if current section has dark background
        const isDarkSection = currentSection.classList.contains('hero') || 
                             currentSection.classList.contains('section--dark') ||
                             currentSection.id === 'results';
        
        if (isDarkSection) {
            // Dark section - almost transparent dark header
            header.style.background = 'rgba(0, 0, 0, 0.15)'; // Almost transparent
            header.style.color = '#ffffff';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            
            // Update logo and nav colors for dark sections
            const logoImg = header.querySelector('.logo-img');
            const navLinks = header.querySelectorAll('.nav-list a');
            const toggleSpans = header.querySelectorAll('.header__toggle span');
            const contactBtn = header.querySelector('.header__contact-btn');
            if (logoImg) logoImg.src = 'image/logo_white.png'; // Use white logo for dark sections
            navLinks.forEach(link => link.style.color = '#ffffff');
            toggleSpans.forEach(span => span.style.background = '#ffffff');
            if (contactBtn) {
                contactBtn.style.color = '#ffffff';
                contactBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
        } else {
            // Light section - almost transparent light header
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.2)'; // Almost transparent
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)'; // Almost transparent
                header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.02)';
            }
            header.style.color = '#111111';
            
            // Update logo and nav colors for light sections
            const logoImg = header.querySelector('.logo-img');
            const navLinks = header.querySelectorAll('.nav-list a');
            const toggleSpans = header.querySelectorAll('.header__toggle span');
            const contactBtn = header.querySelector('.header__contact-btn');
            if (logoImg) logoImg.src = 'image/logo.png'; // Use dark logo for light sections
            navLinks.forEach(link => link.style.color = '#111111');
            toggleSpans.forEach(span => span.style.background = '#111111');
            if (contactBtn) {
                contactBtn.style.color = '#111111';
                contactBtn.style.borderColor = 'rgba(0, 0, 0, 0.3)';
                contactBtn.style.background = 'rgba(0, 0, 0, 0.05)';
            }
        }
        
        // Hide/show header on scroll (optional - can be disabled)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down - keep header visible for better UX
            // header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Use throttled scroll event to prevent excessive updates
    const throttledUpdateHeaderStyle = throttle(updateHeaderStyle, 16); // ~60fps
    window.addEventListener('scroll', throttledUpdateHeaderStyle);
    updateHeaderStyle(); // Initial call
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced Section Snap Functionality for LIG-style fixed section feeling
function initSectionSnap() {
    const sections = document.querySelectorAll('.section-snap');
    if (sections.length === 0) {
        console.log('No section-snap elements found');
        return;
    }
    
    let isScrolling = false;
    let scrollTimeout;
    let lastScrollTime = 0;
    let scrollVelocity = 0;
    let lastScrollTop = 0;
    
    // Enhanced scroll-snap with smart tolerance
    sections.forEach((section, index) => {
        section.style.scrollSnapAlign = 'start';
        section.style.scrollSnapStop = 'normal'; // Less aggressive snapping
        section.setAttribute('data-section-index', index);
    });
    
    // Smart snap tolerance function
    function shouldSnapToSection(sectionTop, currentScroll) {
        const snapTolerance = 100; // Increased tolerance zone to 100px
        const distanceFromTop = Math.abs(currentScroll - sectionTop);
        
        // Snap if we're within tolerance OR if scroll velocity is very low (almost stopped)
        return distanceFromTop <= snapTolerance || Math.abs(scrollVelocity) < 0.5;
    }
    
    // Add section transition indicators
    function addSectionIndicators() {
        if (sections.length === 0) return; // Guard clause
        
        const indicator = document.createElement('div');
        indicator.className = 'section-indicators';
        indicator.innerHTML = Array.from(sections).map((_, index) => 
            `<div class="section-indicator" data-section="${index}"></div>`
        ).join('');
        document.body.appendChild(indicator);
        
        // Update active indicator on scroll
        updateActiveIndicator();
    }
    
    function updateActiveIndicator() {
        const indicators = document.querySelectorAll('.section-indicator');
        const currentSectionIndex = getCurrentSectionIndex();
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSectionIndex);
        });
    }
    
    function getCurrentSectionIndex() {
        const scrollPosition = window.pageYOffset;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionBottom - 50) {
                return i;
            }
        }
        return 0;
    }
    
    // Enhanced scroll snap behavior with smart snapping
    function handleScrollEnd() {
        if (!isScrolling) return;
        
        isScrolling = false;
        const currentScroll = window.pageYOffset;
        const currentTime = Date.now();
        
        // Calculate scroll velocity
        const timeDiff = currentTime - lastScrollTime;
        scrollVelocity = timeDiff > 0 ? (currentScroll - lastScrollTop) / timeDiff : 0;
        
        // Find the closest section
        let closestSection = null;
        let closestDistance = Infinity;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const distance = Math.abs(currentScroll - sectionTop);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });
        
        // More lenient snapping conditions
        if (closestSection) {
            const sectionTop = closestSection.offsetTop;
            const distanceFromTop = Math.abs(currentScroll - sectionTop);
            
            // Snap if:
            // 1. Very close to section start (within 100px)
            // 2. OR scroll has stopped and we're reasonably close (within 200px)
            if (distanceFromTop <= 100 || (Math.abs(scrollVelocity) < 0.5 && distanceFromTop <= 200)) {
                closestSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        
        updateActiveIndicator();
        lastScrollTop = currentScroll;
        lastScrollTime = currentTime;
    }
    
    // Scroll event handling with smart throttling
    const throttledScrollHandler = throttle(() => {
        const currentScroll = window.pageYOffset;
        const currentTime = Date.now();
        
        // Calculate velocity for smart snapping
        if (lastScrollTime > 0) {
            const timeDiff = currentTime - lastScrollTime;
            scrollVelocity = timeDiff > 0 ? (currentScroll - lastScrollTop) / timeDiff : 0;
        }
        
        isScrolling = true;
        clearTimeout(scrollTimeout);
        
        updateActiveIndicator();
        
        // Shorter timeout for more responsive snapping
        scrollTimeout = setTimeout(handleScrollEnd, 200);
        
        lastScrollTop = currentScroll;
        lastScrollTime = currentTime;
    }, 16);
    
    window.addEventListener('scroll', throttledScrollHandler);
    
    // Initialize indicators
    addSectionIndicators();
    
    // Add click functionality to indicators
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('section-indicator')) {
            const sectionIndex = parseInt(e.target.getAttribute('data-section'));
            if (sections[sectionIndex]) {
                sections[sectionIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
    
    // Keyboard navigation for sections
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentIndex = getCurrentSectionIndex();
            let targetIndex;
            
            if (e.key === 'ArrowDown') {
                targetIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                targetIndex = Math.max(currentIndex - 1, 0);
            }
            
            if (targetIndex !== currentIndex) {
                sections[targetIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}
// Simplified Infinite Carousel for Services
function initServicesCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    const prevBtn = document.getElementById('servicesPrev');
    const nextBtn = document.getElementById('servicesNext');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carousel) {
        console.error('Services carousel not found!');
        return;
    }
    
    const cards = Array.from(carousel.children);
    const totalSlides = cards.length;
    let currentSlide = 0;
    let isTransitioning = false;
    let resizeTimer;
    
    function getCardWidth() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) return 400;
        if (screenWidth >= 768) return 350;
        return Math.min(300, screenWidth - 80);
    }
    
    function updateCarousel(animate = true) {
        const cardWidth = getCardWidth();
        const gap = 32;
        const translateX = -currentSlide * (cardWidth + gap);
        
        carousel.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        carousel.style.transform = `translateX(${translateX}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update card widths
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
        });
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        
        isTransitioning = true;
        currentSlide = index;
        updateCarousel();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Initialize
    updateCarousel(false);
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel(false);
        }, 150);
    });
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = startX - currentX;
        
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
    
    // Auto-play disabled - manual control only
    // Users can control carousel through touch, swipe, or buttons
    
    // Responsive adjustments
    function handleResize() {
        updateCarousel();
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
}

// Simplified Infinite Carousel for Cases
function initCasesCarousel() {
    const carousel = document.getElementById('casesCarousel');
    const prevBtn = document.getElementById('casesPrev');
    const nextBtn = document.getElementById('casesNext');
    
    console.log('Initializing simple infinite cases carousel...');
    
    if (!carousel) {
        console.log('Cases carousel not found');
        return;
    }
    
    const cards = Array.from(carousel.children);
    const totalSlides = cards.length;
    let currentSlide = 0;
    let isTransitioning = false;
    
    function getCaseCardWidth() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) return 400;
        if (screenWidth >= 768) return 380;
        return 320;
    }
    
    function updateCarousel() {
        const cardWidth = getCaseCardWidth();
        const gap = 32;
        const translateX = -currentSlide * (cardWidth + gap);
        
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        carousel.style.transform = `translateX(${translateX}px)`;
        
        console.log('Cases carousel updated:', { currentSlide, translateX });
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Simple infinite loop
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
        
        console.log('Cases next slide:', currentSlide);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Simple infinite loop
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
        
        console.log('Cases prev slide:', currentSlide);
    }
    
    // Initialize
    updateCarousel();
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        console.log('Cases next button initialized');
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        console.log('Cases prev button initialized');
    }
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = startX - currentX;
        
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
    
    // Auto-play disabled - manual control only
    // Users can control carousel through touch, swipe, or buttons
    
    // Responsive adjustments
    function handleResize() {
        updateCarousel();
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
}

// Lazy loading for images (if needed)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
}

// Error handling
window.addEventListener('error', function(e) {
    // Don't log resource loading errors (images, etc.)
    if (e.message && e.message.includes('Failed to load resource')) {
        return;
    }
    console.error('JavaScript error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }, 0);
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}