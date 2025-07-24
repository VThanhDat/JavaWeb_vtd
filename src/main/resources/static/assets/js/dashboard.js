import { showToast,showSuccessLogin } from "./toast.js";

let orders = [];
function callApiGetOrders() {
  if (currentStatusCheckboxes.length === 0) {
    orders = [];
    
    renderOrderCards();
    renderDashboardSummary();
    return;
  }
  
  const statusParam = currentStatusCheckboxes.join(',');
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
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
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
    const displayId = (index + 1).toString().padStart(3, '0');
    const orderCard = document.createElement("div");
    orderCard.className = "flex flex-col items-start p-6 gap-2 w-[375px] h-[305px] bg-white rounded-[16px] shadow-sm border border-[#f3f3f3] text-[14px] cursor-pointer hover:shadow-md transition";
    orderCard.setAttribute("data-order-id", order.id);

    const statusStyles = getStatusStyles(order.status.toLowerCase());

    orderCard.innerHTML = `
    <!-- Order header -->
    <div class="flex flex-row justify-between items-start gap-1 w-full">
      <span class="font-medium text-[#292929]">Order# ${displayId}</span>
      <span>${formatDateDisplay(order.createAt)}</span>
    </div>
    
    <!-- Product section -->
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
    
    <!-- Divider -->
    <hr class="w-full border-t border-[#EFEFEF]" />
    
    <span class="font-inter font-normal text-[14px] text-[#797B7E]">${order.totalItems} Items</span>
    
    <div class="flex flex-row justify-end items-center gap-4 w-full h-[48px]">
      <div class="flex flex-row items-center gap-1 flex-grow">
        <span class="font-inter font-bold text-[18px] leading-[27px] text-black">${formatCurrency(order.totalPrice)}</span>
      </div>
      <button class="flex flex-row justify-center items-center px-4 py-2 gap-2 w-[160px] h-[48px] bg-[#E2ECFF] rounded-[4.8px] ${statusStyles.buttonClass}">
        <div class="w-[22px] h-[22px] flex-none">
          ${statusStyles.icon}
        </div>
        <div class="flex flex-col justify-center items-start ${statusStyles.width} bg-[rgba(255,255,255,0.01)] flex-none">
          <p class="font-inter font-bold text-[18px] leading-[27px] flex-none ${statusStyles.textColor}">
            ${order.status}
          </p>
        </div>
      </button>
    </div>
    `;

    orderCard.addEventListener("click", () => {
      const orderId = orderCard.getAttribute("data-order-id");
      openOrderDetailModal(orderId);
    });

    orderListContainer.appendChild(orderCard);
  });
}

