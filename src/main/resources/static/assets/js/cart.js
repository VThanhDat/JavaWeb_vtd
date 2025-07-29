// cart.js - Module quản lý giỏ hàng
import { showToast } from "./toast.js";

// Biến global cho cart
let currentBasketItem = null;

// ================== BASKET SESSION MANAGEMENT ==================

// Function để lưu/update basket từ menu actions (set quantity, không cộng thêm)
export function saveToBasketSession(basketItem) {
  let basket = JSON.parse(sessionStorage.getItem('basket')) || [];
  
  const existingItemIndex = basket.findIndex(item => item.id === basketItem.id);
  
  if (existingItemIndex !== -1) {
    basket[existingItemIndex].quantity = basketItem.quantity;
    basket[existingItemIndex].totalPrice = basket[existingItemIndex].price * basket[existingItemIndex].quantity;
  } else {
    basket.push(basketItem);
  }
  
  sessionStorage.setItem('basket', JSON.stringify(basket));
  updateBasketCounter();
}

// Function để lấy basket từ session
export function getBasketFromSession() {
  return JSON.parse(sessionStorage.getItem('basket')) || [];
}

// Function để cập nhật quantity của item trong basket
export function updateBasketItemQuantity(itemId, newQuantity) {
  let basket = JSON.parse(sessionStorage.getItem('basket')) || [];
  
  const itemIndex = basket.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    basket[itemIndex].quantity = newQuantity;
    basket[itemIndex].totalPrice = basket[itemIndex].price * newQuantity;
    
    sessionStorage.setItem('basket', JSON.stringify(basket));
    updateBasketCounter();
  }
}

// Function để SET quantity của item trong basket (dùng cho modal "Add to Basket")
export function setBasketItemQuantity(basketItem) {
  let basket = JSON.parse(sessionStorage.getItem('basket')) || [];
  
  const existingItemIndex = basket.findIndex(item => item.id === basketItem.id);
  
  if (existingItemIndex !== -1) {
    basket[existingItemIndex].quantity = basketItem.quantity;
    basket[existingItemIndex].totalPrice = basket[existingItemIndex].price * basketItem.quantity;
  } else {
    basket.push(basketItem);
  }
  
  sessionStorage.setItem('basket', JSON.stringify(basket));
  updateBasketCounter();
}

// Function để xóa 1 item khỏi basket
export function removeItemFromBasket(itemId) {
  let basket = JSON.parse(sessionStorage.getItem('basket')) || [];
  basket = basket.filter(item => item.id !== itemId);
  sessionStorage.setItem('basket', JSON.stringify(basket));
  updateBasketCounter();
}

// ================== BASKET COUNTER DISPLAY ==================

export function updateBasketCounter() {
  const basket = JSON.parse(sessionStorage.getItem('basket')) || [];
  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = basket.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Tìm container chứa cart
  const cartContainer = document.querySelector('.heading_nav-cart-order');
  if (!cartContainer) return;
  
  const existingCart = cartContainer.querySelector('.heading_nav-cart');
  const existingDetailedCart = cartContainer.querySelector('.card-detail');
  
  if (totalItems > 0) {
    // Có sản phẩm trong giỏ - ẩn cart bình thường và hiển thị cart chi tiết
    if (existingCart) {
      existingCart.style.display = 'none';
    }
    
    // Xóa cart chi tiết cũ nếu có
    if (existingDetailedCart) {
      existingDetailedCart.remove();
    }
    
    // Tạo cart chi tiết mới với class card-detail
    const detailedCartHtml = `
      <div class="card-detail relative cursor-pointer box-border flex flex-row items-center p-[10px] gap-2 isolate w-[129px] h-[44px] bg-[#FF6B00] border border-[#CED4DA] rounded-[4px] flex-none order-0 flex-grow-0">
        <img src="/img/icon/basket-icon.svg" alt="cart-icon">
        <div class="box-border flex flex-col justify-center items-center p-0 absolute w-[17px] h-[17px] left-[-8px] top-[-8px] bg-white border border-[#FF6B00] rounded-[42px] flex-none order-1 flex-grow-0 z-[1]">
          ${totalItems}
        </div>
        <div class="w-[64px] h-[16px] flex items-center justify-center text-center text-white text-[16px] leading-[100%] font-normal font-[inter] flex-none order-0 flex-grow-0">
          ${formatPrice(totalPrice)} đ
        </div>
      </div>
    `;
    
    // Thêm cart chi tiết vào vị trí giữa cart bình thường và order
    const orderElement = cartContainer.querySelector('.heading_nav-order');
    if (orderElement) {
      orderElement.insertAdjacentHTML('beforebegin', detailedCartHtml);
    }
    
  } else {
    // Không có sản phẩm - hiển thị cart bình thường và ẩn cart chi tiết
    if (existingCart) {
      existingCart.style.display = 'block';
    }
    
    // Xóa cart chi tiết nếu có
    if (existingDetailedCart) {
      existingDetailedCart.remove();
    }
  }
}

