const APP_STORAGE_KEYS = {
  user: "itmo-platform-user",
  enrollments: "itmo-platform-enrollments",
  solved: "itmo-platform-solved-count"
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.user)) || null;
  } catch (error) {
    return null;
  }
}

function setStoredUser(user) {
  localStorage.setItem(APP_STORAGE_KEYS.user, JSON.stringify(user));
}

function getEnrollments() {
  try {
    return JSON.parse(localStorage.getItem(APP_STORAGE_KEYS.enrollments)) || [];
  } catch (error) {
    return [];
  }
}

function saveEnrollments(enrollments) {
  localStorage.setItem(APP_STORAGE_KEYS.enrollments, JSON.stringify(enrollments));
}

function isEnrolled(slug) {
  return getEnrollments().includes(slug);
}

function enrollToCourse(slug) {
  const enrollments = getEnrollments();
  if (!enrollments.includes(slug)) {
    enrollments.push(slug);
    saveEnrollments(enrollments);
  }
}

function getSolvedCount() {
  const value = Number(localStorage.getItem(APP_STORAGE_KEYS.solved) || "0");
  return Number.isNaN(value) ? 0 : value;
}

function incrementSolvedCount() {
  localStorage.setItem(APP_STORAGE_KEYS.solved, String(getSolvedCount() + 1));
}

async function loadMockContent() {
  const response = await fetch("/static/data/mock-content.json");
  if (!response.ok) {
    throw new Error("Не удалось загрузить mock-content.json");
  }
  return response.json();
}

function getRoleLabel(role) {
  if (role === "teacher") return "Учитель";
  if (role === "student") return "Ученик";
  return "Гость";
}

function showToast(message) {
  const body = document.getElementById("appToastBody");
  const toastNode = document.getElementById("appToast");
  if (!body || !toastNode || typeof bootstrap === "undefined") return;
  body.textContent = message;
  bootstrap.Toast.getOrCreateInstance(toastNode).show();
}

function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
      }
    });
  }, { threshold: 0.14 });

  items.forEach((item) => observer.observe(item));
}

function applyNavRole() {
  const roleChip = document.getElementById("navRoleChip");
  const user = getStoredUser();
  if (!roleChip) return;
  roleChip.innerHTML = `<i class="bi bi-person-badge"></i><span>${getRoleLabel(user?.role)}</span>`;
}

function setActiveNavLink() {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.startsWith(href) && href !== "/") {
      link.classList.add("active");
    }
  });
}

function addPointerGlow() {
  const cards = document.querySelectorAll(".glass-card, .course-card, .hero-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
  });
}

window.appHelpers = {
  loadMockContent,
  getStoredUser,
  setStoredUser,
  getEnrollments,
  isEnrolled,
  enrollToCourse,
  getSolvedCount,
  incrementSolvedCount,
  getRoleLabel,
  showToast
};

document.addEventListener("DOMContentLoaded", () => {
  revealOnScroll();
  applyNavRole();
  setActiveNavLink();
  addPointerGlow();
});
