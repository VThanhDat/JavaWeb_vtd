import { showToast } from "./toast.js";

let items = [];
function callApiGetItems(type) {
  $.ajax({
    url: "/api/item",
    method: "GET",
    data: { type },
    xhrFields: { withCredentials: true },
    success: function (response) {
      items = response?.data || [];
      renderItems(items);
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data || "Lỗi không xác định";
      showToast(msg, "error");
    },
  });
}

function renderItems() {
  const tbody = document.getElementById("item-table-body");

  tbody.innerHTML = "";

  if (items.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td colspan="7" style="text-align:center; padding: 20px; font-style: bold; color: #888;">
        Item not found
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }

  items.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${String(index + 1).padStart(3, "0")}</td>
      <td><img src="/${item.image}"></td>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.price.toLocaleString()}đ</td>
      <td>
        <label class="switch">
          <input type="checkbox" ${item.status ? "checked" : ""} disabled>
          <span class="slider"></span>
        </label>
      </td>
      <td>
     <div class="flex flex-row items-center gap-2">
      <span class="text-[#658280] cursor-pointer btn-delete" data-id="${item.id
      }">Delete</span> |
      <span class="text-[#0D6EFD] cursor-pointer btn-edit" data-id="${item.id
      }">Edit</span>
    </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  setupEditButtons();
  setupDeleteButtons();
}

function setupTabToggle() {
  const foodTab = document.querySelector(".food-tab");
  const drinkTab = document.querySelector(".drink-tab");
  const foodText = document.querySelector(".tab-food");
  const drinkText = document.querySelector(".tab-drink");

  function activateTab(type) {
    if (type === "food") {
      foodTab.classList.add("bg-white");
      foodText.classList.remove("text-[#7C7C7C]");
      foodText.classList.add("text-[#292929]");

      drinkTab.classList.remove("bg-white");
      drinkText.classList.remove("text-[#292929]");
      drinkText.classList.add("text-[#7C7C7C]");
    } else {
      drinkTab.classList.add("bg-white");
      drinkText.classList.remove("text-[#7C7C7C]");
      drinkText.classList.add("text-[#292929]");

      foodTab.classList.remove("bg-white");
      foodText.classList.remove("text-[#292929]");
      foodText.classList.add("text-[#7C7C7C]");
    }

    callApiGetItems(type);
  }

  foodTab.addEventListener("click", () => activateTab("food"));
  drinkTab.addEventListener("click", () => activateTab("drink"));

  activateTab("food");
}

function resetModal() {
  isEditMode = false;
  editingItemId = null;

  document.getElementById("itemForm").reset();
  document.getElementById("itemType").value = "food";
  document.getElementById("imagePreview").src =
    "/img/form/landscape-placeholder.svg";
  document.getElementById("fileName").innerText = "";
  document.getElementById("manageItemError").innerText = "";

  document.querySelector(".addModal h1").innerText = "Create New Item";
  document.getElementById("createBtn").innerText = "Create";

  const foodTab = document.querySelector(".modal-tab.food-tab");
  const drinkTab = document.querySelector(".modal-tab.drink-tab");
  const foodText = foodTab.querySelector(".tab-food");
  const drinkText = drinkTab.querySelector(".tab-drink");

  foodTab.classList.add("bg-white");
  foodText.classList.add("text-[#FF6B00]");
  foodText.classList.remove("text-gray-600");

  drinkTab.classList.remove("bg-white");
  drinkText.classList.remove("text-[#FF6B00]");
  drinkText.classList.add("text-gray-600");
}

function closeModal() {
  const modal = document.getElementById("modalOverlay");
  const outerTab = document.getElementById("outerTabContainer");

  modal.classList.add("hidden");
  outerTab?.classList.remove("invisible");
  resetModal();
}

function openModalAdd() {
  const modal = document.getElementById("modalOverlay");
  const openBtn = document.getElementById("openModalBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const outerTab = document.getElementById("outerTabContainer");

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    outerTab?.classList.add("invisible");
  });

  cancelBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const tabs = document.querySelectorAll(".tab-button.outer-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("bg-white");
        t.querySelector("span").classList.remove("text-[#FF6B00]");
        t.querySelector("span").classList.add("text-gray-600");
      });
      tab.classList.add("bg-white");
      tab.querySelector("span").classList.remove("text-gray-600");
      tab.querySelector("span").classList.add("text-[#FF6B00]");
    });
  });
}

// Function Create New Item - Update
let isEditMode = false;
let editingItemId = null;

