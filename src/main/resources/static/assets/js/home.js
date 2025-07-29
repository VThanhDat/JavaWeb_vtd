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
  initCart,
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
    callApiSearchWithPaging({
      type: type,
      page: 1,
      size: currentPageSize,
      status: 1,
    }); // Load item luôn
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
    callApiSearchWithPaging({ type: "food", page: 1, status: 1 });
  });

  drinkLink.addEventListener("click", function (e) {
    e.preventDefault();
    currentType = "drink";
    currentPage = 1;
    callApiSearchWithPaging({ type: "drink", page: 1, status: 1 });
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
  status = 1,
}) {
  const params = { name, type, page, size, status };

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
      status: 1,
    });

    setTimeout(() => {
      resolve();
    }, 2000);
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
    status: 1,
  });
}

function formatPrice(price) {
  return parseInt(price).toLocaleString("vi-VN");
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
      <div class="menu_food-item" data-item-id="${item.id}" data-item-name="${item.name
      }" data-item-price="${item.price}" data-item-image="${item.image
      }" data-item-description="${item.description}">
        <div class="menu_food-item_img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu_food-item_content">
          <p class="menu_food-item_content-title">${item.name}</p>
          <p class="menu_food-item_content-describe">${item.description}</p>
          <span class="menu_food-item_content-price">${formatPrice(
        item.price
      )}đ</span>
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
  document.querySelectorAll(".menu_food-item").forEach((menuItem) => {
    menuItem.addEventListener("click", function (e) {
      // Ngăn chặn sự kiện nếu click vào các nút điều khiển
      if (
        e.target.closest(".menu_food-item_add") ||
        e.target.closest(".quantity") ||
        e.target.closest(".quantity-btn") ||
        e.target.closest(".quantity-delete")
      ) {
        return;
      }

      // Lấy thông tin item từ data attributes
      const itemData = {
        id: this.dataset.itemId,
        name: this.dataset.itemName,
        price: this.dataset.itemPrice,
        image: this.dataset.itemImage,
        description: this.dataset.itemDescription,
      };

      // Kiểm tra xem item đã có trong basket chưa
      const basket = getBasketFromSession();
      const existingItem = basket.find((item) => item.id === itemData.id);

      // Nếu có trong giỏ rồi thì lấy quantity đó, nếu chưa có thì mặc định = 1
      const initialQuantity = existingItem ? existingItem.quantity : 1;

      showBasketPopup(itemData, initialQuantity);
    });
  });

  // Handle event for Add (+) button - Add to basket immediately
  document.querySelectorAll(".menu_food-item_add").forEach((addBtn) => {
    addBtn.addEventListener("click", function () {
      const menuItem = this.closest(".menu_food-item");
      const itemData = {
        id: menuItem.dataset.itemId,
        name: menuItem.dataset.itemName,
        price: menuItem.dataset.itemPrice,
        image: menuItem.dataset.itemImage,
        description: menuItem.dataset.itemDescription,
      };

      const basketItem = {
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        image: itemData.image,
        description: itemData.description,
        quantity: 1,
        totalPrice: itemData.price * 1,
      };

      saveToBasketSession(basketItem);

      // Thêm active class cho menu item
      menuItem.classList.add("active");

      this.style.display = "none";

      const quantityBlock = this.parentElement.querySelector(".quantity");
      if (quantityBlock) {
        quantityBlock.classList.remove("hidden");
        quantityBlock.style.display = "flex";
      }

      const quantitySelector =
        this.parentElement.querySelector(".quantity-selector");
      if (quantitySelector) {
        quantitySelector.classList.add("active");
      }

      if (typeof showToast === "function") {
        showToast(`Item added to your cart!`, "success");
      }
    });
  });

  // Xử lý sự kiện cho nút Plus (+) - Cập nhật session
  document.querySelectorAll(".plus-btn").forEach((plusBtn) => {
    plusBtn.addEventListener("click", function () {
      const quantityInput =
        this.parentElement.querySelector(".quantity-display");
      const menuItem = this.closest(".menu_food-item");
      const itemId = menuItem.dataset.itemId;

      let currentQuantity = parseInt(quantityInput.value);

      if (currentQuantity < 3) {
        currentQuantity++;
        quantityInput.value = currentQuantity;

        // Cập nhật session
        updateBasketItemQuantity(itemId, currentQuantity);
      } else {
        showToast("Maximum quantity is 3", "error");
      }
    });
  });

  // Event handler for Minus (-) button - Update session
  document.querySelectorAll(".minus-btn").forEach((minusBtn) => {
    minusBtn.addEventListener("click", function () {
      const quantityInput =
        this.parentElement.querySelector(".quantity-display");
      const menuItem = this.closest(".menu_food-item");
      const itemId = menuItem.dataset.itemId;

      let currentQuantity = parseInt(quantityInput.value);

      if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;

        updateBasketItemQuantity(itemId, currentQuantity);
      }
    });
  });

  document.querySelectorAll(".quantity-display").forEach((quantityInput) => {
    quantityInput.addEventListener("input", function () {
      const menuItem = this.closest(".menu_food-item");
      const itemId = menuItem.dataset.itemId;
      let value = parseInt(this.value);

      if (isNaN(value) || value < 1) {
        this.value = 1;
        value = 1;
      } else if (value > 3) {
        this.value = 3;
        value = 3;
        showToast("Maximum quantity is 3", "error");
      }

      updateBasketItemQuantity(itemId, value);
    });

    quantityInput.addEventListener("blur", function () {
      let value = parseInt(this.value);

      if (isNaN(value) || value < 1) {
        this.value = 1;
        const menuItem = this.closest(".menu_food-item");
        const itemId = menuItem.dataset.itemId;
        updateBasketItemQuantity(itemId, 1);
      }
    });
  });

  // Event handler for Delete button (trash icon) - Delete from session
  document.querySelectorAll(".quantity-delete").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", function () {
      const quantityBlock = this.parentElement;
      const addBtn = quantityBlock.parentElement.querySelector(
        ".menu_food-item_add"
      );
      const quantityInput = quantityBlock.querySelector(".quantity-display");
      const menuItem = this.closest(".menu_food-item");
      const itemId = menuItem.dataset.itemId;
      const itemName = menuItem.dataset.itemName;

      removeItemFromBasket(itemId);

      // Xóa active class từ menu item
      menuItem.classList.remove("active");

      quantityBlock.classList.add("hidden");
      quantityBlock.style.display = "none";
      addBtn.style.display = "flex";

      quantityInput.value = 1;

      if (typeof showToast === "function") {
        showToast(`Item removed from your cart!`, "success");
      }
    });
  });
}

