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

// Skill bar animation
document.addEventListener('DOMContentLoaded', () => {
  // Function to animate skill bars
  function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
      // Get the percentage from the text
      const percentText = item.querySelector('.skill-percentage').textContent;
      const percentage = parseInt(percentText);
      
      // Get the skill level bar
      const skillLevel = item.querySelector('.skill-level');
      
      if (skillLevel && !isNaN(percentage)) {
        // Reset to 0 first (only on initial animation)
        skillLevel.style.width = '0';
        
        // Force reflow to ensure animation works
        void skillLevel.offsetWidth;
        
        // Set the width to match the percentage
        setTimeout(() => {
          skillLevel.style.width = percentage + '%';
        }, 50);
      }
    });
  }
  
  // Call immediately to ensure bars are filled when page loads
  animateSkillBars();
  
  // Also use IntersectionObserver to re-trigger animation when scrolling into view
  const skillObserver = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      // Re-animate skill bars when they come into view
      animateSkillBars();
    }
  }, { threshold: 0.1 });
  
  // Start observing the skills section
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }
});

// Timeline animations
document.addEventListener('DOMContentLoaded', () => {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
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
    
    // Set initial styles - alternate left/right animation
    const isEven = index % 2 === 0;
    item.style.opacity = '0';
    item.style.transform = isEven ? 'translateX(-50px)' : 'translateX(50px)';
    // Reduced transition duration from 0.6s to 0.5s for faster animations
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Add a slight delay for each item to create a cascade effect
    // Reduced from 0.15s to 0.08s to make items appear faster
    item.style.transitionDelay = `${index * 0.08}s`;
    
    // Start observing
    timelineObserver.observe(item);
  });
});

// Timeline filtering functionality
document.addEventListener('DOMContentLoaded', () => {
  // Timeline tab filtering
  const timelineTabs = document.querySelectorAll('.timeline-tab');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Apply initial left/right classes based on index
  timelineItems.forEach((item, index) => {
    if (index % 2 === 0) {
      item.classList.add('timeline-left');
    } else {
      item.classList.add('timeline-right');
    }
  });
  
  function filterTimeline(targetCategory) {
    // Get the corresponding tab and activate it
    timelineTabs.forEach(tab => {
      const tabTarget = tab.getAttribute('data-target');
      if (tabTarget === targetCategory) {
        tab.click(); // Trigger the click event on the tab
      }
    });
  }
  
  timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      timelineTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetCategory = tab.getAttribute('data-target');
      
      // Track visible items for repositioning
      const visibleItems = [];
      
      // First pass - identify which items will be visible
      timelineItems.forEach(item => {
        if (targetCategory === 'timeline-all' || 
            targetCategory.includes(item.getAttribute('data-category'))) {
          visibleItems.push(item);
        }
      });
      
      // Second pass - apply filtering and positioning
      timelineItems.forEach(item => {
        if (targetCategory === 'timeline-all') {
          // Show all items
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 10);
        } else {
          // Only show items of the selected category
          const itemCategory = item.getAttribute('data-category');
          if (targetCategory.includes(itemCategory)) {
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        }
      });
      
      // Apply alternating left/right positioning based on order of visible items
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
    });
  });

  // Handle timeline dropdown links
  const timelineDropdownLinks = document.querySelectorAll('.dropdown-content a, .dropdown-content-mobile a');
  timelineDropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Extract the target category from the href
      const href = link.getAttribute('href');
      const targetId = href.substring(1); // Remove the # from the href
      
      // Scroll to the timeline section
      const timelineSection = document.getElementById('timeline');
      if (timelineSection) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Scroll to timeline section with offset for header
        const headerHeight = document.getElementById('desktop-nav').offsetHeight;
        const timelineTop = timelineSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: timelineTop,
          behavior: 'smooth'
        });
        
        // Apply the filter after scrolling completes
        setTimeout(() => {
          filterTimeline(targetId);
        }, 700); // Allow time for the scroll to complete
      }
    });
  });

  // Mobile timeline dropdown functionality
  const mobileTimelineDropdown = document.querySelector('.timeline-dropdown-mobile');
  if (mobileTimelineDropdown) {
    const dropdownLink = mobileTimelineDropdown.querySelector('a');
    dropdownLink.addEventListener('click', (e) => {
      // Prevent the link from navigating immediately
      if (window.innerWidth <= 768) {
        e.preventDefault();
        mobileTimelineDropdown.classList.toggle('active');
      }
    });
  }
});
