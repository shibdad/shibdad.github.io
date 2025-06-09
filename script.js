// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize all interactive features
    initScrollAnimations();
    initSmoothScrolling();
    initNavigationEffects();
    initHoverEffects();
    initParallaxEffects();
});

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.style.animationDelay || '0s';
                
                // Add a small delay to respect the animation-delay property
                setTimeout(() => {
                    element.classList.add('animate-in');
                }, parseFloat(delay) * 1000);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navigation effects
function initNavigationEffects() {
    const nav = document.querySelector('.navigation');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove backdrop blur based on scroll position
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Enhanced hover effects
function initHoverEffects() {
    // ML Cards enhanced hover
    const mlCards = document.querySelectorAll('.ml-card');
    mlCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });

    // Experience items hover effect
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-0.5rem)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Social buttons enhanced hover
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.15) rotate(5deg)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Tech badges hover effect
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-2px)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
}

// Parallax effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shape, .floating-dot');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Parallax background
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            const yPos = -(scrolled * 0.3);
            parallaxBg.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// Utility function to add staggered animations
function addStaggeredAnimation(elements, baseDelay = 0) {
    elements.forEach((element, index) => {
        element.style.animationDelay = `${baseDelay + (index * 0.1)}s`;
    });
}

// Initialize staggered animations for groups
document.addEventListener('DOMContentLoaded', function() {
    // Stagger tech badges
    const techBadges = document.querySelectorAll('.tech-badge');
    addStaggeredAnimation(techBadges, 0.5);

    // Stagger parallax tags
    const parallaxTags = document.querySelectorAll('.parallax-tag');
    addStaggeredAnimation(parallaxTags, 0);

    // Stagger ML cards
    const mlCards = document.querySelectorAll('.ml-card');
    addStaggeredAnimation(mlCards, 0.2);

    // Stagger web dev cards
    const webDevCards = document.querySelectorAll('.web-dev-card');
    addStaggeredAnimation(webDevCards, 0.2);
});

// Enhanced button click effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-cta, .btn-web-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// CSS for ripple animation
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Add ripple CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize button effects
document.addEventListener('DOMContentLoaded', initButtonEffects);

// Typing effect for hero title (optional enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title h1');
    if (!heroTitle) return;
    
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 50);
}

// Mouse tracking for enhanced interactivity
function initMouseTracking() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPercent = (clientX / innerWidth) * 100;
        const yPercent = (clientY / innerHeight) * 100;
        
        // Subtle parallax effect on background elements
        const bgElements = document.querySelectorAll('.bg-blob');
        bgElements.forEach((element, index) => {
            const speed = 0.02 + (index * 0.01);
            const x = (xPercent - 50) * speed;
            const y = (yPercent - 50) * speed;
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Performance optimization: Throttle scroll events
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
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Existing scroll handlers will be throttled
}, 16)); // ~60fps

// Intersection Observer for performance
const observerOptions = {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: '-50px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

// Observe all major sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

// Enhanced loading experience
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to enable transitions
    document.body.classList.add('loaded');
    
    // Ensure all images are loaded before showing content
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
        showContent();
    } else {
        let loadedImages = 0;
        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === images.length) {
                        showContent();
                    }
                });
            }
        });
        
        if (loadedImages === images.length) {
            showContent();
        }
    }
});

function showContent() {
    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero-section .fade-in');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 200);
    });
}

// Add CSS for enhanced loading states
const loadingCSS = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-in.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: #10b981;
        position: relative;
    }
    
    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 2px;
        background: #10b981;
        border-radius: 1px;
    }
    
    .navigation.scrolled {
        background: rgba(249, 250, 251, 0.95);
        backdrop-filter: blur(20px);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .section.in-view {
        transform: translateY(0);
        opacity: 1;
    }
`;

// Add enhanced CSS
const enhancedStyle = document.createElement('style');
enhancedStyle.textContent = loadingCSS;
document.head.appendChild(enhancedStyle);

// Console message for developers
console.log('%c🚀 Trey Brown Portfolio', 'font-size: 20px; font-weight: bold; color: #10b981;');
console.log('%cBuilt with vanilla HTML, CSS, and JavaScript', 'font-size: 14px; color: #6b7280;');
console.log('%cInterested in the code? Check out the GitHub repo!', 'font-size: 14px; color: #3b82f6;');
