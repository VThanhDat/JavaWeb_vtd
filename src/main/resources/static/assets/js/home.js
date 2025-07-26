import { showToast } from "./toast.js";
import { renderPaginationControls, setupPageSizeSelector } from "./pagination.js";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

let bannerTimeout = null;
let searchValue = "";
let items = [];
let currentPage = 1;
let currentType = "food";
let lastSearchQuery = "";
let currentSortBy = "";
let currentSortOrder = "";
let currentPageSize = 10;

function resetScrollPosition() {
  window.scrollTo(0, 0);
}

function syncSearchInputs() {
  const navInput = document.querySelector(".heading_nav-search input");
  const mainInput = document.querySelector(".main_content-search input");

  if (!navInput || !mainInput) {
    return;
  }

  // Restore search value if exists
  if (searchValue) {
    navInput.value = searchValue;
    mainInput.value = searchValue;
  }

  // Sync from main input to nav input
  mainInput.addEventListener("input", function () {
    navInput.value = this.value;
    searchValue = this.value;
  });

  // Sync from nav input to main input
  navInput.addEventListener("input", function () {
    mainInput.value = this.value;
    searchValue = this.value;
  });

  // Focus events
  mainInput.addEventListener("focus", function () {
    navInput.value = this.value;
    searchValue = this.value;
  });

  navInput.addEventListener("focus", function () {
    mainInput.value = this.value;
    searchValue = this.value;
  });

  // Blur events
  mainInput.addEventListener("blur", function () {
    navInput.value = this.value;
    searchValue = this.value;
  });

  navInput.addEventListener("blur", function () {
    mainInput.value = this.value;
    searchValue = this.value;
  });

  // Enter key events
  mainInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(this.value);
    }
  });

  navInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch(this.value);
    }
  });
}

function performSearch(value) {
  const menuSection = document.querySelector(".main_content-menu");
  if (menuSection) {
    menuSection.scrollIntoView({ behavior: "smooth" });
  }
}

