function closeMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay");
  const body = document.body;

  menu.classList.remove("open");
  icon.innerHTML = "☰";
  overlay.classList.remove("open");
  body.style.overflow = "auto";
}

function openMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay");
  const body = document.body;

  menu.classList.add("open");
  icon.innerHTML = "×";
  overlay.classList.add("open");
  body.style.overflow = "hidden";
}

function toggleMenu() {
  const menu = document.querySelector(".menu-links");

  if (menu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

// Close menu when clicking overlay
document.querySelector(".menu-overlay")?.addEventListener("click", closeMenu);

// Close menu when clicking any link or heading
document.querySelectorAll(".menu-links a, .title, .experience-sub-title").forEach(element => {
  element.addEventListener("click", () => {
    const menu = document.querySelector(".menu-links");
    if (menu.classList.contains("open")) {
      closeMenu();
    }
  });
});

// Close menu when screen is resized to desktop size
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

// Initialize variables
let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  // Show first slide by default
  const slides = document.querySelectorAll(".gallery-slide");
  if (slides.length > 0) {
    slides[0].classList.add('active');
  }
  
  // Add touch event listeners to the gallery container
  const galleryContainer = document.querySelector(".gallery-container");
  if (galleryContainer) {
    galleryContainer.addEventListener('touchstart', handleTouchStart, false);
    galleryContainer.addEventListener('touchmove', handleTouchMove, false);
    galleryContainer.addEventListener('touchend', handleTouchEnd, false);
  }
});

// Gallery touch event handlers
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
}

function handleTouchEnd() {
  const swipeThreshold = 50; // Minimum distance for a swipe
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) > swipeThreshold) {
    // If swipe distance is greater than threshold, change slide
    if (swipeDistance > 0) {
      // Swiped right - go to previous slide
      changeSlide(-1);
    } else {
      // Swiped left - go to next slide
      changeSlide(1);
    }
  }
  
  // Reset touch coordinates
  touchStartX = 0;
  touchEndX = 0;
}

function changeSlide(direction) {
  const slides = document.querySelectorAll(".gallery-slide");
  if (!slides.length) return;
  
  // Hide current slide
  slides[currentSlide].classList.remove('active');
  
  // Update current slide index
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  
  // Show new slide
  slides[currentSlide].classList.add('active');
}

// Show/hide floating arrow based on scroll position
window.addEventListener('scroll', () => {
  const floatingArrow = document.querySelector('.floating-arrow');
  if (!floatingArrow) return; // Safety check
  
  if (window.scrollY > 300) { // Show arrow after scrolling 300px (reduced from 500px)
    floatingArrow.classList.add('visible');
  } else {
    floatingArrow.classList.remove('visible');
  }
});

