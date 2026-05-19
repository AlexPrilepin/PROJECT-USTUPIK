document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("courseDetailRoot");
  const slug = document.body.dataset.courseSlug;
  const data = await window.appHelpers.loadMockContent();
  const course = data.courses.find((item) => item.slug === slug);

  if (!course) {
    root.innerHTML = `
      <div class="empty-state glass-card reveal-visible">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <h1>Курс не найден</h1>
        <p>Проверь slug курса или вернись в каталог.</p>
        <a href="/courses" class="btn btn-gradient rounded-pill px-4">К курсам</a>
      </div>
    `;
    return;
  }

  const render = () => {
    const enrolled = window.appHelpers.isEnrolled(course.slug);
    root.innerHTML = `
      <div class="detail-grid">
        <div class="detail-hero reveal-visible">
          <div class="eyebrow mb-3"><i class="bi bi-stars"></i> ${course.coverLabel}</div>
          <h1 class="detail-title mb-3">${course.title}</h1>
          <p class="detail-description">${course.fullDescription}</p>
          <div class="tag-cloud my-4">
            ${course.skills.map((skill) => `<span class="soft-tag"><i class="bi bi-check2-circle"></i> ${skill}</span>`).join("")}
          </div>
          <div class="d-flex flex-wrap gap-3">
            <button type="button" class="btn btn-gradient rounded-pill px-4" id="enrollButton">
              <i class="bi ${enrolled ? "bi-play-fill" : "bi-plus-circle-fill"} me-2"></i>
              ${enrolled ? "Открыть курс" : "Записаться и начать"}
            </button>
            <a href="/profile" class="btn btn-outline-light rounded-pill px-4">Профиль</a>
          </div>
        </div>
        <aside class="detail-side reveal-visible">
          <h2 class="section-title mb-3">Что внутри</h2>
          <div class="meta-row mb-4">
            <span class="meta-pill"><i class="bi bi-clock-fill"></i> ${course.duration}</span>
            <span class="meta-pill"><i class="bi bi-bar-chart-fill"></i> ${course.difficulty}</span>
            <span class="meta-pill"><i class="bi bi-grid-1x2-fill"></i> ${course.modules.length} блока</span>
          </div>
          <ul class="outcome-list">
            ${course.outcomes.map((outcome) => `<li><i class="bi bi-check-circle-fill"></i><span>${outcome}</span></li>`).join("")}
          </ul>
        </aside>
      </div>
    `;

    document.getElementById("enrollButton").addEventListener("click", () => {
      if (!window.appHelpers.isEnrolled(course.slug)) {
        window.appHelpers.enrollCourse(course.slug);
        window.appHelpers.showToast("Ты записался на курс");
      }
      window.location.href = `/learn/${course.slug}`;
    });
  };

  render();
});
