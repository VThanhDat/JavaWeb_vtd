const passwordInput = document.getElementById("password");
const togglePasswordIcon = document.getElementById("togglePassword");

let isPasswordVisible = false;

togglePasswordIcon.addEventListener("click", function () {
  isPasswordVisible = !isPasswordVisible;
  if (isPasswordVisible) {
    passwordInput.type = "text";
    togglePasswordIcon.src = "/img/icon/eye-open-icon.svg";
  } else {
    passwordInput.type = "password";
    togglePasswordIcon.src = "/img/icon/eye-icon.svg";
  }
});