// Function to sync menu with basket state on load
function syncMenuWithBasket() {
  const basket = getBasketFromSession();

  // Reset tất cả menu items về trạng thái ban đầu
  document.querySelectorAll(".menu_food-item").forEach((menuItem) => {
    menuItem.classList.remove("active");

    // Reset về trạng thái ban đầu
    const quantityBlock = menuItem.querySelector(".quantity");
    const addBtn = menuItem.querySelector(".menu_food-item_add");
    const quantityInput = menuItem.querySelector(".quantity-display");

    if (quantityBlock && addBtn && quantityInput) {
      quantityBlock.classList.add("hidden");
      quantityBlock.style.display = "none";
      addBtn.style.display = "flex";
      quantityInput.value = 1;
    }
  });

  // Áp dụng trạng thái từ basket
  basket.forEach((basketItem) => {
    const menuItem = document.querySelector(
      `[data-item-id="${basketItem.id}"]`
    );
    if (menuItem) {
      const quantityInput = menuItem.querySelector(".quantity-display");
      const quantityBlock = menuItem.querySelector(".quantity");
      const quantitySelector = menuItem.querySelector(".quantity-selector");
      const addBtn = menuItem.querySelector(".menu_food-item_add");

      // Thêm active class cho menu item
      menuItem.classList.add("active");

      // Hiển thị quantity block và ẩn add button
      if (quantityBlock && addBtn && quantityInput) {
        quantityBlock.classList.remove("hidden");
        quantityBlock.style.display = "flex";
        addBtn.style.display = "none";
        quantityInput.value = basketItem.quantity;
      }

      if (quantitySelector) {
        quantitySelector.classList.add("active");
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
        status: 1,
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
      status: 1,
    });
  });
}

function onPageSizeChange(newPageSize) {
  currentPageSize = parseInt(newPageSize);
  currentPage = 1;
}

