import { getBasketFromSession } from "./cart.js";
import { showToast } from "./toast.js";

const cityData = {
  "Ho Chi Minh City": {
    wards: [
      { name: "Ward 1", shippingFee: 20000 },
      { name: "Ward 2", shippingFee: 22000 }, // Thêm Ward 2
      { name: "Ward 3", shippingFee: 25000 }, 
      { name: "Ward 7", shippingFee: 30000 },
      { name: "Binh Thanh Ward", shippingFee: 35000 },
      { name: "Tan Binh Ward", shippingFee: 25000 }
    ]
  },
  "Ha Noi": {
    wards: [
      { name: "Hoan Kiem Ward", shippingFee: 30000 },
      { name: "Ba Dinh Ward", shippingFee: 35000 },
      { name: "Dong Da Ward", shippingFee: 40000 }, 
      { name: "Hai Ba Trung Ward", shippingFee: 35000 },
      { name: "Cau Giay Ward", shippingFee: 45000 }
    ]
  },
  "Da Nang": {
    wards: [
      { name: "Hai Chau Ward", shippingFee: 35000 },
      { name: "Thanh Khe Ward", shippingFee: 40000 },
      { name: "Son Tra Ward", shippingFee: 45000 },
      { name: "Ngu Hanh Son Ward", shippingFee: 50000 }, 
      { name: "Lien Chieu Ward", shippingFee: 55000 }
    ]
  },
  "Can Tho": {
    wards: [
      { name: "Ninh Kieu Ward", shippingFee: 40000 },
      { name: "Binh Thuy Ward", shippingFee: 45000 },
      { name: "Cai Rang Ward", shippingFee: 50000 },
      { name: "O Mon Ward", shippingFee: 55000 },
      { name: "Thot Not Ward", shippingFee: 60000 }
    ]
  },
  "An Giang": {
    wards: [
      { name: "Rach Gia Ward", shippingFee: 45000 },
      { name: "Long Xuyen Ward", shippingFee: 50000 }, 
      { name: "Chau Doc Ward", shippingFee: 55000 },
      { name: "Kien Luong Ward", shippingFee: 60000 },
      { name: "Hon Dat Ward", shippingFee: 65000 }
    ]
  }
};

// Hàm khởi tạo delivery information
function initDeliveryInfo() {
  const basketData = getBasketFromSession();

  if (basketData && basketData.length > 0) {
    renderOrderProducts(basketData);
    calculateTotals(basketData);
  }

  // Khởi tạo dropdown cho thành phố và phường
  initCityWardDropdowns();
  
  // Khởi tạo event listeners cho các buttons
  initEventListeners();
}

function initCityWardDropdowns() {
  const citySelect = document.getElementById('city');
  const wardSelect = document.getElementById('ward');
  
  if (!citySelect || !wardSelect) return;
  
  citySelect.innerHTML = '<option value="">Choose City</option>';
  wardSelect.innerHTML = '<option value="">Choose Ward</option>';
  
  Object.keys(cityData).forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
  
  citySelect.addEventListener('change', function() {
    const selectedCity = this.value;
    updateWardOptions(selectedCity);
    // Reset shipping fee khi đổi thành phố
    const basketData = getBasketFromSession();
    if (basketData && basketData.length > 0) {
      calculateTotals(basketData);
    }
  });
  
  wardSelect.addEventListener('change', function() {
    updateShippingFee();
  });
}

function updateWardOptions(selectedCity) {
  const wardSelect = document.getElementById('ward');
  
  if (!wardSelect || !selectedCity) {
    wardSelect.innerHTML = '<option value="">Choose Ward</option>';
    return;
  }
  
  wardSelect.innerHTML = '<option value="">Choose Ward</option>';
  
  if (cityData[selectedCity]) {
    cityData[selectedCity].wards.forEach(wardData => {
      const option = document.createElement('option');
      option.value = wardData.name;
      option.textContent = wardData.name;
      option.setAttribute('data-shipping-fee', wardData.shippingFee);
      wardSelect.appendChild(option);
    });
  }
}

function updateShippingFee() {
  const basketData = getBasketFromSession();
  if (basketData && basketData.length > 0) {
    const shippingFee = getShippingFee();
    calculateTotals(basketData, shippingFee);
  }
}

function getShippingFee() {
  const citySelect = document.getElementById('city');
  const wardSelect = document.getElementById('ward');
  const selectedCity = citySelect?.value;
  const selectedWard = wardSelect?.value;
  
  if (selectedCity && selectedWard && cityData[selectedCity]) {
    const wardData = cityData[selectedCity].wards.find(ward => ward.name === selectedWard);
    if (wardData) {
      return wardData.shippingFee;
    }
  }
  
  return 35000; // Default shipping fee
}

// Render danh sách sản phẩm từ basket
function renderOrderProducts(basketData) {
  const orderProductList = document.querySelector(".order-product-list");

  if (!orderProductList) return;

  // Xóa nội dung cũ
  orderProductList.innerHTML = "";

  basketData.forEach((item) => {
    const productCard = createProductCard(item);
    orderProductList.appendChild(productCard);
  });
}

// Tạo card sản phẩm
function createProductCard(item) {
  const productCard = document.createElement("div");
  productCard.className = "order-product-card";
  productCard.setAttribute("data-id", item.id || item.itemId); // Hỗ trợ cả id và itemId

  productCard.innerHTML = `
        <div class="order-product-img">
            <img src="${
              item.image || "/uploads/drink/default.jpg"
            }" alt="product" />
        </div>
        <div class="order-product-info">
            <span class="order-product-name">${item.name || 'Product'}</span>
            <span class="order-product-description">${
              item.description || ""
            }</span>
        </div>
        <div class="order-product-price-quantity">
            <span class="order-product-price">${formatPrice(
              item.price
            )} đ</span>
            <div class="order-product-quantity">
                <span class="quantity-label">Quantity: </span>
                <span class="quantity-count">${item.quantity}</span>
            </div>
        </div>
    `;

  return productCard;
}

