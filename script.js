// Add this code at the beginning of the file to catch all events
document.addEventListener('DOMContentLoaded', function() {
  // Create direct menu elements to avoid any conflicts
  createMobileMenu();
});

// Function to create a completely new mobile menu
function createMobileMenu() {
  // First, remove any existing menu elements that might be conflicting
  const existingMenus = document.querySelectorAll('.menu-links, .menu-overlay, .mobile-menu-links, .mobile-menu-overlay');
  existingMenus.forEach(el => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
  
  // Create new menu elements
  const menuOverlay = document.createElement('div');
  menuOverlay.className = 'mobile-menu-overlay';
  menuOverlay.style.position = 'fixed';
  menuOverlay.style.top = '0';
  menuOverlay.style.left = '0';
  menuOverlay.style.width = '100%';
  menuOverlay.style.height = '100%';
  menuOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  menuOverlay.style.zIndex = '99998';
  menuOverlay.style.display = 'none';
  
  const menuLinks = document.createElement('div');
  menuLinks.className = 'mobile-menu-links';
  menuLinks.style.position = 'fixed';
  menuLinks.style.top = '0';
  menuLinks.style.right = '-100%';
  menuLinks.style.width = '280px';
  menuLinks.style.maxWidth = '85%';
  menuLinks.style.height = '100vh';
  menuLinks.style.backgroundColor = 'var(--card-bg, #ffffff)';
  menuLinks.style.color = 'var(--text-color, #2D2E32)';
  menuLinks.style.boxShadow = '-5px 0 20px rgba(0, 0, 0, 0.3)';
  menuLinks.style.zIndex = '99999';
  menuLinks.style.padding = '80px 20px 30px';
  menuLinks.style.display = 'flex';
  menuLinks.style.flexDirection = 'column';
  menuLinks.style.transition = 'right 0.3s ease';
  menuLinks.style.overflowY = 'auto';
  
  // Define section links
  const sections = [
    { id: "about", name: "About" },
    { id: "skills", name: "Skills" },
    { id: "experience", name: "Experience" },
    { id: "projects", name: "Projects" },
    { id: "contact", name: "Contact" },
    { id: "gallery", name: "Gallery" },
    { id: "timeline", name: "Timeline" }
  ];
  
  // Create links for each section
  sections.forEach(section => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = section.name;
    link.style.display = 'block';
    link.style.padding = '15px 0';
    link.style.borderBottom = '1px solid var(--border-color, #eee)';
    link.style.textDecoration = 'none';
    link.style.color = 'var(--text-color, #2D2E32)';
    link.style.fontSize = '18px';
    
    // Add click handler to close menu when link is clicked
    link.addEventListener('click', function(e) {
      closeMobileMenu();
    });
    
    menuLinks.appendChild(link);
  });
  
  // Add theme toggle options
  const themeToggleContainer = document.createElement('div');
  themeToggleContainer.style.marginTop = '20px';
  themeToggleContainer.style.borderTop = '0';
  themeToggleContainer.style.paddingTop = '5px';
  
  const themeTitle = document.createElement('h3');
  themeTitle.textContent = 'Theme';
  themeTitle.style.fontSize = '18px';
  themeTitle.style.marginBottom = '15px';
  themeTitle.style.color = 'var(--text-color, #2D2E32)';
  themeTitle.style.padding = '15px 0 5px';
  themeTitle.style.borderBottom = '1px solid var(--border-color, #eee)';
  
  const themeOptions = document.createElement('div');
  themeOptions.style.display = 'flex';
  themeOptions.style.gap = '10px';
  
  const createThemeButton = (text, theme) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.dataset.theme = theme;
    button.style.padding = '8px 12px';
    button.style.borderRadius = '4px';
    button.style.border = 'none';
    button.style.backgroundColor = 'var(--hover-color, #f8f8f8)';
    button.style.color = 'var(--text-color, #2D2E32)';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    
    // Add active styles to the current theme
    const currentTheme = localStorage.getItem('theme') || 'auto';
    if (theme === currentTheme) {
      button.style.backgroundColor = 'var(--primary-color, #1D8A5E)';
      button.style.color = 'white';
    }
    
    button.addEventListener('click', function() {
      // Apply theme change immediately
      setTheme(theme);
      
      // Update active button styles
      const buttons = themeOptions.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.style.backgroundColor = 'var(--hover-color, #f8f8f8)';
        btn.style.color = 'var(--text-color, #2D2E32)';
      });
      
      button.style.backgroundColor = 'var(--primary-color, #1D8A5E)';
      button.style.color = 'white';
      
      // Close menu after a short delay to show the theme change
      setTimeout(() => {
        if (window.innerWidth <= 768) {
          closeMobileMenu();
        }
      }, 400);
    });
    
    return button;
  };
  
  const lightButton = createThemeButton('Light', 'light');
  const darkButton = createThemeButton('Dark', 'dark');
  const autoButton = createThemeButton('Auto', 'auto');
  
  themeOptions.appendChild(lightButton);
  themeOptions.appendChild(darkButton);
  themeOptions.appendChild(autoButton);
  
  themeToggleContainer.appendChild(themeTitle);
  themeToggleContainer.appendChild(themeOptions);
  
  menuLinks.appendChild(themeToggleContainer);
  
  // Add elements to the document body
  document.body.appendChild(menuOverlay);
  document.body.appendChild(menuLinks);
  
  // Add click handler to overlay to close menu
  menuOverlay.addEventListener('click', function() {
    closeMobileMenu();
  });
  
  // Add click handler to all hamburger icons
  const hamburgerIcons = document.querySelectorAll('.hamburger-icon');
  hamburgerIcons.forEach(icon => {
    icon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileMenu();
    });
    
    // Make sure the hamburger is visible and clickable
    icon.style.position = 'relative';
    icon.style.zIndex = '100000';
    icon.style.cursor = 'pointer';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
  });
}

