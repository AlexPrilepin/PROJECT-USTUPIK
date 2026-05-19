document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("coursesGrid");
  const searchInput = document.getElementById("courseSearch");
  const filterButtons = document.querySelectorAll(".filter-chip");
  const data = await window.appHelpers.loadMockContent();

  let activeFilter = "all";
  let searchValue = "";

  const matchesCourse = (course) => {
    const haystack = [course.title, course.shortDescription, course.category, course.accent, ...course.tags].join(" ").toLowerCase();
    const bySearch = haystack.includes(searchValue.toLowerCase());
    const byFilter = activeFilter === "all" || course.tags.includes(activeFilter);
    return bySearch && byFilter;
  };

  const renderCourses = () => {
    const courses = data.courses.filter(matchesCourse);

    if (!courses.length) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="empty-state glass-card reveal-visible">
            <i class="bi bi-search-heart"></i>
            <h3>Ничего не найдено</h3>
            <p>Попробуй другой запрос или сбрось фильтр.</p>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = courses.map((course) => {
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
              <div class="tag-row mb-3">
                <span class="soft-tag"><i class="bi bi-bar-chart-fill"></i> ${course.difficulty}</span>
                <span class="soft-tag"><i class="bi bi-clock-fill"></i> ${course.duration}</span>
                <span class="soft-tag"><i class="bi bi-star-fill"></i> ${course.rating}</span>
              </div>
              <h2 class="course-card__title">${course.title}</h2>
              <p class="course-card__text">${course.shortDescription}</p>
              <div class="course-card__footer">
                <div class="course-stats">
                  <span><i class="bi bi-people-fill"></i> ${course.studentsCount}</span>
                  <span><i class="bi bi-grid-1x2-fill"></i> ${course.modules.length} блока</span>
                </div>
                <a href="/courses/${course.slug}" class="btn ${enrolled ? "btn-gradient" : "btn-outline-light"} rounded-pill px-4">
                  ${enrolled ? "Продолжить" : "Подробнее"}
                </a>
              </div>
            </div>
          </article>
        </div>
      `;
    }).join("");
  };

  searchInput.addEventListener("input", (event) => {
    searchValue = event.target.value.trim();
    renderCourses();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderCourses();
    });
  });

  renderCourses();
});
