import { showToast } from "./toast.js";

function handleChangePasswordSubmit() {
  const form = document.getElementById("changePasswordForm");
  const currentPasswordInput = form.querySelector("input[name='currentPassword']");
  const newPasswordInput = form.querySelector("input[name='newPassword']");
  const changePasswordButton = form.querySelector("button[type='submit']");
  const errorEl = document.getElementById("changePasswordError");

  if (!form || !changePasswordButton) {
    console.error("Change password form or button does not exist.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPassword = newPasswordInput.value.trim();
    const currentPassword = currentPasswordInput.value.trim();

    errorEl.innerText = "";

    if (!newPassword && !currentPassword) {
      errorEl.innerText = "Please input current password - please input new password";
      clearInputs();
      return;
    }

    if (!newPassword) {
      errorEl.innerText = "Please input new password";
      clearInputs();
      return;
    }

    if (!currentPassword) {
      errorEl.innerText = "Please input current password";
      clearInputs();
      return;
    }

    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    changePasswordAPI(data);
  });


  function clearInputs() {
    currentPasswordInput.value = "";
    newPasswordInput.value = "";
  }
}

function changePasswordAPI(data) {
  $.ajax({
    url: "http://localhost:8080/admin/password/change",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
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