// Very simple toggle function
function toggleMobileMenu() {
  const menu = document.querySelector('.mobile-menu-links');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  
  if (!menu || !overlay) {
    return;
  }
  
  if (menu.style.right === '0px') {
    // Close menu
    closeMobileMenu();
  } else {
    // Open menu
    openMobileMenu();
  }
}

function openMobileMenu() {
  const menu = document.querySelector('.mobile-menu-links');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  
  if (!menu || !overlay) return;
  
  menu.style.right = '0';
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  if (hamburgerIcon) {
    hamburgerIcon.innerHTML = '×';
  }
}

function closeMobileMenu() {
  const menu = document.querySelector('.mobile-menu-links');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  
  if (!menu || !overlay) return;
  
  menu.style.right = '-100%';
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  
  if (hamburgerIcon) {
    hamburgerIcon.innerHTML = '☰';
  }
}

function closeMenu() {
  try {
    // Get all elements directly to avoid any selector issues
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay");
  const body = document.body;

    // 1. Force remove open class from menu
    if (menu) {
  menu.classList.remove("open");
      // Force inline styles to ensure menu is hidden
      menu.style.right = "-100%";
      menu.style.opacity = "0";
      menu.style.visibility = "hidden";
    }
    
    // 2. Update hamburger icon
    if (icon) {
  icon.innerHTML = "☰";
      icon.classList.remove("open");
    }
    
    // 3. Hide overlay
    if (overlay) {
  overlay.classList.remove("open");
      // Force inline styles to ensure overlay is hidden
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
    }
    
    // 4. Reset body styles
    if (body) {
      body.classList.remove("menu-open");
      body.style.overflow = "";
      body.style.position = "";
      body.style.width = "";
      body.style.height = "";
      
      // Restore scroll position
      const scrollY = body.style.top;
      body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    
    // 5. Restore original z-index values
    const elementsWithZIndex = document.querySelectorAll('[data-original-z-index]');
    elementsWithZIndex.forEach(el => {
      el.style.zIndex = el.getAttribute('data-original-z-index');
      el.removeAttribute('data-original-z-index');
    });
    
    // 6. Double check menu is closed after a delay (sometimes classList changes don't take effect immediately)
    setTimeout(() => {
      if (menu && menu.classList.contains("open")) {
        menu.classList.remove("open");
      }
    }, 100);
  } catch (error) {
    // Silently handle any errors
  }
}

// Ensure the click handlers are properly set up for menu links
// Add this function to be called during the document ready event
function setupMenuLinkHandlers() {
  const menuLinks = document.querySelectorAll(".menu-links a");
  
  menuLinks.forEach((link, index) => {
    link.addEventListener("click", handleMenuLinkClick);
  });
  }
  
// Separate function to handle menu link clicks
function handleMenuLinkClick(e) {
  // Force menu to close when links are clicked
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay");
  
  if (menu) menu.classList.remove("open");
  if (icon) icon.innerHTML = "☰";
  if (overlay) overlay.classList.remove("open");
  
  closeMenu(); // Call the close function to ensure all side effects happen
}

function openMenu() {
  try {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay");
  const body = document.body;

    if (!menu) {
      return;
    }
    
    // 1. Toggle menu visibility
  menu.classList.add("open");
    body.classList.add("menu-open");
    
    // 2. Update hamburger icon
    if (icon) {
      icon.innerHTML = "✕";
      icon.classList.add("open");
    }
    
    // 3. Show overlay
    if (overlay) {
  overlay.classList.add("open");
    }
    
    // 4. Prevent background scrolling
    const scrollY = window.scrollY;
    body.style.top = `-${scrollY}px`;
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.height = '100%';
  
    // 5. Force menu to appear in front (z-index issues)
    forceMenuZIndex();
    
  } catch (error) {
    // Silently handle any errors
  }
}

// Fix toggle menu function to be more direct
function toggleMenu() {
  try {
  const menu = document.querySelector(".menu-links");
    
    if (!menu) {
      return;
    }

  if (menu.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
  } catch (error) {
    // Silently handle any errors
  }
}

// Simplified direct click handler for hamburger icon
function setupHamburgerClickHandler() {
  const hamburger = document.querySelector(".hamburger-icon");
  
  if (hamburger) {
    hamburger.addEventListener("click", handleHamburgerClick);
  }
}

// Direct hamburger click handler
function handleHamburgerClick(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu();
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Create the mobile menu first
  createMobileMenu();
  
  // Get menu elements
  const menuLinks = document.querySelector(".menu-links");
  const menuOverlay = document.querySelector(".menu-overlay");
  
  // If menu elements exist, move them to body level for better stacking context
  if (menuLinks && menuLinks.parentNode) {
    document.body.appendChild(menuLinks);
  }
  
  if (menuOverlay && menuOverlay.parentNode) {
    document.body.appendChild(menuOverlay);
  }
  
  // Set up menu link handlers
  setupMenuLinkHandlers();
  
  // Set up overlay click handler if it exists
  if (menuOverlay) {
    menuOverlay.addEventListener("click", handleOverlayClick);
  }
  
  // Set up document click handler to close menu when clicking outside
  document.addEventListener("click", handleDocumentClick);
  
  // Set up hamburger icon handler
  setupHamburgerClickHandler();
  
  // Update hospitality experience counter
  updateExperienceCounter();

  // Initialize theme - set to auto by default if no theme is saved
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'auto');
  }
  
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme);
});

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
let touchStartY = 0; // Add vertical tracking to avoid issues with scroll vs swipe
let touchEndY = 0;
let lastTap = 0; // For double-tap detection

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
  
  // Improve mobile dropdown functionality
  setupMobileDropdowns();
  
  // Set up floating arrow behavior
  setupFloatingArrow();
  
  // Set up improved touch targets
  improveTouchTargets();
  
  // Add enhanced events for mobile menu
  enhanceMobileMenu();
  
  // Call the new function to set up the scroll indicator
  setupScrollIndicator();
});

