document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("learnRoot");
  const slug = document.body.dataset.courseSlug;
  const data = await window.appHelpers.loadMockContent();
  const course = data.courses.find((item) => item.slug === slug);

  if (!course) {
    root.innerHTML = `
      <div class="empty-state glass-card reveal-visible">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <h1>Курс не найден</h1>
        <a href="/courses" class="btn btn-gradient rounded-pill px-4">К курсам</a>
      </div>
    `;
    return;
  }

  if (!window.appHelpers.isEnrolled(course.slug)) {
    window.appHelpers.enrollCourse(course.slug);
  }

  let activeModuleId = course.modules[0].id;

  root.innerHTML = `
    <div class="learn-shell">
      <aside class="learn-sidebar reveal-visible">
        <div class="learn-head">
          <span class="section-kicker"><i class="bi bi-play-circle-fill"></i> Прохождение</span>
          <h1 class="section-title mt-3 mb-2">${course.title}</h1>
          <p class="mb-0">Выбери блок слева и двигайся по курсу.</p>
        </div>
        <div class="module-nav" id="moduleList"></div>
      </aside>
      <article class="learn-content reveal-visible" id="moduleContent"></article>
    </div>
  `;

  const moduleList = document.getElementById("moduleList");
  const moduleContent = document.getElementById("moduleContent");

  const getVerdict = (solution) => {
    const normalized = solution.toLowerCase();
    const hasFunction = normalized.includes("def is_palindrome");
    const hasReturn = normalized.includes("return");
    const hasReverse = normalized.includes("[::-1]") || normalized.includes("reversed");
    const hasLower = normalized.includes("lower") || normalized.includes("casefold");

    if (hasFunction && hasReturn && hasReverse && hasLower) {
      return { label: "Accepted", style: "success", message: "Демо-проверка видит функцию, return, нормализацию регистра и сравнение с перевёрнутой строкой." };
    }

    if (solution.trim().length < 20) {
      return { label: "Rejected", style: "danger", message: "Решение слишком короткое. Добавь функцию, аргумент text и return." };
    }

    return { label: "Wrong Answer", style: "warning", message: "Решение отправлено, но демо-проверка не нашла все ожидаемые элементы." };
  };

  const renderSidebar = () => {
    moduleList.innerHTML = course.modules.map((module) => `
      <button type="button" class="module-nav__item ${module.id === activeModuleId ? "active" : ""}" data-module-id="${module.id}">
        <span class="module-nav__icon"><i class="bi ${module.type === "theory" ? "bi-file-earmark-richtext-fill" : "bi-code-square"}"></i></span>
        <span class="module-nav__content"><strong>${module.title}</strong><small>${module.duration}</small></span>
      </button>
    `).join("");

    moduleList.querySelectorAll(".module-nav__item").forEach((button) => {
      button.addEventListener("click", () => {
        activeModuleId = Number(button.dataset.moduleId);
        renderSidebar();
        renderContent();
      });
    });
  };

  const renderContent = () => {
    const module = course.modules.find((item) => item.id === activeModuleId);
    if (!module) return;

    if (module.type === "theory") {
      moduleContent.innerHTML = `
        <div class="content-head">
          <span class="meta-pill"><i class="bi bi-file-earmark-richtext-fill"></i> Теория</span>
          <span class="meta-pill"><i class="bi bi-clock-fill"></i> ${module.duration}</span>
        </div>
        <h2 class="content-title mt-4">${module.title}</h2>
        <div class="theory-flow">${module.content.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
      `;
      return;
    }

    moduleContent.innerHTML = `
      <div class="content-head">
        <span class="meta-pill"><i class="bi bi-code-square"></i> Практика</span>
        <span class="meta-pill"><i class="bi bi-clock-fill"></i> ${module.duration}</span>
      </div>
      <h2 class="content-title mt-4">${module.taskTitle}</h2>
      <p class="task-description">${module.taskDescription}</p>
      <div class="hint-box">
        <h3>Что ждёт демо-проверка</h3>
        <ul>${module.successTips.map((tip) => `<li>${tip}</li>`).join("")}</ul>
      </div>
      <form id="practiceForm" class="practice-form">
        <label class="form-label">Твоё решение</label>
        <textarea class="form-control" id="practiceSolution" rows="12" placeholder="${module.inputHint}"></textarea>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
          <span class="text-secondary">Позже здесь будет POST /api/submissions и запись в таблицу submissions.</span>
          <button type="submit" class="btn btn-gradient rounded-pill px-4"><i class="bi bi-send-fill me-2"></i> Отправить решение</button>
        </div>
      </form>
      <div id="verdictCard" class="verdict-card d-none mt-4"></div>
    `;

    document.getElementById("practiceForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const solution = document.getElementById("practiceSolution").value.trim();
      const verdict = getVerdict(solution);
      const verdictCard = document.getElementById("verdictCard");

      verdictCard.className = `verdict-card verdict-card--${verdict.style} mt-4`;
      verdictCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div><p class="verdict-label">${verdict.label}</p><h3 class="verdict-title">Вердикт демо-проверки</h3></div>
          <span class="soft-tag soft-tag--large">${new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <p class="mb-0">${verdict.message}</p>
      `;
      verdictCard.classList.remove("d-none");

      if (verdict.label === "Accepted") {
        window.appHelpers.incrementSolvedCount();
      }

      window.appHelpers.showToast(`Решение отправлено. Вердикт: ${verdict.label}`);
    });
  };

  renderSidebar();
  renderContent();
});
