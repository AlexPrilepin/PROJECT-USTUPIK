# USTUPIK · ITMO Course Platform

Онлайн-платформа для создания и прохождения курсов. Проект сделан как pet-project для студента ИТМО: современный многостраничный frontend, Flask-архитектура, будущая схема БД, CI для ветки `dev` и минимальная Docker-заготовка.

Текущая степень готовности: **frontend MVP готов, backend представлен архитектурным каркасом и демо-API**.


## Где лежат главные гайды

Открой эти файлы в таком порядке:

1. `START_HERE.md` — команды запуска, Docker, тесты, основные страницы.
2. `PROJECT_GUIDE_FULL.md` — подробный гайд по архитектуре и всем файлам.
3. `QA_CHECKLIST_MTS_SAVIN.md` — большой чек-лист вопросов для QA-собеседования.
4. `PREP_MATERIALS_EVENING_MORNING.md` — материалы на вечер и утро перед собеседованием.
5. `docs/api-contract.md` — будущий REST API.
6. `docs/database.md` — проектирование базы данных.
7. `docs/backend-evening-task.md` — задача на вечер для backend-резюме.

## Что реализовано сейчас

- отдельная страница входа и регистрации;
- роли `student` и `teacher` на уровне UI;
- каталог курсов;
- тестовый курс `Flask Launchpad`;
- страница курса с описанием, навыками и кнопкой записи;
- запись на курс в демо-режиме через `localStorage`;
- профиль пользователя с карточками записанных курсов;
- страница прохождения курса;
- sidebar со списком блоков;
- блок теории;
- блок практики;
- textarea для отправки решения;
- демо-вердикт после отправки решения;
- моковые данные в JSON;
- Flask factory;
- SQLAlchemy-модели для будущего backend-а;
- API-заготовки;
- GitHub Actions для `dev`;
- Dockerfile и docker-compose.

## Что ещё не реализовано

- полноценная серверная авторизация;
- хеширование и проверка паролей в production-сценарии;
- настоящая запись на курсы в БД;
- настоящая проверка решений;
- история посылок на UI;
- кабинет преподавателя;
- CRUD курсов;
- загрузка файлов;
- production-деплой.

## Стек

Frontend:

- HTML5;
- CSS3;
- JavaScript без фреймворков;
- Bootstrap 5;
- Bootstrap Icons;
- Jinja2 templates.

Backend scaffold:

- Python 3.12;
- Flask;
- Flask-SQLAlchemy;
- Flask-Migrate;
- SQLite.

Infrastructure:

- Git;
- GitHub Actions;
- Docker;
- Docker Compose.

## Быстрый старт

```bash
python -m venv .venv
```

Linux / macOS:

```bash
source .venv/bin/activate
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

```bash
pip install -r requirements-dev.txt
python run.py
```

Открой:

```text
http://127.0.0.1:5000
```

## Запуск тестов

```bash
python -m unittest discover -s tests -v
python -m compileall app run.py
```

## Docker

```bash
docker compose up --build
```

После запуска:

```text
http://127.0.0.1:5000
```

## Git workflow как в реальной разработке

Главные ветки:

- `main` — стабильная версия;
- `dev` — основная ветка разработки;
- `feature/<name>` — новая функциональность;
- `fix/<name>` — исправления;
- `docs/<name>` — документация;
- `refactor/<name>` — рефакторинг без изменения поведения.

Обычный процесс:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/backend-auth
```

После изменений:

```bash
git status
git add .
git commit -m "feat: add auth api skeleton"
git push origin feature/backend-auth
```

Дальше открыть Pull Request в `dev`. После прохождения CI и ревью можно мержить. В `main` переносить только стабильные версии.

Формат коммитов:

```text
feat: add course detail page
fix: repair enroll button state
docs: update database design
test: add mock content validation
refactor: split api service functions
chore: update docker config
```

## CI/CD

Файл `.github/workflows/dev-ci.yml` запускается на push и pull request в `dev`.

Pipeline делает:

1. checkout репозитория;
2. установку Python 3.12;
3. установку зависимостей из `requirements-dev.txt`;
4. запуск unittest-тестов;
5. проверку компиляции Python-файлов.

Сейчас это CI. Полноценный CD можно добавить позже: build Docker image, push в Docker Hub, деплой на VPS.

## Карта проекта

```text
PROJECT-USTUPIK/
├── .github/workflows/dev-ci.yml
├── app/
│   ├── data/mock_data.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── static/
│   │   ├── css/style.css
│   │   ├── data/mock-content.json
│   │   └── js/
│   ├── templates/
│   ├── __init__.py
│   ├── config.py
│   └── extensions.py
├── docs/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── requirements-dev.txt
└── run.py
```

## Подробный гайд по всем файлам

### `.env.example`