// Enhanced mobile menu functionality - simplified
function enhanceMobileMenu() {
  // Enhance mobile dropdowns
  const mobileDropdown = document.querySelector('.timeline-dropdown-mobile');
  if (mobileDropdown) {
    const dropdownLink = mobileDropdown.querySelector('a');
    
    dropdownLink.addEventListener('click', function(event) {
      event.preventDefault();
      mobileDropdown.classList.toggle('active');
      
      // Prevent menu from closing when clicking the dropdown
      event.stopPropagation();
    });
  }
  
  // Simple effect for hamburger icon
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  if (hamburgerIcon) {
    hamburgerIcon.addEventListener('mousedown', function() {
      this.style.opacity = '0.8';
    });
    
    hamburgerIcon.addEventListener('mouseup', function() {
      this.style.opacity = '1';
    });
    
    hamburgerIcon.addEventListener('mouseleave', function() {
      this.style.opacity = '1';
    });
  }
}

// Gallery touch event handlers
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
  
  // Prevent page scrolling when swiping in the gallery
  const galleryContainer = document.querySelector(".gallery-container");
  if (galleryContainer && galleryContainer.contains(event.target)) {
    // Check if horizontal swipe is more significant than vertical
    const xDiff = Math.abs(touchEndX - touchStartX);
    const yDiff = Math.abs(touchEndY - touchStartY);
    
    if (xDiff > yDiff && xDiff > 30) {
      event.preventDefault();
    }
  }
}