// ================== BASKET POPUP MODAL ==================

export function showBasketPopup(itemData, initialQuantity = 1) {
  const modalHtml = `
    <div id="modal-basket-item">
      <div class="fixed flex flex-col items-start pt-0 pr-0 pb-8 pl-0 gap-[43px] w-[900px] h-[800px] left-1/2 top-[54%] transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[-54px_0px_22px_rgba(199,199,199,0.03),-30px_0px_18px_rgba(199,199,199,0.1),-14px_0px_14px_rgba(199,199,199,0.17),-3px_0px_7px_rgba(199,199,199,0.2)] z-[9999]">
        <div class="flex flex-col items-start px-8 py-0 gap-[22px] w-[900px] h-[600px] flex-none order-0 self-stretch flex-grow">
          <!-- Title Basket -->
          <div class="box-border flex flex-row justify-between items-center py-6 px-0 gap-[69px] w-[836px] h-[82px] border-b border-[#CED4DA] flex-none order-0 self-stretch flex-grow-0">
            <div class="flex flex-col justify-center items-center p-0 m-auto w-6 h-6 flex-none order-0 flex-grow-0">
            </div>

            <h3 class="w-[207px] h-[34px] text-[28px] leading-[120%] font-medium text-[#292929] text-center font-[inter] flex-none order-0 flex-grow">
              Basket
            </h3>

            <div class="flex flex-col justify-center items-center p-0 m-auto w-6 h-6 flex-none order-2 flex-grow-0 cursor-pointer" id="close-basket-btn">
              <img src="/img/icon/cancel-basket-icon.svg" alt="">
            </div>
          </div>

          <!-- Item -->
          <div class="flex flex-col items-start p-10 gap-2 isolate w-[836px] h-[138px] bg-[#F9F9F9] rounded-2xl flex-none order-1 self-stretch flex-grow-0">
            <div class="flex flex-row items-start p-0 gap-4 w-[772px] h-[90px] flex-none order-0 self-stretch flex-grow-0 z-0">
              <!-- Image -->
              <div class="flex flex-col items-start p-0 w-[90px] h-[90px] rounded-[5.53846px] flex-none order-0 flex-grow-0">
                <div class="item-basket-image w-[90px] h-[90px] bg-no-repeat bg-cover bg-center rounded-2xl flex-none order-0 self-stretch flex-grow" style="background-image: url('${itemData.image}');">
                </div>
              </div>
              <!-- Content -->
              <div class="flex flex-row items-start p-0 gap-4 w-[666px] h-[90px] flex-none order-1 self-stretch flex-grow">
                <!-- Title -->
                <div class="flex flex-col items-start p-0 w-[527px] h-[54px] flex-none order-0 flex-grow">
                  <!-- Name -->
                  <div class="item-basket-name w-[527px] h-[30px] text-[20px] leading-[150%] font-semibold text-[#292929] font-[inter] flex-none order-0 flex-grow">
                    ${itemData.name}
                  </div>
                  <!-- Description -->
                  <div class="item-basket-description w-[527px] h-[24px] text-[16px] leading-[150%] font-normal text-[#656565] font-[inter] flex-none order-0 self-stretch flex-grow">
                    ${itemData.description}
                  </div>
                </div>
                <!-- Price -->
                <div class="flex flex-col items-end px-4 py-0 w-[123px] h-[90px] flex-none order-1 self-stretch flex-grow-0">
                  <div class="item-basket-price w-[74px] h-[30px] text-[20px] leading-[150%] font-bold text-[#292929] font-[inter] flex-none order-0 flex-grow-0">
                    ${formatPrice(itemData.price)} đ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center px-8 py-6 gap-[24px] w-[900px] h-[125px] bg-white shadow-[0px_-10px_4px_rgba(171,171,171,0.01),0px_-6px_3px_rgba(171,171,171,0.05),0px_-3px_3px_rgba(171,171,171,0.09),0px_-1px_1px_rgba(171,171,171,0.1)] flex-none order-1 self-stretch flex-grow-0">
          <!-- Quantity Item Basket -->
          <div class="flex flex-row justify-center items-end p-0 gap-[17.78px] w-[134.89px] h-[43px] flex-none order-1 flex-grow-0">
            <div class="flex flex-row justify-center items-center px-[14.2222px] py-[7.11111px] gap-[17.78px] w-[42.67px] h-[42.67px] bg-[#EFEFEF] rounded-[28.4444px] flex-none order-0 flex-grow-0 cursor-pointer" id="modal-decrease-btn">
              <img src="/img/icon/minus-icon.svg">
            </div>
            <input type="number" id="modal-quantity" class="w-[50px] h-[43px] text-[28.4444px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none leading-[150%] font-normal text-[#292929] font-[inter] flex-none order-1 flex-grow-0 text-center" value="${initialQuantity}" min="1" max="3">
            <div class="flex flex-row justify-center items-center px-[14.2222px] py-[7.11111px] gap-[17.78px] w-[42.67px] h-[42.67px] bg-[#EFEFEF] rounded-[28.4444px] flex-none order-2 flex-grow-0 cursor-pointer" id="modal-increase-btn">
              <img src="/img/icon/plus-icon.svg">
            </div>
          </div>
          <!-- Add to basket -->
          <button id="add-to-basket-btn" class="box-border flex flex-row justify-center items-center px-4 py-6 gap-2 w-[677.11px] h-[77px] bg-[#FF6B00] border border-[#FF6B00] rounded flex-none order-1 flex-grow">
            <div class="w-[225px] h-[27px] text-[18px] leading-[150%] font-bold text-white font-[inter] flex-none order-0 flex-grow-0">
              Add to Basket - ${formatPrice(itemData.price * initialQuantity)} đ
            </div>
          </button>
        </div>
      </div>
      <!-- Backdrop overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-10 z-[9998]" id="modal-backdrop"></div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  currentBasketItem = itemData;
  document.body.style.overflow = 'hidden';

  setupModalEventListeners();
}

function setupModalEventListeners() {
  // Close button
  const closeBtn = document.getElementById('close-basket-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBasketPopup);
  }

  // Increase button - Cập nhật cả modal và session
  const increaseBtn = document.getElementById('modal-increase-btn');
  if (increaseBtn) {
    increaseBtn.addEventListener('click', increaseQuantityModal);
  }

  // Decrease button - Cập nhật cả modal và session
  const decreaseBtn = document.getElementById('modal-decrease-btn');
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', decreaseQuantityModal);
  }

  // Add to basket button
  const addBtn = document.getElementById('add-to-basket-btn');
  if (addBtn) {
    addBtn.addEventListener('click', addToBasket);
  }

  // Xử lý sự kiện cho input quantity trong modal
  const quantityInput = document.getElementById('modal-quantity');
  if (quantityInput) {
    quantityInput.addEventListener('input', handleQuantityInputChange);
  }
}

function closeBasketPopup() {
  const modal = document.getElementById('modal-basket-item');
  if (modal) {
    modal.remove();
  }
  document.body.style.overflow = 'auto';
  currentBasketItem = null;
}

// Function mới cho modal increase - KHÔNG cập nhật session, chỉ thay đổi UI modal
function increaseQuantityModal() {
  const quantityInput = document.getElementById('modal-quantity');
  let currentQuantity = parseInt(quantityInput.value);
  
  if (currentQuantity < 3) {
    currentQuantity++;
    quantityInput.value = currentQuantity;
    
    // Chỉ cập nhật giá trong button, KHÔNG cập nhật session
    updateModalPrice(currentQuantity);
  } else {
    showToast("Maximum quantity is 3","error");
  }
}

// Function mới cho modal decrease - KHÔNG cập nhật session, chỉ thay đổi UI modal
function decreaseQuantityModal() {
  const quantityInput = document.getElementById('modal-quantity');
  let currentQuantity = parseInt(quantityInput.value);
  
  if (currentQuantity > 1) {
    currentQuantity--;
    quantityInput.value = currentQuantity;
    updateModalPrice(currentQuantity);
  }
}

// Function để xử lý khi user nhập trực tiếp vào input
function handleQuantityInputChange() {
  const quantityInput = document.getElementById('modal-quantity');
  let value = parseInt(quantityInput.value);
  
  // Kiểm tra giá trị hợp lệ trong khi nhập
  if (isNaN(value) || value < 1) {
    quantityInput.value = 1;
    value = 1;
  } else if (value > 3) {
    quantityInput.value = 3;
    value = 3;
    showToast("Maximum quantity is 3","error");
  }
  
  updateModalPrice(value);
}

// Function helper để cập nhật giá trong modal
function updateModalPrice(quantity) {
  const addButton = document.getElementById('add-to-basket-btn');
  const totalPrice = currentBasketItem.price * quantity;
  
  addButton.innerHTML = `
    <div class="w-[225px] h-[27px] text-[18px] leading-[150%] font-bold text-white font-[inter] flex-none order-0 flex-grow-0">
      Add to Basket - ${formatPrice(totalPrice)} đ
    </div>
  `;
}

function addToBasket() {
  const quantityInput = document.getElementById('modal-quantity');
  const quantity = parseInt(quantityInput.value);
  const itemData = currentBasketItem;
  
  // Đảm bảo quantity hợp lệ trước khi lưu
  if (isNaN(quantity) || quantity < 1 || quantity > 3) {
    showToast("Invalid quantity", "error");
    return;
  }
  
  // Tạo basket item object với quantity từ modal
  const basketItem = {
    id: itemData.id,
    name: itemData.name,
    price: itemData.price,
    image: itemData.image,
    description: itemData.description,
    quantity: quantity,
    totalPrice: itemData.price * quantity
  };
  
  // SET quantity trong session (không cộng thêm, mà thay thế)
  setBasketItemQuantity(basketItem);
  
  // Đóng modal
  closeBasketPopup();
  
  // Hiển thị thông báo thành công (nếu có function showToast)
  if (typeof showToast === 'function') {
    showToast(`Item quantity updated`, "success");
  }
  
  // Trigger event để sync với menu (nếu cần)
  document.dispatchEvent(new CustomEvent('basketUpdated'));
}

// ================== CART MODAL ==================

export function showCartModal() {
  const basket = getBasketFromSession();

  // Tính tổng tiền
  const totalPrice = basket.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Tạo HTML cho các items trong cart
  const cartItemsHtml = basket.map(item => `
    <div class="cart-item-list mb-6 relative flex flex-col items-start p-[24px_32px] gap-2 isolate w-full bg-[#F9F9F9] rounded-[16px]" data-item-id="${item.id}">
      <button class="flex flex-row items-start p-0 gap-1 absolute w-[24px] h-[24px] right-2 top-2 rounded-[31px] z-[1] cart-item-remove">
        <img src="/img/icon/cancel-item-icon.svg" alt="">
      </button>
      <div class="flex flex-row items-start p-0 gap-4 w-full">
        <!-- Image -->
        <div class="flex flex-col items-start p-0 w-[90px] h-[90px] rounded-[5.53846px] flex-none">
          <div class="item-cart-image w-[90px] h-[90px] bg-no-repeat bg-cover bg-center rounded-2xl flex-none order-0 self-stretch flex-grow"
               style="background-image: url('${item.image}');">
          </div>
        </div>
        <!-- Content -->
        <div class="cart-item-content flex-1">
          <div class="cart-item flex flex-row items-start p-0 gap-4 w-full">
            <!-- Title -->
            <div class="flex flex-col items-start p-0 flex-1">
              <!-- Name -->
              <div class="item-cart-name text-[20px] leading-[150%] font-semibold text-[#292929] font-inter">
                ${item.name}
              </div>
              <!-- Description -->
              <div class="item-cart-description text-[16px] leading-[150%] font-normal text-[#656565] font-inter">
                ${item.description || ''}
              </div>
            </div>
            <!-- Price -->
            <div class="flex flex-col items-end px-4 py-0 w-[123px]">
              <div class="item-cart-price text-[20px] leading-[150%] font-bold text-[#292929] font-inter">
                ${formatPrice(item.price)} đ
              </div>
              <div class="flex flex-row justify-center items-end py-[6px] px-0 gap-[10px] w-[79px]">
                <button class="item-cart-minus flex flex-row justify-center items-center px-2 py-1 w-[24px] h-[24px] bg-[#EFEFEF] rounded-[16px]">−</button>
                <input type="number"
                       class="quantity-display w-[25px] text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                       value="${item.quantity}" min="1" max="3" />
                <button class="item-cart-plus flex flex-row justify-center items-center px-2 py-1 w-[24px] h-[24px] bg-[#EFEFEF] rounded-[16px]">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Total item -->
      <div class="flex flex-row justify-end items-start py-2 px-0 gap-4 w-full">
        <div class="flex flex-row justify-end items-center p-0 gap-1">
          <div class="item-total-price text-[20px] leading-[150%] font-bold text-[#FF6B00] font-inter">
            ${formatPrice(item.totalPrice)} đ
          </div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Tạo modal HTML với data từ session
  const modalHtml = `
    <div id="modal-cart">
      <div class="fixed flex flex-col items-start pt-0 pr-0 pb-8 pl-0 gap-[43px] w-[900px] h-[700px] left-1/2 top-[48%] transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[-54px_0px_22px_rgba(199,199,199,0.03),-30px_0px_18px_rgba(199,199,199,0.1),-14px_0px_14px_rgba(199,199,199,0.17),-3px_0px_7px_rgba(199,199,199,0.2)] z-[9999]">

        <!-- Header cố định -->
        <div class="flex flex-col items-start px-8 py-0 gap-[22px] w-[900px] flex-none">
          <!-- Title Basket -->
          <div class="box-border flex flex-row justify-between items-center py-6 px-0 gap-[69px] w-[836px] h-[82px] border-b border-[#CED4DA] flex-none order-0 self-stretch flex-grow-0">
            <div class="flex flex-col justify-center items-center p-0 m-auto w-6 h-6 flex-none order-0 flex-grow-0">
            </div>

            <h3 class="w-[207px] h-[34px] text-[28px] leading-[120%] font-medium text-[#292929] text-center font-[inter] flex-none order-0 flex-grow">
              Basket
            </h3>

            <div class="flex flex-col justify-center items-center p-0 m-auto w-6 h-6 flex-none order-2 flex-grow-0 cursor-pointer" id="close-basket-btn">
              <img src="/img/icon/cancel-basket-icon.svg" alt="">
            </div>
          </div>
        </div>

        <!-- Phần danh sách có thể cuộn -->
        <div class="flex-1 px-8 w-full overflow-hidden">
          <div class="list-cart-item h-full overflow-y-auto custom-scrollbar pr-2">
            ${cartItemsHtml}
          </div>
        </div>

        <!-- Footer-->
        <div class="flex flex-col items-center px-8 py-6 gap-6 w-[900px] bg-white shadow-[0px_-10px_4px_rgba(171,171,171,0.01),0px_-6px_3px_rgba(171,171,171,0.05),0px_-3px_3px_rgba(171,171,171,0.09),0px_-1px_1px_rgba(171,171,171,0.1)] flex-none z-[2]">
          <div class="flex flex-row justify-between items-center p-0 w-[836px]">
            <h3 class="text-[28px] leading-[120%] font-medium text-[#292929] font-inter">
              Total
            </h3>
            <div class="flex items-center justify-end">
              <div id="cart-total-price" class="text-[20px] leading-[150%] font-bold text-[#FF6B00] font-inter">
                ${formatPrice(totalPrice)} đ
              </div>
            </div>
          </div>

          <!-- Place order -->
          <button id="place-order-btn"
                  class="box-border flex flex-row justify-center items-center px-4 py-6 gap-2 w-[836px] h-[77px] bg-[#FF6B00] border border-[#FF6B00] rounded-[4px] hover:bg-orange-600 transition-colors">
            <div class="text-[18px] leading-[150%] font-bold text-white font-inter">
              Place Order
            </div>
          </button>
        </div>
      </div>

      <!-- Backdrop overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-10 z-[9998]" id="modal-backdrop"></div>
    </div>
  `;
  
  // Thêm modal vào DOM
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow = 'hidden';
  
  // Setup event listeners cho modal
  setupCartModalEventListeners();
}