// Add click handler for the floating arrow
document.addEventListener('DOMContentLoaded', () => {
  const floatingArrow = document.querySelector('.floating-arrow');
  if (floatingArrow) {
    floatingArrow.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Automatically update copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Add smooth reveal animations on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('section').forEach((section) => {
  section.classList.add('hidden');
  observer.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  loaderWrapper.classList.add('fade-out');
  setTimeout(() => {
    loaderWrapper.style.display = 'none';
  }, 500);
});

// Theme toggle functionality
function toggleTheme(event) {
  // Prevent the menu from closing when clicking the theme toggle
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const currentTheme = localStorage.getItem('theme') || 'auto';
  let newTheme;
  
  // Cycle through themes: light -> dark -> auto
  if (currentTheme === 'light') {
    newTheme = 'dark';
  } else if (currentTheme === 'dark') {
    newTheme = 'auto';
  } else {
    newTheme = 'light';
  }
  
  // Apply the new theme
  if (newTheme === 'auto') {
    // For auto, use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', newTheme);
  }
  
  // Save theme preference
  localStorage.setItem('theme', newTheme);
  
  // Update theme toggle buttons
  updateThemeIcons();

  // Close the mobile menu after theme change
  const menu = document.querySelector(".menu-links");
  if (menu && menu.classList.contains("open") && window.innerWidth <= 768) {
    setTimeout(() => {
      closeMenu();
    }, 200); // Small delay to ensure the theme change is visible
  }
}

// Function to update theme toggle icons based on current theme
function updateThemeIcons() {
  const currentTheme = localStorage.getItem('theme') || 'auto';
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  themeToggles.forEach(toggle => {
    if (currentTheme === 'light') {
      toggle.innerHTML = '☀️'; // Sun for light theme
      toggle.setAttribute('aria-label', 'Currently on light theme, click to switch to dark');
    } else if (currentTheme === 'dark') {
      toggle.innerHTML = '🌙'; // Moon for dark theme
      toggle.setAttribute('aria-label', 'Currently on dark theme, click to switch to auto');
    } else { // auto
      toggle.innerHTML = '🔄'; // Auto symbol for auto theme
      toggle.setAttribute('aria-label', 'Currently on auto theme, click to switch to light');
    }
  });
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved theme preference or use auto as default
  const savedTheme = localStorage.getItem('theme') || 'auto';
  
  // Apply the theme
  if (savedTheme === 'auto') {
    // Use system preference for auto mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  // Update theme toggle icons
  updateThemeIcons();
  
  // Add click event listeners
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    // Remove any existing event listeners
    toggle.removeEventListener('click', toggleTheme);
    // Add new event listener
    toggle.addEventListener('click', toggleTheme);
  });

  // Listen for changes in system theme preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    // Only apply system theme if in auto mode
    if (localStorage.getItem('theme') === 'auto') {
      document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    }
  });
});

// Update scroll detection for nav
window.addEventListener('scroll', () => {
  const nav = document.querySelector('#desktop-nav');
  const hamburgerNav = document.querySelector('#hamburger-nav');
  const scrolled = window.scrollY > 20;
  
  // Add/remove scrolled class smoothly
  if (scrolled) {
    nav?.classList.add('scrolled');
    hamburgerNav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
    hamburgerNav?.classList.remove('scrolled');
  }
});

// Project filtering
function filterProjects(category) {
  const projects = document.querySelectorAll('.project-card');
  const buttons = document.querySelectorAll('.filter-btn');
  
  // Update active button
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if(btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  // Filter projects with improved transition
  projects.forEach(project => {
    const tags = project.dataset.tags.split(',');
    if(category === 'all' || tags.includes(category)) {
      // Show matching projects
      project.classList.remove('hidden');
      // Use setTimeout to ensure the display change takes effect before changing opacity
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
      }, 10);
    } else {
      // Hide non-matching projects
      project.style.opacity = '0';
      project.style.transform = 'scale(0.8)';
      // Wait for the transition to complete before removing from flow
      setTimeout(() => {
        project.classList.add('hidden');
      }, 300); // Match this to your CSS transition time
    }
  });
}

// Initialize project filters
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterProjects(button.dataset.category);
    });
  });
});

// Project card hover effects
document.addEventListener('DOMContentLoaded', () => {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.project-img');
      if (img) {
        img.style.transform = 'scale(1.05)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.project-img');
      if (img) {
        img.style.transform = 'scale(1)';
      }
    });
  });
});

// Animate skill bars when they come into view
document.addEventListener("DOMContentLoaded", function() {
  const skillsSection = document.getElementById('skills');
  const skillLevels = document.querySelectorAll('.skill-level');
  let animated = false;

  function animateSkillBars() {
    if (animated) return;
    
    const sectionTop = skillsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.9) { // Trigger animation earlier
      skillsSection.classList.add('skills-animated');
      
      // Animate each skill level to its target width
      skillLevels.forEach(skillLevel => {
        const targetWidth = skillLevel.getAttribute('data-width');
        setTimeout(() => {
          skillLevel.style.width = targetWidth;
        }, 50); // Shorter delay for quicker animation start
      });
      
      animated = true;
    }
  }

  // Set initial widths to 0
  skillLevels.forEach(skillLevel => {
    const width = skillLevel.getAttribute('data-width') || skillLevel.style.width;
    skillLevel.setAttribute('data-width', width);
    skillLevel.style.width = "0";
  });

  // Check on scroll
  window.addEventListener('scroll', animateSkillBars);
  
  // Check on page load
  animateSkillBars();
});