Пример переменных окружения. Здесь лежит `SECRET_KEY`, режим разработки и строка подключения к SQLite. Настоящий `.env` не нужно коммитить.

### `.gitignore`

Исключает виртуальное окружение, кэш Python, SQLite-базы, `.env`, IDE-файлы и артефакты тестов.

### `.github/workflows/dev-ci.yml`

CI для ветки `dev`. При пуше или Pull Request в `dev` ставит зависимости, запускает тесты и компиляцию Python-файлов.

### `Dockerfile`

Минимальный контейнер на `python:3.12-slim`. Копирует зависимости, ставит их, копирует проект и запускает `python run.py`.

### `docker-compose.yml`

Поднимает сервис `web` на порту `5000`. Передаёт переменные окружения для Flask и SQLite.

### `requirements.txt`

Production-зависимости: Flask, SQLAlchemy-интеграция, миграции и dotenv.

### `requirements-dev.txt`

Dev-зависимости. Сейчас подключает `requirements.txt` и `pytest`. Тесты написаны на unittest, но pytest пригодится для будущего backend-а.

### `run.py`

Точка входа. Создаёт приложение через `create_app()` и запускает сервер на `0.0.0.0:5000`, чтобы работало и локально, и в Docker.

### `app/__init__.py`

Application factory. Создаёт Flask-приложение, подключает конфиг, инициализирует `db` и `migrate`, регистрирует blueprints страниц и API.

### `app/config.py`

Конфигурация приложения. Хранит `SECRET_KEY`, `SQLALCHEMY_DATABASE_URI`, отключает лишнее отслеживание SQLAlchemy и включает нормальную JSON-кириллицу.

### `app/extensions.py`

Единая точка расширений Flask. Здесь создаются `db = SQLAlchemy()` и `migrate = Migrate()`. Такой подход нужен, чтобы не получать циклические импорты.

### `app/data/mock_data.py`

Загружает `mock-content.json`, кэширует его и даёт функции `get_courses()` и `get_course_by_slug()`. Это временный слой данных до настоящей БД.

### `app/models/user.py`

SQLAlchemy-модель пользователя. Поля: username, email, password_hash, role, is_active, created_at, updated_at. Связи: созданные курсы, записи на курсы, посылки.

### `app/models/course.py`

SQLAlchemy-модель курса. Поля: title, slug, short_description, full_description, difficulty, cover_image, is_published, author_id, timestamps. Связи: автор, модули, записи, посылки.

### `app/models/module.py`

SQLAlchemy-модель блока курса. Поддерживает `theory` и `practice`. Для теории хранится `theory_content`, для практики — `practice_prompt`, `practice_stub`, `checker_type`.

### `app/models/enrollment.py`

SQLAlchemy-модель записи пользователя на курс. Хранит user_id, course_id, status, progress_percent, enrolled_at, completed_at. Есть уникальность пары `(user_id, course_id)`.

### `app/models/submission.py`

SQLAlchemy-модель посылки решения. Хранит пользователя, курс, модуль, текст решения, вердикт, feedback, runtime_ms, created_at.

### `app/models/__init__.py`

Экспортирует все модели из пакета, чтобы их было удобно импортировать и чтобы Flask-Migrate видел модели.

### `app/services/auth_service.py`

Сервис авторизации для демо-режима. Нормализует роль и собирает демо-пользователя. Позже сюда можно перенести проверку пароля, регистрацию и Flask-Login.

### `app/services/course_service.py`

Сервис курсов. Возвращает список курсов, ищет курс по slug и собирает демо-ответ записи на курс.

### `app/services/submission_service.py`

Сервис проверки решения. Сейчас это демо-проверка по текстовым признакам. Позже тут может быть очередь, sandbox, запуск тестов и запись вердикта в БД.

### `app/services/__init__.py`

Экспортирует функции сервисного слоя.

### `app/routes/pages.py`

Маршруты HTML-страниц: `/`, `/login`, `/courses`, `/courses/<slug>`, `/profile`, `/learn/<slug>`.

### `app/routes/auth.py`

