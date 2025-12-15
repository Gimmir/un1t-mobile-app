# Un1t Mobile App

Enterprise-grade React Native application built with Expo SDK 54, featuring modern architecture and best practices.

## 🚀 Tech Stack

- **Framework**: Expo SDK 54 (Managed Workflow)
- **Core**: React Native 0.81+ with New Architecture
- **Language**: TypeScript 5.7+ (Strict Mode)
- **Routing**: Expo Router v6 (File-system based)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **API State**: TanStack Query v5 + Axios
- **Local Storage**: react-native-mmkv
- **Lists**: @shopify/flash-list
- **Forms**: react-hook-form + zod

## 📁 Project Structure

```
un1t-mobile-app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation screens
│   ├── _layout.tsx              # Root layout with providers
│   └── modal.tsx                # Example modal screen
├── src/
│   ├── features/                # Feature-based modules
│   │   ├── auth/
│   │   │   ├── api/             # Auth API endpoints
│   │   │   ├── hooks/           # Auth custom hooks
│   │   │   └── components/      # Auth-specific components
│   │   ├── orders/
│   │   │   ├── api/             # Orders API endpoints
│   │   │   ├── hooks/           # Orders custom hooks
│   │   │   └── components/      # Order-specific components
│   │   └── profile/
│   │       ├── api/             # Profile API endpoints
│   │       ├── hooks/           # Profile custom hooks
│   │       └── components/      # Profile-specific components
│   ├── lib/
│   │   ├── axios.ts             # Axios instance with interceptors
│   │   ├── storage.ts           # MMKV storage utilities
│   │   └── query-client.ts      # TanStack Query configuration
│   ├── hooks/
│   │   └── useFetch.ts          # Generic API hooks wrapper
│   ├── types/
│   │   └── api.d.ts             # Backend API type definitions
│   └── utils/                   # Shared utilities
├── components/                   # Shared UI components
├── constants/                    # App constants
├── assets/                       # Images, fonts, etc.
├── global.css                    # Tailwind CSS directives
├── tailwind.config.js           # Tailwind configuration
├── metro.config.js              # Metro bundler with NativeWind
└── tsconfig.json                # TypeScript configuration
```

## 🏗️ Architecture Principles

### Feature-Based Organization
- Each feature (`auth`, `orders`, `profile`) is self-contained
- Contains its own `api`, `hooks`, and `components`
- Promotes modularity and scalability

### API Layer
- Centralized Axios instance in `src/lib/axios.ts`
- Automatic Bearer token injection from MMKV
- Global error handling with auto-logout on 401
- Type-safe API endpoints in feature-specific `api` folders

### State Management
- TanStack Query for server state
- MMKV for persistent local storage
- No Redux/Zustand needed for simple apps

### Type Safety
- Strict TypeScript mode enabled
- API types defined in `src/types/api.d.ts`
- Full type inference across the app

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Update the `EXPO_PUBLIC_API_URL` with your backend URL.

### 3. Update Storage Encryption Key

Open `src/lib/storage.ts` and replace the encryption key:

```typescript
encryptionKey: 'your-secure-encryption-key-here'
```

### 4. Start Development Server

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web

## 📱 Running on Devices

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```

## 🔐 Authentication Flow

1. User submits credentials via login form
2. `useLogin()` hook calls `authApi.login()`
3. On success:
   - Tokens stored in MMKV via `storageUtils`
   - User data cached
   - Navigate to home screen
4. All subsequent API calls automatically include Bearer token
5. On 401 error, user is logged out and redirected to login

## 📡 API Usage Examples

### Fetching Data (GET)
```typescript
import { useOrders } from '@/src/features/orders/hooks/use-orders';

function OrdersList() {
  const { data, isLoading, error } = useOrders(1, 10);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <OrderList orders={data.data} />;
}
```

### Mutations (POST/PUT/DELETE)
```typescript
import { useLogin } from '@/src/features/auth/hooks/use-auth';

function LoginScreen() {
  const { mutate: login, isPending } = useLogin();
  
  const handleSubmit = (data: LoginRequest) => {
    login(data);
  };
  
  return <LoginForm onSubmit={handleSubmit} isLoading={isPending} />;
}
```

### Adding New Features

1. Create feature folder: `src/features/your-feature/`
2. Add API endpoints: `src/features/your-feature/api/your-feature.api.ts`
3. Create custom hooks: `src/features/your-feature/hooks/use-your-feature.ts`
4. Build components: `src/features/your-feature/components/`

Example:
```typescript
// src/features/products/api/products.api.ts
import { api } from '@/src/lib/axios';

export const productsApi = {
  getProducts: () => api.get<Product[]>('/products'),
  getProductById: (id: string) => api.get<Product>(`/products/${id}`),
};

// src/features/products/hooks/use-products.ts
import { useFetch } from '@/src/hooks/useFetch';
import { productsApi } from '../api/products.api';

export function useProducts() {
  return useFetch(['products'], productsApi.getProducts);
}
```

## 🎨 Styling with NativeWind

Use Tailwind CSS classes directly in JSX:

```typescript
import { View, Text } from 'react-native';

export function Card() {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      <Text className="text-xl font-bold text-gray-900">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

## 🧪 Best Practices

### 1. Always Use Type-Safe Hooks
```typescript
// ❌ Don't use Axios directly in components
const response = await axios.get('/api/users');

// ✅ Use feature-specific hooks
const { data } = useUsers();
```

### 2. Store Sensitive Data in MMKV
```typescript
// ❌ Don't use AsyncStorage for tokens
await AsyncStorage.setItem('token', token);

// ✅ Use MMKV with encryption
storageUtils.setString(StorageKeys.AUTH_TOKEN, token);
```

### 3. Use Flash List for Performance
```typescript
// ❌ Don't use FlatList for large lists
<FlatList data={items} renderItem={renderItem} />

// ✅ Use FlashList
<FlashList data={items} renderItem={renderItem} estimatedItemSize={100} />
```

### 4. Invalidate Queries After Mutations
```typescript
const { mutate: createOrder } = useMutate(
  (data) => ordersApi.createOrder(data),
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  }
);
```

## 🔧 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### iOS Build Issues
```bash
cd ios && pod install && cd ..
npm run ios
```

### Type Errors
```bash
npx tsc --noEmit
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TanStack Query](https://tanstack.com/query/latest)
- [NativeWind](https://www.nativewind.dev/)
- [React Hook Form](https://react-hook-form.com/)

## 📄 License

MIT
