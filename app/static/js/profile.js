document.addEventListener("DOMContentLoaded", async () => {
  const profileName = document.getElementById("profileName");
  const profileMeta = document.getElementById("profileMeta");
  const profileRole = document.getElementById("profileRole");
  const profileCoursesCount = document.getElementById("profileCoursesCount");
  const profileSolvedCount = document.getElementById("profileSolvedCount");
  const grid = document.getElementById("profileCoursesGrid");
  const emptyState = document.getElementById("profileEmptyState");

  const user = window.appHelpers.getStoredUser();
  const data = await window.appHelpers.loadMockContent();
  const enrollments = window.appHelpers.getEnrollments();
  const enrolledCourses = data.courses.filter((course) => enrollments.includes(course.slug));

  profileName.textContent = user?.username || "Гость";
  profileMeta.textContent = user?.email || "demo@local";
  profileRole.textContent = window.appHelpers.getRoleLabel(user?.role);
  profileCoursesCount.textContent = String(enrolledCourses.length);
  profileSolvedCount.textContent = String(window.appHelpers.getSolvedCount());

  if (!enrolledCourses.length) {
    emptyState.classList.remove("d-none");
    grid.innerHTML = "";
    return;
  }

  emptyState.classList.add("d-none");
  grid.innerHTML = enrolledCourses.map((course) => `
    <div class="col-md-6">
      <article class="course-card course-card--compact reveal-visible">
        <div class="course-card__cover">
          <div class="cover-badge">${course.coverLabel}</div>
          <div class="cover-accent">${course.accent}</div>
          <div class="cover-glow"></div>
        </div>
        <div class="course-card__body">
          <h3 class="course-card__title">${course.title}</h3>
          <p class="course-card__text">${course.shortDescription}</p>
          <div class="course-card__footer">
            <div class="course-stats">
              <span><i class="bi bi-grid-1x2-fill"></i> ${course.modules.length} блока</span>
            </div>
            <a href="/learn/${course.slug}" class="btn btn-gradient rounded-pill px-4">Открыть</a>
          </div>
        </div>
      </article>
    </div>
  `).join("");
});
