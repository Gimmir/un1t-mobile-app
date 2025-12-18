# Як працює отримання Coach та Location для подій

## 🎯 Проблема

Бекенд повертає події з полями `coach` та `studio` як ID (string), а не як повні об'єкти:

```json
{
  "_id": "...",
  "title": "Event #002",
  "coach": "694428f829baa264a95f9157",  // Just ID
  "studio": "6941cdabdbfd3569f7ece976", // Just ID
  "startTime": "2025-12-19T16:00:00.000Z",
  "endTime": "2025-12-19T18:00:00.000Z"
}
```

## ✅ Рішення

### 1. API Endpoints

Додані нові API для отримання окремих записів:

- **Users API** (`src/features/users/api/users.api.ts`):
  - `GET /users/:id` - отримати будь-якого користувача (включно з coach)
  - `GET /users/me` - отримати поточного користувача

- **Studios API** (`src/features/studios/api/studios.api.ts`):
  - `GET /studios/:id` - отримати окрему студію

### 2. React Hooks

Створені хуки для зручного використання:

```typescript
// Отримати користувача по ID
import { useUser } from '@/src/features/users/hooks/use-users';
const { data: coach } = useUser(event.coach);

// Отримати студію по ID
import { useStudio } from '@/src/features/studios/hooks/use-studios';
const { data: studio } = useStudio(event.studio);
```

### 3. Автоматичне заповнення - usePopulatedEvent

Створений хелпер хук який автоматично отримує coach та studio:

```typescript
import { usePopulatedEvent } from '@/src/features/events/hooks/use-events';

function MyComponent() {
  const { data: event } = useEvent(eventId);
  const { populatedEvent, isLoading } = usePopulatedEvent(event);
  
  // populatedEvent містить:
  // - instructor: { first_name, last_name, image_url }
  // - location: { name }
}
```

## 📊 Структура даних

### Coach (User з роллю 'coach')

**GET /users/:id** повертає:
```typescript
{
  "_id": "...",
  "role": "coach",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "email": "coach@example.com",
  // ... інші поля
}
```

**Мапінг для frontend:**
```typescript
instructor: {
  _id: user._id,
  first_name: user.firstName,
  last_name: user.lastName,
  image_url: user.avatar
}
```

### Location (Studio)

**GET /studios/:id** повертає:
```typescript
{
  "_id": "...",
  "title": "Main Studio",
  "address": "...",
  "city": "...",
  // ... інші поля
}
```

**Мапінг для frontend:**
```typescript
location: {
  _id: studio._id,
  name: studio.title
}
```

## 🔄 Як це працює

### Схема запитів:

```
1. GET /events → event with coach ID and studio ID
2. GET /users/:coachId → full coach data
3. GET /studios/:studioId → full studio data
4. Combine → populated event with instructor and location
```

### Приклад використання:

#### В списку подій (classes screen)

Події показуються без завантаження coach/studio для кожної події (оптимізація).

#### На екрані деталей події (class-details screen)

```typescript
const { data: event } = useEvent(eventId);
const { populatedEvent, coach, studio, isLoading } = usePopulatedEvent(event);

// Використовуємо populatedEvent для відображення
<Text>{populatedEvent.instructor.first_name}</Text>
<Text>{populatedEvent.location.name}</Text>
```

## 🚀 Переваги цього підходу

1. **Кешування** - React Query кешує coach та studio окремо
2. **Переиспользование** - якщо кілька подій мають того самого coach, він завантажується один раз
3. **Гнучкість** - можна отримати повні дані coach або studio коли потрібно
4. **Оптимізація** - на списку не завантажуємо зайві дані

## 📝 Файли створені/змінені

### Нові файли:
- `src/features/users/api/users.api.ts` - API для користувачів
- `src/features/users/hooks/use-users.ts` - Хуки для користувачів
- `src/features/events/hooks/use-populated-event.ts` - Хелпер для автозаповнення

### Оновлені файли:
- `src/features/studios/api/studios.api.ts` - додано getStudioById
- `src/features/studios/hooks/use-studios.ts` - додано useStudio
- `src/features/events/api/events.api.ts` - оновлено normalizeEvent
- `DATA_TYPES/event.ts` - оновлено коментарі
- `app/class-details/[id].tsx` - використання usePopulatedEvent

## 💡 Альтернативні варіанти

### Варіант 1: Backend populate (краще для продакшену)

Попросити бекенд робити populate автоматично:

```javascript
// Backend
Event.find().populate('coach').populate('studio')
```

Тоді відповідь буде:
```json
{
  "coach": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe"
  },
  "studio": {
    "_id": "...",
    "title": "Main Studio"
  }
}
```

### Варіант 2: Окремий endpoint для populated events

```
GET /events?populate=coach,studio
GET /events/:id?populate=coach,studio
```

### Варіант 3: GraphQL (для майбутнього)

```graphql
query GetEvent($id: ID!) {
  event(id: $id) {
    title
    coach {
      firstName
      lastName
    }
    studio {
      title
    }
  }
}
```

## ⚠️ Обмеження поточного рішення

1. **Додаткові запити** - для кожної події робиться 2 додаткові запити (coach + studio)
2. **Waterfall requests** - запити виконуються послідовно (event → coach, studio)
3. **Network overhead** - більше HTTP запитів = повільніше

**Рекомендація:** Попросити бекенд додати populate для production.
