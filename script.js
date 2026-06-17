/* ====================================
   LAW FIRM WEBSITE SCRIPT
==================================== */


/* ====================================
   NAVBAR SCROLL EFFECT
==================================== */

window.addEventListener("scroll", () => {

    const navbar =
    document.querySelector(".navbar");

    if(!navbar) return;

    if(window.scrollY > 80){

        navbar.style.background =
        "#08182f";

        navbar.style.position =
        "fixed";

        navbar.style.top = "0";

        navbar.style.width = "100%";

        navbar.style.boxShadow =
        "0 2px 10px rgba(0,0,0,0.2)";

    }
    else{

        navbar.style.background =
        "transparent";

        navbar.style.boxShadow =
        "none";
    }

});


/* ====================================
   MOBILE MENU
==================================== */

const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.querySelector(".nav-links");

if(menuBtn){

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");
        menuBtn.setAttribute(
            "aria-expanded",
            navLinks.classList.contains("active")
        );

    });

}



/* ====================================
   FAQ ACCORDION
==================================== */

const questions =
document.querySelectorAll(".question");

questions.forEach(question => {

    question.addEventListener("click", () => {

        const answer =
        question.nextElementSibling;
        const faqItem =
        question.parentElement;

        if(answer.style.maxHeight){

            answer.style.maxHeight = null;
            faqItem.classList.remove("active");

        }
        else{

            answer.style.maxHeight =
            answer.scrollHeight + "px";
            faqItem.classList.add("active");

        }

    });

});


/* ====================================
   COUNTER ANIMATION
==================================== */

const counters =
document.querySelectorAll(".counter");

const startCounter = () => {

    counters.forEach(counter => {

        const target =
        +counter.dataset.target;

        let count = 0;

        const speed = target / 100;

        const updateCounter = () => {

            if(count < target){

                count += speed;

                counter.innerText =
                Math.floor(count)
                .toLocaleString();

                requestAnimationFrame(
                    updateCounter
                );

            }
            else{

                counter.innerText =
                target.toLocaleString();

            }

        };

        updateCounter();

    });

};

startCounter();


/* ====================================
   PRACTICE AREA SHOW MORE
==================================== */

const showMoreBtn =
document.getElementById("showMoreBtn");

const extraCards =
document.querySelectorAll(".extra-card");

let expanded = false;

if(showMoreBtn){

    showMoreBtn.addEventListener("click", () => {

        if(!expanded){

            extraCards.forEach(card => {

                card.classList.add("is-visible");

            });

            showMoreBtn.innerText =
            "Show Less";

            expanded = true;

        }
        else{

            extraCards.forEach(card => {

                card.classList.remove("is-visible");

            });

            showMoreBtn.innerText =
            "More Practice Areas";

            expanded = false;

        }

    });

}


/* ====================================
   SCROLL REVEAL ANIMATION
==================================== */

const revealItems =
document.querySelectorAll(
"section:not(.hero), .card, .feature, .consult-item, .stat, .price-card, .blog-card, .testimonial"
);

if("IntersectionObserver" in window){

    const revealObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);

            }

        });

    },{threshold:0.12});

    revealItems.forEach(item => {

        item.classList.add("reveal");
        revealObserver.observe(item);

    });

}
else{

    revealItems.forEach(item => {

        item.classList.add("is-visible");

    });

}


/* ====================================
   PRICING + NEWS POPUP
==================================== */

const popupTriggers =
document.querySelectorAll(".popup-trigger");

const infoModal =
document.getElementById("infoModal");

const modalTitle =
document.getElementById("modalTitle");

const modalBody =
document.getElementById("modalBody");

let activePopupButton = null;

const closeInfoModal = () => {

    if(!infoModal) return;

    infoModal.classList.remove("is-open");
    infoModal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");

    if(activePopupButton){

        activePopupButton.focus();
        activePopupButton = null;

    }

};

if(infoModal){

    popupTriggers.forEach(button => {

        button.addEventListener("click", () => {

            activePopupButton = button;
            modalTitle.innerText =
            button.dataset.title || "More Information";

            modalBody.innerText =
            button.dataset.body || "";

            infoModal.classList.add("is-open");
            infoModal.setAttribute("aria-hidden","false");
            document.body.classList.add("modal-open");

            const closeButton =
            infoModal.querySelector(".modal-close");

            if(closeButton){

                closeButton.focus();

            }

        });

    });

    infoModal
    .querySelectorAll("[data-close-modal]")
    .forEach(closeControl => {

        closeControl.addEventListener("click", closeInfoModal);

    });

    document.addEventListener("keydown", (e) => {

        if(e.key === "Escape" &&
           infoModal.classList.contains("is-open")){

            closeInfoModal();

        }

    });

}


/* ====================================
   EXPAND LATEST NEWS CARDS
==================================== */

const newsButtons =
document.querySelectorAll(".blog-card .news-link");

newsButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
        button.closest(".blog-card");

        if(!card) return;

        const isExpanded =
        card.classList.toggle("expanded");

        button.innerText =
        isExpanded ? "Show Less" : "Read More";

    });

});


/* ====================================
   TESTIMONIAL SLIDER
==================================== */

const testimonials =
document.querySelectorAll(".testimonial-slide");

let currentSlide = 0;

if(testimonials.length > 1){

    testimonials.forEach((slide,index) => {

        if(index !== 0){

            slide.style.display =
            "none";

        }

    });

    setInterval(() => {

        testimonials[currentSlide]
        .style.display = "none";

        currentSlide++;

        if(currentSlide >=
        testimonials.length){

            currentSlide = 0;

        }

        testimonials[currentSlide]
        .style.display = "block";

    },5000);

}


/* ====================================
   APPOINTMENT FORM
==================================== */

const appointmentForm =
document.querySelector(".appointment-form");

if(appointmentForm){

    appointmentForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();

            const requiredFields =
            appointmentForm
            .querySelectorAll("[required]");

            const hasEmptyField =
            Array.from(requiredFields)
            .some(field => field.value.trim() === "");

            if(hasEmptyField){

                alert(
                "Please select a service, lawyer, date, and time."
                );

                return;
            }

            alert(
            "Appointment submitted successfully!"
            );

            appointmentForm.reset();

        }
    );

}


/* ====================================
   SMOOTH SCROLLING
==================================== */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener(
        "click",
        function(e){

            e.preventDefault();

            const selector =
            this.getAttribute("href");

            if(!selector || selector === "#"){

                return;

            }

            const target =
            document.querySelector(
            selector
            );

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        }
    );

});


/* ====================================
   PAGE LOADED
==================================== */

window.addEventListener(
"load",
() => {

    console.log(
    "Law Firm Website Loaded Successfully"
    );

});
