import { showToast, showSuccessLogin } from "./toast.js";
import { renderPaginationControls, setupPageSizeSelector } from "./pagination.js";

let orders = [];
let currentOrderId = null;
let currentStatusCheckboxes = ["New", "Completed", "Cancelled", "Shipping"];
let currentPage = 1;
let pageSize = 10;
let lastSearchQuery = "";

const statusStyles = {
  new: {
    width: "w-[40px]",
    text: "text-[#4079ED]",
    border: "border-[#4079ED]",
    bg: "bg-[#EDF3FF]",
    icon: "/img/icon/new-status-icon.svg",
    label: "New",
  },
  cancelled: {
    width: "w-[84px]",
    text: "text-[#E31844]",
    border: "border-[#E31844]",
    bg: "bg-[#FDE8EC]",
    icon: "/img/icon/cancelled-status-icon.svg",
    label: "Cancelled",
  },
  completed: {
    width: "w-[84px]",
    text: "text-[#17AE30]",
    border: "border-[#17AE30]",
    bg: "bg-[#DCFCE7]",
    icon: "/img/icon/completed-status-icon.svg",
    label: "Completed",
  },
  shipping: {
    width: "w-[84px]",
    text: "text-[#F04438]",
    border: "border-[#F04438]",
    bg: "bg-[#FFE4E1]",
    icon: "/img/icon/shipping-status-icon.svg",
    label: "Shipping",
  },
};

const allowedNextStatuses = {
  new: ["shipping", "cancelled"],
  shipping: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const statusClasses = [
  "border-[#4079ED]", "text-[#4079ED]", "bg-[#EDF3FF]",
  "border-[#F04438]", "text-[#F04438]", "bg-[#FFE4E1]",
  "border-[#17AE30]", "text-[#17AE30]", "bg-[#E6F4EA]",
  "border-[#E31844]", "text-[#E31844]", "bg-[#FDE8EC]"
];

function callApiGetOrders({
  name = lastSearchQuery,
  status = currentStatusCheckboxes.join(","),
  date = getCurrentDateFilter(),
  page = 1,
  size = 10,
}) {
  if (currentStatusCheckboxes.length === 0) {
    orders = [];
    renderOrderCards();
    return;
  }

  // Build data object, only include name if it's not empty
  const requestData = { status, date, page, size };
  if (name && name.trim() !== "") {
    requestData.name = name.trim();
  }

  $.ajax({
    url: "/api/order",
    method: "GET",
    data: requestData,
    xhrFields: { withCredentials: true },
    success: function (response) {
      const result = response?.data || {};
      orders = result.orders || result.items || response.data || [];
      currentPage = result.currentPage || page;
      pageSize = size;
      lastSearchQuery = name; // Update last search query

      renderOrderCards();

      // Render pagination if result has pagination info
      if (result.totalPages && result.currentPage !== undefined) {
        renderPaginationControls(result.totalPages, result.currentPage, result.totalItems, fetchOrdersPage);
      }
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data || "Lỗi không xác định";
      showToast(msg, "error");
    },
  });
}

// Function to handle page changes
function fetchOrdersPage(page) {
  callApiGetOrders({
    name: lastSearchQuery,
    status: currentStatusCheckboxes.join(","),
    date: getCurrentDateFilter(),
    page: page,
    size: pageSize,
  });
}

function callApiGetOrderById(id, displayId = null) {
  $.ajax({
    url: `/api/order/${id}`,
    method: "GET",
    xhrFields: { withCredentials: true },
    success: function (response) {
      const order = response.data;
      if (displayId) order.displayId = displayId;
      renderOrderDetail(order);
    },
    error: function (xhr) {
      showToast(xhr.responseJSON?.data, "error");
    },
  });
}

function callUpdateStatus(orderId, status) {
  $.ajax({
    url: `/api/order/${orderId}/status`,
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({ status: status }),
    success: function (response) {
      showToast(response.data, "success");

      const orderIndex = orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex].status = status;
      }

      callApiGetOrderById(orderId);
      renderOrderCards();
      loadDashboardSummary();
    },
    error: function (xhr) {
      showToast(xhr.responseJSON?.data, "error");
    },
  });
}

const orderListContainer = document.getElementById("orderListContainer");

