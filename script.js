// Configuration EmailJS - À REMPLACER AVEC VOS VRAIES INFORMATIONS
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_ygqp9rm', // À remplacer
    TEMPLATE_ID: 'template_4wrqvir', // À remplacer
    PUBLIC_KEY: 'fJhI7C1Oj6yo6aikQ' // À remplacer
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Site L\'ÉQUIPE WEB initialisé');
    
    // Initialiser EmailJS si configuré
    if (EMAILJS_CONFIG.PUBLIC_KEY && !EMAILJS_CONFIG.PUBLIC_KEY.includes('xxxx')) {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS initialisé');
    } else {
        console.warn('⚠️ EmailJS non configuré. Ajoutez vos identifiants dans le fichier script.js');
    }
    
    // Mettre à jour l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
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
    
    console.log('✅ Toutes les fonctionnalités sont initialisées');
});

// Configuration du menu mobile
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Fermer le menu en cliquant sur un lien
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Navigation fluide
function setupSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Fermer le menu mobile si ouvert
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
                
                // Scroll vers l'élément
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mettre à jour la navigation active
                updateActiveNavLink(targetId);
            }
        });
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
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// Animation du header au scroll
function setupHeaderOnScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Configuration du formulaire de contact
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('spinner');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Valider le formulaire
        if (!validateContactForm()) return;
        
        // Afficher l'indicateur de chargement
        btnText.textContent = 'Envoi en cours...';
        spinner.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Récupérer les données du formulaire
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            date: new Date().toLocaleDateString('fr-FR'),
            time: new Date().toLocaleTimeString('fr-FR')
        };
        
        try {
            // Vérifier si EmailJS est configuré
            if (EMAILJS_CONFIG.PUBLIC_KEY.includes('xxxx')) {
                // Simuler un envoi réussi pour la démo
                console.log('📧 Simulation d\'envoi d\'email (configurer EmailJS pour un vrai envoi)');
                await new Promise(resolve => setTimeout(resolve, 1500));
                showSuccessMessage();
                contactForm.reset();
            } else {
                // Envoyer l'email via EmailJS
                const response = await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    formData
                );
                
                // Succès
                console.log('✅ Email envoyé avec succès:', response);
                showSuccessMessage();
                contactForm.reset();
            }
            
        } catch (error) {
            // Erreur
            console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
            showErrorMessage();
        } finally {
            // Réinitialiser le bouton
            btnText.textContent = 'Envoyer le message';
            spinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
    
    // Réinitialiser les messages d'erreur quand l'utilisateur commence à taper
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearError(this.id);
            
            // Masquer les messages de succès/erreur
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
        });
    });
}

// Validation du formulaire
function validateContactForm() {
    let isValid = true;
    
    // Valider le nom
    const name = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!name.value.trim()) {
        nameError.textContent = 'Veuillez entrer votre nom';
        name.style.borderColor = '#e74c3c';
        isValid = false;
    } else if (name.value.trim().length < 2) {
        nameError.textContent = 'Le nom doit contenir au moins 2 caractères';
        name.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        clearError('name');
    }
    
    // Valider l'email
    const email = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.value.trim()) {
        emailError.textContent = 'Veuillez entrer votre email';
        email.style.borderColor = '#e74c3c';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.textContent = 'Veuillez entrer un email valide';
        email.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        clearError('email');
    }
    
    // Valider le message
    const message = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    if (!message.value.trim()) {
        messageError.textContent = 'Veuillez entrer votre message';
        message.style.borderColor = '#e74c3c';
        isValid = false;
    } else if (message.value.trim().length < 10) {
        messageError.textContent = 'Le message doit contenir au moins 10 caractères';
        message.style.borderColor = '#e74c3c';
        isValid = false;
    } else {
        clearError('message');
    }
    
    return isValid;
}

// Effacer les messages d'erreur
function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    if (inputElement) {
        inputElement.style.borderColor = '';
    }
}

// Afficher le message de succès
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

// Afficher le message d'erreur
function showErrorMessage() {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    successMessage.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}

// Animations au scroll
function setupScrollAnimations() {
    // Éléments à animer
    const animatedElements = document.querySelectorAll('.service-card, .benefit, .stat');
    
    // Observer pour animer les éléments quand ils entrent dans la vue
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer les éléments
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Mettre à jour la navigation active au scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink('#' + sectionId);
            }
        });
    });
}