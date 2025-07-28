import { showToast } from "./toast.js";
import {
  renderPaginationControls,
  setupPageSizeSelector,
} from "./pagination.js";

// IMPORT CÁC FUNCTIONS TỪ CART MODULE
import {
  saveToBasketSession,
  getBasketFromSession,
  updateBasketItemQuantity,
  removeItemFromBasket,
  showBasketPopup,
  initCart
} from "./cart.js";

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

// Các functions không thay đổi...
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
  sortOrder = "",
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
      renderPaginationControls(
        result.totalPages,
        result.currentPage,
        result.totalItems,
        fetchPage
      );
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function fetchData() {
  return new Promise((resolve) => {
    callApiSearchWithPaging({
      type: "food",
      page: 1,
      size: currentPageSize,
    });

    setTimeout(() => {
      resolve();
    }, 0);
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
    sortOrder: currentSortOrder,
  });
}

function formatPrice(price) {
  return parseInt(price).toLocaleString('vi-VN');
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
      <div class="menu_food-item" data-item-id="${item.id}" data-item-name="${item.name}" data-item-price="${item.price}" data-item-image="${item.image}" data-item-description="${item.description}">
        <div class="menu_food-item_img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu_food-item_content">
          <p class="menu_food-item_content-title">${item.name}</p>
          <p class="menu_food-item_content-describe">${item.description}</p>
          <span class="menu_food-item_content-price">${formatPrice(item.price)}đ</span>
          <div class="menu_food-item_add">+</div>
          <div class="quantity hidden">
            <div class="quantity-delete">
              <img src="/img/icon/trash-icon.svg" />
            </div>
            <div class="quantity-selector">
              <button class="quantity-btn minus-btn">−</button>
              <input
                type="number"
                class="quantity-display w-[25px] text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value="1"
                min="1"
                max="3"
              />
              <button class="quantity-btn plus-btn">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
    menuContainer.insertAdjacentHTML("beforeend", itemHtml);
  });

  // Load existing basket state và sync với UI
  syncMenuWithBasket();

  // Xử lý sự kiện click vào toàn bộ menu item để hiện basket popup
  document.querySelectorAll('.menu_food-item').forEach(menuItem => {
    menuItem.addEventListener('click', function (e) {
      // Ngăn chặn sự kiện nếu click vào các nút điều khiển
      if (e.target.closest('.menu_food-item_add') || 
          e.target.closest('.quantity') || 
          e.target.closest('.quantity-btn') || 
          e.target.closest('.quantity-delete')) {
        return;
      }
      
      // Lấy thông tin item từ data attributes
      const itemData = {
        id: this.dataset.itemId,
        name: this.dataset.itemName,
        price: this.dataset.itemPrice,
        image: this.dataset.itemImage,
        description: this.dataset.itemDescription
      };
      
      // Kiểm tra xem item đã có trong basket chưa
      const basket = getBasketFromSession();
      const existingItem = basket.find(item => item.id === itemData.id);
      
      // Nếu có trong giỏ rồi thì lấy quantity đó, nếu chưa có thì mặc định = 1
      const initialQuantity = existingItem ? existingItem.quantity : 1;
      
      showBasketPopup(itemData, initialQuantity);
    });
  });
  
  // Handle event for Add (+) button - Add to basket immediately
  document.querySelectorAll('.menu_food-item_add').forEach(addBtn => {
    addBtn.addEventListener('click', function () {
      const menuItem = this.closest('.menu_food-item');
      const itemData = {
        id: menuItem.dataset.itemId,
        name: menuItem.dataset.itemName,
        price: menuItem.dataset.itemPrice,
        image: menuItem.dataset.itemImage,
        description: menuItem.dataset.itemDescription
      };

      const basketItem = {
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        image: itemData.image,
        description: itemData.description,
        quantity: 1,
        totalPrice: itemData.price * 1
      };

      saveToBasketSession(basketItem);

      // Thêm active class cho menu item
      menuItem.classList.add('active');

      this.style.display = 'none';
      
      const quantityBlock = this.parentElement.querySelector('.quantity');
      if (quantityBlock) {
        quantityBlock.classList.remove('hidden');
        quantityBlock.style.display = 'flex';
      }
      
      const quantitySelector = this.parentElement.querySelector('.quantity-selector');
      if (quantitySelector) {
        quantitySelector.classList.add('active');
      }

      if (typeof showToast === 'function') {
        showToast(`Item added to your cart!`, "success");
      }
    });
  });

  // Xử lý sự kiện cho nút Plus (+) - Cập nhật session
  document.querySelectorAll('.plus-btn').forEach(plusBtn => {
    plusBtn.addEventListener('click', function () {
      const quantityInput = this.parentElement.querySelector('.quantity-display');
      const menuItem = this.closest('.menu_food-item');
      const itemId = menuItem.dataset.itemId;
      
      let currentQuantity = parseInt(quantityInput.value);
      
      if (currentQuantity < 3) {
        currentQuantity++;
        quantityInput.value = currentQuantity;
        
        // Cập nhật session
        updateBasketItemQuantity(itemId, currentQuantity);
      } else {
        showToast("Maximum quantity is 3","error");
      }
    });
  });

  // Event handler for Minus (-) button - Update session
  document.querySelectorAll('.minus-btn').forEach(minusBtn => {
    minusBtn.addEventListener('click', function () {
      const quantityInput = this.parentElement.querySelector('.quantity-display');
      const menuItem = this.closest('.menu_food-item');
      const itemId = menuItem.dataset.itemId;
      
      let currentQuantity = parseInt(quantityInput.value);
      
      if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
        
        updateBasketItemQuantity(itemId, currentQuantity);
      }
    });
  });

  document.querySelectorAll('.quantity-display').forEach(quantityInput => {
    quantityInput.addEventListener('input', function() {
      const menuItem = this.closest('.menu_food-item');
      const itemId = menuItem.dataset.itemId;
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        value = 1;
      } else if (value > 3) {
        this.value = 3;
        value = 3;
        showToast("Maximum quantity is 3","error");
      }
      
      updateBasketItemQuantity(itemId, value);
    });

    quantityInput.addEventListener('blur', function() {
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        const menuItem = this.closest('.menu_food-item');
        const itemId = menuItem.dataset.itemId;
        updateBasketItemQuantity(itemId, 1);
      }
    });
  });

  // Event handler for Delete button (trash icon) - Delete from session
  document.querySelectorAll('.quantity-delete').forEach(deleteBtn => {
    deleteBtn.addEventListener('click', function () {
      const quantityBlock = this.parentElement;
      const addBtn = quantityBlock.parentElement.querySelector('.menu_food-item_add');
      const quantityInput = quantityBlock.querySelector('.quantity-display');
      const menuItem = this.closest('.menu_food-item');
      const itemId = menuItem.dataset.itemId;
      const itemName = menuItem.dataset.itemName;
      
      removeItemFromBasket(itemId);
      
      // Xóa active class từ menu item
      menuItem.classList.remove('active');
      
      quantityBlock.classList.add('hidden');
      quantityBlock.style.display = 'none';
      addBtn.style.display = 'flex';
      
      quantityInput.value = 1;
      
      if (typeof showToast === 'function') {
        showToast(`Item removed from your cart!`, "success");
      }
    });
  });
}

