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
    initializeProjectSlider();
    
});

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

            // Filter cards
            mediaCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
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
                
                // Close mobile menu if open
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
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

// Hero section functionality
function initializeHero() {
    // const heroTexts = [
    //     'Empowering Communities',
    //     'Nurturing Nature',
    //     'Educating the Future',
    //     'Building Equality',
    //     'Inspiring Change',
    //     'Sustainable Impact'
    // ];
    
    const changingTextElement = document.getElementById('changing-text');
    let currentTextIndex = 0;
    
    // Change hero text every 3 seconds
    setInterval(() => {
        changingTextElement.style.opacity = '0';
        
        setTimeout(() => {
            currentTextIndex = (currentTextIndex + 1) % heroTexts.length;
            changingTextElement.textContent = heroTexts[currentTextIndex];
            changingTextElement.style.opacity = '1';
        }, 300);
    }, 3000);
    
    // Scroll to top when logo is clicked
    document.querySelector('.nav-logo').addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Slideshow functionality
function initializeSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Initialize first slide
    showSlide(currentSlide);
    
    // Change slide every 3 seconds
    setInterval(nextSlide, 3000);
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .team-member, .story-content, .about-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}




// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let counterAnimated = false;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                counterAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    if (counters.length > 0) {
        counterObserver.observe(counters[0].closest('.impact-stats'));
    }
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        let count = 0;
        const increment = target / 100;
        
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
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        console.log('Form submitted:', { name, email, subject, message });
        
        // Clear form
        contactForm.reset();
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
    });
}

// Modal functionality
function initializeModals() {
    const projectModal = document.getElementById('project-modal');
    const projectModalClose = projectModal.querySelector('.modal-close');
    const galleryModal = document.getElementById('gallery-modal');
    const galleryModalClose = galleryModal.querySelector('.modal-close');
    
    // Close project modal
    projectModalClose.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });
    
    // Close gallery modal
    galleryModalClose.addEventListener('click', closeGalleryModal);
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
        }
    });
}

