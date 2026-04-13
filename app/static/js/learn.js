document.addEventListener("DOMContentLoaded", async () => {
  const root = document.getElementById("learnRoot");
  if (!root) return;

  const slug = document.body.dataset.courseSlug;
  const data = await window.appHelpers.loadMockContent();
  const course = data.courses.find((item) => item.slug === slug);

  if (!course) {
    root.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-journal-x"></i>
        <h3>Курс не найден</h3>
        <p>Либо такого slug нет, либо моковые данные не загрузились.</p>
      </div>
    `;
    return;
  }

  if (!window.appHelpers.isEnrolled(course.slug)) {
    root.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-lock-fill"></i>
        <h3>Сначала запишись на курс</h3>
        <p>После записи курс станет доступен для прохождения.</p>
        <a href="/courses/${course.slug}" class="btn btn-gradient rounded-pill px-4">Открыть страницу курса</a>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="glass-card learn-head mb-4">
      <div class="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <p class="section-kicker mb-2">Прохождение курса</p>
          <h1 class="section-title mb-2">${course.title}</h1>
          <p class="text-secondary mb-0">Слева список блоков, справа содержимое выбранного блока.</p>
        </div>
        <a href="/profile" class="btn btn-outline-light rounded-pill px-4">В профиль</a>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4 col-xl-3">
        <aside class="glass-card learn-sidebar" id="moduleList"></aside>
      </div>
      <div class="col-lg-8 col-xl-9">
        <section class="glass-card learn-content" id="moduleContent"></section>
      </div>
    </div>
  `;

  const moduleList = document.getElementById("moduleList");
  const moduleContent = document.getElementById("moduleContent");
  let activeModuleId = course.modules[0]?.id;

  const getVerdict = (solution) => {
    const text = solution.toLowerCase();
    const hasDef = text.includes("def is_palindrome");
    const hasReturn = text.includes("return");
    const hasComparison = text.includes("[::-1]") || text.includes("==") || text.includes("reversed");
    const hasLower = text.includes("lower()");
    const score = [hasDef, hasReturn, hasComparison, hasLower].filter(Boolean).length;

    if (score >= 4) {
      return {
        label: "Accepted",
        style: "success",
        message: "Похоже на уверенное решение: структура функции, возврат значения и логика проверки на месте."
      };
    }

    if (score >= 2) {
      return {
        label: "Needs improvement",
        style: "warning",
        message: "Есть хорошее начало, но решение ещё выглядит неполным. Добавь более явную логику сравнения и обработку регистра."
      };
    }

    return {
      label: "Wrong answer",
      style: "danger",
      message: "Сейчас проверка не видит достаточно признаков корректного решения. Попробуй оформить именно функцию на Python."
    };
  };

  const renderSidebar = () => {
    moduleList.innerHTML = `
      <div class="sidebar-title-wrap">
        <p class="section-kicker mb-2">Содержание</p>
        <h2 class="section-title mb-0">Блоки курса</h2>
      </div>
      <div class="module-nav">
        ${course.modules.map((module) => `
          <button type="button" class="module-nav__item ${module.id === activeModuleId ? "active" : ""}" data-module-id="${module.id}">
            <span class="module-nav__icon">
              <i class="bi ${module.type === "theory" ? "bi-file-earmark-richtext-fill" : "bi-code-square"}"></i>
            </span>
            <span class="module-nav__content">
              <strong>${module.title}</strong>
              <small>${module.duration}</small>
            </span>
          </button>
        `).join("")}
      </div>
    `;

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
        <h2 class="content-title">${module.title}</h2>
        <div class="theory-flow">
          ${module.content.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
      `;
      return;
    }

    moduleContent.innerHTML = `
      <div class="content-head">
        <span class="meta-pill"><i class="bi bi-code-square"></i> Практика</span>
        <span class="meta-pill"><i class="bi bi-clock-fill"></i> ${module.duration}</span>
      </div>
      <h2 class="content-title">${module.taskTitle}</h2>
      <p class="task-description">${module.taskDescription}</p>

      <div class="hint-box">
        <h3>На что смотрит демо-проверка</h3>
        <ul>
          ${module.successTips.map((tip) => `<li>${tip}</li>`).join("")}
        </ul>
      </div>

      <form id="practiceForm" class="practice-form">
        <label class="form-label">Твоё решение</label>
        <textarea class="form-control" id="practiceSolution" rows="12" placeholder="${module.inputHint}"></textarea>
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-3">
          <span class="text-secondary">В реальной версии тут будет запрос на backend и запись в submissions.</span>
          <button type="submit" class="btn btn-gradient rounded-pill px-4">
            <i class="bi bi-send-fill me-2"></i>
            Отправить решение
          </button>
        </div>
      </form>

      <div id="verdictCard" class="verdict-card d-none mt-4"></div>
    `;

    const form = document.getElementById("practiceForm");
    const textarea = document.getElementById("practiceSolution");
    const verdictCard = document.getElementById("verdictCard");

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const solution = textarea.value.trim();
      const verdict = getVerdict(solution);

      verdictCard.className = `verdict-card verdict-card--${verdict.style} mt-4`;
      verdictCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
          <div>
            <p class="verdict-label">${verdict.label}</p>
            <h3 class="verdict-title">Вердикт демо-проверки</h3>
          </div>
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