function renderOrderCards() {
  if (!orderListContainer) return;
  orderListContainer.innerHTML = "";

  if (orders.length === 0) {
    orderListContainer.innerHTML = `
      <div class="text-gray-500 text-sm px-4 py-6 text-center">
        No found orders.
      </div>`;
    return;
  }

  orders.forEach((order, index) => {
    // Calculate display ID based on current page and page size
    const displayId = ((currentPage - 1) * pageSize + index + 1).toString().padStart(3, "0");
    const representativeItem = order.items && order.items.length > 0 ? order.items[0] : null;
    const orderCard = document.createElement("div");
    orderCard.className = "flex flex-col items-start p-6 gap-2 w-[375px] h-[305px] bg-white rounded-[16px] shadow-sm border border-[#f3f3f3] text-[14px] cursor-pointer hover:shadow-md transition";
    orderCard.setAttribute("data-order-id", order.id);
    orderCard.setAttribute("data-display-id", displayId);

    const statusStyles = getStatusStyles(order.status.toLowerCase());

    orderCard.innerHTML = `
    <div class="flex flex-row justify-between items-start gap-1 w-full">
      <span class="font-medium text-[#292929]">Order# ${displayId}</span>
      <span>${formatDateDisplay(order.createAt)}</span>
    </div>
    
    <div class="flex flex-row items-start py-4 gap-4 w-full h-[130px]">
      <img src="/${representativeItem.img}" alt="Product Image" class="w-16 h-16 rounded-md object-cover" />
      <div class="flex-1 grid gap-1">
        <div class="flex flex-row items-start gap-1">
          <h3 class="font-inter font-semibold text-[16px] leading-[24px] text-black flex-grow">${representativeItem.name}</h3>
        </div>
        <p class="text-xs text-[#7c7c7c] line-clamp-1">${representativeItem.description}</p>
        <div class="flex justify-between items-end py-1">
          <div class="flex items-center">
            <span class="font-inter font-bold text-[16px] leading-[24px] text-black">${formatCurrency(representativeItem.price)}</span>
          </div>
          <span class="text-xs text-[#7c7c7c] font-normal">Quantity: ${representativeItem.quantity}</span>
        </div>
      </div>
    </div>
    
    <hr class="w-full border-t border-[#EFEFEF]" />
    
    <span class="font-inter font-normal text-[14px] text-[#797B7E]">${order.items.length} Items</span>
    
    <div class="flex flex-row justify-end items-center gap-4 w-full h-[48px]">
      <div class="flex flex-row items-center gap-1 flex-grow">
        <span class="font-inter font-bold text-[18px] leading-[27px] text-black">${formatCurrency(order.totalPrice)}</span>
      </div>
      <button class="flex flex-row justify-center items-center px-4 py-2 gap-2 w-[160px] h-[48px] rounded-[4.8px] ${statusStyles.bg}">
        <div class="w-[22px] h-[22px] flex-none">
          <img src="${statusStyles.icon}" />
        </div>
        <div class="flex flex-col justify-center items-start ${statusStyles.width} bg-[rgba(255,255,255,0.01)] flex-none">
          <p class="font-inter font-bold text-[18px] leading-[27px] flex-none ${statusStyles.text}">
            ${capitalizeFirstLetter(order.status)}
          </p>
        </div>
      </button>
    </div>
    `;

    orderCard.addEventListener("click", () => {
      callApiGetOrderById(order.id, displayId);
    });

    orderListContainer.appendChild(orderCard);
  });
}

