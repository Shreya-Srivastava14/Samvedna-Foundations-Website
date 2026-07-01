// Performance optimization: Use passive event listeners
const passiveSupported = checkPassiveSupport();

function checkPassiveSupport() {
    let passive = false;
    try {
        const options = {
            get passive() {
                passive = true;
                return false;
            }
        };
        window.addEventListener("test", null, options);
        window.removeEventListener("test", null, options);
    } catch (err) {
        passive = false;
    }
    return passive;
}

// Debounce function for performance
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

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeHero();
    initializeScrollAnimations();
    initializeCounters();
    initializeContactForm();
    initializeModals();
    initializeMobileMenu();
    initializeSlideshow();
    initializeMediaFilters();
    initializeStoriesSlider();
    initializeDonateModal();
    initializeProjectCards();
    initializeMediaCards();
    
    // Initialize YouTube Facades
    initializeYouTubeFacades();
});

// YouTube Facades for performance (click-to-load)
function initializeYouTubeFacades() {
    document.querySelectorAll('.youtube-facade').forEach(facade => {
        facade.addEventListener('click', function() {
            const videoId = this.dataset.videoId;
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute('title', 'YouTube video player');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', 'true');
            
            // Replace facade content with iframe
            this.innerHTML = '';
            this.appendChild(iframe);
        });
    });
}

// Media Filters
function initializeMediaFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mediaCards = document.querySelectorAll('.media-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update button styles
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline');
            });
            btn.classList.remove('btn-outline');
            btn.classList.add('btn-primary');

            // Filter cards with animation
            mediaCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect - debounced for performance
    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, 10);
    
    window.addEventListener('scroll', handleScroll, passiveSupported ? { passive: true } : false);
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Hero section functionality
function initializeHero() {
    // Scroll to top when logo is clicked
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Slideshow functionality - optimized
function initializeSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                // Dynamic lazy-load slideshow image
                const img = slide.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                slide.classList.add('active');
            }
        });
        
        // Pre-load the next slide's image to ensure seamless transitions
        const nextIndex = (index + 1) % slides.length;
        const nextSlide = slides[nextIndex];
        if (nextSlide) {
            const nextImg = nextSlide.querySelector('img[data-src]');
            if (nextImg) {
                nextImg.src = nextImg.dataset.src;
                nextImg.removeAttribute('data-src');
            }
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Initialize first slide
    showSlide(currentSlide);
    
    // Change slide every 4 seconds
    setInterval(nextSlide, 4000);
}

// Scroll animations - optimized with Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .team-member, .story-content, .about-content, .media-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter animation - optimized
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    let counterAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
                counterObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    counterObserver.observe(counters[0].closest('.impact-stats'));
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const targetText = counter.dataset.target;
        const target = parseInt(targetText.replace(/\+/g, ''));
        let count = 0;
        const increment = target / 60; // 60 frames for smooth animation
        
        const updateCounter = () => {
            count += increment;
            if (count < target) {
                counter.textContent = Math.ceil(count);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        console.log('Form submitted:', formData);
        
        // Clear form
        contactForm.reset();
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
    });
}

// Modal functionality
function initializeModals() {
    const projectModal = document.getElementById('project-modal');
    const galleryModal = document.getElementById('gallery-modal');
    
    if (!projectModal || !galleryModal) return;
    
    const projectModalClose = projectModal.querySelector('.modal-close');
    const galleryModalClose = galleryModal.querySelector('.modal-close');
    
    // Close project modal
    if (projectModalClose) {
        projectModalClose.addEventListener('click', closeModal);
    }
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // Close gallery modal
    if (galleryModalClose) {
        galleryModalClose.addEventListener('click', closeGalleryModal);
    }
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeGalleryModal();
            closeDonateModal();
        }
    });
}

