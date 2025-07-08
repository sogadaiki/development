// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
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
});

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
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if it's a KPI section
                if (entry.target.classList.contains('kpi-highlights')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });
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

// Counter animations for KPI numbers (legacy support)
function animateCounters() {
    const counters = document.querySelectorAll('.kpi-item__value[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number based on the original text
            const originalText = counter.textContent;
            if (originalText.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const toggle = document.getElementById('headerToggle');
    const nav = document.getElementById('headerNav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            const isOpen = nav.style.display === 'block';
            nav.style.display = isOpen ? 'none' : 'block';
            
            // Animate hamburger icon
            const spans = toggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (!isOpen) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.style.display = 'none';
                const spans = toggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
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

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
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

// Section Snap Functionality
function initSectionSnap() {
    // Only enable on desktop and tablets (not on mobile)
    if (window.innerWidth <= 767) return;
    
    // Disable on touchscreens except large tablets
    if ('ontouchstart' in window && window.innerWidth <= 1024) return;
    
    const sections = document.querySelectorAll('.section-snap');
    let currentSection = 0;
    let isScrolling = false;
    
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        isScrolling = true;
        sections[index].scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        currentSection = index;
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
    
    // Wheel event for scroll lock
    function handleWheel(e) {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();
        
        if (e.deltaY > 0) {
            // Scroll down
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else {
            // Scroll up
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    }
    
    // Touch events for mobile swipe
    let touchStartY = 0;
    
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    
    function handleTouchEnd(e) {
        if (isScrolling) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) > 50) { // Minimum swipe distance
            if (deltaY > 0) {
                // Swipe up (scroll down)
                if (currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                }
            } else {
                // Swipe down (scroll up)
                if (currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
            }
        }
    }
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentSection < sections.length - 1) {
                    scrollToSection(currentSection + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentSection > 0) {
                    scrollToSection(currentSection - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                scrollToSection(0);
                break;
            case 'End':
                e.preventDefault();
                scrollToSection(sections.length - 1);
                break;
        }
    });
    
    // Update current section on scroll (for manual scrolling)
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionIndex = Array.from(sections).indexOf(entry.target);
                if (sectionIndex !== -1) {
                    currentSection = sectionIndex;
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    sections.forEach(section => sectionObserver.observe(section));
}
// Simplified Infinite Carousel for Services
function initServicesCarousel() {
    const carousel = document.getElementById('servicesCarousel');
    const prevBtn = document.getElementById('servicesPrev');
    const nextBtn = document.getElementById('servicesNext');
    const indicators = document.querySelectorAll('.indicator');
    
    console.log('Initializing simple infinite services carousel...');
    
    if (!carousel) {
        console.error('Services carousel not found!');
        return;
    }
    
    const cards = Array.from(carousel.children);
    const totalSlides = cards.length;
    let currentSlide = 0;
    let isTransitioning = false;
    
    function getCardWidth() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) return 400;
        if (screenWidth >= 768) return 350;
        return 300;
    }
    
    function updateCarousel() {
        const cardWidth = getCardWidth();
        const gap = 32;
        const translateX = -currentSlide * (cardWidth + gap);
        
        carousel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        carousel.style.transform = `translateX(${translateX}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        console.log('Carousel updated:', { currentSlide, translateX });
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
        
        console.log('Next slide:', currentSlide);
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
        
        console.log('Prev slide:', currentSlide);
    }
    
    function goToSlide(index) {
        if (isTransitioning) return;
        currentSlide = index;
        updateCarousel();
        
        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }
    
    // Initialize
    updateCarousel();
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        console.log('Next button initialized');
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        console.log('Prev button initialized');
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
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
    
    // Auto-play
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start autoplay
    startAutoPlay();
    
    // Pause on hover/touch
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('touchstart', stopAutoPlay);
    
    // Responsive adjustments
    function handleResize() {
        updateCarousel();
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
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
    
    // Auto-play
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start autoplay
    startAutoPlay();
    
    // Pause on hover/touch
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('touchstart', stopAutoPlay);
    
    // Responsive adjustments
    function handleResize() {
        updateCarousel();
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
}// Enhanced scroll performance
window.addEventListener('scroll', throttle(function() {
    // Any scroll-based animations can be added here
}, 16)); // ~60fps

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