// Function để setup các event listeners cho modal cart
function setupCartModalEventListeners() {
  // Close button
  const closeBtn = document.getElementById('close-basket-btn');
  const backdrop = document.getElementById('modal-backdrop');
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartModal);
  }
  
  if (backdrop) {
    backdrop.addEventListener('click', closeCartModal);
  }
  
  // Remove item buttons
  document.querySelectorAll('.cart-item-remove').forEach(removeBtn => {
    removeBtn.addEventListener('click', function() {
      const cartItem = this.closest('.cart-item-list');
      const itemId = cartItem.dataset.itemId;
      
      // Xóa item khỏi session
      removeItemFromBasket(itemId);
      
      // Xóa item khỏi DOM
      cartItem.remove();
      
      // Cập nhật tổng tiền
      updateCartModalTotal();
      
      // Trigger event để sync với menu
      document.dispatchEvent(new CustomEvent('basketUpdated'));
      
      // Kiểm tra nếu giỏ hàng trống thì đóng modal
      const remainingItems = document.querySelectorAll('.cart-item-list');
      if (remainingItems.length === 0) {
        closeCartModal();
        showToast("Cart is now empty", "warning");
      } else {
        showToast("Item removed from cart", "success");
      }
    });
  });
  
  // Plus buttons
  document.querySelectorAll('.item-cart-plus').forEach(plusBtn => {
    plusBtn.addEventListener('click', function() {
      const cartItem = this.closest('.cart-item-list');
      const itemId = cartItem.dataset.itemId;
      const quantityInput = this.parentElement.querySelector('.quantity-display');
      
      let currentQuantity = parseInt(quantityInput.value);
      
      if (currentQuantity < 3) {
        currentQuantity++;
        quantityInput.value = currentQuantity;
        
        // Cập nhật session
        updateBasketItemQuantity(itemId, currentQuantity);
        
        // Cập nhật giá item và tổng tiền
        updateCartItemPrice(cartItem, itemId);
        updateCartModalTotal();
        
        // Trigger event để sync với menu
        document.dispatchEvent(new CustomEvent('basketUpdated'));
      } else {
        showToast("Maximum quantity is 3", "error");
      }
    });
  });
  
  // Minus buttons
  document.querySelectorAll('.item-cart-minus').forEach(minusBtn => {
    minusBtn.addEventListener('click', function() {
      const cartItem = this.closest('.cart-item-list');
      const itemId = cartItem.dataset.itemId;
      const quantityInput = this.parentElement.querySelector('.quantity-display');
      
      let currentQuantity = parseInt(quantityInput.value);
      
      if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
        
        // Cập nhật session
        updateBasketItemQuantity(itemId, currentQuantity);
        
        // Cập nhật giá item và tổng tiền
        updateCartItemPrice(cartItem, itemId);
        updateCartModalTotal();
        
        // Trigger event để sync với menu
        document.dispatchEvent(new CustomEvent('basketUpdated'));
      }
    });
  });
  
  // Quantity input change
  document.querySelectorAll('.quantity-display').forEach(quantityInput => {
    quantityInput.addEventListener('input', function() {
      const cartItem = this.closest('.cart-item-list');
      const itemId = cartItem.dataset.itemId;
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        value = 1;
      } else if (value > 3) {
        this.value = 3;
        value = 3;
        showToast("Maximum quantity is 3", "error");
      }
      
      // Cập nhật session
      updateBasketItemQuantity(itemId, value);
      
      // Cập nhật giá item và tổng tiền
      updateCartItemPrice(cartItem, itemId);
      updateCartModalTotal();
      
      // Trigger event để sync với menu
      document.dispatchEvent(new CustomEvent('basketUpdated'));
    });
    
    quantityInput.addEventListener('blur', function() {
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 1) {
        this.value = 1;
        const cartItem = this.closest('.cart-item-list');
        const itemId = cartItem.dataset.itemId;
        updateBasketItemQuantity(itemId, 1);
        updateCartItemPrice(cartItem, itemId);
        updateCartModalTotal();
        
        // Trigger event để sync với menu
        document.dispatchEvent(new CustomEvent('basketUpdated'));
      }
    });
  });
  
  // Place order button
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function() {
      // Kiểm tra giỏ hàng có sản phẩm không
      const basket = getBasketFromSession();
      
      if (basket.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
      }
      
      // Đóng modal trước khi chuyển trang
      closeCartModal();
      
      // Chuyển hướng đến trang delivery-information.html
      window.location.href = '/delivery-information.html';
    });
  }
}

