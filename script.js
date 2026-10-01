/**
 * Torres Ferro e Aço - Modernized JavaScript Interactions
 * Incorporates performance optimizations, smooth scrolling, 
 * micro-interactions, and preserves all original business logic.
 */

(() => {
  'use strict';

  // -------------------------------------------------------------------
  // UTILITIES & PERFORMANCE
  // -------------------------------------------------------------------

  // Debounce helper
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Throttle using requestAnimationFrame
  const throttle = (func) => {
    let ticking = false;
    return (...args) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          func.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  };

  // -------------------------------------------------------------------
  // PAGE LOAD & PRELOADER
  // -------------------------------------------------------------------
  
  const initPageLoad = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 500); // Remove from DOM after transition
      }, 300); // Slight delay for smoother feel
    }
    
    // Trigger typewriter on load
    const heroHeadline = document.querySelector('.hero h1');
    if (heroHeadline) {
      const text = heroHeadline.textContent;
      heroHeadline.textContent = '';
      heroHeadline.classList.add('typing-active');
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          heroHeadline.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      };
      setTimeout(typeWriter, 500);
    }
  };

  // -------------------------------------------------------------------
  // NAVBAR ENHANCEMENTS & MOBILE MENU
  // -------------------------------------------------------------------

  const initNavbar = () => {
    const navbar = document.querySelector('header');
    const btn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.navlinks');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navlinks a');

    // Dynamic Navbar Shrink & Shadow
    const handleScroll = throttle(() => {
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled', 'shadow');
      } else {
        navbar?.classList.remove('scrolled', 'shadow');
      }

      // Active section highlighting
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.includes(current)) {
          link.classList.add('active');
        }
      });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile Menu
    btn?.addEventListener('click', () => {
      nav.classList.toggle('open');
      btn.classList.toggle('active');
    });

    // Auto-close on link click or outside scroll
    navLinks.forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        btn?.classList.remove('active');
      });
    });

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', throttle(() => {
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        nav?.classList.remove('open');
        btn?.classList.remove('active');
      }
      lastScrollY = window.scrollY;
    }), { passive: true });
  };

  // -------------------------------------------------------------------
  // SCROLL ANIMATIONS & INTERSECTION OBSERVERS
  // -------------------------------------------------------------------

  const initScrollAnimations = () => {
    const revealOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered reveal
          setTimeout(() => {
            entry.target.classList.add('visible', 'animate-in');
          }, index * 100); 
          observer.unobserve(entry.target);
        }
      });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Number counters
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const targetNumber = parseInt(counter.dataset.target, 10);
          if (isNaN(targetNumber)) return;
          
          let count = 0;
          const duration = 2000;
          const increment = targetNumber / (duration / 16); // 60fps

          const updateCount = () => {
            count += increment;
            if (count < targetNumber) {
              counter.innerText = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = targetNumber;
            }
          };
          updateCount();
          observer.unobserve(counter);
        }
      });
    });

    document.querySelectorAll('.counter, [data-target]').forEach(el => counterObserver.observe(el));
  };

  // -------------------------------------------------------------------
  // PARALLAX EFFECT
  // -------------------------------------------------------------------

  const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const onScrollParallax = throttle(() => {
      const scrollY = window.scrollY;
      // Adjust background position for parallax illusion
      if (scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
      }
    });

    window.addEventListener('scroll', onScrollParallax, { passive: true });
  };

  // -------------------------------------------------------------------
  // MICRO-INTERACTIONS (Cards, Buttons, Ripples)
  // -------------------------------------------------------------------

  const initMicroInteractions = () => {
    // Card tilt effect
    const cards = document.querySelectorAll('.card, .product-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease';
      });
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });

    // Ripple Effect on CTA buttons
    const ctas = document.querySelectorAll('.btn, .cta, button');
    ctas.forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  };

  // -------------------------------------------------------------------
  // EXISTING FUNCTIONALITY
  // -------------------------------------------------------------------

  const initExistingLogic = () => {
    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterStatus = document.getElementById('newsletterStatus');

    newsletterForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = newsletterEmail?.value.trim() || '';

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (newsletterStatus) {
          newsletterStatus.textContent = 'Digite um e-mail válido para continuar.';
          newsletterStatus.className = 'newsletter-status error';
        }
        newsletterEmail?.focus();
        return;
      }

      const key = 'torresNewsletterCadastros';
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      if (!current.includes(email)) current.push(email);
      localStorage.setItem(key, JSON.stringify(current));

      if (newsletterStatus) {
        newsletterStatus.textContent = 'Cadastro realizado! Em breve conectaremos este formulário ao envio de novidades.';
        newsletterStatus.className = 'newsletter-status success';
      }
      newsletterForm.reset();
    });

    // Banner Crossfade
    document.querySelectorAll('.hero-banner-mobile, .hero-banner-desktop').forEach(track => {
      const slides = track.querySelectorAll('.hero-banner-slide');
      if (slides.length >= 2) {
        let slideIndex = 0;
        setInterval(() => {
          slides[slideIndex].classList.remove('is-active');
          slideIndex = (slideIndex + 1) % slides.length;
          slides[slideIndex].classList.add('is-active');
        }, 5000);
        return;
      }
      if (slides.length === 1) {
        const hero = track.closest('.hero');
        let shown = true;
        setInterval(() => {
          shown = !shown;
          slides[0].classList.toggle('is-active', shown);
          if (hero) hero.classList.toggle('telha-overlay', shown);
        }, 5000);
      }
    });

    // Quote Dialog
    const quoteDialog = document.getElementById('quoteDialog');
    const quoteForm = document.getElementById('quoteForm');
    const quoteProduct = document.getElementById('quoteProduct');

    document.querySelectorAll('[data-quote-product]').forEach(button => {
      button.addEventListener('click', () => {
        quoteForm?.reset();
        if (quoteProduct) quoteProduct.value = button.dataset.quoteProduct || '';
        quoteDialog?.showModal();
        if (quoteForm && quoteProduct) {
          (quoteProduct.value ? quoteForm.elements.measurements : quoteProduct).focus();
        }
      });
    });

    document.querySelector('[data-quote-close]')?.addEventListener('click', () => quoteDialog?.close());
    quoteDialog?.addEventListener('click', event => {
      if (event.target === quoteDialog) quoteDialog.close();
    });

    quoteForm?.addEventListener('submit', event => {
      event.preventDefault();
      if (!quoteForm.reportValidity()) return;

      const data = new FormData(quoteForm);
      const lines = [
        'Olá, Torres! Gostaria de solicitar um orçamento.',
        '',
        `Material/serviço: ${data.get('product').trim()}`,
        data.get('measurements').trim() && `Medidas: ${data.get('measurements').trim()}`,
        `Quantidade: ${data.get('quantity').trim()}`,
        data.get('location').trim() && `Bairro/cidade: ${data.get('location').trim()}`,
      ].filter(Boolean);
      const url = `https://wa.me/5541995414120?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener');
    });
  };

  // -------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', () => {
    initPageLoad();
    initNavbar();
    initScrollAnimations();
    initParallax();
    initMicroInteractions();
    initExistingLogic();
  });

})();
