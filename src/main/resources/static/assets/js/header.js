if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

let bannerTimeout = null;
let searchValue = "";

function syncSearchValues() {
  const navbarSearchInput = document.querySelector(".heading_nav-search input");
  const searchDownInput = document.querySelector(".main_content-search input");

  if (!navbarSearchInput || !searchDownInput) {
    return;
  }

  if (searchValue) {
    navbarSearchInput.value = searchValue;
    searchDownInput.value = searchValue;
  }

  searchDownInput.addEventListener("input", function (e) {
    const value = e.target.value;
    navbarSearchInput.value = value;
    searchValue = value;

    triggerSearchEvent(value);
  });

  navbarSearchInput.addEventListener("input", function (e) {
    const value = e.target.value;
    searchDownInput.value = value;
    searchValue = value;

    triggerSearchEvent(value);
  });

  searchDownInput.addEventListener("focus", function () {
    navbarSearchInput.value = this.value;
    searchValue = this.value;
  });

  navbarSearchInput.addEventListener("focus", function () {
    searchDownInput.value = this.value;
    searchValue = this.value;
  });

  searchDownInput.addEventListener("blur", function () {
    navbarSearchInput.value = this.value;
    searchValue = this.value;
  });

  navbarSearchInput.addEventListener("blur", function () {
    searchDownInput.value = this.value;
    searchValue = this.value;
  });

  searchDownInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(this.value);
    }
  });

  navbarSearchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(this.value);
    }
  });
}

function triggerSearchEvent(value) {
  clearTimeout(window.searchTimeout);
  window.searchTimeout = setTimeout(() => {}, 300);
}

function performSearch(value) {
  const resultsSection = document.querySelector(".main_content-menu");
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }
}

function filterMenuItems(searchTerm) {
  const menuItems = document.querySelectorAll(".menu_food-item");
  const searchTermLower = searchTerm.toLowerCase();

  menuItems.forEach((item) => {
    const title = item.querySelector(".menu_food-item_content-title");
    const description = item.querySelector(".menu_food-item_content-describe");

    if (title && description) {
      const titleText = title.textContent.toLowerCase();
      const descText = description.textContent.toLowerCase();

      if (
        titleText.includes(searchTermLower) ||
        descText.includes(searchTermLower)
      ) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    }
  });
}

function handleScroll() {
  const scrollY = window.scrollY;
  const navbarSearch = document.querySelector(".heading_nav-search");
  const searchDown = document.querySelector(".main_content-search");
  const bannerTitle = document.querySelector(".heading_title");
  const homeHeading = document.querySelector(".home_heading");
  const header = document.querySelector(".header");
  const headingNav = document.querySelector(".heading_nav");

  if (
    !navbarSearch ||
    !searchDown ||
    !bannerTitle ||
    !homeHeading ||
    !header ||
    !headingNav
  ) {
    return;
  }

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
    if (
      !bannerTitle.classList.contains("hide") &&
      !bannerTitle.classList.contains("hiding")
    ) {
      bannerTitle.classList.add("hiding");

      if (bannerTimeout) {
        clearTimeout(bannerTimeout);
      }

      bannerTimeout = setTimeout(() => {
        bannerTitle.classList.add("hide");
        bannerTitle.classList.remove("hiding");
        bannerTimeout = null;
      }, 300);
    }
  } else {
    if (bannerTimeout) {
      clearTimeout(bannerTimeout);
      bannerTimeout = null;
    }

    bannerTitle.classList.remove("hiding");
    bannerTitle.classList.remove("hide");
  }
}

window.addEventListener("scroll", handleScroll);

document.addEventListener("DOMContentLoaded", function () {
  window.scrollTo(0, 0);
  syncSearchValues();

  setTimeout(() => {
    handleScroll();
  }, 50);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
});

window.addEventListener("load", function () {
  window.scrollTo(0, 0);
  syncSearchValues();

  setTimeout(() => {
    handleScroll();
  }, 50);
});

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    window.scrollTo(0, 0);
    syncSearchValues();
    setTimeout(() => {
      handleScroll();
    }, 50);
  }
});
