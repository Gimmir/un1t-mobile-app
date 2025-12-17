# 🚀 Quick Start - Backend Integration

## ✅ Що вже готово

### Створені файли:
1. ✅ `.env` - Backend URL configuration
2. ✅ `src/types/api.d.ts` - TypeScript types з гнучкою структурою LoginResponse
3. ✅ `src/lib/storage.ts` - MMKV encrypted storage
4. ✅ `src/lib/axios.ts` - Axios з interceptors (auto token + auto logout)
5. ✅ `src/lib/query-client.ts` - TanStack Query config
6. ✅ `src/hooks/useFetch.ts` - Generic hooks (useFetch, useMutate)
7. ✅ `src/features/auth/api/auth.api.ts` - Auth API endpoints
8. ✅ `src/features/auth/hooks/use-auth.ts` - useLogin/useLogout hooks
9. ✅ `src/features/auth/utils/auth-utils.ts` - Auth utility functions
10. ✅ `app/(auth)/login.tsx` - Повна інтеграція з API

### Вже налаштовано:
- ✅ QueryClientProvider в app/_layout.tsx
- ✅ Axios interceptors (auto token, auto logout on 401)
- ✅ Encrypted token storage (MMKV)
- ✅ TypeScript types для всіх API endpoints
- ✅ Error handling (Alert dialogs)
- ✅ Loading states (ActivityIndicator)
- ✅ Form validation (Zod)

## 🎯 Як використовувати

### 1. Запуск додатку
```bash
npm start
# або
npx expo start
```

### 2. Тест логіну
- Відкрийте додаток
- Натисніть "Login" або "Get Started"
- Введіть:
  - Email: `admin@un1t.com`
  - Password: `123qwe23`
- Натисніть "LOGIN"
- ✅ Має з'явитися Alert "Login successful!"
- ✅ Після OK → перехід на /(tabs)

### 3. Використання в інших екранах

#### Перевірка авторизації:
```tsx
import { authUtils } from '@/src/features/auth/utils/auth-utils';

// В будь-якому компоненті
useEffect(() => {
  if (!authUtils.isAuthenticated()) {
    router.replace('/login');
  }
}, []);
```

#### Отримання даних користувача:
```tsx
import { authUtils } from '@/src/features/auth/utils/auth-utils';

const user = authUtils.getUser();
const token = authUtils.getToken();

console.log('User:', user?.email);
console.log('Token:', token);
```

#### Logout:
```tsx
import { useLogout } from '@/src/features/auth/hooks/use-auth';

function ProfileScreen() {
  const { mutate: logout } = useLogout();

  return (
    <TouchableOpacity onPress={() => logout()}>
      <Text>Logout</Text>
    </TouchableOpacity>
  );
}
```

#### Виклик API (GET):
```tsx
import { useFetch } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

// Отримання списку класів
const { data: classes, isLoading } = useFetch(
  ['classes'],
  () => api.get('/classes')
);
```

#### Виклик API (POST):
```tsx
import { useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

const { mutate: createBooking, isPending } = useMutate(
  (data) => api.post('/bookings', data)
);

// Використання
createBooking({ classId: '123', date: '2024-01-01' });
```

## 📚 Додаткова документація

- **API_INTEGRATION_SUMMARY.md** - Повний опис інтеграції
- **API_USAGE_EXAMPLES.md** - Приклади використання API
- **TESTING_GUIDE.md** - Гайд по тестуванню

## 🔑 Backend Details

- **URL:** https://un1t-back-end-development.up.railway.app
- **Login Endpoint:** POST /auth/login
- **Test Credentials:**
  - Email: admin@un1t.com
  - Password: 123qwe23

## 🛡️ Безпека

- ✅ Токени зберігаються в encrypted MMKV storage
- ✅ Автоматичний logout при 401 (expired token)
- ✅ Токени автоматично додаються до всіх запитів
- ✅ Secure encryption key для MMKV

## ⚡ Важливі особливості

### Гнучка структура токенів
Backend може повертати або `token` або `accessToken`. Код автоматично обробляє обидва варіанти:

```tsx
// В use-auth.ts
const authToken = data.token || data.accessToken;
```

### Автоматичний logout
При 401 помилці (expired/invalid token):
1. Всі дані очищаються з storage
2. Користувач перенаправляється на /login
3. З'являється повідомлення "Session expired"

### Loading states
Всі API виклики мають стани:
- `isPending` - під час запиту
- `isError` - при помилці
- `isSuccess` - при успіху

## 🚨 Можливі проблеми

### Помилка: "Network error"
**Рішення:** Перевірте інтернет з'єднання та доступність backend

### Помилка: 401 Unauthorized
**Рішення:** Токен прострочений. Вийдіть та увійдіть знову

### Додаток не логінить
**Рішення:** 
1. Перезапустіть Metro: `npx expo start --clear`
2. Перевірте консоль на помилки
3. Перевірте .env файл

## 📞 Наступні кроки

1. ✅ Протестуйте login flow з тестовими credentials
2. ⬜ Додайте auto-login при старті (якщо токен існує)
3. ⬜ Додайте refresh token logic
4. ⬜ Додайте захищені роути
5. ⬜ Інтегруйте інші API endpoints (classes, bookings, etc.)

## 🎉 Готово до використання!

Всі файли створені, інтеграція готова. Можна тестувати та розробляти далі!
