# Common Patterns & Recipes

## 🔐 Authentication Patterns

### Protected Routes
```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { storageUtils, StorageKeys } from '@/src/lib/storage';

export default function RootLayout() {
  const segments = useSegments();
  
  useEffect(() => {
    const token = storageUtils.getString(StorageKeys.AUTH_TOKEN);
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!token && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (token && inAuthGroup) {
      // Redirect to home if already authenticated
      router.replace('/(tabs)');
    }
  }, [segments]);

  return (
    // ... providers
  );
}
```

### Logout Hook
```typescript
// Usage in any component
import { useLogout } from '@/src/features/auth/hooks/use-auth';

function SettingsScreen() {
  const { mutate: logout } = useLogout();
  
  return (
    <Pressable onPress={() => logout()}>
      <Text>Logout</Text>
    </Pressable>
  );
}
```

## 📡 API Patterns

### Simple GET Request
```typescript
// 1. Define API endpoint
// src/features/products/api/products.api.ts
export const productsApi = {
  getProducts: () => api.get<Product[]>('/products'),
};

// 2. Create hook
// src/features/products/hooks/use-products.ts
import { useFetch } from '@/src/hooks/useFetch';

export function useProducts() {
  return useFetch(['products'], () => productsApi.getProducts());
}

// 3. Use in component
function ProductsScreen() {
  const { data, isLoading, error, refetch } = useProducts();
  
  return (
    <FlashList
      data={data || []}
      onRefresh={refetch}
      refreshing={isLoading}
      renderItem={({ item }) => <ProductCard product={item} />}
      estimatedItemSize={120}
    />
  );
}
```

### POST Request with Form
```typescript
// 1. Define types
interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
}

// 2. Define API endpoint
export const productsApi = {
  createProduct: (data: CreateProductRequest) => 
    api.post<Product>('/products', data),
};

// 3. Create hook
import { useMutate } from '@/src/hooks/useFetch';
import { queryClient } from '@/src/lib/query-client';

export function useCreateProduct() {
  return useMutate<Product, Error, CreateProductRequest>(
    (data) => productsApi.createProduct(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
    }
  );
}

// 4. Use in component with form
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string(),
});

type ProductForm = z.infer<typeof productSchema>;

function CreateProductScreen() {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { control, handleSubmit } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductForm) => {
    createProduct(data);
  };

  return (
    <View className="p-4">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            placeholder="Product Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      
      <Pressable
        className="bg-blue-500 rounded-lg py-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        <Text className="text-white text-center font-semibold">
          {isPending ? 'Creating...' : 'Create Product'}
        </Text>
      </Pressable>
    </View>
  );
}
```