function renderOrderDetail(order) {
  currentOrderId = order.id;
  document.getElementById("orderModal").classList.remove("hidden");

  // Update order info
  document.querySelector(".detailOrder-popup-code span:nth-child(2)").innerText = " " + order.displayId;
  document.querySelector(".detailOrder-popup-date span").innerText = formatDateDisplay(order.createAt);
  document.querySelector(".detailOrder-popup-total-items").innerText = `${order.items.length} Items`;

  // Update customer info
  document.querySelector(".fullname span").innerText = order.customer.fullName;
  document.querySelector(".tel span").innerText = order.customer.phone;
  document.querySelector(".detail-address span").innerText = `${order.customer.address}, ${order.customer.ward}, ${order.customer.city}`;
  document.querySelector(".detail-message span").innerText = order.customer.message || "No message.";

  // Render products
  const productListContainer = document.querySelector(".detailOrder-popup-product-list");
  productListContainer.innerHTML = "";
  order.items.forEach((product) => {
    const productHTML = `
      <div class="detailOrder-popup-product-card">
        <div class="detailOrder-popup-product-card-img">
          <img src="/${product.img}" />
        </div>
        <div class="detailOrder-popup-product-card-info">
          <div class="detailOrder-popup-card-name-n-descript">
            <h3>${product.name}</h3>
            <span>${product.description}</span>
          </div>
          <div class="detailOrder-popup-product-price-n-quantity">
            <div class="detailOrder-popup-product-price">
              <span>${formatCurrency(product.price)}</span>
            </div>
            <div class="detailOrder-popup-product-quantity">
              <span>Quantity: </span>
              <span>${product.quantity}</span>
            </div>
          </div>
        </div>
      </div>`;
    productListContainer.insertAdjacentHTML("beforeend", productHTML);
  });

  // Update totals
  document.querySelector(".detailOrder-popup-total span:nth-child(2)").innerText = formatCurrency(order.subTotal);
  document.querySelector(".detailOrder-popup-shippingFee span:nth-child(2)").innerText = formatCurrency(order.shippingFee);
  document.querySelector(".detailOrder-popup-footer-total-bill span:nth-child(2)").innerText = formatCurrency(order.totalPrice);

  setOrderStatusUI(order.status.toLowerCase());
}

// Sumary total today's
function loadDashboardSummary() {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  $.ajax({
    url: "/api/order",
    method: "GET",
    data: {
      status: "New,Completed,Cancelled,Shipping",
      date: today,
      page: 1,
      size: 1000
    },
    xhrFields: { withCredentials: true },
    success: function (response) {
      const result = response?.data || {};
      const todayOrders = result.orders || result.items || response.data || [];
      renderDashboardSummary(todayOrders);
    },
    error: function (xhr) {
      console.error("Failed to fetch dashboard summary data");
    },
  });
}

function renderDashboardSummary(ordersData = null) {
  const dataToUse = ordersData || orders;

  const today = new Date().toDateString();
  const todayOrders = dataToUse.filter(order => new Date(order.createAt).toDateString() === today);
  const todaySales = todayOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const shipping = todayOrders.filter(o => o.status.toLowerCase() === "shipping").length;
  const completed = todayOrders.filter(o => o.status.toLowerCase() === "completed").length;
  const cancelled = todayOrders.filter(o => o.status.toLowerCase() === "cancelled").length;

  document.getElementById("today-sales-amount").innerText = todaySales.toLocaleString() + " đ";
  document.getElementById("total-orders").innerText = todayOrders.length;
  document.getElementById("shipping-orders").innerText = shipping;
  document.getElementById("complete-orders").innerText = completed;
  document.getElementById("cancel-orders").innerText = cancelled;
}

// Summary chart

// Get Last 7 Days Labels
function getLast7DaysLabels() {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("vi-VN"));
  }
  return labels;
}

// Get Last 12 Weeks Labels
function getLast12WeeksLabels() {
  const labels = [];
  const today = new Date();
  let endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 7); // Sunday

  for (let i = 11; i >= 0; i--) {
    const start = new Date(endOfWeek);
    start.setDate(endOfWeek.getDate() - 6 - (i * 7));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    labels.push(`W${12 - i} (${start.toLocaleDateString("vi-VN")}~${end.toLocaleDateString("vi-VN")})`);
  }
  return labels;
}

// Get Last 12 Months Labels
function getLast12MonthsLabels() {
  const labels = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(`${d.getMonth() + 1}/${d.getFullYear()}`); // ex: 3/2023
  }
  return labels;
}

