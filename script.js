function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".menu-overlay");
  const body = document.body;

  menu.classList.toggle("open");
  icon.classList.toggle("open");
  overlay.classList.toggle("open");
  
  // Toggle body scroll
  if (menu.classList.contains("open")) {
    body.style.overflow = "hidden";
  } else {
    body.style.overflow = "auto";
  }
}

// Close menu when clicking overlay
document.querySelector(".menu-overlay")?.addEventListener("click", toggleMenu);

// Close menu when clicking any link or heading
document.querySelectorAll(".menu-links a, .title, .experience-sub-title").forEach(element => {
  element.addEventListener("click", () => {
    const menu = document.querySelector(".menu-links");
    if (menu.classList.contains("open")) {
      toggleMenu();
    }
  });
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
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  const offset = -currentSlide * 100;
  document.querySelector(
    ".gallery-container"
  ).style.transform = `translateX(${offset}%)`;
  adjustGalleryHeight();
}

function adjustGalleryHeight() {
  const galleryContainer = document.querySelector(".gallery-container");
  const activeSlide = document.querySelectorAll(".gallery-slide")[currentSlide];
  const activeImage = activeSlide.querySelector("img");
  const activeDescription = activeSlide.querySelector(".description");

  if (
    activeImage &&
    activeDescription &&
    window.matchMedia("(min-width: 600px)").matches
  ) {
    galleryContainer.style.height = activeImage.clientHeight + "px";
  } else {
    const totalHeight =
      activeImage.clientHeight + activeDescription.clientHeight + 20;
    galleryContainer.style.height = totalHeight + "px";
  }
}

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
