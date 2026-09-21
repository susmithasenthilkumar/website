document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const scrollTop = document.querySelector('.scroll-top');
  const currentYear = document.querySelectorAll('.current-year');

  currentYear.forEach((year) => { year.textContent = new Date().getFullYear(); });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    const fields = {
      fullName: { message: 'Please enter your full name.', validate: (value) => value.trim().length >= 2 },
      email: { message: 'Please enter a valid email address.', validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) },
      phone: { message: 'Please enter a valid phone number.', validate: (value) => value.trim() === '' || /^[+\d][\d\s().-]{7,}$/.test(value.trim()) },
      subject: { message: 'Please choose a topic.', validate: (value) => value !== '' },
      message: { message: 'Please write at least 20 characters.', validate: (value) => value.trim().length >= 20 }
    };

    const showFieldError = (name, message = '') => {
      const field = contactForm.elements[name];
      const row = field.closest('.form-row');
      const error = contactForm.querySelector(`[data-error-for="${name}"]`);
      row.classList.toggle('invalid', Boolean(message));
      error.textContent = message;
    };

    Object.keys(fields).forEach((name) => {
      contactForm.elements[name].addEventListener('blur', () => {
        const rule = fields[name];
        showFieldError(name, rule.validate(contactForm.elements[name].value) ? '' : rule.message);
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;
      Object.entries(fields).forEach(([name, rule]) => {
        const valid = rule.validate(contactForm.elements[name].value);
        showFieldError(name, valid ? '' : rule.message);
        if (!valid) isValid = false;
      });
      const status = contactForm.querySelector('.form-status');
      status.className = 'form-status';
      if (!isValid) {
        status.textContent = 'Please check the highlighted fields and try again.';
        status.classList.add('error');
        return;
      }
      status.textContent = 'Thanks for reaching out. We will be in touch within two working days.';
      status.classList.add('success');
      contactForm.reset();
    });
  }
});