function handleScrollEffects() {
  const scrollY = window.scrollY;

  // Get all elements
  const navSearch = document.querySelector(".heading_nav-search");
  const mainSearch = document.querySelector(".main_content-search");
  const bannerTitle = document.querySelector(".heading_title");
  const homeHeading = document.querySelector(".home_heading");
  const header = document.querySelector(".header");
  const headingNav = document.querySelector(".heading_nav");

  if (
    !navSearch ||
    !mainSearch ||
    !bannerTitle ||
    !homeHeading ||
    !header ||
    !headingNav
  ) {
    return;
  }

  // Handle initial scroll state
  if (scrollY > 0) {
    homeHeading.classList.add("no-background");
    headingNav.classList.add("scrolled");
  } else {
    homeHeading.classList.remove("no-background");
    bannerTitle.classList.remove("hide");
    headingNav.classList.remove("scrolled");
  }

  // Handle scroll threshold at 50px
  if (scrollY > 50) {
    navSearch.classList.add("show");
    mainSearch.classList.add("hide");
    homeHeading.classList.add("scrolled");
    header.classList.add("show");
  } else {
    navSearch.classList.remove("show");
    mainSearch.classList.remove("hide");
    homeHeading.classList.remove("scrolled");
    header.classList.remove("show");
  }

  // Handle banner hiding at 330px
  if (scrollY > 330) {
    if (
      !bannerTitle.classList.contains("hide") &&
      !bannerTitle.classList.contains("hiding")
    ) {
      bannerTitle.classList.add("hiding");

      if (bannerTimeout) {
        clearTimeout(bannerTimeout);
      }

      bannerTimeout = setTimeout(function () {
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

function setupSmoothScrolling() {
  const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchors.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Event click get type
function handleEventType() {
  const foodTab = document.getElementById("food-tab");
  const drinkTab = document.getElementById("drink-tab");

  function switchTab(activeTab, inactiveTab, type) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    currentType = type;
    currentPage = 1; // Reset page when switching tabs
    callApiSearchWithPaging({ type: type, page: 1, size: currentPageSize }); // Load item luôn
  }

  foodTab.addEventListener("click", function (e) {
    e.preventDefault();
    switchTab(foodTab, drinkTab, "food");
  });

  drinkTab.addEventListener("click", function (e) {
    e.preventDefault();
    switchTab(drinkTab, foodTab, "drink");
  });
}

// Handle data item
function handleFoodTypeFilter() {
  const foodLink = document.querySelector(
    ".main_content-filter_foodType-type_food a"
  );
  const drinkLink = document.querySelector(
    ".main_content-filter_foodType-type_drink a"
  );

  if (!foodLink || !drinkLink) {
    console.error("Food or drink filter links not found");
    return;
  }

  foodLink.addEventListener("click", function (e) {
    e.preventDefault();
    currentType = "food";
    currentPage = 1;
    callApiSearchWithPaging({ type: "food", page: 1 });
  });

  drinkLink.addEventListener("click", function (e) {
    e.preventDefault();
    currentType = "drink";
    currentPage = 1;
    callApiSearchWithPaging({ type: "drink", page: 1 });
  });
}

// Updated API call function with pagination and sorting
function callApiSearchWithPaging({
  name = "",
  type = "food",
  page = 1,
  size = 10,
  sortBy = "",
  sortOrder = ""
}) {
  const params = { name, type, page, size };
  
  // Add sorting parameters if provided
  if (sortBy) {
    params.sortBy = sortBy;
  }
  if (sortOrder) {
    params.sortOrder = sortOrder;
  }

  $.ajax({
    url: "/api/item",
    method: "GET",
    data: params,
    xhrFields: { withCredentials: true },
    success: function (response) {
      const result = response?.data || {};
      items = result.items || [];
      currentPage = result.currentPage;
      currentType = type;
      lastSearchQuery = name;
      currentSortBy = sortBy;
      currentSortOrder = sortOrder;
      currentPageSize = size;

      renderItems();
      renderPaginationControls(result.totalPages, result.currentPage, result.totalItems, fetchPage);
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

// Function to fetch specific page
function fetchPage(page, pageSize = currentPageSize) {
  callApiSearchWithPaging({
    name: lastSearchQuery,
    type: currentType,
    page: page,
    size: pageSize,
    sortBy: currentSortBy,
    sortOrder: currentSortOrder
  });
}

function renderItems() {
  const menuContainer = document.querySelector(".main_content-menu_food");
  menuContainer.innerHTML = "";

  if (!items || items.length === 0) {
    menuContainer.innerHTML = `
      <div class="text-center text-gray-500 text-2xl bold py-10">
        Item not found
      </div>
    `;
    return;
  }

  items.forEach(function (item) {
    const itemHtml = `
      <div class="menu_food-item">
        <div class="menu_food-item_img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu_food-item_content">
          <p class="menu_food-item_content-title">${item.name}</p>
          <p class="menu_food-item_content-describe">${item.description}</p>
          <span class="menu_food-item_content-price">${item.price}đ</span>
          <div class="menu_food-item_add">+</div>
        </div>
      </div>
    `;
    menuContainer.insertAdjacentHTML("beforeend", itemHtml);
  });
}



// Search
function getCurrentType() {
  const foodTab = document.getElementById("food-tab");
  return foodTab.classList.contains("active") ? "food" : "drink";
}

function setupSearchInput() {
  const navInput = document.querySelector(".heading_nav-search input");
  const mainInput = document.querySelector(".main_content-search input");

  if (!navInput || !mainInput) return;

  function handleSearch(e) {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      const type = getCurrentType();

      navInput.value = query;
      mainInput.value = query;
      currentPage = 1; // Reset to first page when searching
      
      callApiSearchWithPaging({
        name: query,
        type: type,
        page: 1,
        size: currentPageSize,
        sortBy: currentSortBy,
        sortOrder: currentSortOrder
      });
    }
  }

  navInput.addEventListener("keydown", handleSearch);
  mainInput.addEventListener("keydown", handleSearch);
}

function setupPriceSortFilter() {
  const sortSelect = document.getElementById("filter-price");

  if (!sortSelect) return;

  sortSelect.addEventListener("change", function () {
    const sortOrder = this.value;
    const sortBy = sortOrder ? "price" : "";
    
    currentPage = 1; // Reset to first page when sorting
    
    callApiSearchWithPaging({
      name: lastSearchQuery,
      type: currentType,
      page: 1,
      size: currentPageSize,
      sortBy: sortBy,
      sortOrder: sortOrder
    });
  });
}

function onPageSizeChange(newPageSize) {
  currentPageSize = parseInt(newPageSize);
  currentPage = 1;
}

// Event listeners
window.addEventListener("scroll", handleScrollEffects);

document.addEventListener("DOMContentLoaded", function () {
  resetScrollPosition();
  syncSearchInputs();
  setupSmoothScrolling();
  handleFoodTypeFilter();
  callApiSearchWithPaging({ type: "food", page: 1, size: currentPageSize }); // Load initial data with pagination
  handleEventType();
  setupSearchInput();
  setupPriceSortFilter();
  setupPageSizeSelector(onPageSizeChange, fetchPage); // Setup page size selector
  setTimeout(function () {
    handleScrollEffects();
  }, 50);
});