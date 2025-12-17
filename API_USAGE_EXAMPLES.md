# API Integration Examples

## 🔐 Authentication

### Login Example
```tsx
import { useLogin } from '@/src/features/auth/hooks/use-auth';

function LoginScreen() {
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = () => {
    login(
      { email: 'admin@un1t.com', password: '123qwe23' },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Logged in!');
          router.replace('/(tabs)');
        },
        onError: (error) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  return (
    <TouchableOpacity onPress={handleLogin} disabled={isPending}>
      {isPending ? <ActivityIndicator /> : <Text>Login</Text>}
    </TouchableOpacity>
  );
}
```

### Logout Example
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

### Check Authentication Status
```tsx
import { authUtils } from '@/src/features/auth/utils/auth-utils';

function ProtectedScreen() {
  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.replace('/login');
    }
  }, []);

  const user = authUtils.getUser();
  const token = authUtils.getToken();

  return <Text>Welcome, {user?.email}</Text>;
}
```

## 📡 Making API Requests

### GET Request (Fetch Data)
```tsx
import { useFetch } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

interface Class {
  id: string;
  name: string;
  instructor: string;
}

function ClassesScreen() {
  const { data: classes, isLoading, error } = useFetch<Class[]>(
    ['classes'], // Query key for caching
    () => api.get<Class[]>('/classes'),
    {
      enabled: true, // Only fetch when enabled
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    }
  );

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={classes}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

### POST Request (Create Data)
```tsx
import { useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

interface BookingRequest {
  classId: string;
  date: string;
}

interface BookingResponse {
  id: string;
  status: 'confirmed' | 'pending';
}

function BookClassButton({ classId }: { classId: string }) {
  const { mutate: bookClass, isPending } = useMutate<
    BookingResponse,
    Error,
    BookingRequest
  >(
    (data) => api.post<BookingResponse>('/bookings', data),
    {
      onSuccess: (booking) => {
        Alert.alert('Success', `Booking ${booking.id} confirmed!`);
        // Refetch bookings list
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    }
  );

  const handleBook = () => {
    bookClass({
      classId,
      date: new Date().toISOString(),
    });
  };

  return (
    <TouchableOpacity onPress={handleBook} disabled={isPending}>
      {isPending ? <ActivityIndicator /> : <Text>Book Class</Text>}
    </TouchableOpacity>
  );
}
```

### PUT/PATCH Request (Update Data)
```tsx
import { useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

function EditProfileScreen() {
  const { mutate: updateProfile, isPending } = useMutate<
    User,
    Error,
    UpdateProfileRequest
  >((data) => api.put<User>('/users/me', data));

  const handleSave = (data: UpdateProfileRequest) => {
    updateProfile(data, {
      onSuccess: (user) => {
        Alert.alert('Success', 'Profile updated!');
        // Update user in storage
        storageUtils.setObject(StorageKeys.USER_DATA, user);
      },
    });
  };

  return <Form onSubmit={handleSave} />;
}
```

### DELETE Request
```tsx
import { useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';

function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const { mutate: cancelBooking, isPending } = useMutate(
    () => api.delete(`/bookings/${bookingId}`),
    {
      onSuccess: () => {
        Alert.alert('Cancelled', 'Booking cancelled successfully');
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
    }
  );

  return (
    <TouchableOpacity onPress={() => cancelBooking()} disabled={isPending}>
      <Text>Cancel</Text>
    </TouchableOpacity>
  );
}
```

## 🔄 Refetching & Cache Management

### Manual Refetch
```tsx
import { queryClient } from '@/src/lib/query-client';

// Refetch specific query
queryClient.invalidateQueries({ queryKey: ['classes'] });

// Refetch all queries
queryClient.invalidateQueries();

// Refetch on focus/pull-to-refresh
function ClassesScreen() {
  const { data, refetch, isRefetching } = useFetch(
    ['classes'],
    () => api.get<Class[]>('/classes')
  );

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
```

## 🎯 Advanced Patterns

### Dependent Queries
```tsx
function UserOrdersScreen({ userId }: { userId: string }) {
  // First, fetch user
  const { data: user } = useFetch(
    ['user', userId],
    () => api.get<User>(`/users/${userId}`)
  );

  // Then, fetch orders (only when user is loaded)
  const { data: orders } = useFetch(
    ['orders', userId],
    () => api.get<Order[]>(`/users/${userId}/orders`),
    {
      enabled: !!user, // Only run when user exists
    }
  );

  return <OrdersList orders={orders} />;
}
```

### Paginated Data
```tsx
import { usePaginatedFetch } from '@/src/hooks/useFetch';

function PaginatedClasses() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePaginatedFetch(
    ['classes', page],
    () => api.get<PaginatedResponse<Class>>(`/classes?page=${page}&limit=10`)
  );

  return (
    <>
      <ClassesList data={data?.data} />
      <Pagination
        page={page}
        totalPages={data?.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Optimistic Updates
```tsx
function LikeButton({ postId }: { postId: string }) {
  const { mutate: likePost } = useMutate(
    () => api.post(`/posts/${postId}/like`),
    {
      onMutate: async () => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['posts', postId] });

        // Snapshot previous value
        const previousPost = queryClient.getQueryData(['posts', postId]);

        // Optimistically update to the new value
        queryClient.setQueryData(['posts', postId], (old: any) => ({
          ...old,
          liked: true,
          likesCount: old.likesCount + 1,
        }));

        return { previousPost };
      },
      onError: (err, variables, context) => {
        // Rollback on error
        queryClient.setQueryData(['posts', postId], context?.previousPost);
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({ queryKey: ['posts', postId] });
      },
    }
  );

  return <TouchableOpacity onPress={() => likePost()} />;
}
```

## 🔍 Error Handling

### Global Error Handling (Already Configured)
Axios interceptor in `src/lib/axios.ts` handles:
- ✅ 401 Unauthorized → Auto logout + redirect
- ✅ Network errors → User-friendly message
- ✅ Server errors → Error message from backend

### Component-Level Error Handling
```tsx
function MyComponent() {
  const { data, error, isError } = useFetch(
    ['data'],
    () => api.get('/endpoint')
  );

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <DataView data={data} />;
}
```

## 🛡️ Protected Routes

```tsx
// app/(tabs)/_layout.tsx
import { authUtils } from '@/src/features/auth/utils/auth-utils';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.replace('/login');
    }
  }, []);

  return <Tabs>...</Tabs>;
}
```

## 📝 TypeScript Tips

### Type Your API Responses
```tsx
// src/types/api.d.ts
export interface Class {
  id: string;
  name: string;
  instructor: string;
  duration: number;
  capacity: number;
}

// Usage
const { data } = useFetch<Class[]>(
  ['classes'],
  () => api.get<Class[]>('/classes')
);
// data is typed as Class[] | undefined
```

### Generic API Function
```tsx
async function fetchUserData<T>(endpoint: string): Promise<T> {
  return api.get<T>(`/users/me${endpoint}`);
}

// Usage
const profile = await fetchUserData<UserProfile>('/profile');
const stats = await fetchUserData<UserStats>('/stats');
```
