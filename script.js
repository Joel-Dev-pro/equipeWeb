// Configuration EmailJS
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_ygqp9rm',
    TEMPLATE_ID: 'template_4wrqvir',
    PUBLIC_KEY: 'fJhI7C1Oj6yo6aikQ'
};

// Variables globales
let scrollObserver;
let navObserver;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Site L\'ÉQUIPE WEB initialisé');
    
    try {
        // Initialiser EmailJS
        initEmailJS();
        
        // Mettre à jour l'année dans le footer
        updateCurrentYear();
        
        // Menu mobile
        setupMobileMenu();
        
        // Navigation fluide
        setupSmoothNavigation();
        
        // Formulaires
        setupContactForm();
        
        // Animations au scroll
        setupScrollAnimations();
        
        // Barre de progression
        setupScrollProgress();
        
        // Animation du header au scroll
        setupHeaderOnScroll();
        
        // Observer pour la navigation active
        setupNavObserver();
        
        console.log('✅ Toutes les fonctionnalités sont initialisées');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    }
});

// Initialisation EmailJS
function initEmailJS() {
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY.length > 10) {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialisé');
    } else {
        console.warn('⚠️ EmailJS non configuré correctement');
    }
}

// Mettre à jour l'année
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Configuration du menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Fermer le menu en cliquant sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    navMenu.classList.remove('active');
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = '';
}

// Navigation fluide
function setupSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                closeMobileMenu();
                scrollToElement(targetElement);
                updateActiveNavLink(targetId);
            }
        });
    });
}

function scrollToElement(element) {
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Mettre à jour le lien actif dans la navigation
function updateActiveNavLink(targetId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Barre de progression
function setupScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;
    
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = Math.min(scrolled, 100) + '%';
    }
    
    // Initialiser
    updateScrollProgress();
    
    // Optimiser avec debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateScrollProgress, 10);
    });
}

// Animation du header au scroll
function setupHeaderOnScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initialiser
    updateHeader();
    
    // Optimiser avec debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateHeader, 10);
    });
}

// Configuration du formulaire de contact
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Réinitialiser les messages d'erreur
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => clearInputError(input));
        input.addEventListener('blur', () => validateField(input));
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Valider le formulaire
    if (!validateForm(form)) return;
    
    // Afficher l'indicateur de chargement
    setButtonLoading(submitBtn, true);
    
    try {
        const formData = getFormData(form);
        
        if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY.length < 10) {
            // Simulation pour le développement
            console.log('📧 Simulation d\'envoi d\'email');
            await simulateEmailSend();
            showFormMessage(successMessage, errorMessage, true);
            form.reset();
        } else {
            // Envoyer l'email via EmailJS
            await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                formData
            );
            console.log('✅ Email envoyé avec succès');
            showFormMessage(successMessage, errorMessage, true);
            form.reset();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi:', error);
        showFormMessage(successMessage, errorMessage, false);
        
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

function getFormData(form) {
    return {
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        message: form.querySelector('#message').value.trim(),
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR'),
        page: window.location.href
    };
}

function validateForm(form) {
    let isValid = true;
    
    // Valider chaque champ
    ['name', 'email', 'message'].forEach(fieldId => {
        const input = form.querySelector(`#${fieldId}`);
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById(`${input.id}-error`);
    
    if (!errorElement) return true;
    
    // Réinitialiser
    clearInputError(input);
    
    // Validation spécifique par champ
    let isValid = true;
    let errorMessage = '';
    
    switch(input.id) {
        case 'name':
            if (!value) {
                errorMessage = 'Veuillez entrer votre nom';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Veuillez entrer votre email';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Veuillez entrer un email valide';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Veuillez entrer votre message';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Le message doit contenir au moins 10 caractères';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showInputError(input, errorMessage);
    }
    
    return isValid;
}

function clearInputError(input) {
    input.style.borderColor = '';
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function showInputError(input, message) {
    input.style.borderColor = '#e74c3c';
    const errorElement = document.getElementById(`${input.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    
    if (isLoading) {
        button.disabled = true;
        btnText.textContent = 'Envoi en cours...';
        if (spinner) spinner.classList.remove('hidden');
    } else {
        button.disabled = false;
        btnText.textContent = 'Envoyer le message';
        if (spinner) spinner.classList.add('hidden');
    }
}

async function simulateEmailSend() {
    return new Promise(resolve => {
        setTimeout(resolve, 1500);
    });
}

function showFormMessage(successEl, errorEl, isSuccess) {
    if (!successEl || !errorEl) return;
    
    if (isSuccess) {
        successEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
    } else {
        errorEl.classList.remove('hidden');
        successEl.classList.add('hidden');
    }
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        successEl.classList.add('hidden');
        errorEl.classList.add('hidden');
    }, 5000);
}

// Animations au scroll
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .benefit, .stat');
    if (animatedElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });
}

// Observer pour la navigation active
function setupNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveNavLink('#' + sectionId);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px'
    });
    
    sections.forEach(section => {
        navObserver.observe(section);
    });
}

// Nettoyage des observateurs
window.addEventListener('beforeunload', () => {
    if (scrollObserver) scrollObserver.disconnect();
    if (navObserver) navObserver.disconnect();
});

// Gestion du redimensionnement de la fenêtre
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Fermer le menu mobile sur desktop
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250);
});

// Empêcher le FOUC (Flash of Unstyled Content)
document.documentElement.classList.add('js-loaded');

// Préchargement des ressources critiques
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.loading = 'lazy';
    });
}
