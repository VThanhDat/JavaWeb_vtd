import { showToast } from "./toast.js";

function handleChangePasswordSubmit() {
  const form = document.getElementById("changePasswordForm");

  if (!form) {
    console.error("Form changePasswordForm no exists in DOM.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const newPassword = data.newPassword?.trim();

    if (!newPassword || newPassword.length < 6 || newPassword.length > 100) {
      showToast("New password must be between 6 and 100 characters.", "error");
      return;
    }

    changePasswordAPI(data);
  });
}

function changePasswordAPI(data) {
  $.ajax({
    url: "http://localhost:8080/admin/password/change",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(data),
    xhrFields: { withCredentials: true },
    success: function (response) {
      showToast(response?.data, "success");
      document.getElementById("changePasswordForm").reset();
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function setupPasswordToggle(inputId, buttonId, iconId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const icon = document.getElementById(iconId);

  button.addEventListener("click", () => {
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    icon.src = isVisible
      ? "/img/icon/eye-icon.svg"
      : "/img/icon/eye-open-icon.svg";
  });
}

setupPasswordToggle(
  "currentPassword",
  "toggleCurrentPassword",
  "currentEyeIcon"
);
setupPasswordToggle("newPassword", "toggleNewPassword", "newEyeIcon");

document.addEventListener("DOMContentLoaded", function () {
  handleChangePasswordSubmit();
});