### Pagination Pattern
```typescript
// Hook
export function useOrders(page: number) {
  return usePaginatedFetch(
    ['orders', page],
    () => ordersApi.getOrders(page),
  );
}

// Component
function OrdersScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders(page);

  return (
    <View className="flex-1">
      <FlashList
        data={data?.data || []}
        renderItem={({ item }) => <OrderCard order={item} />}
        estimatedItemSize={100}
      />
      
      <View className="flex-row justify-between p-4">
        <Pressable
          onPress={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Previous</Text>
        </Pressable>
        
        <Text>Page {page} of {data?.meta.totalPages}</Text>
        
        <Pressable
          onPress={() => setPage(p => p + 1)}
          disabled={page >= (data?.meta.totalPages || 1)}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          <Text className="text-white">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

### File Upload Pattern
```typescript
// API
export const profileApi = {
  uploadAvatar: (uri: string) => {
    const formData = new FormData();
    formData.append('avatar', {
      uri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);
    
    return api.post<{ avatarUrl: string }>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Hook
export function useUploadAvatar() {
  return useMutate<{ avatarUrl: string }, Error, string>(
    (uri) => profileApi.uploadAvatar(uri),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    }
  );
}

// Component with Image Picker
import * as ImagePicker from 'expo-image-picker';

function AvatarUpload() {
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadAvatar(result.assets[0].uri);
    }
  };

  return (
    <Pressable onPress={pickImage} disabled={isPending}>
      <Text>{isPending ? 'Uploading...' : 'Upload Avatar'}</Text>
    </Pressable>
  );
}
```

## 🎨 UI Patterns

### Loading States
```typescript
function DataScreen() {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-500 text-lg font-semibold mb-2">
          Error
        </Text>
        <Text className="text-gray-600 text-center">{error.message}</Text>
      </View>
    );
  }

  return <DataList data={data} />;
}
```

### Pull to Refresh
```typescript
function OrdersScreen() {
  const { data, isLoading, refetch } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <FlashList
      data={data?.data || []}
      renderItem={({ item }) => <OrderCard order={item} />}
      estimatedItemSize={100}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
```

### Search Pattern
```typescript
function ProductsScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [search]);
  
  const { data, isLoading } = useFetch(
    ['products', debouncedSearch],
    () => productsApi.search(debouncedSearch),
    { enabled: debouncedSearch.length > 2 }
  );

  return (
    <View className="flex-1">
      <TextInput
        className="mx-4 my-2 px-4 py-3 border border-gray-300 rounded-lg"
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />
      
      <FlashList
        data={data || []}
        renderItem={({ item }) => <ProductCard product={item} />}
        estimatedItemSize={120}
      />
    </View>
  );
}
```

### Optimistic Updates
```typescript
export function useUpdateOrder() {
  return useMutate<Order, Error, { id: string; status: string }>(
    ({ id, status }) => ordersApi.updateStatus(id, status),
    {
      onMutate: async ({ id, status }) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['orders', id] });
        
        // Snapshot previous value
        const previous = queryClient.getQueryData(['orders', id]);
        
        // Optimistically update
        queryClient.setQueryData(['orders', id], (old: Order) => ({
          ...old,
          status,
        }));
        
        return { previous };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        if (context?.previous) {
          queryClient.setQueryData(['orders', variables.id], context.previous);
        }
      },
      onSettled: (data, error, variables) => {
        // Refetch after mutation
        queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
      },
    }
  );
}
```

## 💾 Storage Patterns

### Save User Preferences
```typescript
// Extend StorageKeys enum
export enum StorageKeys {
  AUTH_TOKEN = 'auth_token',
  THEME = 'theme',
  LANGUAGE = 'language',
}

// Usage
function SettingsScreen() {
  const [theme, setTheme] = useState(
    storageUtils.getString(StorageKeys.THEME) || 'light'
  );

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    storageUtils.setString(StorageKeys.THEME, newTheme);
  };

  return (
    <Pressable onPress={() => updateTheme(theme === 'light' ? 'dark' : 'light')}>
      <Text>Toggle Theme</Text>
    </Pressable>
  );
}
```

### Cache Images/Data Locally
```typescript
// Store complex objects
const cacheProduct = (product: Product) => {
  storageUtils.setObject(StorageKeys.CACHED_PRODUCT, product);
};

const getCachedProduct = (): Product | undefined => {
  return storageUtils.getObject<Product>(StorageKeys.CACHED_PRODUCT);
};
```

## 🚨 Error Handling

### Global Error Boundary
```typescript
// components/ErrorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 text-xl font-bold mb-4">
            Something went wrong
          </Text>
          <Text className="text-gray-600 text-center">
            {this.state.error?.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Use in app/_layout.tsx
<ErrorBoundary>
  {/* Your app */}
</ErrorBoundary>
```

## 🎯 Best Practices

1. **Always type your API responses**
2. **Use feature-based organization**
3. **Invalidate queries after mutations**
4. **Use FlashList for long lists**
5. **Store sensitive data in MMKV, not AsyncStorage**
6. **Enable optimistic updates for better UX**
7. **Implement proper error boundaries**
8. **Use zod for runtime validation**
9. **Debounce search inputs**
10. **Cache frequently accessed data**
