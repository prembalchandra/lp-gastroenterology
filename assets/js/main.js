document.addEventListener("DOMContentLoaded", function () {
    // Doctors Swiper Slider
    const doctorSlider = document.querySelector(".doctor-slider");
    if (doctorSlider && typeof Swiper !== "undefined") {
        new Swiper(doctorSlider, {
            slidesPerView: 1,
            spaceBetween: 18,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: ".doctor-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".doctor-next",
                prevEl: ".doctor-prev",
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                },
            },
        });
    }

    // Review Swiper Slider
    new Swiper(".review-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".review-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".review-next",
            prevEl: ".review-prev",
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 24,
            },
        },
    });

    // Video Section Swiper Slider
    new Swiper(".video-section", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,
        navigation: {
            nextEl: ".video-next",
            prevEl: ".video-prev",
        },
        breakpoints: {
            640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 24,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 28,
            },
        },
    });

    // Mobile Sticky Header Dropdown
    const navbar = document.getElementById("navbar");
    const mobileStickyBar = document.getElementById("mobileStickyBar");
    const mobileStickyToggle = document.getElementById("mobileStickyToggle");
    const mobileStickyDropdown = document.getElementById("mobileStickyDropdown");
    const closeBtn = document.getElementById("closeMobileDropdown");
    const backdrop = document.getElementById("mobileStickyBackdrop");

    function updateHeaderOffset() {
        if (navbar) {
            const h = navbar.offsetHeight;
            document.documentElement.style.setProperty("--header-height", h + "px");
        }
    }

    if (navbar && mobileStickyBar) {
        updateHeaderOffset();
        window.addEventListener("resize", updateHeaderOffset);
        window.addEventListener("orientationchange", updateHeaderOffset);
        window.addEventListener("scroll", updateHeaderOffset, { passive: true });
    }

    function openMobileDropdown() {
        if (!mobileStickyBar) return;
        mobileStickyBar.classList.add("is-open");
        if (backdrop) backdrop.classList.add("is-active");
        if (mobileStickyToggle) mobileStickyToggle.setAttribute("aria-expanded", "true");

        // Focus first input in mobile dropdown
        if (mobileStickyDropdown) {
            const firstInput = mobileStickyDropdown.querySelector('input[name="name"]');
            if (firstInput) {
                setTimeout(function () {
                    firstInput.focus();
                }, 180);
            }
        }
    }

    function closeMobileDropdown() {
        if (!mobileStickyBar) return;
        mobileStickyBar.classList.remove("is-open");
        if (backdrop) backdrop.classList.remove("is-active");
        if (mobileStickyToggle) mobileStickyToggle.setAttribute("aria-expanded", "false");
    }

    function toggleMobileDropdown(e) {
        if (e) e.stopPropagation();
        if (mobileStickyBar && mobileStickyBar.classList.contains("is-open")) {
            closeMobileDropdown();
        } else {
            openMobileDropdown();
        }
    }

    if (mobileStickyToggle) {
        mobileStickyToggle.addEventListener("click", toggleMobileDropdown);
        mobileStickyToggle.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMobileDropdown(e);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            closeMobileDropdown();
        });
    }

    if (backdrop) {
        backdrop.addEventListener("click", closeMobileDropdown);
    }

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileStickyBar && mobileStickyBar.classList.contains("is-open")) {
            closeMobileDropdown();
        }
    });

    // On mobile, clicking buttons with href="#callback-form" can smoothly open this dropdown
    document.querySelectorAll('a[href="#callback-form"]').forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            if (window.innerWidth <= 768 && mobileStickyBar) {
                e.preventDefault();
                openMobileDropdown();
            }
        });
    });

    // Callback Form Submission & Redirect to Thank You Page (handles all callback forms)
    const callbackForms = document.querySelectorAll(".callback-form");
    callbackForms.forEach(function (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const citySelect = form.querySelector('select[name="city"]');
            const submitBtn = form.querySelector('button[type="submit"]');

            const nameVal = nameInput ? nameInput.value.trim() : "";
            const phoneVal = phoneInput ? phoneInput.value.trim() : "";
            const cityVal = citySelect ? citySelect.value : "";

            if (!nameVal) {
                alert("कृपया अपना नाम दर्ज करें।");
                if (nameInput) nameInput.focus();
                return;
            }

            if (!phoneVal || !/^[0-9]{10}$/.test(phoneVal)) {
                alert("कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें।");
                if (phoneInput) phoneInput.focus();
                return;
            }

            if (!cityVal) {
                alert("कृपया अपना शहर चुनें।");
                if (citySelect) citySelect.focus();
                return;
            }

            // Show feedback on button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'अनुरोध भेजा जा रहा है...';
            }

            // Save details to sessionStorage
            try {
                sessionStorage.setItem("lead_name", nameVal);
                sessionStorage.setItem("lead_phone", phoneVal);
                sessionStorage.setItem("lead_city", cityVal);
            } catch (err) {
                console.error(err);
            }

            // Redirect to Thank-You Page
            setTimeout(function () {
                window.location.href = "thank-you.html";
            }, 300);
        });
    });
});