// Close project modal
function closeModal() {
    const projectModal = document.getElementById('project-modal');
    if (projectModal) {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close gallery modal
function closeGalleryModal() {
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Open gallery modal
function openGalleryModal() {
    const galleryModal = document.getElementById('gallery-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (!galleryModal || !galleryGrid) return;
    
    const images = [
        'images/images/gallerymay1.webp',
        'images/images/gallerymay2.webp',
        'images/images/gallerymay3.webp',
        'images/images/gallerymay4.webp',
        'images/images/gallerymay5.webp',
        'images/images/gallerymay6.webp',
        'images/images/gallerymay7.webp',
        'images/images/gallerymay8.webp',
        'images/images/gallerymay9.webp',
        'images/images/gallerymay10.webp',
        'images/images/gallerymay11.webp',
        'images/images/gallerymay12.webp',
        'images/images/gallerymay13.webp',
        'images/images/gallerymay14.webp',
        'images/images/gallerymay15.webp',
        'images/images/gallerymay16.webp',
        'images/images/gallerymay17.webp',
        'images/images/gallerymay18.webp',
        'images/images/gallerymay19.webp',
        'images/images/gallerymay20.webp',
        'images/images/gallerymay21.webp',
        'images/images/gallerymay22.webp',
        'images/images/gallerymay23.webp',
        'images/images/gallerymay24.webp',
        'images/images/gallerymay25.webp',
        'images/images/gallerymay26.webp',
        'images/images/gallerymay27.webp',
        'images/images/gallerymay28.webp',
        'images/images/gallerymay29.webp',
        'images/images/gallerymay30.webp',
        'images/images/gallerymay31.webp',
        'images/images/gallerymay32.webp',
        'images/images/gallerymay33.webp',
        'images/images/gallerymay34.webp',
        'images/images/gallerymay35.webp',
        'images/images/gallerymay36.webp',
        'images/images/gallerymay37.webp',
        'images/images/gallerymay38.webp',
        'images/images/gallerymay39.webp',
        'images/images/gallerymay40.webp',
        'images/images/gallerymay41.webp',
        'images/images/gallerypic42.webp',
        'images/images/gallerypic43.webp',
        'images/images/gallerypic44.webp',
        'images/images/gallerypic45.webp',
        'images/images/gallerypic46.webp',
        'images/images/gallerypic47.webp',
        'images/images/gallerypic48.webp',
        'images/images/gallerypic49.webp',
        'images/images/gallerypic50.webp',
        'images/images/gallerypic51.webp',
        'images/images/gallerypic52.webp',
        'images/images/gallerypic53.webp',
        'images/images/gallerypic54.webp',
        'images/images/gallerypic55.webp',
        'images/images/gallerypic56.webp',
        'images/images/gallerypic57.webp',
        'images/images/gallerypic58.webp',
        'images/images/gallerypic59.webp',
        'images/images/gallerypic60.webp',
        'images/images/gallerypic61.webp',
        'images/images/gallerypic62.webp',
        'images/images/gallerypic63.webp',
        'images/images/gallerypic64.webp',
        'images/images/gallerypic65.webp',
        'images/images/gallerypic66.webp',
        'images/images/gallerypic67.webp',
        'images/images/gallerypic68.webp',
        'images/images/gallerypic69.webp',
        'images/images/gallerypic70.webp',
        'images/images/gallerypic71.webp',
        'images/images/gallerypic72.webp',
        'images/images/gallerypic73.webp',
        
       ];

    galleryGrid.innerHTML = images.map(img => `
        <img src="${img}" alt="Gallery Image" style="width:100%;height:200px;object-fit:contain;border-radius:15px;" loading="lazy">
    `).join('');

    galleryModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;
    
    const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}

// Donate Modal
function initializeDonateModal() {
    const modal = document.getElementById('qrModal');
    const btn = document.getElementById('donateBtn');
    const close = document.querySelector('.qr-close');
    
    if (!modal || !btn || !close) return;
    
    btn.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    close.addEventListener('click', closeDonateModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDonateModal();
        }
    });
}

function closeDonateModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Stories Slider
function initializeStoriesSlider() {
    const track = document.getElementById('storiesTrack');
    const dots = document.querySelectorAll('.dot');
    
    if (!track || dots.length === 0) return;
    
    const totalSlides = document.querySelectorAll('.story-item').length - 1;
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds
    let autoSlide;

    function goToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);

        if (currentSlide === totalSlides) {
            setTimeout(() => {
                track.style.transition = 'none';
                goToSlide(0);
                setTimeout(() => {
                    track.style.transition = 'transform 0.6s ease-in-out';
                }, 50);
            }, 600);
        }
    }

    // Auto-play
    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, slideInterval);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    startAutoSlide();

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
    });

    // Pause on hover
    const sliderContainer = document.querySelector('.stories-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

// Project Cards - Click handling
function initializeProjectCards() {
    document.querySelectorAll('.project-card .learn-more-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.project-card');
            const url = card.dataset.link;

            if (url && url.trim() !== '' && url !== '#') {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                alert('More details coming soon! Check our Facebook page for updates.');
            }
        });
    });

    // Make entire card clickable
    document.querySelectorAll('.project-card[data-link]').forEach(card => {
        if (card.dataset.link && card.dataset.link.trim() !== '' && card.dataset.link !== '#') {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                if (e.target.closest('.btn')) return;
                const url = this.dataset.link;
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        }
    });
}

// Media Cards - Click handling
function initializeMediaCards() {
    document.querySelectorAll('.media-card .read-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.media-card');
            const url = card.dataset.link;

            if (url && url !== '#') {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                alert('Article link is not available yet.');
            }
        });
    });

    // Make entire card clickable
    document.querySelectorAll('.media-card[data-link]').forEach(card => {
        if (card.dataset.link && card.dataset.link !== '#') {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                if (e.target.closest('.btn') || e.target.closest('button') || e.target.closest('iframe')) return;
                const url = this.dataset.link;
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        }
    });
}

// Performance: Reduce reflows and repaints
window.addEventListener('load', () => {
    // Force GPU acceleration for smooth animations
    const animatedElements = document.querySelectorAll('.hero-slide, .project-card, .team-member');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });
    
    // Remove will-change after animations complete to save memory
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
        });
    }, 5000);
});