Демо API авторизации: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`. Сейчас возвращает демо-пользователя.

### `app/routes/api.py`

Общие API-заготовки: healthcheck, список курсов, курс по slug, текущий пользователь, отправка решения.

### `app/routes/courses.py`

API-заготовка записи на курс: `POST /api/courses/<slug>/enroll`.

### `app/routes/profile.py`

API-заготовки профиля: summary, мои курсы, мои посылки.

### `app/routes/__init__.py`

Экспортирует blueprints.

### `app/templates/base.html`

Базовый HTML layout. Подключает Bootstrap, Icons, шрифт Inter, главный CSS, navbar, footer, toast и общий JS.

### `app/templates/components/navbar.html`

Навигация: логотип, ссылки на курсы, профиль, вход и бейдж текущей роли.

### `app/templates/components/footer.html`

Нижний блок с описанием проекта и технологическими бейджами.

### `app/templates/login.html`

Страница входа и регистрации. Содержит tabs входа/регистрации, выбор роли student/teacher и форму. Логика находится в `auth.js`.

### `app/templates/courses.html`

Каталог курсов. Содержит hero-блок, поиск, фильтры и контейнер `coursesGrid`, куда JavaScript рендерит карточки.

### `app/templates/course_detail.html`

Пустой контейнер для подробной страницы курса. Данные и HTML собираются в `course-detail.js`.

### `app/templates/profile.html`

Профиль пользователя: имя, email, роль, количество курсов, accepted-счётчик, empty-state и сетка курсов.

### `app/templates/learn.html`

Страница прохождения курса. Содержимое полностью рендерится через `learn.js`: sidebar, теория, практика, verdict-card.

### `app/static/css/style.css`

Визуальная система: тёмный фон, glow-эффекты, glassmorphism-карточки, responsive-сетка, кнопки, формы, анимации появления, стили каталога, профиля и прохождения курса.

### `app/static/js/app.js`

Общие frontend-хелперы: загрузка моковых данных, работа с `localStorage`, запись на курс, счётчик accepted, toast, роль в navbar, reveal-анимации и pointer-glow.

### `app/static/js/auth.js`

Логика авторизации в демо-режиме. Переключает вход/регистрацию, роли, сохраняет пользователя в `localStorage` и переводит в каталог.

### `app/static/js/courses.js`

Загружает моковые курсы, фильтрует по поиску и тегам, рендерит карточки курсов.

### `app/static/js/course-detail.js`

Находит курс по slug, рендерит описание, навыки, outcomes и кнопку записи. После записи переводит на `/learn/<slug>`.

### `app/static/js/profile.js`

Читает пользователя и enrollments из `localStorage`, показывает профиль и карточки курсов пользователя.

### `app/static/js/learn.js`

Рендерит прохождение курса. Для теории показывает текстовые параграфы. Для практики показывает условие, textarea и демо-проверку решения.

### `app/static/data/mock-content.json`

Единственный тестовый курс. Внутри один блок теории и один блок практики.

### `docs/architecture.md`

Архитектура проекта, слои, flow пользователя, backend roadmap.

### `docs/database.md`

Проектирование базы данных: таблицы, поля, связи, индексы, жизненный цикл данных.

### `docs/api-contract.md`

Контракт будущего REST API: auth, courses, profile, submissions.

### `docs/backend-evening-task.md`

Задание на вечер для прокачки backend-резюме: REST API, Flask, SQLAlchemy, pytest, Docker, Git.

### `docs/qa-prep-mts.md`

Подготовка к QA-вакансии: чек-лист вопросов, темы по Савину, DevTools, API, баг-репорты, вечерний и утренний план.

### `tests/test_frontend_structure.py`

Проверяет, что ключевые шаблоны, JS, CSS, docs и workflow существуют, а в шаблонах есть нужные маркеры.

### `tests/test_mock_content.py`

Проверяет моковые данные: есть один курс, slug, теги, теория, практика, подсказки и expected-поля.

## Как подключать настоящий backend дальше

1. Создать миграции:

```bash
flask --app run.py db init
flask --app run.py db migrate -m "initial schema"
flask --app run.py db upgrade
```

2. Заменить чтение `mock-content.json` на запросы к БД.
3. Подключить Flask-Login или JWT.
4. Реализовать регистрацию и вход с `werkzeug.security`.
5. Реализовать `POST /api/courses/<slug>/enroll` через таблицу `enrollments`.
6. Реализовать `POST /api/submissions` с записью в `submissions`.
7. Добавить историю посылок в профиль и в страницу практики.
8. Добавить teacher panel для создания курсов и модулей.

## Оценка времени на backend

Если frontend уже готов и ты работаешь один по вечерам:

| Блок | Время |
|---|---:|
| Настроить миграции и реальные модели | 4–6 часов |
| Auth: регистрация, логин, роли | 6–10 часов |
| API курсов и модулей | 5–8 часов |
| Запись на курс и профиль | 5–8 часов |
| Отправка решений и хранение вердиктов | 6–10 часов |
| История посылок | 3–5 часов |
| Тесты API и сервисов | 5–8 часов |
| Интеграция frontend с API | 5–8 часов |
| Docker Compose + polish | 3–5 часов |

MVP backend без teacher-panel: **26–40 часов**.

Полный аккуратный MVP с teacher-panel: **42–65 часов**.

Реалистично для вечерней разработки: **2–3 недели**, если работать регулярно.

## Следующий лучший шаг

Сначала сделать настоящий backend для auth + enrollments + submissions. После этого проект уже можно красиво показывать в backend-резюме как Flask/SQLAlchemy/REST API/CI/Docker pet-project.
