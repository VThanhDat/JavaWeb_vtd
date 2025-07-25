import { showToast, showSuccessLogin } from "./toast.js";

let orders = [];
let currentOrderId = null;
let currentStatusCheckboxes = ["New", "Completed", "Cancelled", "Shipping"];

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

function callApiGetOrders() {
  if (currentStatusCheckboxes.length === 0) {
    orders = [];
    renderOrderCards();
    renderDashboardSummary();
    return;
  }

  const statusParam = currentStatusCheckboxes.join(",");
  const dateParam = getCurrentDateFilter();
  const queryString = `status=${encodeURIComponent(statusParam)}&date=${encodeURIComponent(dateParam)}`;

  $.ajax({
    url: `/api/order?${queryString}`,
    method: "GET",
    xhrFields: { withCredentials: true },
    success: function (response) {
      orders = response.data;
      renderOrderCards();
      renderDashboardSummary();
    },
    error: function (xhr) {
      showToast(xhr.responseJSON?.data, "error");
    },
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
      renderDashboardSummary();
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
    const displayId = (index + 1).toString().padStart(3, "0");
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
      <img src="/${order.itemImage}" alt="Product Image" class="w-16 h-16 rounded-md object-cover" />
      <div class="flex-1 grid gap-1">
        <div class="flex flex-row items-start gap-1">
          <h3 class="font-inter font-semibold text-[16px] leading-[24px] text-black flex-grow">${order.itemName}</h3>
        </div>
        <p class="text-xs text-[#7c7c7c] line-clamp-1">${order.itemDescription}</p>
        <div class="flex justify-between items-end py-1">
          <div class="flex items-center">
            <span class="font-inter font-bold text-[16px] leading-[24px] text-black">${formatCurrency(order.price)}</span>
          </div>
          <span class="text-xs text-[#7c7c7c] font-normal">Quantity: ${order.quantity}</span>
        </div>
      </div>
    </div>
    
    <hr class="w-full border-t border-[#EFEFEF]" />
    
    <span class="font-inter font-normal text-[14px] text-[#797B7E]">${order.totalItems} Items</span>
    
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
  document.querySelector(".detailOrder-popup-total-items").innerText = `${order.totalItems} Items`;
  
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

function renderDashboardSummary() {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => new Date(order.createAt).toDateString() === today);
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

function renderSalesChart(canvasId, labels = [], dataPoints = []) {
  const chartCanvas = document.getElementById(canvasId);
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 250);
  gradient.addColorStop(0, "rgba(255, 128, 0, 0.5)");
  gradient.addColorStop(1, "rgba(255, 128, 0, 0)");

  new Chart(ctx, {
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
            text: "May",
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
      callApiGetOrders();
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
      callUpdateStatus(currentOrderId, status);
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
  renderOrderCards();
  showSuccessLogin();
  renderStatusTags();
  renderSalesChart("salesChart", ["14", "15", "16", "17", "18", "19", "20"], [15, 20, 25, 22, 28, 18, 27]);
  setupDropdownToggle("filterBtn", "filterDropdown");

  // Filter change listener
  document.getElementById("order-status-filter").addEventListener("change", callApiGetOrders);

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
      callApiGetOrders();
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

  callApiGetOrders();
});