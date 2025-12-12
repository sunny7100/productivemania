// Productive Mania - Premium Interactive Website

class PremiumProductiveManiaWebsite {
    constructor() {
        this.isLoaded = false;
        this.currentSlide = 0;
        this.slideInterval = null;
        this.scrollThreshold = 100;
        this.animationObserver = null;

        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.initializeComponents();

        // Hide loading screen after initial setup
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoaded = true;
                this.startAnimations();
            }, 500);
        }
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('load', this.handleWindowLoad.bind(this));

        // Navigation events
        this.setupNavigation();
        this.setupMobileMenu();

        // Form events
        this.setupNewsletterForm();
        this.setupScrollToTop();
    }

    initializeComponents() {
        this.setupHeroSlideshow();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupParallaxEffects();
        this.setupCardHoverEffects();
        this.setupSmoothScrolling();
    }

    // Navigation functionality
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Update active nav on scroll
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        // Smooth scroll for nav links
        navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 100;
                        this.smoothScrollTo(offsetTop, 800);
                    }
                });
            }
        });
    }

    setupMobileMenu() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    // Hero slideshow functionality
    setupHeroSlideshow() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;

        this.slideInterval = setInterval(() => {
            slides[this.currentSlide].classList.remove('active');
            this.currentSlide = (this.currentSlide + 1) % slides.length;
            slides[this.currentSlide].classList.add('active');
        }, 6000);
    }

    // Scroll animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in, ' +
            '.featured-card, .category-card, .article-card, .feature-item'
        );

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Add staggered animation for grid items
                    if (entry.target.classList.contains('article-card') || 
                        entry.target.classList.contains('category-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }

                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            element.classList.add('fade-in-up');
            this.animationObserver.observe(element);
        });
    }

    // Counter animations
    setupCounterAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let countersAnimated = false;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    this.animateCounters();
                    counterObserver.disconnect();
                }
            });
        });

        if (statNumbers.length > 0) {
            counterObserver.observe(statNumbers[0].closest('.hero-stats'));
        }
    }

    animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // Parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.section-background, .hero-background-slideshow');

        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(element => {
                const rate = scrolled * -0.3;
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }

    // Card hover effects
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.featured-card, .article-card, .category-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            // Add tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });
    }

    // Smooth scrolling
    setupSmoothScrolling() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');

        scrollLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    this.smoothScrollTo(offsetTop, 800);
                }
            });
        });
    }

    smoothScrollTo(targetY, duration) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    // Newsletter form
    setupNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        const input = form?.querySelector('.newsletter-input');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = input.value.trim();

                if (this.validateEmail(email)) {
                    this.showNotification('Thank you for subscribing! Welcome to our community of explorers.', 'success');
                    input.value = '';

                    // Add success animation
                    const button = form.querySelector('.newsletter-btn');
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                } else {
                    this.showNotification('Please enter a valid email address.', 'error');
                    input.focus();
                }
            });
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-message">${message}</div>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        const closeNotification = () => {
            notification.classList.remove('visible');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', closeNotification);

        // Auto hide after 5 seconds
        setTimeout(closeNotification, 5000);
    }

    // Scroll to top button
    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');

        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', () => {
                this.smoothScrollTo(0, 800);
            });
        }
    }

    // Scroll handler
    handleScroll() {
        const navbar = document.getElementById('navbar');
        const scrollToTopBtn = document.getElementById('scrollToTop');
        const scrollY = window.pageYOffset;

        // Navbar scroll effect
        if (scrollY > this.scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll to top button visibility
        if (scrollToTopBtn) {
            if (scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    }

    // Window resize handler
    handleResize() {
        // Update any responsive calculations
        this.updateResponsiveElements();
    }

    handleWindowLoad() {
        // Trigger any load-dependent animations
        this.startAnimations();
    }

    updateResponsiveElements() {
        // Update mobile menu state
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');

        if (window.innerWidth > 768) {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    startAnimations() {
        if (!this.isLoaded) return;

        // Start any load-dependent animations
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('fade-in-up', 'visible');
        }
    }

    // Utility functions
    throttle(func, limit) {
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

    debounce(func, wait) {
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

    // Search functionality (placeholder for future implementation)
    setupSearch() {
        const searchInput = document.querySelector('.search-input');

        if (searchInput) {
            let searchTimeout;

            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        this.performSearch(query);
                    }, 300);
                }
            });
        }
    }

    performSearch(query) {
        // Placeholder for search functionality
        console.log(`Searching for: ${query}`);
        // Implementation would depend on your content management system
    }

    // Image lazy loading
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Error handling for images
    setupImageErrorHandling() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            img.addEventListener('error', () => {
                // Replace with placeholder or hide
                img.style.display = 'none';

                // Optionally add a placeholder
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.innerHTML = '<i class="fas fa-image"></i>';
                img.parentNode.insertBefore(placeholder, img);
            });
        });
    }

    // Performance monitoring
    logPerformanceMetrics() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                }, 0);
            });
        }
    }

    // Accessibility improvements
    setupAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');

                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle?.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }

                // Close any notifications
                const notification = document.querySelector('.notification');
                if (notification) {
                    notification.querySelector('.notification-close').click();
                }
            }
        });
    }

    // Dark mode toggle (future feature)
    setupDarkMode() {
        const darkModeToggle = document.querySelector('.dark-mode-toggle');

        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
            });

            // Load saved preference
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            if (savedDarkMode) {
                document.body.classList.add('dark-mode');
            }
        }
    }

    // Cleanup function
    destroy() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }

        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }

        // Remove event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('load', this.handleWindowLoad);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new PremiumProductiveManiaWebsite();

    // Make website instance globally available for debugging
    window.productiveManiaWebsite = website;
});

// Console welcome message
console.log(`
🌟 ========================================= 🌟
   Welcome to Productive Mania Premium!
🌟 ========================================= 🌟

🌍 Discover the world's most mysterious places
✨ Premium interactive experience loaded
🚀 Website optimized and ready for exploration

Built with ❤️ for adventure seekers worldwide
`);

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}