# 🚀 Quick Reference Card

## 📦 Package Versions
```json
{
  "expo": "~54.0.29",
  "react-native": "0.81.5",
  "typescript": "5.7+",
  "expo-router": "~6.0.19",
  "nativewind": "^4.2.1",
  "@tanstack/react-query": "^5.90.12",
  "axios": "^1.13.2",
  "react-native-mmkv": "^4.1.0",
  "@shopify/flash-list": "^2.2.0",
  "react-hook-form": "^7.68.0",
  "zod": "^4.2.0"
}
```

## 🎯 Core Commands
```bash
# Start dev server
npm start

# Platform specific
npm run ios
npm run android
npm run web

# Maintenance
npm start -- --clear        # Clear cache
npx tsc --noEmit           # Type check
npm run lint               # Lint code
```

## 📁 Where to Put What

| What                     | Where                                          |
|--------------------------|------------------------------------------------|
| Screen files             | `app/`                                        |
| API endpoints            | `src/features/{feature}/api/`                 |
| Custom hooks             | `src/features/{feature}/hooks/`               |
| Feature components       | `src/features/{feature}/components/`          |
| Shared components        | `components/`                                 |
| Global hooks             | `src/hooks/`                                  |
| Type definitions         | `src/types/`                                  |
| Core utilities           | `src/lib/`                                    |
| Helper functions         | `src/utils/`                                  |

## 🔥 Common Imports

```typescript
// Navigation
import { router } from 'expo-router';

// API
import { useFetch, useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

// Storage
import { storageUtils, StorageKeys } from '@/src/lib/storage';

// Query
import { queryClient } from '@/src/lib/query-client';

// Forms
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Lists
import { FlashList } from '@shopify/flash-list';

// UI
import { View, Text, Pressable, TextInput } from 'react-native';
```

## 🎨 Styling Quick Reference

```typescript
// Common Tailwind patterns
className="flex-1"                          // Full height
className="justify-center items-center"    // Center
className="p-4"                             // Padding
className="mb-4"                            // Margin bottom
className="bg-blue-500"                     // Background
className="text-white"                      // Text color
className="rounded-lg"                      // Border radius
className="shadow-md"                       // Shadow
className="font-bold"                       // Font weight
className="text-xl"                         // Text size
```

## 🔐 Auth Flow Checklist

- [ ] Create login screen in `app/login.tsx`
- [ ] Use `useLogin()` hook from `src/features/auth/hooks/use-auth.ts`
- [ ] Tokens automatically stored in MMKV
- [ ] Axios auto-injects Bearer token
- [ ] 401 errors trigger auto-logout
- [ ] User redirected to home on success

## 📡 Adding New API Endpoint

1. **Define types** in `src/types/api.d.ts`
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

2. **Create API file** `src/features/products/api/products.api.ts`
```typescript
import { api } from '@/src/lib/axios';

export const productsApi = {
  getProducts: () => api.get<Product[]>('/products'),
};
```

3. **Create hook** `src/features/products/hooks/use-products.ts`
```typescript
import { useFetch } from '@/src/hooks/useFetch';

export function useProducts() {
  return useFetch(['products'], productsApi.getProducts);
}
```

4. **Use in screen** `app/products.tsx`
```typescript
import { useProducts } from '@/src/features/products/hooks/use-products';

export default function ProductsScreen() {
  const { data, isLoading } = useProducts();
  // ...
}
```

## 🛠️ Common Tasks

### Navigate to Screen
```typescript
import { router } from 'expo-router';

router.push('/products');
router.replace('/login');
router.back();
```

### Show Loading
```typescript
if (isLoading) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
```

### Show Error
```typescript
if (error) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-500">{error.message}</Text>
    </View>
  );
}
```

### Form Validation
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Too short'),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

### Invalidate Query
```typescript
import { queryClient } from '@/src/lib/query-client';

queryClient.invalidateQueries({ queryKey: ['products'] });
```

### Store Data
```typescript
import { storageUtils, StorageKeys } from '@/src/lib/storage';

// String
storageUtils.setString(StorageKeys.AUTH_TOKEN, token);
storageUtils.getString(StorageKeys.AUTH_TOKEN);

// Object
storageUtils.setObject(StorageKeys.USER_DATA, user);
storageUtils.getObject<User>(StorageKeys.USER_DATA);

// Delete
storageUtils.delete(StorageKeys.AUTH_TOKEN);
storageUtils.clearAll();
```

## 🐛 Debugging

```bash
# Check logs
npx react-native log-ios
npx react-native log-android

# Type errors
npx tsc --noEmit

# Clear everything
rm -rf node_modules .expo
npm install
npm start -- --clear
```

## ⚡ Performance Tips

1. Use `FlashList` instead of `FlatList`
2. Use `React.memo()` for expensive components
3. Avoid inline functions in `renderItem`
4. Set `estimatedItemSize` for FlashList
5. Use `staleTime` to reduce refetches
6. Enable `placeholderData` for pagination

## 📞 Need Help?

- Expo Docs: https://docs.expo.dev/
- TanStack Query: https://tanstack.com/query/latest
- NativeWind: https://www.nativewind.dev/
- Project docs: `ARCHITECTURE.md`, `PATTERNS.md`