// Function to sync menu with basket state on load
function syncMenuWithBasket() {
  const basket = getBasketFromSession();
  
  // Reset tất cả menu items về trạng thái ban đầu
  document.querySelectorAll('.menu_food-item').forEach(menuItem => {
    menuItem.classList.remove('active');
    
    // Reset về trạng thái ban đầu
    const quantityBlock = menuItem.querySelector('.quantity');
    const addBtn = menuItem.querySelector('.menu_food-item_add');
    const quantityInput = menuItem.querySelector('.quantity-display');
    
    if (quantityBlock && addBtn && quantityInput) {
      quantityBlock.classList.add('hidden');
      quantityBlock.style.display = 'none';
      addBtn.style.display = 'flex';
      quantityInput.value = 1;
    }
  });
  
  // Áp dụng trạng thái từ basket
  basket.forEach(basketItem => {
    const menuItem = document.querySelector(`[data-item-id="${basketItem.id}"]`);
    if (menuItem) {
      const quantityInput = menuItem.querySelector('.quantity-display');
      const quantityBlock = menuItem.querySelector('.quantity');
      const quantitySelector = menuItem.querySelector('.quantity-selector');
      const addBtn = menuItem.querySelector('.menu_food-item_add');

      // Thêm active class cho menu item
      menuItem.classList.add('active');

      // Hiển thị quantity block và ẩn add button
      if (quantityBlock && addBtn && quantityInput) {
        quantityBlock.classList.remove('hidden');
        quantityBlock.style.display = 'flex';
        addBtn.style.display = 'none';
        quantityInput.value = basketItem.quantity;
      }
      
      if (quantitySelector) {
        quantitySelector.classList.add('active');
      }
    }
  });
}

// Search functions
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
        sortOrder: currentSortOrder,
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
      sortOrder: sortOrder,
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
  document.getElementById("loading").style.display = "block";
  document.getElementById("main").style.display = "none";
  resetScrollPosition();
  syncSearchInputs();
  setupSmoothScrolling();
  handleFoodTypeFilter();
  fetchData()
    .then(() => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("main").style.display = "block";
    })
    .catch(() => {
      document.getElementById("loading").style.display = "none";
      document.getElementById("main").style.display = "block";
    });
  handleEventType();
  setupSearchInput();
  setupPriceSortFilter();
  setupPageSizeSelector(onPageSizeChange, fetchPage);
  setTimeout(function () {
    handleScrollEffects();
  }, 50);
  
  initCart();
  
  // LISTEN TO BASKET UPDATED EVENT
  document.addEventListener('basketUpdated', function() {
    syncMenuWithBasket();
  });
});