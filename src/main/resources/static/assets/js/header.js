window.addEventListener("scroll", function () {
  const scrollY = window.scrollY;
  const navbarSearch = document.querySelector(".heading_nav-search");
  const searchDown = document.querySelector(".main_content-search");
  const bannerTitle = document.querySelector(".heading_title");
  const homeHeading = document.querySelector(".home_heading");
  const header = document.querySelector(".header");
  const headingNav = document.querySelector(".heading_nav");

  const scrollThreshold = 50;
  const bannerHideThreshold = 330;

  if (scrollY > 0) {
    homeHeading.classList.add("no-background");
    if (headingNav) {
      headingNav.classList.add("scrolled");
    }
  } else {
    homeHeading.classList.remove("no-background");
    bannerTitle.classList.remove("hide");
    if (headingNav) {
      headingNav.classList.remove("scrolled");
    }
  }

  if (scrollY > scrollThreshold) {
    navbarSearch.classList.add("show");
    searchDown.classList.add("hide");
    homeHeading.classList.add("scrolled");
    if (header) {
      header.classList.add("show");
    }
  } else {
    navbarSearch.classList.remove("show");
    searchDown.classList.remove("hide");
    homeHeading.classList.remove("scrolled");
    if (header) {
      header.classList.remove("show");
    }
  }

  if (scrollY > bannerHideThreshold) {
    bannerTitle.classList.add("hiding");
    setTimeout(() => {
      bannerTitle.classList.add("hide");
      bannerTitle.classList.remove("hiding");
    }, 300);
  } else {
    bannerTitle.classList.remove("hiding");
    bannerTitle.classList.remove("hide");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});
