document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Sticky Header
  // ==========================================
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  const handleScrollHeader = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader);
  handleScrollHeader(); // Trigger initially in case page loaded scrolled down

  // ==========================================
  // 2. Mobile Responsive Nav Menu Toggle
  // ==========================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile nav when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Hero Slider (Homepage Only)
  // ==========================================
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 4400;

    const showSlide = (index) => {
      // Remove active classes
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      // Set new index with wrapping
      currentSlide = (index + slides.length) % slides.length;

      // Add active classes
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
            const slideVideo = slides[currentSlide].querySelector('video');
      if (slideVideo) {
        slideVideo.currentTime = 0;
        slideVideo.play();
      }
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      showSlide(currentSlide - 1);
    };

    const startAutoplay = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    // Control event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // Reset interval on click
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // Reset interval on click
      });
    }

    // Dot click listeners
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoplay(); // Reset interval on click
      });
    });

    // Start slider autoplay
    startAutoplay();

    // restart the timer once the first video really starts playing
    const firstVideo = slides[0].querySelector('video');
    if (firstVideo) {
      firstVideo.addEventListener('playing', () => startAutoplay(), { once: true });
    }
  }

  // ==========================================
  // 4. Scroll Spy (Highlight Nav on Scroll - Homepage Only)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const scrollSpy = () => {
    if (sections.length === 0 || navItems.length === 0) return;
    
    // Only apply scroll spy if we are on the homepage
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && !window.location.href.includes('#')) {
      // If we are on a subpage, don't change header active styling dynamically unless it links to homepage sections
      return;
    }

    const scrollY = window.pageYOffset;
    let currentSectionId = '';

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      // Offset to trigger earlier when scrolling down
      const sectionTop = current.offsetTop - (header.offsetHeight + 100);
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        currentSectionId = sectionId;
      }
    });

    // If we're at the very top, set active to home
    if (scrollY < 100) {
      currentSectionId = '';
    }

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      
      if (currentSectionId === '' && (href === 'index.html' || href === '#')) {
        item.classList.add('active');
      } else if (href === `#${currentSectionId}` || href.endsWith(`#${currentSectionId}`)) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);

  // ==========================================
  // 5. Contact Form Validation & Submission Handling (Homepage Only)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const nameVal = document.getElementById('form-name').value.trim();
      const phoneVal = document.getElementById('form-phone').value.trim();
      const emailVal = document.getElementById('form-email').value.trim();
      const messageVal = document.getElementById('form-message').value.trim();

      // Simple validation check
      if (!nameVal || !phoneVal || !emailVal || !messageVal) {
        showStatus('Please fill in all required fields.', 'error');
        return;
      }

      if (!validateEmail(emailVal)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Visual loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      showStatus('', ''); // clear previous messages

      // Simulate API call/email sending
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        showStatus('Thank you! Your message has been sent successfully. We will get back to you shortly.', 'success');
        contactForm.reset();
      }, 1500);
    });

    const showStatus = (msg, type) => {
      if (!formStatus) return;
      formStatus.className = 'form-status';
      if (type) {
        formStatus.classList.add(type);
        formStatus.textContent = msg;
      } else {
        formStatus.textContent = '';
      }
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
  }
});
function runAboutAnimation() {
  const aboutItems = document.querySelectorAll(".about-text, .about-visual");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.2
  });

  aboutItems.forEach(item => observer.observe(item));
}

// Run after everything loads (safe for slider websites)
window.addEventListener("load", runAboutAnimation);
const stack = document.getElementById("tiltStack");

if (stack) {
  stack.addEventListener("mousemove", (e) => {
    let x = (e.offsetX / stack.offsetWidth) - 0.5;
    let y = (e.offsetY / stack.offsetHeight) - 0.5;

    stack.style.transform = `rotateY(${x * 20}deg) rotateX(${y * -20}deg)`;
    stack.classList.add("active");
  });

  stack.addEventListener("mouseleave", () => {
    stack.style.transform = "rotateY(0deg) rotateX(0deg)";
    stack.classList.remove("active");
  });
}
