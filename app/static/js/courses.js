document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("coursesGrid");
  const searchInput = document.getElementById("courseSearch");
  const chips = document.querySelectorAll(".filter-chip");

  if (!grid) return;

  const data = await window.appHelpers.loadMockContent();
  const courses = data.courses || [];
  let activeFilter = "all";
  let query = "";

  const renderCourses = () => {
    const filtered = courses.filter((course) => {
      const matchesFilter = activeFilter === "all" || course.tags.includes(activeFilter);
      const normalizedQuery = query.trim().toLowerCase();
      const haystack = [
        course.title,
        course.shortDescription,
        course.category,
        ...(course.tags || [])
      ].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });

    if (!filtered.length) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="empty-state">
            <i class="bi bi-search-heart"></i>
            <h3>Ничего не найдено</h3>
            <p>Попробуй изменить фильтр или поисковый запрос.</p>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((course) => {
      const enrolled = window.appHelpers.isEnrolled(course.slug);
      return `
        <div class="col-lg-6">
          <article class="course-card reveal-visible">
            <div class="course-card__cover">
              <div class="cover-badge">${course.coverLabel}</div>
              <div class="cover-accent">${course.accent}</div>
              <div class="cover-glow"></div>
            </div>

            <div class="course-card__body">
              <div class="d-flex justify-content-between gap-3 flex-wrap mb-3">
                <div class="course-meta">
                  <span><i class="bi bi-bar-chart-fill"></i> ${course.difficulty}</span>
                  <span><i class="bi bi-clock-history"></i> ${course.duration}</span>
                </div>
                <div class="course-rating">
                  <i class="bi bi-star-fill"></i>
                  ${course.rating}
                </div>
              </div>

              <h3 class="course-card__title">${course.title}</h3>
              <p class="course-card__text">${course.shortDescription}</p>

              <div class="tag-row">
                ${course.tags.map((tag) => `<span class="soft-tag">#${tag}</span>`).join("")}
              </div>

              <div class="course-card__footer">
                <div class="course-stats">
                  <span><i class="bi bi-people-fill"></i> ${course.studentsCount} студентов</span>
                  <span><i class="bi bi-grid-1x2-fill"></i> ${course.modules.length} блока</span>
                </div>
                <a href="/courses/${course.slug}" class="btn ${enrolled ? "btn-outline-light" : "btn-gradient"} rounded-pill px-4">
                  ${enrolled ? "Продолжить" : "Открыть"}
                </a>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join("");
  };

  searchInput?.addEventListener("input", (event) => {
    query = event.target.value;
    renderCourses();
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      renderCourses();
    });
  });

  renderCourses();
});
