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
  adjustGalleryHeight(); // Adjust the height after changing the slide
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