function handleTouchEnd() {
  const swipeThreshold = 50; // Minimum distance for a swipe
  const swipeDistance = touchEndX - touchStartX;
  const verticalDistance = Math.abs(touchEndY - touchStartY);
  
  // Only register as a swipe if horizontal movement is greater than vertical
  // This prevents accidental swipes when scrolling
  if (Math.abs(swipeDistance) > swipeThreshold && Math.abs(swipeDistance) > verticalDistance) {
    // If swipe distance is greater than threshold, change slide
    if (swipeDistance > 0) {
      // Swiped right - go to previous slide
      changeSlide(-1);
    } else {
      // Swiped left - go to next slide
      changeSlide(1);
    }
  }
  
  // Handle double tap to zoom (only on mobile)
  const now = new Date().getTime();
  const timeDiff = now - lastTap;
  
  if (timeDiff < 300 && timeDiff > 0) {
    // Double tap detected
    const target = document.elementFromPoint(touchEndX, touchEndY);
    if (target && target.tagName === 'IMG') {
      toggleImageZoom(target);
    }
  }
  
  lastTap = now;
}

// Toggle image zoom on double tap
function toggleImageZoom(img) {
  if (img.classList.contains('zoomed')) {
    img.classList.remove('zoomed');
    img.style.transform = 'scale(1)';
    img.style.cursor = 'zoom-in';
  } else {
    img.classList.add('zoomed');
    img.style.transform = 'scale(1.5)';
    img.style.cursor = 'zoom-out';
  }
}

function changeSlide(direction) {
  const slides = document.querySelectorAll(".gallery-slide");
  
  // Remove active class from current slide
  slides[currentSlide].classList.remove("active");
  
  // Calculate new slide index
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  
  // Add active class to new slide
  slides[currentSlide].classList.add("active");
  
  // Scroll to top of gallery container if needed
  if (window.innerWidth <= 767) {
    const gallerySection = document.getElementById('gallery');
    const galleryTop = gallerySection.getBoundingClientRect().top + window.scrollY;
    
    // Only scroll if we're not already at the gallery
    if (Math.abs(window.scrollY - galleryTop) > 200) {
      window.scrollTo({
        top: galleryTop - 100,
        behavior: 'smooth'
      });
    }
  }
}

// Setup mobile dropdowns
function setupMobileDropdowns() {
  const mobileDropdown = document.querySelector('.timeline-dropdown-mobile');
  
  if (mobileDropdown) {
    // Toggle dropdown on tap
    mobileDropdown.addEventListener('click', function(event) {
      // Only toggle if the direct link was clicked (not a dropdown item)
      if (event.target.parentNode === this) {
        this.classList.toggle('active');
        event.preventDefault();
      }
    });
  }
}

// Setup floating arrow for easier page navigation
function setupFloatingArrow() {
  const floatingArrow = document.querySelector('.floating-arrow');
  
  if (floatingArrow) {
    // Show arrow after scrolling
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        floatingArrow.classList.add('visible');
      } else {
        floatingArrow.classList.remove('visible');
      }
    });
    
    // Add smooth scroll to top
    floatingArrow.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Improve touch targets for mobile
function improveTouchTargets() {
  // Add aria-label to buttons without text
  document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('aria-label') && button.textContent.trim() === '') {
      if (button.classList.contains('theme-toggle')) {
        button.setAttribute('aria-label', 'Toggle dark mode');
      } else if (button.classList.contains('prev')) {
        button.setAttribute('aria-label', 'Previous slide');
      } else if (button.classList.contains('next')) {
        button.setAttribute('aria-label', 'Next slide');
      }
    }
  });
  
  // Make small icons more tappable on mobile
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.icon').forEach(icon => {
      icon.style.minWidth = '44px';
      icon.style.minHeight = '44px';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
    });
  }
}

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
  const timelineContainer = document.querySelector('.timeline-container');
  if (!timelineTabs.length || !timelineItems.length || !timelineContainer) return;

  // Sort timeline items by date on load and when 'All' is selected
  sortTimelineItemsByDate(timelineContainer);

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