// Modal order
let expanded = false;
function setupScrollModalOrder(orderStatus = 'new') {
  const statusContainer = document.querySelector(".status-container");

  // Cập nhật status container dựa trên trạng thái đơn hàng
  updateStatusDisplay(orderStatus, statusContainer);

  // Chờ DOM được cập nhật sau khi updateStatusDisplay chạy
  requestAnimationFrame(() => {
    const bar = document.querySelector(".bar");
    const barBg = document.querySelector(".bar-background");
    const statuses = document.querySelectorAll(".status");

    // Kiểm tra xem các element đã tồn tại chưa
    if (!bar || !barBg || statuses.length === 0) {
      console.warn("Status elements not found in DOM");
      return;
    }

    // Tìm chỉ số status hiện tại sau khi đã cập nhật
    const currentIndex = Array.from(statuses).findIndex((status) =>
      status.classList.contains("current")
    );

    // Số bước chuyển tiếp
    const steps = statuses.length - 1;

    // Lấy chiều rộng thực tế của bar-background
    const availableWidth = barBg.offsetWidth;

    // Tính chiều dài .bar tương ứng
    let width = 0;
    if (orderStatus.toLowerCase() === 'completed') {
      // Khi completed, progress bar phải đầy 100%
      width = availableWidth;
    } else if (currentIndex >= 0 && steps > 0) {
      width = (currentIndex / steps) * availableWidth;
    }

    bar.style.width = `${width}px`;
  });

  // Phần còn lại của hàm giữ nguyên
  const toggleBtn = document.getElementById("toggle-expand-btn");
  const toggleIcon = document.getElementById("toggle-icon");
  const listItemOrder = document.querySelector(".list-item-order");
  const listContainer = document.getElementById("listItemOrder");
  const modalContent = document.querySelector(".modal-order-content");
  const contentOrder = document.querySelector(".content-order");
  const adjustOrder = document.querySelector(".adjust-order");

  // Remove existing event listener to avoid duplicates
  const newToggleBtn = toggleBtn.cloneNode(true);
  toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);


  newToggleBtn.addEventListener("click", () => {
    expanded = !expanded;

    if (expanded) {
      listItemOrder.classList.remove("collapsed");
      listItemOrder.classList.add("expanded");
      toggleIcon.src = "/img/icon/retract-icon.svg";
      modalContent.style.height = "840px";
      contentOrder.style.height = "716px";
      adjustOrder.style.top = "65%";
    } else {
      listItemOrder.classList.remove("expanded");
      listItemOrder.classList.add("collapsed");
      toggleIcon.src = "/img/icon/expand-icon.svg";
      modalContent.style.height = "658px";
      contentOrder.style.height = "522px";
      adjustOrder.style.top = "55%";
    }
    listContainer.scrollTop = 0;
  });
}

// Hàm mapping và cập nhật trạng thái
function updateStatusDisplay(orderStatus, statusContainer) {
  if (!statusContainer) return;

  // Mapping trạng thái
  const statusMapping = {
    'new': {
      statuses: [
        { key: 'placed', name: 'Order placed successfully', state: 'completed' },
        { key: 'preparing', name: 'Preparing your order', state: 'current' },
        { key: 'shipping', name: 'Shipping', state: 'future' },
        { key: 'completed', name: 'Completed', state: 'future' }
      ]
    },
    'shipping': {
      statuses: [
        { key: 'placed', name: 'Order placed successfully', state: 'completed' },
        { key: 'preparing', name: 'Preparing your order', state: 'completed' },
        { key: 'shipping', name: 'Shipping', state: 'current' },
        { key: 'completed', name: 'Completed', state: 'future' }
      ]
    },
    'completed': {
      statuses: [
        { key: 'placed', name: 'Order placed successfully', state: 'completed' },
        { key: 'preparing', name: 'Preparing your order', state: 'completed' },
        { key: 'shipping', name: 'Shipping', state: 'completed' },
        { key: 'completed', name: 'Completed', state: 'completed' }
      ]
    },
    'cancelled': {
      statuses: [
        { key: 'placed', name: 'Order placed successfully', state: 'completed' },
        { key: 'cancelled', name: 'Order cancelled', state: 'current' }
      ]
    }
  };

  const currentMapping = statusMapping[orderStatus.toLowerCase()] || statusMapping['new'];

  // Tạo HTML cho progress bar
  const progressHTML = generateProgressHTML(currentMapping.statuses);

  // Cập nhật nội dung status container
  statusContainer.innerHTML = progressHTML;
}

