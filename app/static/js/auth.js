document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".auth-tab");
  const roleButtons = document.querySelectorAll(".role-option");
  const registerOnlyFields = document.querySelectorAll(".register-only");
  const form = document.getElementById("authForm");
  const submitButton = document.getElementById("authSubmitButton");
  const teacherNote = document.getElementById("teacherNote");
  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");

  let mode = "login";
  let selectedRole = "student";

  const updateMode = (nextMode) => {
    mode = nextMode;
    tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.authMode === mode));
    registerOnlyFields.forEach((field) => field.classList.toggle("d-none", mode !== "register"));
    submitButton.textContent = mode === "login" ? "Войти" : "Создать аккаунт";
  };

  const updateRole = (nextRole) => {
    selectedRole = nextRole;
    roleButtons.forEach((button) => button.classList.toggle("active", button.dataset.role === selectedRole));
    teacherNote.classList.toggle("d-none", selectedRole !== "teacher");
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => updateMode(tab.dataset.authMode)));
  roleButtons.forEach((button) => button.addEventListener("click", () => updateRole(button.dataset.role)));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim() || "student@itmo.ru";
    const username = usernameInput.value.trim() || email.split("@")[0] || "demo_user";
    window.appHelpers.setStoredUser({ id: 1, username, email, role: selectedRole });
    window.appHelpers.showToast(selectedRole === "teacher" ? "Вход выполнен как учитель" : "Вход выполнен как ученик");
    window.location.href = "/courses";
  });
});