// Add scroll handling for hamburger menu
window.addEventListener('scroll', function() {
  // Get the hamburger nav
  const hamburgerNav = document.querySelector('#hamburger-nav');
  
  if (hamburgerNav) {
    // Add slight transparency when scrolled
    if (window.scrollY > 50) {
      hamburgerNav.style.backgroundColor = 'var(--nav-bg)';
      hamburgerNav.style.boxShadow = '0 4px 10px var(--nav-shadow)';
    } else {
      hamburgerNav.style.backgroundColor = 'var(--nav-bg)';
      hamburgerNav.style.boxShadow = '0 2px 10px var(--nav-shadow)';
    }
  }
});

// Function to handle scroll indicator with mobile check
function setupScrollIndicator() {
  // First check if we're on mobile - if so, we don't need to do anything
  if (window.innerWidth <= 768) {
    return; // Don't run the function on mobile
  }
  
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const aboutSection = document.getElementById('about');
  
  if (scrollIndicator && aboutSection) {
    // Make scroll indicator scroll to about section when clicked
    scrollIndicator.addEventListener('click', function(e) {
      e.preventDefault();
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Add pointer cursor to indicate it's clickable
    scrollIndicator.style.cursor = 'pointer';
  }
}

// Scroll-based navbar visibility
let lastScrollTop = 0;
const hamburgerNav = document.getElementById('hamburger-nav');
const scrollThreshold = 50; // How many pixels to scroll before showing/hiding

window.addEventListener('scroll', function() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  // Show navbar at the very top of the page
  if (currentScroll <= 10) {
    hamburgerNav.classList.add('show-nav');
    return;
  }
  
  // Determine scroll direction
  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    // Scrolling down
    hamburgerNav.classList.remove('show-nav');
  } else if (currentScroll < lastScrollTop) {
    // Scrolling up
    hamburgerNav.classList.add('show-nav');
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For mobile or negative scrolling
}, { passive: true });

// Show navbar initially then hide after 2 seconds if no scrolling
document.addEventListener('DOMContentLoaded', function() {
  hamburgerNav.classList.add('show-nav');
  
  setTimeout(function() {
    if (window.pageYOffset > scrollThreshold) {
      hamburgerNav.classList.remove('show-nav');
    }
  }, 2000);
});

function handlePotentialObscuringElements() {
  // Elements that might be obscuring the menu
  const potentialObscuringSelectors = [
    '.description', 
    '.modal', 
    '.zoom-container', 
    '.gallery-slide',
    '[style*="z-index"]',
    '[class*="popup"]',
    '[class*="overlay"]',
    '[class*="modal"]'
  ];
  
  // Find and adjust any potentially obscuring elements
  potentialObscuringSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        if (el.classList.contains('menu-links') || el.classList.contains('hamburger-icon') || el.classList.contains('menu-overlay')) {
          return; // Skip our menu elements
        }
        
        const computedStyle = window.getComputedStyle(el);
        const zIndex = parseInt(computedStyle.zIndex);
        
        // If element has a high z-index or is absolutely/fixed positioned
        if (!isNaN(zIndex) && zIndex > 1000 || 
            computedStyle.position === 'fixed' || 
            computedStyle.position === 'absolute') {
          
          // Temporarily lower its z-index
          el.dataset.originalZIndex = computedStyle.zIndex;
          el.style.zIndex = "1";
        }
      });
    } catch (err) {
      // Silently handle any errors
    }
  });
}

function forceMenuZIndex() {
  const menu = document.querySelector(".menu-links.open");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay.open");
  
  // Check for obscuring elements first
  handlePotentialObscuringElements();
  
  if (overlay) {
    // Set overlay to appear behind the menu but above other content
    overlay.style.zIndex = "99999";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.backdropFilter = "blur(3px)";
  }
  
  if (menu) {
    // Force inline styles with extremely high z-index and full height
    // Important: menu z-index must be HIGHER than overlay z-index
    menu.style.zIndex = "9999999";
    menu.style.position = "fixed";
    menu.style.top = "0";
    menu.style.right = "0";
    menu.style.height = "100vh";
    menu.style.width = "280px";
    menu.style.maxWidth = "85%";
    menu.style.visibility = "visible";
    menu.style.display = "flex";
    menu.style.flexDirection = "column";
    menu.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim();
    menu.style.overflowY = "auto";
    menu.style.opacity = "1";
    menu.style.boxShadow = "-5px 0 20px rgba(0, 0, 0, 0.3)";
  }
  
  if (icon) {
    // Icon should be above all - same as menu or higher
    icon.style.zIndex = "9999999";
  }
}

// Helper functions for event handling
function toggleMenuWithPrevent(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu();
}