// Hàm tạo HTML cho progress bar
function generateProgressHTML(statuses) {
  const statusItems = statuses.map(status => {
    let iconSrc;
    let statusStyle = '';

    switch (status.state) {
      case 'completed':
        iconSrc = '/img/icon/complete-order-icon.svg';
        statusStyle = 'color: #28a745;';
        break;
      case 'current':
        iconSrc = status.key === 'cancelled'
          ? '/img/icon/cancel-order-icon.svg'
          : '/img/icon/indicator-current-icon.svg';
        statusStyle = 'color: #ff0000;';
        break;
      case 'future':
        iconSrc = '/img/icon/indicator-future-icon.svg';
        statusStyle = 'color: #666;';
        break;
      default:
        iconSrc = '/img/icon/indicator-future-icon.svg';
        statusStyle = 'color: #666;';
    }
    return `
      <div class="status ${status.state}" style="${statusStyle}">
        <div class="img">
          <img src="${iconSrc}" alt="">
        </div>
        <div class="name">${status.name}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="progress">
      ${statusItems}
      <div class="bar-background"></div>
      <div class="bar"></div>
    </div>
  `;
}

function callApiOrderByOrderCode(orderCode) {
  $.ajax({
    url: `/api/order/ordercode/${orderCode}`,
    method: "GET",
    xhrFields: { withCredentials: true },
    success: function (response) {
      const order = response.data;
      renderOrderCard(order);
      setupScrollModalOrder(order.status || 'new');
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function renderOrderCard(order) {
  const listItemOrder = document.getElementById("listItemOrder");
  if (!listItemOrder) return;

  // Get additional data from session storage
  const subTotal = sessionStorage.getItem("subTotal") || order.subTotal || "0";
  const totalPrice = sessionStorage.getItem("totalPrice") || order.totalPrice || "0";
  const shippingFee = sessionStorage.getItem("shippingFee") || order.shippingFee || "35.000";

  // Update order code if available
  const orderCodeElement = document.querySelector('span[class*="order-0 flex-grow-0"]');
  if (orderCodeElement && order.orderCode) {
    orderCodeElement.textContent = `#${order.orderCode}`;
  }

  // Clear old content
  listItemOrder.innerHTML = "";

  // Render order items
  order.items.forEach((item) => {
    const itemHTML = `
      <div class="mb-10 box-border flex flex-row items-start p-4 gap-4 w-[772px] h-[162px] bg-[#F9F9F9] border border-transparent rounded-[16px] self-stretch flex-none">
        <img class="flex flex-col items-start p-0 w-[130px] h-[130px] rounded-[8px]"
          src="/${item.img}" alt="">
        <div class="flex flex-row items-start p-0 gap-4 w-[594px] h-[130px] self-stretch flex-grow">
          <div class="flex flex-col items-start p-0 w-[466px] h-[124px] flex-grow flex-1">
            <div class="item-order-name w-[527px] h-[30px] text-[20px] font-semibold text-[#292929] font-[inter]">
              ${item.name}
            </div>
            <div class="item-order-description w-[527px] h-[24px] text-[16px] font-normal text-[#656565] font-[inter]">
              ${item.description}
            </div>
          </div>
          <div class="flex flex-col items-end p-0 w-[112px] h-[130px]">
            <div class="item-basket-price w-[74px] h-[30px] text-[20px] font-bold text-[#292929] font-[inter]">
              ${formatPrice(item.price)} đ
            </div>
            <div class="flex flex-row justify-end items-end p-0 gap-2 w-[112px] h-[100px]">
              <div class="w-[70px] text-[16px] text-black">Quantity:</div>
              <div class="w-[34px] h-[34px] bg-[#FF6B00] rounded-[44px] relative">
                <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">${item.quantity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    listItemOrder.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Update pricing information
  updatePricingDisplay(subTotal, shippingFee, totalPrice);
}

function updatePricingDisplay(subTotal, shippingFee, totalPrice) {
  // Update subtotal
  const subtotalElement = document.querySelector('.flex-row.items-center.p-0.gap-1 h6');
  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(subTotal);
  }

  // Update shipping fee
  const shippingElements = document.querySelectorAll('.flex-row.items-center.p-0.gap-1 h6');
  if (shippingElements.length >= 2) {
    shippingElements[1].textContent = formatPrice(shippingFee);
  }

  // Update total bill
  const totalBillElement = document.querySelector('h1[class*="text-[#FF6B00]"]');
  if (totalBillElement) {
    totalBillElement.textContent = `${formatPrice(totalPrice)} đ`;
  }
}

function showModalOrder(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    modal.style.display = "block";

    const orderCode = sessionStorage.getItem("orderCode");
    if (orderCode) {
      callApiOrderByOrderCode(orderCode);
    }
  }
}

function hideModalOrder(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

function setupOrderModal() {
  const openBtn = document.querySelector(".heading_nav-order");
  const closeBtn = document.getElementById("close-order-btn");

  if (openBtn) {
    openBtn.addEventListener("click", () => showModalOrder("modal-order"));
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      hideModalOrder("modal-order");
    });
  }
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
  document.addEventListener("basketUpdated", function () {
    syncMenuWithBasket();
  });

  setupOrderModal();
});