function groupOrdersByLabel(orders, labels, mode = "day") {
  const map = {};

  labels.forEach(label => map[label] = 0);

  orders.forEach(order => {
    const date = new Date(order.createAt);
    let label;

    if (mode === "day") {
      label = date.toLocaleDateString("vi-VN");
    }
    else if (mode === "week") {
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // về thứ 2
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      label = labels.find(l => l.includes(monday.toLocaleDateString("vi-VN")));
    }
    else if (mode === "month") {
      label = `${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    if (label && map[label] !== undefined) {
      map[label] += order.totalPrice || 0;
    }
  });

  return labels.map(label => map[label]);
}

function loadChart(mode = "day") {
  $.ajax({
    url: "/api/order",
    method: "GET",
    data: {
      status: "New,Completed,Cancelled,Shipping",
      page: 1,
      size: 1000
    },
    xhrFields: { withCredentials: true },
    success: function (response) {
      const orders = response?.data?.items || [];
      let labels = [];
      let modeKey = "";

      if (mode === "day") {
        labels = getLast7DaysLabels();
        modeKey = "day";
      } else if (mode === "week") {
        labels = getLast12WeeksLabels();
        modeKey = "week";
      } else if (mode === "month") {
        labels = getLast12MonthsLabels();
        modeKey = "month";
      }

      const dataPoints = groupOrdersByLabel(orders, labels, modeKey);
      renderSalesChart("salesChart", labels, dataPoints);
    },
    error: function () {
      console.error("Failed to load chart data.");
    }
  });
}

function getValueSummaryChart() {
  const tabElements = document.querySelectorAll(".tab-mode");

  tabElements.forEach(tab => {
    tab.addEventListener("click", () => {
      // Bỏ active ở tất cả tab
      tabElements.forEach(t => t.classList.remove("active-tab"));
      // Thêm active vào tab hiện tại
      tab.classList.add("active-tab");

      const mode = tab.getAttribute("data-mode");
      console.log(mode);

      loadChart(mode);
    });
  });

  // Mặc định là "day"
  loadChart("day");
}

let salesChartInstance = null;

function renderSalesChart(canvasId, labels = [], dataPoints = []) {
  const chartCanvas = document.getElementById(canvasId);
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext("2d");

  if (salesChartInstance) {
    salesChartInstance.destroy();
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, "rgba(255, 128, 0, 0.5)");
  gradient.addColorStop(1, "rgba(255, 128, 0, 0)");

  salesChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Sales",
        data: dataPoints,
        backgroundColor: gradient,
        borderColor: "rgb(255, 128, 0)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(255, 128, 0)",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.y + "M đ";
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#888", font: { size: 12 } },
          title: {
            display: true,
            text: "",
            color: "#555",
            font: { size: 14, weight: "bold" },
          },
        },
        y: {
          beginAtZero: true,
          position: "right",
          grid: { color: "#eee" },
          ticks: {
            color: "#888",
            font: { size: 12 },
            callback: function (value) {
              return value % 10 === 0 ? value : "";
            },
          },
          afterFit: function (scale) {
            scale.width = 40;
          },
        },
      },
      layout: {
        padding: { left: 0, right: 20, top: 10, bottom: 0 },
      },
    },
  });
}


function renderStatusTags() {
  const listFilterStatus = document.querySelector(".list-filter-status");
  listFilterStatus.innerHTML = "";

  currentStatusCheckboxes.forEach((status) => {
    const tagDiv = document.createElement("div");
    tagDiv.className = "tag";
    tagDiv.dataset.status = status;

    tagDiv.innerHTML = `
    ${status}
    <button class="tag-close" style="margin-left: 6px;">
      <img src="/img/icon/cancel-status-icon.svg" alt="x" />
    </button>
    `;

    tagDiv.querySelector(".tag-close").addEventListener("click", () => {
      const checkbox = document.querySelector(`#filterDropdown input[value="${status}"]`);
      if (checkbox) checkbox.checked = false;

      currentStatusCheckboxes = currentStatusCheckboxes.filter(s => s !== status);
      renderStatusTags();
      callApiGetOrders({ page: 1, size: pageSize }); // Reset to page 1 when filter changes
    });

    listFilterStatus.appendChild(tagDiv);
  });
}

