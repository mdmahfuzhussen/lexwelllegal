// Initialize EmailJS only when the library is available.
if (typeof emailjs !== "undefined") {
    emailjs.init("YOUR_PUBLIC_KEY_HERE");
}

const themeToggle = document.getElementById("themeToggle");
const body = document.getElementById("body");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const header = document.getElementById("header");
const THEME_KEY = "lexwell-theme";

// Enhanced theme toggle with smooth transition
function loadTheme() {
    if (!body) {
        return;
    }

    const savedTheme = localStorage.getItem(THEME_KEY) || "light";
    body.classList.remove("light-theme", "dark-theme");
    body.classList.add(`${savedTheme}-theme`);
    updateThemeToggle(savedTheme);
}

function updateThemeToggle(theme) {
    if (!themeToggle) {
        return;
    }

    themeToggle.textContent = theme === "light" ? "Moon" : "Sun";
    themeToggle.style.animation = "bounce 0.5s ease";
    setTimeout(() => {
        if (themeToggle) themeToggle.style.animation = "none";
    }, 500);
}

if (themeToggle && body) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.classList.contains("light-theme") ? "light" : "dark";
        const newTheme = currentTheme === "light" ? "dark" : "light";

        body.classList.remove("light-theme", "dark-theme");
        body.classList.add(`${newTheme}-theme`);

        localStorage.setItem(THEME_KEY, newTheme);
        updateThemeToggle(newTheme);
    });
}

// Enhanced mobile menu toggle
if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        menuToggle.style.animation = "rotateSpin 0.3s ease";
    });
}

if (nav) {
    document.querySelectorAll(".nav-menu a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
        });
    });
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }

    if (nav) {
        nav.classList.remove("active");
    }
}

// Enhanced element observation with multiple animation classes
function observeElements() {
    const items = document.querySelectorAll(
        ".fade-in, .animate-scale-in, .slide-in-left, .slide-in-right"
    );
    
    if (!items.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    
                    // Add staggered animation for multiple elements
                    if (entry.target.parentElement) {
                        const siblings = entry.target.parentElement.querySelectorAll(
                            ".fade-in, .animate-scale-in, .slide-in-left, .slide-in-right"
                        );
                        
                        siblings.forEach((sibling, index) => {
                            if (sibling.classList.contains("visible")) {
                                sibling.style.animationDelay = `${index * 0.1}s`;
                            }
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    items.forEach((item) => observer.observe(item));
}

// Parallax scrolling effect
function initParallax() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    
    if (!parallaxElements.length) {
        return;
    }
    
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        
        parallaxElements.forEach((element) => {
            const speed = element.getAttribute("data-parallax") || 0.5;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    }, { passive: true });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.id = "scroll-progress";
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--royal-blue), var(--pale-yellow));
        z-index: 2000;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + "%";
    }, { passive: true });
}

// Add ripple effect to buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll("button, .cta-button, .secondary-button");
    
    buttons.forEach((button) => {
        button.addEventListener("click", function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement("span");
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                width: 100px;
                height: 100px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            ripple.style.left = (e.clientX - rect.left - 50) + "px";
            ripple.style.top = (e.clientY - rect.top - 50) + "px";
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Smooth header shadow on scroll
function initHeaderScroll() {
    if (!header) return;
    
    const updateHeaderShadow = () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = "0 8px 30px rgba(44, 62, 127, 0.3)";
            header.style.backdropFilter = "blur(10px)";
        } else {
            header.style.boxShadow = "none";
            header.style.backdropFilter = "none";
        }
    };
    
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
    updateHeaderShadow();
}

function showModal(title, message) {
    const modal = document.getElementById("successModal");
    const modalTitle = modal?.querySelector("h2");
    const modalMessage = document.getElementById("modalMessage");

    if (!modal || !modalTitle || !modalMessage) {
        return;
    }

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = "block";
    modal.classList.add("modal-show");
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("modal-show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector("button[type='submit']");
        const originalText = submitButton?.textContent;
        
        if (submitButton) {
            submitButton.textContent = "Sending...";
            submitButton.classList.add("loading");
        }

        const name = document.getElementById("contactName")?.value || "";
        const email = document.getElementById("contactEmail")?.value || "";

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            showModal(
                "Thank You",
                `Your message has been received, ${name || "client"}. We will reply to ${email} soon.`
            );
            
            contactForm.reset();
            
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.classList.remove("loading");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            showModal("Error", "There was a problem sending your message. Please try again.");
            
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.classList.remove("loading");
            }
        }
    });
}

const appointmentForm = document.getElementById("appointmentForm");
if (appointmentForm) {
    appointmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = appointmentForm.querySelector("button[type='submit']");
        const originalText = submitButton?.textContent;
        
        if (submitButton) {
            submitButton.textContent = "Booking...";
            submitButton.classList.add("loading");
        }

        const email = document.getElementById("appointmentEmail")?.value || "";

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            showModal(
                "Appointment Requested",
                `Your consultation request has been received. We will confirm details at ${email} shortly.`
            );
            
            appointmentForm.reset();
            
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.classList.remove("loading");
            }
        } catch (error) {
            console.error("Appointment form error:", error);
            showModal("Error", "There was a problem booking your appointment. Please try again.");
            
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.classList.remove("loading");
            }
        }
    });
}

// Enhanced modal close functionality
window.addEventListener("click", (e) => {
    const modal = document.getElementById("successModal");
    if (modal && e.target === modal) {
        closeModal("successModal");
    }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        const modal = document.getElementById("successModal");
        if (modal && modal.style.display === "block") {
            closeModal("successModal");
        }
    }
});

const dateInput = document.getElementById("appointmentDate");
if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);
}

// Initialize all enhancements on page load
document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    observeElements();
    initParallax();
    initScrollProgress();
    initRippleEffect();
    initHeaderScroll();

    const hero = document.querySelector(".hero-content");
    if (hero) {
        hero.style.animation = "slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
    }
    
    // Add smooth animation to cards
    const cards = document.querySelectorAll(".service-card, .lawyer-card, .about-card");
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Cleanup and performance optimization
window.addEventListener("beforeunload", () => {
    // Clean up event listeners if needed
});

