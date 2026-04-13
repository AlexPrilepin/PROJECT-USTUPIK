# Architecture Overview

## Общая идея

Проект строится как Flask-приложение с разделением на:

- presentation layer — шаблоны, CSS, JS;
- routing layer — blueprint-маршруты;
- service layer — бизнес-логика;
- data layer — SQLAlchemy-модели и БД;
- infrastructure layer — CI, Docker, env-конфиги.

Сейчас полноценно реализован именно **frontend**, а backend дан как **архитектурный scaffold**.

## Описание файлов и идеи реализации

### `run.py`
Точка запуска Flask-приложения.

### `app/__init__.py`
Фабрика приложения `create_app()`. Позже сюда стоит добавить инициализацию расширений и регистрацию всех blueprint.

### `app/config.py`
Конфигурация проекта: секретный ключ, URL базы, debug-флаги, лимиты и настройки окружения.

### `app/extensions.py`
Будущая точка подключения `SQLAlchemy`, `Migrate`, `LoginManager`, CSRF и других расширений.

### `app/routes/pages.py`
Маршруты для рендера страниц:
- `/login`
- `/courses`
- `/courses/<slug>`
- `/profile`
- `/learn/<slug>`

### `app/routes/auth.py`
Здесь позже будет регистрация, вход, выход, работа с ролями и Flask-Login.

### `app/routes/courses.py`
Список курсов, запись на курс, выдача структуры модулей.

### `app/routes/profile.py`
Профиль пользователя, мои курсы, мои посылки, прогресс.

### `app/routes/api.py`
REST API для frontend-а: курсы, модули, посылки, профиль.

### `app/services/auth_service.py`
Валидация пользователя, хеширование паролей, логика входа.

### `app/services/course_service.py`
Бизнес-логика курсов: получить курс, записать студента, отдать прогресс, проверить доступ.

### `app/services/submission_service.py`
Логика приёма решения, запуска проверки, сохранения вердикта и выдачи истории.

### `app/models/user.py`
Будущая модель пользователя: username, email, password_hash, role.

### `app/models/course.py`
Будущая модель курса: title, slug, descriptions, difficulty, author_id.

### `app/models/module.py`
Модель блока курса: type, position, theory_content, practice_prompt.

### `app/models/enrollment.py`
Связь пользователя и курса: статус, прогресс, дата записи.

### `app/models/submission.py`
Посылки решений: user, module, text, verdict, feedback, created_at.

### `app/templates/base.html`
Общий layout, navbar, footer, toast, подключение CSS и JS.

### `app/templates/login.html`
Экран входа и регистрации с переключателем ролей student / teacher.

### `app/templates/courses.html`
Каталог курсов: hero, поиск, фильтры и карточки курсов.

### `app/templates/course_detail.html`
Подробная страница курса с описанием, навыками и записью.

### `app/templates/profile.html`
Профиль пользователя и карточки его записанных курсов.

### `app/templates/learn.html`
Экран прохождения: sidebar модулей + контент выбранного блока.

### `app/static/css/style.css`
Главный визуальный файл. Содержит дизайн-систему, анимации, glassmorphism, responsive-сетку.

### `app/static/js/app.js`
Общие helper-функции: localStorage, toast, mock-data loader, reveal-анимации.

### `app/static/js/auth.js`
Логика страницы логина: переключение роли, tabs, демо-вход.

### `app/static/js/courses.js`
Фильтрация, поиск и рендер списка курсов.

### `app/static/js/course-detail.js`
Отрисовка страницы курса и запись на него.

### `app/static/js/profile.js`
Отрисовка профиля и списка записанных курсов.

### `app/static/js/learn.js`
Рендер теории и практики, демо-отправка решения, отображение вердикта.

### `app/static/data/mock-content.json`
Моковые данные UI. Позже можно заменить реальными API-ответами.

### `docs/database.md`
Схема БД и связи сущностей.

### `docs/api-contract.md`
Контракт будущего API.

### `tests/test_frontend_structure.py`
Проверка наличия ключевых файлов, шаблонов, CSS и JS.

### `tests/test_mock_content.py`
Проверка мокового курса и наличия theory + practice.

## Рекомендуемый следующий шаг по backend

1. Подключить Flask-SQLAlchemy и Flask-Migrate
2. Описать реальные модели
3. Подключить Flask-Login
4. Реализовать запись на курс
5. Реализовать API для модулей и посылок
6. Сохранять вердикты и выводить историю
7. Сделать кабинет преподавателя
