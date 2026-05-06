/* Ibbo UI Upgrade JS - Interactive Enhancements for Industrial Portfolio */

/**
 * Problem Solver Section Functionality
 * Handles card selection and workflow display
 */
class ProblemSolver {
  constructor() {
    this.cards = document.querySelectorAll('.problem-solver-card');
    this.init();
  }

  init() {
    if (!this.cards.length) return;

    this.cards.forEach(card => {
      card.addEventListener('click', () => this.selectCard(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectCard(card);
        }
      });
    });
  }

  selectCard(selectedCard) {
    // Remove active class from all cards
    this.cards.forEach(card => {
      card.classList.remove('active');
      card.setAttribute('aria-expanded', 'false');
      const workflow = card.querySelector('.problem-solver-workflow');
      if (workflow) {
        workflow.classList.remove('active');
      }
    });

    // Add active class to selected card
    selectedCard.classList.add('active');
    selectedCard.setAttribute('aria-expanded', 'true');

    // Show workflow for selected card
    const workflow = selectedCard.querySelector('.problem-solver-workflow');
    if (workflow) {
      workflow.classList.add('active');
    }

    // Smooth scroll to show the workflow
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      selectedCard.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'nearest'
      });
    }, 300);
  }
}

/**
 * Smooth Scrolling for Navigation
 */
class SmoothScroll {
  constructor() {
    this.links = document.querySelectorAll('.section-link, .nav-link[href^="#"]');
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('click', (e) => this.handleClick(e, link));
    });
  }

  handleClick(e, link) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'start'
        });

        // Update active nav link
        this.updateActiveNav(href);
      }
    }
  }

  updateActiveNav(activeHref) {
    document.querySelectorAll('.nav-link').forEach(navLink => {
      navLink.classList.remove('active');
      if (navLink.getAttribute('href') === activeHref) {
        navLink.classList.add('active');
      }
    });
  }
}

/**
 * Intersection Observer for Scroll Animations
 */
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, this.observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.problem-solver-card, .trusted-badge, .technical-cases .case-card, .scroll-reveal').forEach(el => {
      observer.observe(el);
    });
  }
}

/**
 * Performance Optimizations
 */
class PerformanceUtils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

/**
 * Initialize all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Problem Solver
  new ProblemSolver();

  // Initialize Smooth Scrolling
  new SmoothScroll();

  // Initialize Scroll Animations
  new ScrollAnimations();

  // Add loading class removal for smooth transitions
  document.body.classList.add('loaded');

  // Handle reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }

  // Performance: Debounce resize events
  const handleResize = PerformanceUtils.debounce(() => {
    // Add any resize-specific logic here if needed
  }, 250);

  window.addEventListener('resize', handleResize);
});

/**
 * Error handling and logging
 */
// Graceful degradation for older browsers
if (!window.IntersectionObserver) {
  console.warn('IntersectionObserver not supported. Scroll animations disabled.');
}

if (!window.matchMedia) {
  console.warn('matchMedia not supported. Reduced motion detection disabled.');
}