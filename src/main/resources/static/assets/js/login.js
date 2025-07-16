function showHidePassword() {
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
}

function handleLogin() {
  const container = document.getElementById("loginForm");
  const usernameInput = container.querySelector("input[name='username']");
  const passwordInput = container.querySelector("input[name='password']");
  const loginButton = container.querySelector("button[type='submit']");
  const errorEl = document.getElementById("loginError");

  if (!container || !loginButton) {
    console.error("Login form container hoặc button không tồn tại.");
    return;
  }

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    errorEl.innerText = "";

    if (!username && !password) {
      errorEl.innerText = "Please input account - please input password";
      clearInputs();
      return;
    }

    if (!username) {
      errorEl.innerText = "Please input account";
      clearInputs();
      return;
    }

    if (!password) {
      errorEl.innerText = "Please input password";
      clearInputs();
      return;
    }

    const data = {
      username: username,
      password: password
    };

    loginAPI(data);
  });

  function clearInputs() {
    usernameInput.value = "";
    passwordInput.value = "";
  }
}

function loginAPI(data) {
  $.ajax({
    url: "/admin/login",
    method: "POST",
    data: {
      username: data.username,
      password: data.password
    },
    xhrFields: { withCredentials: true },
    success: function (response) {
      localStorage.setItem("loginData", response?.data);
      window.location.href = "/admin/dashboard.html";
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data || "Đăng nhập thất bại";
      showToast(msg, "error");
    }
  });
}

function showToast(message, type = "info") {
  alert(`${message}`);
}

document.addEventListener("DOMContentLoaded", function () {
  showHidePassword();
  handleLogin();
});
