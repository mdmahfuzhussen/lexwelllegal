const AUTH_KEY = "lexwell_users";
const SESSION_KEY = "lexwell_session";

function initializeUsers() {
    if (!localStorage.getItem(AUTH_KEY)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify([]));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

function getSession() {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

function createSession(user) {
    const sessionData = {
        userId: user.email,
        name: user.name,
        loginTime: new Date().toISOString(),
        token: generateToken()
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return sessionData;
}

function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i += 1) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash &= hash;
    }
    return hash.toString();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return {
        isValid: password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password),
        hasLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        message: "Password must be at least 8 characters with 1 uppercase letter and 1 number"
    };
}

function switchForm(formId) {
    document.querySelectorAll(".auth-form").forEach((form) => {
        form.classList.remove("active");
    });

    document.querySelectorAll(".auth-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.target === formId);
    });

    document.getElementById(formId)?.classList.add("active");
    clearAllErrors();
}

function togglePassword(inputId, trigger) {
    const input = document.getElementById(inputId);
    if (!input) {
        return;
    }

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    if (trigger) {
        trigger.textContent = isHidden ? "Hide" : "Show";
    }
}

function showError(element, message) {
    if (!element) {
        return;
    }

    element.textContent = message;
    element.style.display = "block";
}

function clearAllErrors() {
    document.querySelectorAll(".error-msg").forEach((item) => {
        item.textContent = "";
        item.style.display = "none";
    });
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
    modal.style.animation = "scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
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

function updatePasswordChecklist(password) {
    const validation = validatePassword(password);
    const ruleLength = document.getElementById("ruleLength");
    const ruleUppercase = document.getElementById("ruleUppercase");
    const ruleNumber = document.getElementById("ruleNumber");

    ruleLength?.classList.toggle("met", validation.hasLength);
    ruleUppercase?.classList.toggle("met", validation.hasUppercase);
    ruleNumber?.classList.toggle("met", validation.hasNumber);
}

function fillDemoCredentials() {
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    if (email && password) {
        email.value = "demo@lexwell.com";
        password.value = "Demo12345";
    }
}

document.getElementById("signInForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();

    const submitButton = document.querySelector("#signInForm button[type='submit']");
    const originalText = submitButton?.textContent;
    
    if (submitButton) {
        submitButton.textContent = "Signing in...";
        submitButton.classList.add("loading");
        submitButton.style.animation = "pulse 1s ease-in-out infinite";
    }

    const email = document.getElementById("loginEmail")?.value.trim() || "";
    const password = document.getElementById("loginPassword")?.value || "";
    const errorDiv = document.querySelector("#signInForm .error-msg");

    if (!email || !password) {
        showError(errorDiv, "Please fill in all fields");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    if (!isValidEmail(email)) {
        showError(errorDiv, "Please enter a valid email address");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    const users = getUsers();
    const user = users.find((item) => item.email === email);

    if (!user) {
        showError(errorDiv, "User not found. Please create an account first");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    if (user.password !== hashPassword(password)) {
        showError(errorDiv, "Incorrect password");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    createSession(user);
    
    if (submitButton) {
        submitButton.textContent = "Redirecting...";
    }
    
    showModal("Welcome Back", `Welcome back, ${user.name}. Redirecting to the firm homepage now.`);

    window.setTimeout(() => {
        window.location.href = "index.html";
    }, 1800);
});

document.getElementById("createAccountForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();

    const submitButton = document.querySelector("#createAccountForm button[type='submit']");
    const originalText = submitButton?.textContent;
    
    if (submitButton) {
        submitButton.textContent = "Creating Account...";
        submitButton.classList.add("loading");
        submitButton.style.animation = "pulse 1s ease-in-out infinite";
    }

    const name = document.getElementById("signupFullName")?.value.trim() || "";
    const email = document.getElementById("signupEmail")?.value.trim() || "";
    const phone = document.getElementById("signupPhone")?.value.trim() || "";
    const password = document.getElementById("signupPassword")?.value || "";
    const confirmPassword = document.getElementById("signupConfirmPassword")?.value || "";
    const agreeTerms = document.getElementById("agreeTerms")?.checked;

    const errorNodes = document.querySelectorAll("#createAccountForm .error-msg");

    if (!name || !email || !phone || !password || !confirmPassword) {
        showError(errorNodes[0], "Please fill in all fields");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    if (!isValidEmail(email)) {
        showError(errorNodes[1], "Please enter a valid email address");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
        showError(errorNodes[2], "Please enter a valid phone number");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        showError(errorNodes[3], passwordValidation.message);
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    if (password !== confirmPassword) {
        showError(errorNodes[4], "Passwords do not match");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    if (!agreeTerms) {
        showModal("Terms Required", "Please agree to the Terms and Privacy Policy before continuing.");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    const users = getUsers();
    if (users.find((item) => item.email === email)) {
        showError(errorNodes[1], "This email is already registered");
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.classList.remove("loading");
            submitButton.style.animation = "none";
        }
        return;
    }

    const newUser = {
        id: generateToken(),
        name,
        email,
        phone,
        password: hashPassword(password),
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    createSession(newUser);

    if (submitButton) {
        submitButton.textContent = "Account Created!";
    }
    
    showModal("Account Created", `Welcome ${name}. Your client portal account is ready.`);

    window.setTimeout(() => {
        window.location.href = "index.html";
    }, 1800);
});

window.addEventListener("click", (e) => {
    const modal = document.getElementById("successModal");
    if (modal && e.target === modal) {
        modal.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    initializeUsers();

    if (getSession()) {
        window.location.href = "index.html";
        return;
    }

    const users = getUsers();
    if (users.length === 0) {
        users.push({
            id: generateToken(),
            name: "Demo User",
            email: "demo@lexwell.com",
            phone: "+8801234567890",
            password: hashPassword("Demo12345"),
            createdAt: new Date().toISOString()
        });
        saveUsers(users);
    }

    document.querySelectorAll(".auth-tab").forEach((tab) => {
        tab.addEventListener("click", () => switchForm(tab.dataset.target));
    });

    const signupPassword = document.getElementById("signupPassword");
    if (signupPassword) {
        updatePasswordChecklist(signupPassword.value);
        signupPassword.addEventListener("input", (e) => {
            updatePasswordChecklist(e.target.value);
        });
    }

    document.querySelectorAll(".toggle-password").forEach((button) => {
        button.addEventListener("click", () => togglePassword(button.dataset.target, button));
    });

    document.getElementById("demoLoginBtn")?.addEventListener("click", fillDemoCredentials);
});
