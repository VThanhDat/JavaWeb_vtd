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
