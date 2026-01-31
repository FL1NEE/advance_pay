"""
Скрипт для создания тестового пользователя
"""
import requests
import json

# Настройки
API_URL = "http://localhost:8081/api/v1"

# Данные тестового пользователя
test_user = {
    "username": "trader1",
    "password": "test123",
    "email": "trader1@example.com",
    "role": "trader"
}

print("=" * 50)
print("Создание тестового пользователя")
print("=" * 50)

try:
    # Регистрация пользователя
    response = requests.post(
        f"{API_URL}/auth/register",
        json=test_user
    )

    if response.status_code == 200:
        user_data = response.json()
        print("\n✅ Пользователь успешно создан!")
        print(f"\nЛогин: {test_user['username']}")
        print(f"Пароль: {test_user['password']}")
        print(f"Email: {test_user['email']}")
        print(f"Роль: {test_user['role']}")
        print(f"\nID пользователя: {user_data['id']}")

        print("\n" + "=" * 50)
        print("Используйте эти данные для входа в приложение!")
        print("=" * 50)

    elif response.status_code == 400:
        error = response.json()
        if "already registered" in error.get("detail", "").lower():
            print("\n⚠️ Пользователь уже существует!")
            print(f"\nЛогин: {test_user['username']}")
            print(f"Пароль: {test_user['password']}")
            print("\nИспользуйте эти данные для входа")
        else:
            print(f"\n❌ Ошибка: {error.get('detail', 'Unknown error')}")
    else:
        print(f"\n❌ Ошибка: HTTP {response.status_code}")
        print(response.text)

except requests.exceptions.ConnectionError:
    print("\n❌ Не удалось подключиться к серверу!")
    print("\nУбедитесь что backend запущен:")
    print("  cd backend")
    print("  uvicorn app.main:app --host 0.0.0.0 --port 8081")

except Exception as e:
    print(f"\n❌ Ошибка: {e}")

print()
