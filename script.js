// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Optional: Add ARIA attribute for accessibility
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Sticky Header Shadow on Scroll ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Fade-in Sections on Scroll ---
    const sections = document.querySelectorAll('.fade-in-section');
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            root: null, // relative to document viewport
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of the section is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: Stop observing after the animation has run once
                    // observer.unobserve(entry.target);
                }
                // Optional: Uncomment below to fade out when scrolling out of view
                // else {
                //    entry.target.classList.remove('is-visible');
                // }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback for older browsers: make sections visible immediately
        sections.forEach(section => section.classList.add('is-visible'));
    }


    // --- Trees Planted Counter Animation ---
    const counterElement = document.getElementById('trees-planted-counter');
    if (counterElement) {
        const targetTrees = 1578; // Example target number - replace with dynamic data later

        const animateCounter = (element, target) => {
            let current = 0;
            // Calculate increment based on target value for consistent speed
            const increment = Math.max(1, Math.ceil(target / 100));
            const duration = 1500; // Animation duration in ms
            const stepTime = Math.abs(Math.floor(duration / (target / increment)));

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target; // Ensure final value is exact
                }
                element.textContent = current.toLocaleString(); // Format with commas
            }, stepTime);
        };

        // Trigger counter when the impact section is visible using Intersection Observer
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Check if the element is intersecting and hasn't been animated yet
                if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                    animateCounter(counterElement, targetTrees);
                    entry.target.setAttribute('data-animated', 'true'); // Mark as animated
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        // Observe the parent container of the counter
        const impactSection = document.getElementById('impact');
        if (impactSection) {
            counterObserver.observe(impactSection);
        }
    }


    // --- Image Gallery/Carousel ---
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer) {
        const track = galleryContainer.querySelector('.gallery-track');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('gallery-dots');

        // --- Gallery Images (Replace with your actual image data) ---
        const images = [
            { src: 'https://placehold.co/800x600/d8f3dc/333333?text=Planting+Site+1', alt: 'Planting Site 1' },
            { src: 'https://placehold.co/800x600/b7e4c7/333333?text=Planting+Site+2', alt: 'Planting Site 2' },
            { src: 'https://placehold.co/800x600/95d5b2/333333?text=Watering+Tree', alt: 'Watering Tree' },
            { src: 'https://placehold.co/800x600/74c69d/333333?text=Happy+Donor+Tree', alt: 'Happy Donor Tree' },
            { src: 'https://placehold.co/800x600/52b788/ffffff?text=Growing+Forest', alt: 'Growing Forest' }
        ];

        let currentIndex = 0;
        let slides = []; // To hold the created slide elements

        // Function to create slides and dots
        function setupGallery() {
            track.innerHTML = ''; // Clear existing slides
            dotsContainer.innerHTML = ''; // Clear existing dots
            slides = []; // Reset slides array

            images.forEach((image, index) => {
                // Create slide element
                const slide = document.createElement('div');
                slide.classList.add('gallery-slide');
                slide.innerHTML = `<img src="${image.src}" alt="${image.alt}" class="gallery-image" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/800x600/cccccc/ffffff?text=Image+Error';">`;
                track.appendChild(slide);
                slides.push(slide);

                // Create dot element
                const dot = document.createElement('button');
                dot.classList.add('gallery-dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
                dotsContainer.appendChild(dot);
            });

            // Set track width
            track.style.width = `${images.length * 100}%`;
            updateGallery(); // Initial display
        }

        // Function to move to a specific slide
        function goToSlide(index) {
            if (index < 0 || index >= slides.length) return; // Boundary check
            currentIndex = index;
            updateGallery();
        }

        // Function to update gallery display (transform and dots)
        function updateGallery() {
            track.style.transform = `translateX(-${currentIndex * (100 / images.length)}%)`;

            // Update dots
            const dots = dotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('aria-current');
                }
            });

            // Update button states (disable at ends)
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;
            prevBtn.classList.toggle('opacity-50', currentIndex === 0);
            nextBtn.classList.toggle('opacity-50', currentIndex === slides.length - 1);
        }

        // Event Listeners for buttons
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });

            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }

        // Initialize gallery
        setupGallery();

        // Optional: Add swipe functionality for touch devices (basic example)
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true }); // Use passive for better scroll performance

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const threshold = 50; // Minimum swipe distance
            if (touchEndX < touchStartX - threshold) {
                // Swiped left
                goToSlide(currentIndex + 1);
            } else if (touchEndX > touchStartX + threshold) {
                // Swiped right
                goToSlide(currentIndex - 1);
            }
        }
    }


    // --- Update Footer Year ---
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Basic Contact Form Submission Feedback (Example) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

            // Basic validation example (can be expanded)
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                 formStatus.textContent = 'Please fill out all fields.';
                 formStatus.className = 'mt-4 text-center error'; // Use CSS classes
                 return;
            }

            // Simulate form submission (replace with actual AJAX call)
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'mt-4 text-center'; // Reset class

            setTimeout(() => {
                // Simulate success
                formStatus.textContent = 'Thank you! Your message has been sent.';
                formStatus.className = 'mt-4 text-center success';
                contactForm.reset(); // Clear the form

                // Clear status message after a few seconds
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'mt-4 text-center';
                }, 5000);

                // Simulate error (uncomment to test error state)
                // formStatus.textContent = 'Oops! Something went wrong. Please try again.';
                // formStatus.className = 'mt-4 text-center error';

            }, 1500); // Simulate network delay
        });
    }

}); // End DOMContentLoaded