function formatDateDisplay(dateString) {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

function getStatusStyles(status) {
  const statusStyles = {
    new: { 
      width: 'w-[40px]', 
      textColor: 'text-[#4079ED]',
      buttonClass: "bg-[#e7efff] text-[#1570EF]",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3044_3773)">
        <path d="M13.2979 1.18898L11.003 0.000976562L8.7081 1.18898L6.15335 1.57673L4.9956 3.88673L3.15723 5.70173L3.57798 8.25098L3.15723 10.8002L4.9956 12.6152L6.15335 14.9252L8.7081 15.313L11.003 16.501L13.2979 15.313L15.8526 14.9252L17.0104 12.6152L18.8487 10.8002L18.428 8.25098L18.8487 5.70173L17.0104 3.88673L15.8526 1.57673L13.2979 1.18898ZM14.9424 2.82935L15.8829 4.70623L17.3761 6.18023L17.0351 8.25098L17.3761 10.3217L15.8829 11.7957L14.9424 13.6726L12.8661 13.9875L11.003 14.9527L9.13985 13.9875L7.0636 13.6726L6.1231 11.7957L4.62985 10.3217L4.97223 8.25098L4.62848 6.18023L6.1231 4.70623L7.0636 2.82935L9.13985 2.51448L11.003 1.54923L12.8675 2.51448L14.9424 2.82935Z" fill="#4079ED"/>
        <path d="M5.50298 16.2177V22.001L11.003 20.626L16.503 22.001V16.2177L13.7282 16.6385L11.003 18.0492L8.27773 16.6385L5.50298 16.2177Z" fill="#4079ED"/>
        </g>
        <defs>
        <clipPath id="clip0_3044_3773">
        <rect width="22" height="22" fill="white"/>
        </clipPath>
        </defs>
        </svg>`
    },
    cancelled: { 
      width: 'w-[84px]', 
      textColor: 'text-[#E31844]',
      buttonClass: "bg-[#fef3f2] text-[#F04438]",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3044_6899)">
        <path d="M4.41593 4.41398C4.50714 4.32253 4.6155 4.24998 4.7348 4.20047C4.8541 4.15097 4.98199 4.12549 5.11116 4.12549C5.24032 4.12549 5.36821 4.15097 5.48751 4.20047C5.60681 4.24998 5.71517 4.32253 5.80638 4.41398L11.0029 9.61247L16.1994 4.41398C16.2907 4.32268 16.3991 4.25025 16.5184 4.20084C16.6377 4.15143 16.7655 4.126 16.8947 4.126C17.0238 4.126 17.1516 4.15143 17.2709 4.20084C17.3902 4.25025 17.4986 4.32268 17.5899 4.41398C17.6812 4.50527 17.7536 4.61366 17.803 4.73295C17.8524 4.85223 17.8779 4.98009 17.8779 5.1092C17.8779 5.23832 17.8524 5.36617 17.803 5.48546C17.7536 5.60474 17.6812 5.71313 17.5899 5.80443L12.3914 11.001L17.5899 16.1975C17.6812 16.2888 17.7536 16.3972 17.803 16.5165C17.8524 16.6357 17.8779 16.7636 17.8779 16.8927C17.8779 17.0218 17.8524 17.1497 17.803 17.269C17.7536 17.3883 17.6812 17.4966 17.5899 17.5879C17.4986 17.6792 17.3902 17.7517 17.2709 17.8011C17.1516 17.8505 17.0238 17.8759 16.8947 17.8759C16.7655 17.8759 16.6377 17.8505 16.5184 17.8011C16.3991 17.7517 16.2907 17.6792 16.1994 17.5879L11.0029 12.3894L5.80638 17.5879C5.71508 17.6792 5.6067 17.7517 5.48741 17.8011C5.36812 17.8505 5.24027 17.8759 5.11116 17.8759C4.98204 17.8759 4.85419 17.8505 4.7349 17.8011C4.61561 17.7517 4.50723 17.6792 4.41593 17.5879C4.32463 17.4966 4.25221 17.3883 4.2028 17.269C4.15339 17.1497 4.12796 17.0218 4.12796 16.8927C4.12796 16.7636 4.15339 16.6357 4.2028 16.5165C4.25221 16.3972 4.32463 16.2888 4.41593 16.1975L9.61442 11.001L4.41593 5.80443C4.32448 5.71321 4.25193 5.60485 4.20243 5.48556C4.15292 5.36626 4.12744 5.23836 4.12744 5.1092C4.12744 4.98004 4.15292 4.85215 4.20243 4.73285C4.25193 4.61355 4.32448 4.50519 4.41593 4.41398Z" fill="#E31844"/>
        </g>
        <defs>
        <clipPath id="clip0_3044_6899">
        <rect width="22" height="22" fill="white"/>
        </clipPath>
        </defs>
        </svg>`
    },
    completed: { 
      width: 'w-[84px]', 
      textColor: 'text-[#12B76A]',
      buttonClass: "bg-[#e7f9ef] text-[#12B76A]",
      icon: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3044_5568)">
        <path d="M17.5147 5.45964C17.6086 5.36389 17.7206 5.28783 17.8442 5.2359C17.9678 5.18397 18.1005 5.15723 18.2345 5.15723C18.3686 5.15723 18.5013 5.18397 18.6249 5.2359C18.7485 5.28783 18.8605 5.36389 18.9543 5.45964C19.3476 5.85701 19.3531 6.49914 18.9681 6.90339L10.8377 16.5146C10.7454 16.616 10.6334 16.6975 10.5085 16.7541C10.3836 16.8106 10.2485 16.8412 10.1115 16.8437C9.97438 16.8463 9.83822 16.8209 9.71131 16.769C9.58439 16.7172 9.46939 16.64 9.37334 16.5421L4.42609 11.5289C4.2353 11.3343 4.12842 11.0727 4.12842 10.8001C4.12842 10.5276 4.2353 10.266 4.42609 10.0714C4.51993 9.97564 4.63193 9.89958 4.75553 9.84765C4.87913 9.79572 5.01184 9.76898 5.14591 9.76898C5.27997 9.76898 5.41269 9.79572 5.53629 9.84765C5.65988 9.89958 5.77188 9.97564 5.86572 10.0714L10.0622 14.3243L17.4872 5.48989C17.4958 5.47926 17.505 5.46916 17.5147 5.45964Z" fill="#17AE30"/>
        </g>
        <defs>
            <clipPath id="clip0_3044_5568">
            <rect width="22" height="22" fill="white"/>
            </clipPath>
            </defs>
            </svg>`
    },
    shipping: { 
      width: 'w-[84px]', 
      textColor: 'text-[#F04438]',
      buttonClass: "bg-[#fef3f2] text-[#F04438]",
      icon: `<svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3044_4699)">
        <path d="M0.50293 3.43848C0.50293 3.25614 0.575363 3.08127 0.704294 2.95234C0.833225 2.82341 1.00809 2.75098 1.19043 2.75098H3.25293C3.40629 2.75102 3.55522 2.80233 3.67606 2.89676C3.7969 2.99119 3.88269 3.1233 3.9198 3.2721L4.47668 5.50098H20.4404C20.5449 5.50101 20.6479 5.52482 20.7418 5.57062C20.8356 5.61642 20.9178 5.683 20.9821 5.76531C21.0464 5.84761 21.091 5.94347 21.1127 6.04562C21.1344 6.14777 21.1326 6.25353 21.1073 6.35485L19.0448 14.6049C19.0077 14.7536 18.9219 14.8858 18.8011 14.9802C18.6802 15.0746 18.5313 15.1259 18.3779 15.126H6.00293C5.84957 15.1259 5.70064 15.0746 5.5798 14.9802C5.45896 14.8858 5.37317 14.7536 5.33605 14.6049L2.71668 4.12598H1.19043C1.00809 4.12598 0.833225 4.05354 0.704294 3.92461C0.575363 3.79568 0.50293 3.62081 0.50293 3.43848ZM4.82043 6.87598L6.53918 13.751H17.8417L19.5604 6.87598H4.82043ZM7.37793 17.876C7.01326 17.876 6.66352 18.0208 6.40566 18.2787C6.1478 18.5366 6.00293 18.8863 6.00293 19.251C6.00293 19.6157 6.1478 19.9654 6.40566 20.2232C6.66352 20.4811 7.01326 20.626 7.37793 20.626C7.7426 20.626 8.09234 20.4811 8.3502 20.2232C8.60806 19.9654 8.75293 19.6157 8.75293 19.251C8.75293 18.8863 8.60806 18.5366 8.3502 18.2787C8.09234 18.0208 7.7426 17.876 7.37793 17.876ZM4.62793 19.251C4.62793 18.5216 4.91766 17.8222 5.43339 17.3064C5.94911 16.7907 6.64858 16.501 7.37793 16.501C8.10728 16.501 8.80675 16.7907 9.32247 17.3064C9.8382 17.8222 10.1279 18.5216 10.1279 19.251C10.1279 19.9803 9.8382 20.6798 9.32247 21.1955C8.80675 21.7112 8.10728 22.001 7.37793 22.001C6.64858 22.001 5.94911 21.7112 5.43339 21.1955C4.91766 20.6798 4.62793 19.9803 4.62793 19.251ZM17.0029 17.876C16.6383 17.876 16.2885 18.0208 16.0307 18.2787C15.7728 18.5366 15.6279 18.8863 15.6279 19.251C15.6279 19.6157 15.7728 19.9654 16.0307 20.2232C16.2885 20.4811 16.6383 20.626 17.0029 20.626C17.3676 20.626 17.7173 20.4811 17.9752 20.2232C18.2331 19.9654 18.3779 19.6157 18.3779 19.251C18.3779 18.8863 18.2331 18.5366 17.9752 18.2787C17.7173 18.0208 17.3676 17.876 17.0029 17.876ZM14.2529 19.251C14.2529 18.5216 14.5427 17.8222 15.0584 17.3064C15.5741 16.7907 16.2736 16.501 17.0029 16.501C17.7323 16.501 18.4317 16.7907 18.9475 17.3064C19.4632 17.8222 19.7529 18.5216 19.7529 19.251C19.7529 19.9803 19.4632 20.6798 18.9475 21.1955C18.4317 21.7112 17.7323 22.001 17.0029 22.001C16.2736 22.001 15.5741 21.7112 15.0584 21.1955C14.5427 20.6798 14.2529 19.9803 14.2529 19.251Z" fill="#FF3403"/>
        </g>
        <defs>
        <clipPath id="clip0_3044_4699">
        <rect width="22" height="22" fill="white" transform="translate(0.5)"/>
        </clipPath>
        </defs>
        </svg>`
    },
  };

  return statusStyles[status.toLowerCase()] || { 
    width: 'w-[84px]', 
    textColor: 'text-gray-700',
    buttonClass: "bg-gray-200 text-gray-700",
    icon: ""
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
}

function renderDashboardSummary() {
  const todaySales = orders.reduce((sum, order) => {
    const isToday = new Date(order.createAt).toDateString() === new Date().toDateString();
    return isToday ? sum + (order.totalPrice || 0) : sum;
  }, 0);

  const shipping = orders.filter(o => o.status === 'Shipping').length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  const cancelled = orders.filter(o => o.status === 'Cancelled').length;

  document.getElementById('today-sales-amount').innerText = todaySales.toLocaleString() + ' đ';
  document.getElementById('total-orders').innerText = orders.length;
  document.getElementById('shipping-orders').innerText = shipping;
  document.getElementById('complete-orders').innerText = completed;
  document.getElementById('cancel-orders').innerText = cancelled;
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
      datasets: [
        {
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
        },
      ],
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


let currentStatusCheckboxes = ["New", "Completed", "Cancelled", "Shipping"];

function renderStatusTags() {
  const listFilterStatus = document.querySelector('.list-filter-status');
  listFilterStatus.innerHTML = '';

  currentStatusCheckboxes.forEach(status => {
    const tagDiv = document.createElement('div');
    tagDiv.className = 'tag';
    tagDiv.dataset.status = status;

    tagDiv.innerHTML = `
    ${status}
    <button class="tag-close" style="margin-left: 6px;">
    <img src="/img/icon/cancel-status-icon.svg" alt="x" />
    </button>
    `;

    tagDiv.querySelector('.tag-close').addEventListener('click', () => {
      const checkbox = document.querySelector(`#filterDropdown input[value="${status}"]`);
      if (checkbox) checkbox.checked = false;

      currentStatusCheckboxes = currentStatusCheckboxes.filter(s => s !== status);
      renderStatusTags();
      callApiGetOrders();
    });

    listFilterStatus.appendChild(tagDiv);
  });
}

document.querySelectorAll('#filterDropdown input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
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

function setupDropdownToggle(buttonId, dropdownId) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);
  if (!button || !dropdown) return;

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function getCurrentDateFilter() {
  return document.getElementById("order-status-filter").value;
}

function openOrderDetailModal(orderId) {
  const order = orders.find(o => o.id == orderId);
  if (!order) return;

  console.log("Chi tiết đơn hàng:", order);
}

document.addEventListener("DOMContentLoaded", function () {
  renderOrderCards();
  showSuccessLogin();
  renderStatusTags();
  renderSalesChart("salesChart", ["14", "15", "16", "17", "18", "19", "20"], [15, 20, 25, 22, 28, 18, 27]);
  setupDropdownToggle('filterBtn', 'filterDropdown');

  document.getElementById("order-status-filter").addEventListener("change", function () {
    callApiGetOrders();
  });

  callApiGetOrders();
});