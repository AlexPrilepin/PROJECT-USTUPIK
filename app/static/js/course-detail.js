document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("courseDetailRoot");
  if (!root) return;

  const slug = document.body.dataset.courseSlug;
  const data = await window.appHelpers.loadMockContent();
  const course = data.courses.find((item) => item.slug === slug);

  if (!course) {
    root.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-exclamation-diamond"></i>
        <h3>Курс не найден</h3>
        <p>Похоже, такого курса пока нет в mock-данных.</p>
        <a href="/courses" class="btn btn-gradient rounded-pill px-4">Вернуться к курсам</a>
      </div>
    `;
    return;
  }

  const enrolled = window.appHelpers.isEnrolled(course.slug);

  root.innerHTML = `
    <div class="detail-hero glass-card mb-4">
      <div class="row g-4 align-items-center">
        <div class="col-lg-8">
          <div class="eyebrow mb-3">
            <i class="bi bi-book-half"></i>
            ${course.category}
          </div>
          <h1 class="detail-title mb-3">${course.title}</h1>
          <p class="detail-description mb-4">${course.fullDescription}</p>

          <div class="meta-row mb-4">
            <span class="meta-pill"><i class="bi bi-bar-chart-fill"></i> ${course.difficulty}</span>
            <span class="meta-pill"><i class="bi bi-clock-fill"></i> ${course.duration}</span>
            <span class="meta-pill"><i class="bi bi-star-fill"></i> ${course.rating}</span>
            <span class="meta-pill"><i class="bi bi-collection-play-fill"></i> ${course.modules.length} блока</span>
          </div>

          <div class="d-flex gap-3 flex-wrap">
            <button class="btn btn-gradient btn-lg rounded-pill px-4" id="enrollButton">
              <i class="bi ${enrolled ? "bi-play-circle-fill" : "bi-person-plus-fill"} me-2"></i>
              ${enrolled ? "Перейти к прохождению" : "Записаться на курс"}
            </button>
            <a href="/courses" class="btn btn-outline-light btn-lg rounded-pill px-4">Назад к каталогу</a>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="detail-side glass-card">
            <h3 class="mb-3">Ты получишь</h3>
            <div class="vstack gap-2">
              ${course.outcomes.map((outcome) => `
                <div class="check-line">
                  <i class="bi bi-check2-circle"></i>
                  <span>${outcome}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-7">
        <div class="glass-card h-100">
          <p class="section-kicker mb-2">Описание модулей</p>
          <h2 class="section-title mb-4">Что внутри курса</h2>
          <div class="vstack gap-3">
            ${course.modules.map((module) => `
              <div class="module-preview">
                <div class="module-preview__index">${module.position}</div>
                <div class="flex-grow-1">
                  <h3>${module.title}</h3>
                  <p>${module.type === "theory" ? "Теоретический блок с текстовым контентом." : "Практический блок с условием, полем отправки и вердиктом."}</p>
                </div>
                <span class="soft-tag">${module.duration}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="glass-card h-100">
          <p class="section-kicker mb-2">Навыки</p>
          <h2 class="section-title mb-4">Что прокачаешь</h2>
          <div class="tag-cloud">
            ${course.skills.map((skill) => `<span class="soft-tag soft-tag--large">${skill}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  const enrollButton = document.getElementById("enrollButton");
  enrollButton?.addEventListener("click", () => {
    if (!window.appHelpers.isEnrolled(course.slug)) {
      window.appHelpers.enrollToCourse(course.slug);
      window.appHelpers.showToast("Ты записался на курс.");
    }
    window.location.href = `/learn/${course.slug}`;
  });
});
