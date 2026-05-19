def evaluate_demo_solution(solution: str) -> dict:
    normalized = solution.lower()
    checks = [
        "def is_palindrome" in normalized,
        "return" in normalized,
        "[::-1]" in normalized or "reversed" in normalized,
        "lower" in normalized or "casefold" in normalized,
    ]
    if all(checks):
        return {"verdict": "accepted", "label": "Accepted", "feedback": "Решение похоже на корректную реализацию для демо-проверки."}
    if len(solution.strip()) < 20:
        return {"verdict": "rejected", "label": "Rejected", "feedback": "Слишком короткое решение. Добавь функцию и return."}
    return {"verdict": "wrong_answer", "label": "Wrong Answer", "feedback": "Демо-проверка не нашла все ожидаемые элементы решения."}