function setOrderStatusUI(currentStatus) {
  const btn = document.getElementById("statusDropdownBtn");
  const imgEl = btn.querySelector("img");
  const textEl = btn.querySelector("span");
  const menu = document.getElementById("statusDropdownMenu");

  const style = statusStyles[currentStatus];
  if (!style) return;

  // Reset classes
  btn.classList.remove(...statusClasses);
  btn.classList.add(style.border, style.text, style.bg);

  imgEl.src = style.icon;
  textEl.innerText = style.label;

  const allowedStatuses = allowedNextStatuses[currentStatus];

  // Remove existing listeners
  btn.removeEventListener("click", handleDropdownClick);

  if (!allowedStatuses || allowedStatuses.length === 0) {
    menu.style.display = "none";
    btn.classList.remove("cursor-pointer");
    menu.innerHTML = "";
    return;
  }

  btn.classList.add("cursor-pointer");
  menu.style.display = "none";
  btn.addEventListener("click", handleDropdownClick);

  // Build dropdown menu
  menu.innerHTML = "";
  allowedStatuses.forEach((status) => {
    const item = document.createElement("div");
    item.className = "px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer";
    item.setAttribute("data-value", status);

    item.innerHTML = `
      <img src="${statusStyles[status].icon}" class="w-4 h-4 mr-2" alt="">
      <span class="${statusStyles[status].text}">${statusStyles[status].label}</span>
    `;

    item.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.style.display = "none";

      // Show simple confirm dialog
      const currentStatusLabel = statusStyles[currentStatus]?.label || currentStatus;
      const newStatusLabel = statusStyles[status]?.label || status;

      if (confirm(`Are you sure you want to change the order status from "${currentStatusLabel}" to "${newStatusLabel}"?`)) {
        callUpdateStatus(currentOrderId, status);
      }
    });

    menu.appendChild(item);
  });
}

function handleDropdownClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const menu = document.getElementById("statusDropdownMenu");
  menu.style.display = menu.style.display === "none" || menu.style.display === "" ? "block" : "none";
}

function setupDropdownToggle(buttonId, dropdownId) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);
  if (!button || !dropdown) return;

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
}

// Setup search functionality
function setupSearchInput() {
  const searchInput = document.getElementById("searchNameInput");
  if (!searchInput) return;

  // Handle Enter key press for immediate search
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      const searchValue = e.target.value.trim();
      lastSearchQuery = searchValue;
      callApiGetOrders({
        name: searchValue,
        page: 1,
        size: pageSize
      });
    }
  });
}

// Helper functions
function capitalizeFirstLetter(status) {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatDateDisplay(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

function getStatusStyles(status) {
  return statusStyles[status.toLowerCase()] || {
    width: "w-[84px]",
    textColor: "text-gray-700",
    buttonClass: "bg-gray-200 text-gray-700",
    icon: "",
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
}

function getCurrentDateFilter() {
  return document.getElementById("order-status-filter").value;
}

// Event listeners setup
document.addEventListener("DOMContentLoaded", function () {
  showSuccessLogin();
  renderStatusTags();
  renderSalesChart("salesChart", ["14", "15", "16", "17", "18", "19", "20"], [15, 20, 25, 22, 28, 18, 27]);
  setupDropdownToggle("filterBtn", "filterDropdown");
  setupSearchInput(); // Setup search functionality

  // Setup page size selector if needed
  setupPageSizeSelector(
    (newSize) => {
      pageSize = newSize;
    },
    (page, size) => {
      callApiGetOrders({ page, size });
    }
  );

  // Filter change listener
  document.getElementById("order-status-filter").addEventListener("change", () => {
    callApiGetOrders({ page: 1, size: pageSize }); // Reset to page 1 when date filter changes
  });

  // Status filter listeners
  document.querySelectorAll('#filterDropdown input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const status = e.target.value;
      const isChecked = e.target.checked;

      if (isChecked) {
        if (!currentStatusCheckboxes.includes(status)) {
          currentStatusCheckboxes.push(status);
        }
      } else {
        currentStatusCheckboxes = currentStatusCheckboxes.filter(s => s !== status);
      }

      renderStatusTags();
      callApiGetOrders({ page: 1, size: pageSize }); // Reset to page 1 when status filter changes
    });
  });

  // Modal close listener
  document.getElementById("closeModalBtn").addEventListener("click", function () {
    document.getElementById("orderModal").classList.add("hidden");
  });

  // Dropdown outside click listener
  document.addEventListener("click", function (event) {
    const menu = document.getElementById("statusDropdownMenu");
    const btn = document.getElementById("statusDropdownBtn");

    if (!btn.contains(event.target) && !menu.contains(event.target)) {
      menu.classList.add("hidden");
    }
  });

  // Initial API call
  callApiGetOrders({ page: 1, size: pageSize });
  loadDashboardSummary();
  getValueSummaryChart();
});