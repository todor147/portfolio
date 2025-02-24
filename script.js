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

let currentSlide = 0;
let touchStartX = 0;
let touchEndX = 0;

// Add touch event listeners to the gallery container
const galleryContainer = document.querySelector(".gallery-container");
if (galleryContainer) {
  galleryContainer.addEventListener('touchstart', handleTouchStart, false);
  galleryContainer.addEventListener('touchmove', handleTouchMove, false);
  galleryContainer.addEventListener('touchend', handleTouchEnd, false);
}

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
  
  // Update current slide index
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  
  // Calculate the offset for transform
  const offset = -currentSlide * 100;
  
  // Update transform with GPU acceleration
  const container = document.querySelector(".gallery-container");
  if (container) {
    container.style.transform = `translate3d(${offset}%, 0, 0)`;
    
    // Force browser reflow to ensure transform is applied
    container.offsetHeight;
    
    // Ensure all slides are visible
    slides.forEach((slide, index) => {
      slide.style.opacity = '1';
      slide.style.visibility = 'visible';
      slide.style.transform = 'none';
    });
  }
  
  // Adjust gallery height for the new slide
  adjustGalleryHeight();
}

function adjustGalleryHeight() {
  const galleryContainer = document.querySelector(".gallery-container");
  const slides = document.querySelectorAll(".gallery-slide");
  if (!galleryContainer || !slides.length) return;

  // Reset any previously set heights
  galleryContainer.style.height = '';
  slides.forEach(slide => {
    slide.style.height = '';
  });

  // Find the maximum image height across all slides
  let maxImageHeight = 0;
  let maxDescriptionHeight = 0;

  slides.forEach(slide => {
    const img = slide.querySelector("img");
    const description = slide.querySelector(".description");
    
    if (img) {
      // Get the natural image dimensions
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const containerWidth = slide.clientWidth;
      const calculatedHeight = containerWidth / imgAspectRatio;
      
      // Limit the height to a reasonable maximum
      const maxAllowedHeight = window.innerHeight * 0.6; // 60% of viewport height
      const finalHeight = Math.min(calculatedHeight, maxAllowedHeight);
      
      maxImageHeight = Math.max(maxImageHeight, finalHeight);
    }
    
    if (description) {
      maxDescriptionHeight = Math.max(maxDescriptionHeight, description.offsetHeight);
    }
  });

  // Apply the consistent heights
  if (window.matchMedia("(min-width: 600px)").matches) {
    // Desktop view
    const totalHeight = maxImageHeight + maxDescriptionHeight + 40; // Adding padding
    galleryContainer.style.height = `${totalHeight}px`;
    
    slides.forEach(slide => {
      const img = slide.querySelector("img");
      if (img) {
        img.style.maxHeight = `${maxImageHeight}px`;
      }
    });
  } else {
    // Mobile view
    const totalHeight = maxImageHeight + maxDescriptionHeight + 20; // Less padding for mobile
    galleryContainer.style.height = `${totalHeight}px`;
    
    slides.forEach(slide => {
      const img = slide.querySelector("img");
      if (img) {
        img.style.maxHeight = `${maxImageHeight}px`;
      }
    });
  }
}

// Initialize gallery on load
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector(".gallery-container");
  const slides = document.querySelectorAll(".gallery-slide");
  
  if (container && slides.length) {
    // Set initial transform
    container.style.transform = 'translate3d(0%, 0, 0)';
    
    // Ensure all slides are initially visible
    slides.forEach(slide => {
      slide.style.opacity = '1';
      slide.style.visibility = 'visible';
      slide.style.transform = 'none';
    });
    
    // Wait for all images to load before adjusting height
    const images = container.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          adjustGalleryHeight();
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            adjustGalleryHeight();
          }
        };
      }
    });
  }
});

// Adjust gallery height on window resize
window.addEventListener('resize', adjustGalleryHeight);

// Show/hide floating arrow based on scroll position
window.addEventListener('scroll', () => {
  const floatingArrow = document.querySelector('.floating-arrow');
  if (window.scrollY > 500) { // Show arrow after scrolling 500px
    floatingArrow.classList.add('visible');
  } else {
    floatingArrow.classList.remove('visible');
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

  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Update the theme
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update theme toggle buttons
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });

  // Close the mobile menu after theme change
  const menu = document.querySelector(".menu-links");
  if (menu && menu.classList.contains("open") && window.innerWidth <= 768) {
    setTimeout(() => {
      closeMenu();
    }, 200); // Small delay to ensure the theme change is visible
  }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  // Detect system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update theme toggle buttons
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Remove any existing event listeners
    toggle.removeEventListener('click', toggleTheme);
    // Add new event listener
    toggle.addEventListener('click', toggleTheme);
  });

  // Listen for changes in system theme preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!savedTheme) { // Only change if no theme is saved
      const newTheme = event.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggles.forEach(toggle => {
        toggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
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
  
  // Filter projects
  projects.forEach(project => {
    const tags = project.dataset.tags.split(',');
    if(category === 'all' || tags.includes(category)) {
      project.classList.remove('hidden');
      setTimeout(() => {
        project.style.opacity = '1';
        project.style.transform = 'scale(1)';
      }, 0);
    } else {
      project.style.opacity = '0';
      project.style.transform = 'scale(0.8)';
      setTimeout(() => {
        project.classList.add('hidden');
      }, 300);
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
