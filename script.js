// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Form submission
const appointmentForm = document.getElementById('appointmentForm');

appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data manually
    const data = {
        name: this.querySelector('#name').value,
        phone: this.querySelector('#phone').value,
        email: this.querySelector('#email').value,
        pet: this.querySelector('#pet').value,
        service: this.querySelector('#service').value,
        message: this.querySelector('#message').value
    };
    
    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.service) {
        showFormMessage('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormMessage('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        showFormMessage('Por favor, ingresa un número de teléfono válido', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Send to WhatsApp
    const whatsappNumber = '3112617515';
    const serviceNames = {
        'consulta': 'Consulta General',
        'vacunacion': 'Vacunación',
        'cirugia': 'Cirugía',
        'urgencia': 'Urgencia',
        'peluqueria': 'Peluquería',
        'otro': 'Otro'
    };
    
    const serviceName = serviceNames[data.service] || data.service;
    
    const message = `*🐾 NUEVA SOLICITUD DE CITA - ANIMAL WORLD DOG & CAT*%0A%0A` +
        `*📋 Datos del Cliente:*%0A` +
        `• Nombre: ${data.name}%0A` +
        `• Teléfono: ${data.phone}%0A` +
        `• Email: ${data.email}%0A` +
        `• Mascota: ${data.pet || 'No especificado'}%0A%0A` +
        `*🏥 Servicio Solicitado:*%0A` +
        `• ${serviceName}%0A%0A` +
        `*💬 Mensaje Adicional:*%0A` +
        `${data.message || 'No hay mensaje adicional'}%0A%0A` +
        `*📅 Fecha de Solicitud:* ${new Date().toLocaleString('es-CO')}%0A%0A` +
        `*⚠️ Por favor contactar al cliente para confirmar la cita*`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Show message preview first, then automatically send to WhatsApp
    showFormMessagePreviewAndAutoSend(message, whatsappUrl, submitButton, originalText);
    
    // Track conversion (Google Analytics or similar)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'Appointment',
            'event_label': 'WhatsApp Form'
        });
    }
});

function showFormMessagePreviewAndAutoSend(message, whatsappUrl, submitButton, originalText) {
    // Remove existing preview
    const existingPreview = document.querySelector('.message-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    // Convert WhatsApp formatting to readable text
    const readableMessage = message
        .replace(/\*/g, '')
        .replace(/%0A/g, '\n')
        .replace(/•/g, '•');
    
    // Create preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'message-preview';
    previewContainer.innerHTML = `
        <div class="preview-header">
            <h3><i class="fab fa-whatsapp"></i> Tu información está siendo enviada</h3>
            <p>Revisa tu información mientras se envía automáticamente a WhatsApp</p>
        </div>
        <div class="preview-content">
            <div class="message-text">${readableMessage}</div>
        </div>
        <div class="preview-status">
            <div class="status-indicator">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Enviando mensaje a WhatsApp...</span>
            </div>
        </div>
    `;
    
    // Style the preview
    previewContainer.style.cssText = `
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        margin-top: 2rem;
        animation: fadeIn 0.5s ease-in;
        border: 2px solid var(--primary-green);
    `;
    
    // Add styles for preview elements
    const previewStyles = document.createElement('style');
    previewStyles.textContent = `
        .message-preview .preview-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }
        .message-preview .preview-header h3 {
            color: var(--dark-green);
            margin-bottom: 0.5rem;
            font-size: 1.3rem;
        }
        .message-preview .preview-header p {
            color: var(--gray);
            font-size: 0.9rem;
        }
        .message-preview .preview-content {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border-left: 4px solid var(--primary-green);
        }
        .message-preview .message-text {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            color: var(--dark-gray);
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .message-preview .preview-status {
            text-align: center;
            padding: 1rem;
            background: #e8f5e8;
            border-radius: 10px;
            border: 1px solid var(--primary-green);
        }
        .message-preview .status-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: var(--primary-green);
            font-weight: 600;
        }
        .message-preview .status-indicator i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(previewStyles);
    
    // Add preview after form
    appointmentForm.appendChild(previewContainer);
    
    // Enable form for editing
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-open WhatsApp after 2 seconds
    setTimeout(() => {
        // Update status
        const statusIndicator = previewContainer.querySelector('.status-indicator');
        statusIndicator.innerHTML = '<i class="fas fa-check-circle"></i><span>¡Mensaje enviado a WhatsApp!</span>';
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        showFormMessage('¡Tu solicitud ha sido enviada a WhatsApp! Nos pondremos en contacto contigo pronto.', 'success');
        
        // Remove preview and reset form after 3 seconds
        setTimeout(() => {
            const preview = document.querySelector('.message-preview');
            if (preview) {
                preview.remove();
            }
            appointmentForm.reset();
        }, 3000);
    }, 2000);
}

function sendToWhatsApp(whatsappUrl, buttonElement) {
    // Show loading state
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Abriendo WhatsApp...';
    buttonElement.disabled = true;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showFormMessage('¡Mensaje enviado a WhatsApp! Nos pondremos en contacto contigo pronto.', 'success');
    
    // Remove preview and reset form
    setTimeout(() => {
        const preview = document.querySelector('.message-preview');
        if (preview) {
            preview.remove();
        }
        appointmentForm.reset();
    }, 2000);
}

function cancelPreview() {
    const preview = document.querySelector('.message-preview');
    if (preview) {
        preview.remove();
    }
    showFormMessage('Puedes modificar tu información y volver a enviar el formulario.', 'success');
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        padding: 1rem;
        border-radius: 10px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 500;
        animation: fadeIn 0.5s ease-in;
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'var(--primary-green)';
        messageDiv.style.color = 'white';
    } else {
        messageDiv.style.background = '#f44336';
        messageDiv.style.color = 'white';
    }
    
    // Add message after form
    appointmentForm.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Service cards hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Contact form input animations
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
    }
    e.target.value = value;
});

// WhatsApp click tracking
document.querySelector('.btn-whatsapp').addEventListener('click', function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'WhatsApp',
            'event_label': 'Contact Button'
        });
    }
});

// Emergency button click tracking
document.querySelector('.btn-emergency').addEventListener('click', function() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Emergency',
            'event_label': 'Phone Call'
        });
    }
});

// Loading animation for page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroPets = document.querySelector('.hero-pets');
    
    if (hero && heroPets) {
        heroPets.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Counter animation for statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Initialize counters when in viewport
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            if (!isNaN(number)) {
                animateCounter(entry.target, number);
            }
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    counterObserver.observe(stat);
});

// Print functionality
function printPage() {
    window.print();
}

// Emergency contact quick action
function emergencyCall() {
    if (confirm('¿Deseas llamar a nuestra línea de emergencia?')) {
        window.location.href = 'tel:1234567891';
    }
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Service cards animation on scroll
const serviceCards = document.querySelectorAll('.service-card');
const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            serviceObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    serviceObserver.observe(card);
});

// Testimonial cards animation
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 150);
            testimonialObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

testimonialCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    testimonialObserver.observe(card);
});

// Form field validation feedback
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#f44336';
        } else if (this.value.trim()) {
            this.style.borderColor = 'var(--primary-green)';
        }
    });
    
    field.addEventListener('focus', function() {
        this.style.borderColor = 'var(--accent-blue)';
    });
});

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

// Add revealed styles
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    section.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(revealStyles);

console.log('ANIMAL WORLD DOG & CAT - Website loaded successfully!');
