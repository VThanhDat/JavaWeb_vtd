document.addEventListener("DOMContentLoaded", function () {
    const loginData = localStorage.getItem("loginData");
    if (loginData == "Successfully") {
        showToast(loginData, "success");
        localStorage.removeItem("loginData");
    }
});

function showToast(message, type = "info") {
    alert(`[${type.toUpperCase()}] ${message}`);
}