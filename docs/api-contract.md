# Future API Contract

## Auth

### POST `/api/auth/register`
```json
{
  "username": "alex",
  "email": "alex@itmo.ru",
  "password": "secret123",
  "role": "student"
}
```

### POST `/api/auth/login`
```json
{
  "email": "alex@itmo.ru",
  "password": "secret123"
}
```

## Courses

### GET `/api/courses`
Получить список курсов.

### GET `/api/courses/<slug>`
Получить карточку курса.

### POST `/api/courses/<course_id>/enroll`
Записаться на курс.

## Modules

### GET `/api/courses/<course_id>/modules`
Получить модули курса.

## Submissions

### POST `/api/submissions`
```json
{
  "course_id": 1,
  "module_id": 102,
  "submitted_text": "def is_palindrome(text): ..."
}
```

### GET `/api/submissions/<submission_id>`
Получить статус одной посылки.

## Profile

### GET `/api/profile`
Текущий пользователь.

### GET `/api/profile/courses`
Курсы текущего пользователя.

### GET `/api/profile/submissions`
История посылок.
