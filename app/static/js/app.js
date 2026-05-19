const APP_STORAGE_KEYS = {
  user: "ustupik:user",
  enrollments: "ustupik:enrollments",
  solvedCount: "ustupik:solved-count"
};

const getJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
};

const loadMockContent = async () => getJson("/static/data/mock-content.json");

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStoredUser = () => readStorage(APP_STORAGE_KEYS.user, null);

const setStoredUser = (user) => {
  writeStorage(APP_STORAGE_KEYS.user, user);
  syncNavbarRole();
};

const getEnrollments = () => readStorage(APP_STORAGE_KEYS.enrollments, []);

const setEnrollments = (slugs) => writeStorage(APP_STORAGE_KEYS.enrollments, Array.from(new Set(slugs)));

const isEnrolled = (slug) => getEnrollments().includes(slug);

const enrollCourse = (slug) => {
  const next = [...getEnrollments(), slug];
  setEnrollments(next);
};

const getSolvedCount = () => Number(localStorage.getItem(APP_STORAGE_KEYS.solvedCount) || "0");

const incrementSolvedCount = () => {
  const nextValue = getSolvedCount() + 1;
  localStorage.setItem(APP_STORAGE_KEYS.solvedCount, String(nextValue));
  return nextValue;
};

const getRoleLabel = (role) => {
  if (role === "teacher") return "Учитель";
  if (role === "student") return "Ученик";
  return "Гость";
};

const showToast = (message) => {
  const toastElement = document.getElementById("appToast");
  const bodyElement = document.getElementById("appToastBody");
  if (!toastElement || !bodyElement || !window.bootstrap) return;
  bodyElement.textContent = message;
  window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 2800 }).show();
};

const syncNavbarRole = () => {
  const chip = document.getElementById("navRoleChip");
  if (!chip) return;
  const user = getStoredUser();
  chip.querySelector("span").textContent = getRoleLabel(user?.role);
};

const setupRevealAnimations = () => {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  elements.forEach((element) => observer.observe(element));
};

const setupPointerGlow = () => {
  document.querySelectorAll(".glass-card, .hero-banner, .course-card, .detail-hero, .detail-side, .auth-card, .profile-head, .learn-sidebar, .learn-content").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      element.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
};

window.appHelpers = {
  APP_STORAGE_KEYS,
  loadMockContent,
  getStoredUser,
  setStoredUser,
  getEnrollments,
  setEnrollments,
  isEnrolled,
  enrollCourse,
  getSolvedCount,
  incrementSolvedCount,
  getRoleLabel,
  showToast
};

document.addEventListener("DOMContentLoaded", () => {
  syncNavbarRole();
  setupRevealAnimations();
  setupPointerGlow();
});