// Function để đóng modal cart
function closeCartModal() {
  const modal = document.getElementById('modal-cart');
  if (modal) {
    modal.remove();
  }
  document.body.style.overflow = 'auto';
}

// Function để cập nhật giá của một item trong modal
function updateCartItemPrice(cartItemElement, itemId) {
  const basket = getBasketFromSession();
  const item = basket.find(basketItem => basketItem.id === itemId);
  
  if (item) {
    const totalPriceElement = cartItemElement.querySelector('.item-total-price');
    if (totalPriceElement) {
      totalPriceElement.textContent = `${formatPrice(item.totalPrice)} đ`;
    }
  }
}

// Function để cập nhật tổng tiền trong modal
function updateCartModalTotal() {
  const basket = getBasketFromSession();
  const totalPrice = basket.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const totalPriceElement = document.getElementById('cart-total-price');
  if (totalPriceElement) {
    totalPriceElement.textContent = `${formatPrice(totalPrice)} đ`;
  }
}

// ================== CART CLICK LISTENER ==================

// Function để setup event listener cho card-detail (gọi sau khi tạo card-detail)
export function setupCartDetailClickListener() {
  // Sử dụng event delegation để handle cả card-detail hiện tại và tương lai
  document.addEventListener('click', function(e) {
    // Kiểm tra nếu element được click có class card-detail hoặc là con của card-detail
    const cardDetail = e.target.closest('.card-detail');
    if (cardDetail) {
      e.preventDefault();
      e.stopPropagation();
      showCartModal();
    }
  });
}

// ================== HELPER FUNCTIONS ==================

// Function format price - cần import từ nơi khác hoặc định nghĩa lại
function formatPrice(price) {
  if (!price) return '0 đ';
  return parseInt(price).toLocaleString('vi-VN');
}

// ================== INITIALIZATION ==================

// Function để khởi tạo cart module
export function initCart() {
  setupCartDetailClickListener();
  updateBasketCounter();
}