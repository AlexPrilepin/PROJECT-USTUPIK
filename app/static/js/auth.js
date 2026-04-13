document.addEventListener("DOMContentLoaded", () => {
  const roleOptions = document.querySelectorAll(".role-option");
  const tabButtons = document.querySelectorAll(".auth-tabs .nav-link");
  const panes = document.querySelectorAll(".auth-pane");
  const loginRole = document.getElementById("loginRole");
  const registerRole = document.getElementById("registerRole");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  let currentRole = "student";

  const setRole = (role) => {
    currentRole = role;
    loginRole.value = role;
    registerRole.value = role;
    roleOptions.forEach((button) => {
      button.classList.toggle("active", button.dataset.role === role);
    });
  };

  roleOptions.forEach((button) => {
    button.addEventListener("click", () => setRole(button.dataset.role));
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((item) => item.classList.remove("active"));
      panes.forEach((pane) => pane.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.target)?.classList.add("active");
    });
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    window.appHelpers.setStoredUser({
      username: String(formData.get("email")).split("@")[0],
      email: formData.get("email"),
      role: formData.get("role")
    });
    window.appHelpers.showToast("Вход выполнен. Добро пожаловать!");
    window.location.href = "/courses";
  });

  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    window.appHelpers.setStoredUser({
      username: formData.get("username"),
      email: formData.get("email"),
      role: formData.get("role")
    });
    window.appHelpers.showToast("Аккаунт создан в демо-режиме.");
    window.location.href = "/courses";
  });

  setRole(currentRole);
});
