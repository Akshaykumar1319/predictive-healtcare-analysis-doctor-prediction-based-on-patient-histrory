// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Get Started button
    const getStartedBtn = document.querySelector(".get-started");
    if (getStartedBtn) {
        getStartedBtn.addEventListener("click", function() {
            window.location.href = "/prediction";
        });
    }

    // Testimonials Slider
    const testimonials = document.querySelectorAll(".testimonial");
    let currentIndex = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial) => {
            testimonial.classList.remove("active");
        });
        testimonials[index].classList.add("active");
    }

    window.moveSlide = function(step) {
        currentIndex += step;
        if (currentIndex >= testimonials.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = testimonials.length - 1;
        }
        showTestimonial(currentIndex);
    }

    // Initialize first testimonial
    if (testimonials.length > 0) {
        showTestimonial(currentIndex);
    }

    // FAQ Section
    const faqs = document.querySelectorAll(".faq");
    faqs.forEach(faq => {
        faq.addEventListener("click", () => {
            faq.classList.toggle("active");
        });
    });

    // Demo Form
    const demoForm = document.getElementById("demo-form");
    if (demoForm) {
        demoForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const firstName = document.getElementById("first-name").value.trim();
            const lastName = document.getElementById("last-name").value.trim();
            const email = document.getElementById("work-email").value.trim();
            const organization = document.getElementById("organization").value.trim();
            const jobTitle = document.getElementById("job-title").value.trim();

            if (!firstName || !lastName || !email || !organization || !jobTitle) {
                alert("Please fill in all required fields.");
                return;
            }

            const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!email.match(emailPattern)) {
                alert("Please enter a valid email address.");
                return;
            }

            alert("Your demo request has been submitted!");
            demoForm.reset();
        });
    }

    // Demo and Learn More buttons
    const demoBtn = document.querySelector(".demo-btn");
    const learnBtn = document.querySelector(".learn-btn");

    if (demoBtn) {
        demoBtn.addEventListener("click", function() {
            const demoSection = document.getElementById("demo-form");
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (learnBtn) {
        learnBtn.addEventListener("click", function() {
            const featuresSection = document.getElementById("features");
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Update copyright year
    const copyrightElement = document.querySelector(".footer-bottom p");
    if (copyrightElement) {
        copyrightElement.innerHTML = `© ${new Date().getFullYear()} HealthPredictAI. All rights reserved.`;
    }
});