function handleItemFormSubmit() {
  const form = document.getElementById("itemForm");
  const imageInput = document.getElementById("imageInput");
  const itemNameInput = document.getElementById("itemName");
  const itemDescInput = document.getElementById("itemDesc");
  const itemPriceInput = document.getElementById("itemPrice");
  const createBtn = document.getElementById("createBtn");
  const errorEl = document.getElementById("manageItemError");
  const itemTypeInput = document.getElementById("itemType");

  const chooseFileBtn = document.getElementById("chooseFileBtn");
  const fileNameEl = document.getElementById("fileName");
  const imagePreview = document.getElementById("imagePreview");

  const foodTab = document.querySelector(".modal-tab.food-tab");
  const drinkTab = document.querySelector(".modal-tab.drink-tab");
  const foodText = foodTab.querySelector(".tab-food");
  const drinkText = drinkTab.querySelector(".tab-drink");

  foodTab.addEventListener("click", () => {
    itemTypeInput.value = "food";

    foodTab.classList.add("bg-white");
    foodText.classList.add("text-[#FF6B00]");
    foodText.classList.remove("text-gray-600");

    drinkTab.classList.remove("bg-white");
    drinkText.classList.remove("text-[#FF6B00]");
    drinkText.classList.add("text-gray-600");
  });

  drinkTab.addEventListener("click", () => {
    itemTypeInput.value = "drink";

    drinkTab.classList.add("bg-white");
    drinkText.classList.add("text-[#FF6B00]");
    drinkText.classList.remove("text-gray-600");

    foodTab.classList.remove("bg-white");
    foodText.classList.remove("text-[#FF6B00]");
    foodText.classList.add("text-gray-600");
  });

  chooseFileBtn.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      fileNameEl.innerText = file.name;
      const imageURL = URL.createObjectURL(file);
      imagePreview.src = imageURL;
      imagePreview.onload = () => URL.revokeObjectURL(imageURL);
    }
  });

  createBtn.addEventListener("click", function (e) {
    e.preventDefault();
    errorEl.innerText = "";

    const imageFile = imageInput.files[0];
    const name = itemNameInput.value.trim();
    const desc = itemDescInput.value.trim();
    const price = itemPriceInput.value.trim();
    const type = itemTypeInput.value;

    if (!name) return (errorEl.innerText = "Please enter item name.");
    if (!desc) return (errorEl.innerText = "Please enter description.");
    if (!price || isNaN(price) || Number(price) <= 0)
      return (errorEl.innerText = "Price must be greater than 0.");
    if (!isEditMode && !imageFile)
      return (errorEl.innerText = "Please choose an image.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("type", type);
    if (imageFile) formData.append("image", imageFile);
    if (isEditMode) formData.append("id", editingItemId);

    isEditMode ? callApiUpdateItem(formData) : createItemAPI(formData);
  });
}

function createItemAPI(formData) {
  $.ajax({
    url: "/api/item/add",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      showToast(response?.data, "success");
      closeModal();
      reloadItemList();
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function setupEditButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      callApiGetItemById(id);
    });
  });
}

function callApiGetItemById(id) {
  $.ajax({
    url: `/api/item/${id}`,
    method: "GET",
    xhrFields: { withCredentials: true },
    success: function (response) {
      const item = response.data;
      renderEditItem(item);
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function renderEditItem(item) {
  isEditMode = true;
  editingItemId = item.id;

  document.getElementById("modalOverlay").classList.remove("hidden");

  document.getElementById("itemName").value = item.name;
  document.getElementById("itemDesc").value = item.description;
  document.getElementById("itemPrice").value = item.price;
  document.getElementById("itemType").value = item.type;
  document.getElementById("fileName").innerText = item.image || "";
  document.getElementById("imagePreview").src = "/" + item.image;

  document.querySelector(".addModal h1").innerText = "Edit Item";
  document.getElementById("createBtn").innerText = "Update";

  const foodTab = document.querySelector(".modal-tab.food-tab");
  const drinkTab = document.querySelector(".modal-tab.drink-tab");
  const foodText = foodTab.querySelector(".tab-food");
  const drinkText = drinkTab.querySelector(".tab-drink");

  if (item.type === "drink") {
    foodTab.classList.remove("bg-white");
    foodText.classList.remove("text-[#FF6B00]");
    foodText.classList.add("text-gray-600");

    drinkTab.classList.add("bg-white");
    drinkText.classList.add("text-[#FF6B00]");
    drinkText.classList.remove("text-gray-600");
  } else {
    drinkTab.classList.remove("bg-white");
    drinkText.classList.remove("text-[#FF6B00]");
    drinkText.classList.add("text-gray-600");

    foodTab.classList.add("bg-white");
    foodText.classList.add("text-[#FF6B00]");
    foodText.classList.remove("text-gray-600");
  }
}

function callApiUpdateItem(formData) {
  $.ajax({
    url: "/api/item/update",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      showToast(res?.message, "success");
      closeModal();
      reloadItemList();
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function reloadItemList() {
  const currentType =
    document.querySelector(".tab-button.bg-white")?.innerText.toLowerCase() ||
    "food";
  callApiGetItems(currentType);
}

// Delete
function setupDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      console.log(id);

      if (confirm("Are you sure you want to delete this item?")) {
        callApiDeleteItem(id);
      }
    });
  });
}

function callApiDeleteItem(id) {
  $.ajax({
    url: `/api/item/${id}`,
    method: "DELETE",
    xhrFields: { withCredentials: true },
    success: function (response) {
      showToast(response?.data);
      reloadItemList();
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

// Search
function setupSearchInput() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const query = e.target.value.trim();
      const type = getCurrentActiveType();

      if (query === "") {
        callApiGetItems(type);
      } else {
        callApiSearch(query, type);
      }
    }
  });
}

function getCurrentActiveType() {
  const activeTab = document.querySelector(".tab-button.bg-white");
  if (activeTab?.innerText.toLowerCase().includes("drink")) {
    return "drink";
  }
  return "food";
}

function callApiSearch(query, type) {
  $.ajax({
    url: "/api/item/searchAdmin",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      name: query.trim(),
      type: type,
    }),
    xhrFields: { withCredentials: true },
    success: function (response) {
      items = response?.data || [];
      renderItems();
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data || "Lỗi khi tìm kiếm";
      showToast(msg, "error");
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderItems();
  setupTabToggle();
  openModalAdd();
  handleItemFormSubmit();
  setupSearchInput();
});