// Close project modal
function closeModal() {
    const projectModal = document.getElementById('project-modal');
    projectModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close gallery modal
function closeGalleryModal() {
    const galleryModal = document.getElementById('gallery-modal');
    galleryModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Open project modal with content
function openModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    let content = '';

    // Project-specific content
    switch (projectId) {
        case 'sangini':
            content = `
                <h2>Sangini</h2>
                <p>Sangini is dedicated to empowering women through skill development and sustainable livelihoods. We provide training in eco-friendly product creation, enabling women to achieve financial independence and contribute to their communities.</p>
                <img src="https://images.unsplash.com/photo-1594736797933-d0200ba6e804?w=500&h=300&fit=crop" alt="Sangini Project" style="width:100%;border-radius:10px;margin-top:1rem;">
                <p>Our programs include workshops, mentorship, and access to markets, ensuring long-term impact and empowerment.</p>
            `;
            break;
        case 'gyanshala':
            content = `
                <h2>Samvedna Gyanshala</h2>
                <p>Samvedna Gyanshala focuses on providing quality education to children from underserved communities. Our holistic approach includes academic support, extracurricular activities, and life skills training.</p>
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=300&fit=crop" alt="Gyanshala Project" style="width:100%;border-radius:10px;margin-top:1rem;">
                <p>We aim to create a nurturing environment where every child can thrive and build a brighter future.</p>
            `;
            break;
        case 'eshiksha':
            content = `
                <h2>E-Shiksha</h2>
                <p>E-Shiksha brings digital education to remote communities, bridging the gap in access to quality learning resources. We provide digital tools, online courses, and teacher training.</p>
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=300&fit=crop" alt="E-Shiksha Project" style="width:100%;border-radius:10px;margin-top:1rem;">
                <p>Our goal is to ensure every child has access to modern education, regardless of their location.</p>
            `;
            break;
        case 'sparrow':
            content = `
                <h2>Sparrow Conservation</h2>
                <p>Our Sparrow Conservation project focuses on protecting sparrow populations through habitat restoration and community awareness. We install nesting boxes and promote sustainable practices.</p>
                <img src="https://images.unsplash.com/photo-1517167497479-10f2e27c9db0?w=500&h=300&fit=crop" alt="Sparrow Conservation Project" style="width:100%;border-radius:10px;margin-top:1rem;">
                <p>Join us in preserving biodiversity and protecting these vital species for future generations.</p>
            `;
            break;
        default:
            content = '<p>Project details not found.</p>';
    }

    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open gallery modal
function openGalleryModal() {
    const galleryModal = document.getElementById('gallery-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const images = [
        'images/images/imageinside1.jpg',
        'images/images/imageinside2.jpg',
        'images/images/imageinside3.jpg',
        'images/images/imageinside4.jpg',
        'images/images/imageinside5.jpg',
        'images/images/imageinside6.jpg',
        'images/images/imageinside7.jpg',
        'images/images/imageinside8.jpg',
        'images/images/imageinside9.jpg',
        'images/images/imageinside10.jpg',
        'images/images/imageinside11.jpg',
        'images/images/imageinside12.jpg',
        'images/images/imageinside13.jpg',
        'images/images/imageinside14.jpg',
        'images/images/imageinside15.jpg',
        'images/images/imageinside16.jpg',
      
    ];

    galleryGrid.innerHTML = 
    images.map(img => `
        <img src="${img}" alt="Gallery Image" style="width:100%;height:200px;object-fit:cover;border-radius:15px;">
    `).join('');

    galleryModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Project slider functionality
function initializeProjectSlider() {
    const slider = document.getElementById('projects-slider');
    const prevBtn = document.getElementById('prev-project');
    const nextBtn = document.getElementById('next-project');
    
    function updateButtonStates() {
        prevBtn.disabled = slider.scrollLeft <= 0;
        nextBtn.disabled = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth;
    }
    
    prevBtn.addEventListener('click', () => {
        const cardWidth = slider.querySelector('.project-card').offsetWidth + 32; // Including gap
        slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        setTimeout(updateButtonStates, 300);
    });
    
    nextBtn.addEventListener('click', () => {
        const cardWidth = slider.querySelector('.project-card').offsetWidth + 32; // Including gap
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        setTimeout(updateButtonStates, 300);
    });
    
    slider.addEventListener('scroll', updateButtonStates);
    updateButtonStates();
}

// Scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const offsetTop = contactSection.getBoundingClientRect().top + window.pageYOffset - 80;

    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
}


/* ---------- Modal Logic ---------- */
const modal   = document.getElementById('qrModal');
const btn     = document.getElementById('donateBtn');
const close   = document.querySelector('.qr-close');

btn.onclick = () => modal.style.display = 'flex';
close.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };


const track = document.getElementById('storiesTrack');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = document.querySelectorAll('.story-item').length - 1; // -1 because of duplicate
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

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

        // Seamless loop: if we reach the duplicated first slide, jump back
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
    let autoSlide = setInterval(nextSlide, slideInterval);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlide);
            goToSlide(index);
            autoSlide = setInterval(nextSlide, slideInterval);
        });
    });

    // Pause on hover
    document.querySelector('.stories-slider').addEventListener('mouseenter', () => {
        clearInterval(autoSlide);
    });

    document.querySelector('.stories-slider').addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, slideInterval);
    });



   
document.addEventListener('DOMContentLoaded', () => {
    // Handle clicks on Read Now buttons
    document.querySelectorAll('.media-card .read-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // prevent card click if you add it later
            const card = this.closest('.media-card');
            const url = card.dataset.link;

            if (url && url !== '#') {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                alert('Article link is not available yet.');
            }
        });
    });

    // Optional: make the entire card clickable (very user-friendly)
    document.querySelectorAll('.media-card[data-link]').forEach(card => {
        if (card.dataset.link && card.dataset.link !== '#') {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(e) {
                // Don't trigger if clicked directly on button
                if (e.target.closest('.btn') || e.target.closest('button')) return;
                const url = this.dataset.link;
                window.open(url, '_blank', 'noopener,noreferrer');
            });
        }
    });
});
