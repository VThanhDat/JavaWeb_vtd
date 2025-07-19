import { showToast } from "./toast.js";

function handleAddItemSubmit() {}

let items = [];
function callApiGetItems(type) {
  $.ajax({
    url: "/api/item",
    method: "GET",
    data: { type }, // hoặc data: { type: type }
    xhrFields: { withCredentials: true },
    success: function (response) {
      items = response?.data || [];
      renderItems(items); // Gọi hàm render danh sách
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

  items.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${String(index + 1).padStart(3, "0")}</td>
      <td><img src="/${
        item.image
      }" width="40" height="40" style="border-radius:6px;"></td>
      <td>${item.name}</td>
      <td>${item.description}</td>
      <td>${item.price.toLocaleString()} đ</td>
      <td>
        <label class="switch">
          <input type="checkbox" ${item.status ? "checked" : ""} disabled>
          <span class="slider"></span>
        </label>
      </td>
      <td>
        <div class="flex flex-row items-center gap-2">
          <span class="text-[#658280] cursor-pointer">Delete</span> |
          <span class="text-[#0D6EFD] cursor-pointer">Edit</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
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

document.addEventListener("DOMContentLoaded", function () {
  renderItems();
  setupTabToggle();
});