// Tính toán tổng tiền
function calculateTotals(basketData, customShippingFee = null) {
  let totalProductPrice = 0;

  basketData.forEach((item) => {
    totalProductPrice += parseInt(item.price) * item.quantity;
  });

  const shippingFee = customShippingFee || getShippingFee();
  const totalBill = totalProductPrice + shippingFee;

  updatePriceDisplay(totalProductPrice, shippingFee, totalBill);
}

function updatePriceDisplay(totalProductPrice, shippingFee, totalBill) {
  const totalProductElement = document.querySelector(
    ".order-total-product-price span:last-child"
  );
  const shippingFeeElement = document.querySelector(
    ".order-shipping-fee span:last-child"
  );
  const totalBillElement = document.querySelector(
    ".order-total-bill span:last-child"
  );

  if (totalProductElement) {
    totalProductElement.textContent = formatPrice(totalProductPrice) + "đ";
  }

  if (shippingFeeElement) {
    shippingFeeElement.textContent = formatPrice(shippingFee) + "đ";
  }

  if (totalBillElement) {
    totalBillElement.textContent = formatPrice(totalBill) + " đ";
  }
}

// Format giá tiền
function formatPrice(price) {
  return parseInt(price).toLocaleString("vi-VN");
}

function initEventListeners() {
  const cancelButton = document.querySelector(".cancel-button");
  const placeOrderButton = document.querySelector(".place-order-button");

  if (cancelButton) {
    cancelButton.addEventListener("click", handleCancelOrder);
  }

  if (placeOrderButton) {
    placeOrderButton.addEventListener("click", handlePlaceOrder);
  }
}

function handleCancelOrder() {
  window.location.href = "home.html";
}

// Xử lý đặt hàng - SỬA ĐỔI CHÍNH Ở ĐÂY
function handlePlaceOrder() {
  const deliveryInfo = collectDeliveryInfo();

  if (validateDeliveryInfo(deliveryInfo)) {
    const basketData = getBasketFromSession();
    
    // Chuyển đổi sang format mới
    const orderData = {
      customer: {
        fullName: deliveryInfo.fullName,
        phone: deliveryInfo.phone,
        city: deliveryInfo.city,
        ward: deliveryInfo.ward,
        address: deliveryInfo.address,
        message: deliveryInfo.message
      },
      items: basketData.map(item => ({
        itemId: item.id || item.itemId, // Hỗ trợ cả id và itemId
        quantity: item.quantity,
        price: parseInt(item.price)
      })),
      shippingFee: getShippingFee()
    };

    processOrder(orderData);
  }
}

function collectDeliveryInfo() {
  return {
    fullName: document.getElementById("fullname")?.value || "",
    phone: document.getElementById("tel")?.value || "",
    city: document.getElementById("city")?.value || "",
    ward: document.getElementById("ward")?.value || "",
    address: document.getElementById("address")?.value || "",
    message: document.getElementById("message")?.value || "",
  };
}

// SỬA VALIDATION CHO PHONE - cho phép format "039 3456 244"
function validateDeliveryInfo(info) {
  if (!info.fullName.trim()) {
    showToast("Please enter your full name", "error");
    return false;
  } else if (info.fullName.trim().length < 2) {
    showToast("Full name must be at least 2 characters", "error");
    return false;
  }

  if (!info.phone.trim()) {
    showToast("Please enter your phone", "error");
    return false;
  } else {
    // Cho phép cả format "0901234567" và "039 3456 244"
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9\s]{8,10})$/;
    const cleanPhone = info.phone.trim().replace(/\s/g, ''); // Xóa khoảng trắng
    if (!phoneRegex.test(cleanPhone) || cleanPhone.length !== 10) {
      showToast("Invalid phone number (eg: 0901234567 or 039 3456 244)", "error");
      return false;
    }
  }

  if (!info.city.trim()) {
    showToast("Please choose a city", "error");
    return false;
  }

  if (!info.ward.trim()) {
    showToast("Please choose a ward", "error");
    return false;
  }

  if (!info.address.trim()) {
    showToast("Please enter shipping address", "error");
    return false;
  } else if (info.address.trim().length < 5) {
    showToast("Address is too short, please enter more details", "error");
    return false;
  } else if (info.address.trim().length > 500) {
    showToast("Shipping address must be under 500 words", "error");
    return false;
  }

  return true;
}

// SỬA HÀM processOrder để gửi dữ liệu theo format mới
function processOrder(orderData) {
  const placeOrderButton = document.querySelector(".place-order-button");

  try {
    // In ra console để kiểm tra format
    console.log("Order data to send:", JSON.stringify(orderData, null, 2));
    
    // Ở đây bạn có thể gửi orderData lên server
    // fetch('/api/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(orderData)
    // })
    
    // Xóa giỏ hàng sau khi đặt hàng thành công
    sessionStorage.removeItem("basket");
    // window.location.href = "order-success.html";
  } catch (error) {
    showToast(
      "An error occurred while placing your order. Please try again.",
      "error"
    );
  }
}

function initMap() {
  var map = L.map("map").setView([10.805382011143632, 106.66613941915007], 18);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var marker = L.marker([10.805382011143632, 106.66613941915007]).addTo(map);
}

document.addEventListener("DOMContentLoaded", function () {
  initDeliveryInfo();
  initMap();
});