function handleOverlayClick(e) {
  e.preventDefault();
  e.stopPropagation();
  closeMenu();
}

// Function to handle clicks outside the menu
function handleDocumentClick(e) {
  const menu = document.querySelector(".menu-links, .mobile-menu-links");
  const hamburger = document.querySelector(".hamburger-icon");
  
  // If menu is open and click is outside menu and hamburger, close it
  if (menu && 
      menu.classList.contains("open") && 
      !menu.contains(e.target) && 
      hamburger && 
      !hamburger.contains(e.target)) {
    closeMenu();
  }
}

// Add theme switching functionality
function setTheme(theme) {
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  localStorage.setItem('theme', theme);
  
  if (theme === 'light') {
    root.classList.remove('dark-theme');
    root.classList.add('light-theme');
    root.setAttribute('data-theme', 'light');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
  } else if (theme === 'dark') {
    root.classList.remove('light-theme');
    root.classList.add('dark-theme');
    root.setAttribute('data-theme', 'dark');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#191919');
  } else {
    // Auto theme based on system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
      root.classList.remove('light-theme');
      root.classList.add('dark-theme');
      root.setAttribute('data-theme', 'dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#191919');
    } else {
      root.classList.remove('dark-theme');
      root.classList.add('light-theme');
      root.setAttribute('data-theme', 'light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'auto') {
        setTheme('auto');
      }
    });
  }
  
  // Update any active buttons in the theme toggle
  const themeButtons = document.querySelectorAll('[data-theme]');
  themeButtons.forEach(button => {
    if (button.dataset.theme === theme) {
      button.style.backgroundColor = 'var(--primary-color, #1D8A5E)';
      button.style.color = 'white';
    } else {
      button.style.backgroundColor = 'var(--hover-color, #f8f8f8)';
      button.style.color = 'var(--text-color, #2D2E32)';
    }
  });
  
  // Update desktop theme toggle buttons as well
  updateThemeIcons();
}

// Function to calculate and update the hospitality experience counter
function updateExperienceCounter() {
  const hospitalityCounter = document.getElementById('hospitality-experience');
  
  if (hospitalityCounter) {
    // Start date: September 2022
    const startDate = new Date(2022, 8, 1); // Month is 0-indexed (8 = September)
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const timeDiff = currentDate - startDate;
    
    // Convert to years and months
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.floor(timeDiff / millisecondsPerDay);
    
    const years = Math.floor(daysDiff / 365);
    const months = Math.floor((daysDiff % 365) / 30);
    
    // Calculate total years with correct decimal (months/12)
    const totalYears = years + (months / 12);
    
    // Format to 1 decimal place
    hospitalityCounter.textContent = totalYears.toFixed(1);
    
    // Run the counter update every day
    setTimeout(updateExperienceCounter, 24 * 60 * 60 * 1000);
  }
}

// --- Timeline Sorting Utility ---
function parseTimelineDate(dateStr) {
  // Handles formats like 'Jun 2025', 'May 2025 - Jun 2025', 'Mar 2025 - Mar 2028', 'Mar 2024 - Present'
  // Returns a comparable Date object (end date if range, otherwise the date itself)
  if (!dateStr) return new Date(0);
  dateStr = dateStr.trim();
  let end = dateStr;
  if (dateStr.includes('-')) {
    end = dateStr.split('-')[1].trim();
  }
  if (/present/i.test(end)) {
    return new Date(3000, 0, 1); // Far future for 'Present'
  }
  // Try to parse 'Mon YYYY' or 'YYYY'
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };
  const parts = end.split(/\s+/);
  if (parts.length === 2) {
    const m = months[parts[0].toLowerCase().slice(0,3)];
    const y = parseInt(parts[1], 10);
    if (!isNaN(m) && !isNaN(y)) return new Date(y, m, 1);
  }
  if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    return new Date(parseInt(parts[0], 10), 0, 1);
  }
  return new Date(0); // fallback
}

function sortTimelineItemsByDate(container) {
  const items = Array.from(container.querySelectorAll('.timeline-item'));
  items.sort((a, b) => {
    const aDate = parseTimelineDate(a.querySelector('.timeline-date')?.textContent);
    const bDate = parseTimelineDate(b.querySelector('.timeline-date')?.textContent);
    return bDate - aDate; // Descending (most recent first)
  });
  items.forEach(item => container.appendChild(item));
}
// --- End Timeline Sorting Utility ---