// Timeline animations
document.addEventListener('DOMContentLoaded', () => {
  const timelineContainer = document.querySelector('.timeline-container');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineContainer || timelineItems.length === 0) return;
  
  // Create a new IntersectionObserver for timeline items
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Stop observing after animation
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Initialize styles and start observing
  timelineItems.forEach((item, index) => {
    // Apply left/right positioning classes based on index
    if (index % 2 === 0) {
      item.classList.add('timeline-left');
    } else {
      item.classList.add('timeline-right');
    }
    
    // Set initial styles for animation
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    
    // Start observing
    timelineObserver.observe(item);
  });
});

// Timeline filtering functionality
document.addEventListener('DOMContentLoaded', () => {
  // Timeline tab filtering
  const timelineTabs = document.querySelectorAll('.timeline-tab');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  if (!timelineTabs.length || !timelineItems.length) return;
  
  // Initial state - limit visible items based on category
  const ITEMS_TO_SHOW_INITIALLY = 8;
  let currentCategory = 'timeline-all';
  let moreButtonAdded = false;
  let scrollObserver = null;
  
  // Create Intersection Observer for scroll animations
  function createScrollObserver() {
    // Disconnect any existing observer
    if (scrollObserver) {
      scrollObserver.disconnect();
    }
    
    // Create new observer for scroll animations
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          
          // Animate the item
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 100);
          
          // Stop observing after animation
          scrollObserver.unobserve(item);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }
  
  // Function to add "View More" button
  function addViewMoreButton() {
    if (moreButtonAdded) return;
    
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;
    
    const viewMoreButton = document.createElement('div');
    viewMoreButton.className = 'timeline-view-more';
    viewMoreButton.innerHTML = '<button class="btn btn-color-2">View More</button>';
    timelineContainer.after(viewMoreButton);
    
    viewMoreButton.querySelector('button').addEventListener('click', function() {
      const hiddenItems = document.querySelectorAll('.timeline-item.initially-hidden');
      
      // Hide the "View More" button
      this.parentElement.style.opacity = '0';
      setTimeout(() => {
        this.parentElement.style.display = 'none';
      }, 300);
      
      // Reveal items with staggered animation
      hiddenItems.forEach((item, index) => {
        // Set initial state but keep hidden
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.display = 'block';
        item.classList.remove('initially-hidden');
        
        // Animate with staggered delay
        setTimeout(() => {
          // Apply positioning based on visible index and current visible items
          const visibleItems = document.querySelectorAll('.timeline-item:not(.initially-hidden)');
          const visibleIndex = Array.from(visibleItems).indexOf(item);
          
          item.classList.remove('timeline-left', 'timeline-right');
          if (visibleIndex % 2 === 0) {
            item.classList.add('timeline-left');
          } else {
            item.classList.add('timeline-right');
          }
          
          // Start the reveal animation
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 100 + (index * 150)); // Staggered delay - each item appears 150ms after the previous one
      });
    });
    
    moreButtonAdded = true;
  }
  
  // Function to limit visible items and show "View More" button if needed
  function limitVisibleItems(visibleItems, targetCategory) {
    // Create a new scroll observer for the current set of items
    createScrollObserver();
    
    // If we have more than the limit, we need to limit them
    if (visibleItems.length > ITEMS_TO_SHOW_INITIALLY) {
      // Add view more button
      addViewMoreButton();
      
      // Now, handle items based on their position
      visibleItems.forEach((item, index) => {
        // Reset styles
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        if (index >= ITEMS_TO_SHOW_INITIALLY) {
          // Hide items beyond the initial limit
          item.classList.add('initially-hidden');
          setTimeout(() => {
            item.style.display = 'none';
          }, 50);
        } else {
          // Show items within the limit and observe for scroll animation
          item.style.display = 'block';
          scrollObserver.observe(item);
        }
      });
      
      // Display the view more button
      document.querySelector('.timeline-view-more').style.display = 'flex';
    } else {
      // When there are fewer items than the limit
      visibleItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.display = 'block';
        
        // Observe all items for scroll animation
        scrollObserver.observe(item);
      });
      
      // Hide the view more button if visible items are less than the limit
      const viewMoreBtn = document.querySelector('.timeline-view-more');
      if (viewMoreBtn) {
        viewMoreBtn.style.display = 'none';
      }
    }
  }
  
  timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      timelineTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      currentCategory = tab.getAttribute('data-target');
      
      // Track visible items for repositioning
      const visibleItems = [];
      
      // First pass - identify which items will be visible
      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (currentCategory === 'timeline-all' || 
            currentCategory.includes(itemCategory)) {
          visibleItems.push(item);
          item.classList.remove('initially-hidden');
        }
      });
      
      // Second pass - apply filtering and positioning
      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (currentCategory === 'timeline-all' || currentCategory.includes(itemCategory)) {
          // Show this item
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          // Hide this item
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
      
      // Apply alternating left/right positioning based on visible items
      visibleItems.forEach((item, index) => {
        // Remove any previous positioning classes
        item.classList.remove('timeline-left', 'timeline-right');
        
        // Apply positioning based on visible index
        if (index % 2 === 0) {
          item.classList.add('timeline-left');
        } else {
          item.classList.add('timeline-right');
        }
      });
      
      // Limit visible items if there are too many
      limitVisibleItems(visibleItems, currentCategory);
    });
  });
  
  // Initialize the timeline on first load
  const defaultTab = document.querySelector('.timeline-tab.active');
  if (defaultTab) {
    setTimeout(() => {
      defaultTab.click();
    }, 100);
  }
  
  // Handle direct anchor links to specific timeline categories
  function handleTimelineLinks() {
    const hash = window.location.hash;
    if (hash && hash.includes('timeline-')) {
      const targetCategory = hash.replace('#', '');
      const matchingTab = document.querySelector(`.timeline-tab[data-target="${targetCategory}"]`);
      
      if (matchingTab) {
        setTimeout(() => {
          matchingTab.click();
          
          // Scroll to the timeline section with a slight offset
          const timelineSection = document.getElementById('timeline');
          if (timelineSection) {
            const offset = -100; // Adjust as needed
            const top = timelineSection.getBoundingClientRect().top + window.pageYOffset + offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 300);
      }
    }
  }
  
  // Run on page load
  handleTimelineLinks();
  
  // Also handle navigation changes
  window.addEventListener('hashchange', handleTimelineLinks);
});

// Contact form functionality
document.addEventListener('DOMContentLoaded', () => {
  // Form handling now done by FormSubmit
  // No JavaScript needed for the contact form
});

// Add event listener to scroll indicator
document.addEventListener('DOMContentLoaded', function() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Typewriter animation
document.addEventListener("DOMContentLoaded", function() {
  const phrases = [
    "Computer Science Student",
    "Web Developer",
    "Problem Solver",
    "Software Engineer",
    "UI/UX Enthusiast"
  ];
  
  const dynamicText = document.querySelector('.dynamic-text');
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  let delayAfterPhrase = 1500;
  let delayBeforeTyping = 500;
  
  function typeWriter() {
    const currentPhrase = phrases[currentIndex];
    
    if (isDeleting) {
      // Removing letters
      dynamicText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster deletion
      
      // When done deleting, move to next phrase
      if (charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % phrases.length;
        typingSpeed = delayBeforeTyping; // Pause before typing next phrase
      }
    } else {
      // Adding letters
      dynamicText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
      
      // When phrase is completely typed
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = delayAfterPhrase; // Pause before deleting
      }
    }
    
    setTimeout(typeWriter, typingSpeed);
  }
  
  // Start the animation
  typeWriter();
});
