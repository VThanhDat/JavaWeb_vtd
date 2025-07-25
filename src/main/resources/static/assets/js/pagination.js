function renderPaginationControls(totalPages, currentPage, totalItems, fetchPageCallback) {
  const container = document.querySelector(".pagination-total p");
  container.innerText = `Total ${totalItems} items`;

  const paginationContainer = document.querySelector(".pagination-container");
  paginationContainer.innerHTML = "";

  if (totalPages <= 1) {
    return;
  }

  const prevBtn = createPageButton("<", currentPage > 1, () => {
    if (currentPage > 1) fetchPageCallback(currentPage - 1);
  });
  paginationContainer.appendChild(prevBtn);

  const pageList = generatePageList(currentPage, totalPages);
  pageList.forEach(p => {
    if (p === "...") {
      const dot = document.createElement("span");
      dot.innerText = "...";
      dot.className = "pagination-dot border border-gray-400 bg-white px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 ease-in-out text-gray-700 min-w-8 h-8 flex items-center justify-center hover:bg-gray-50 hover:border-gray-500";
      paginationContainer.appendChild(dot);
    } else {
      const btn = createPageButton(
        p,
        true,
        () => fetchPageCallback(p),
        p === currentPage
      );
      paginationContainer.appendChild(btn);
    }
  });

  const nextBtn = createPageButton(">", currentPage < totalPages, () => {
    if (currentPage < totalPages) fetchPageCallback(currentPage + 1);
  });
  paginationContainer.appendChild(nextBtn);
}

function createPageButton(label, enabled, onClick, isActive = false) {
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.disabled = !enabled;
  btn.className = isActive
    ? "border border-orange-500 bg-orange-500 text-white font-medium min-w-8 h-8"
    : "border border-gray-400 bg-white text-gray-700 min-w-8 h-8 hover:bg-gray-50 hover:border-gray-500";
  btn.onclick = onClick;
  return btn;
}

function generatePageList(current, total) {
  if (total <= 1) {
    return [];
  }

  if (total <= 7) {
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  const delta = 2;
  const range = [];
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  
  if (current - delta > 2) range.unshift("...");
  if (current + delta < total - 1) range.push("...");

  range.unshift(1);
  
  if (total > 1) range.push(total);

  return range;
}

function setupPageSizeSelector(onPageSizeChange, fetchPageCallback) {
  const pageSizeSelect = document.querySelector(".custom-select");
  if (pageSizeSelect && onPageSizeChange && fetchPageCallback) {
    pageSizeSelect.addEventListener("change", function () {
      const newPageSize = parseInt(this.value);
      onPageSizeChange(newPageSize);
      fetchPageCallback(1, newPageSize);
    });
  }
}

export {
  renderPaginationControls,
  createPageButton,
  generatePageList,
  setupPageSizeSelector
};