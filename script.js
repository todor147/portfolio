function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

let currentSlide = 0;

function changeSlide(direction) {
  const slides = document.querySelectorAll(".gallery-slide");
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  const offset = -currentSlide * 100;
  document.querySelector(
    ".gallery-container"
  ).style.transform = `translateX(${offset}%)`;
}
