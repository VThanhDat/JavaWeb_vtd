export function createToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "flex flex-col items-start p-0 toast-enter";
  toast.style.cssText =
    "width: 424px; height: 83px; border: 1px solid rgba(0, 0, 0, 0.1); box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15); border-radius: 4px; overflow: hidden; margin-top: 4px;";

  let backgroundColor, iconSrc, title;
  switch (type) {
    case "error":
      backgroundColor = "#DC2626";
      iconSrc = "/img/icon/error-icon.svg";
      title = "Error";
      break;
    case "success":
      backgroundColor = "#17AE30";
      iconSrc = "/img/icon/success-icon.svg";
      title = "Success";
      break;
    case "warning":
      backgroundColor = "#F59E0B";
      iconSrc = "/img/icon/warning-icon.svg";
      title = "Warning";
      break;
  }

  toast.style.background = backgroundColor;

  toast.innerHTML = `
        <div class="flex items-center justify-between px-3 py-2 gap-2 h-10 border-b border-black border-opacity-5" style="background: rgba(255, 255, 255, 0.85); width: 424px;">
          <div class="flex items-center space-x-2">
            <img src="${iconSrc}" />
            <span class="font-medium text-gray-800">${title}</span>
          </div>
          <button class="text-gray-500 hover:text-gray-700 rounded p-1 transition-colors" onclick="closeToast(this)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="flex-1 flex items-center px-3 py-2">
          <div class="flex flex-col items-start p-0 text-white" style="width: 400px; height: 21px; background: rgba(255, 255, 255, 0.000001);">
            <p style="width: 100%; height: 21px; font-family: 'Helvetica Neue'; font-style: normal; font-weight: 400; font-size: 14px; line-height: 150%; color: #FFFFFF; flex: none; order: 0; flex-grow: 0;">${message}</p>
          </div>
        </div>
      `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      closeToast(toast);
    }
  }, 4000);
}

export function closeToast(element) {
  const toast =
    element.closest(".flex.flex-col") || element.parentElement.parentElement;
  toast.classList.remove("toast-enter");
  toast.classList.add("toast-exit");

  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 300);
}

export function showToast(message, type = "success") {
  createToast(message, type);
}

export function showSuccessLogin() {
  const loginData = localStorage.getItem("loginData");
  if (loginData === "Successfully") {
    showToast(loginData, "success");
    localStorage.removeItem("loginData");
  }
}

export function showSuccessLogout() {
  const logoutData = localStorage.getItem("logoutData");
  if (logoutData === "Logout successful") {
    showToast(logoutData, "success");
    localStorage.removeItem("logoutData");
  }
}

window.closeToast = closeToast;
