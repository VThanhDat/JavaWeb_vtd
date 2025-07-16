function logoutAPI() {
  $.ajax({
    url: "/admin/logout",
    method: "POST",
    xhrFields: { withCredentials: true },
    success: function (response) {
      localStorage.setItem("logoutData", response?.data);
      window.location.href = "/admin/login.html";
    },
    error: function (xhr) {
      const msg = xhr.responseJSON?.data;
      showToast(msg, "error");
    },
  });
}

function handleLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logoutAPI();
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  handleLogout();
});
