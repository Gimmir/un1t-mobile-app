# Auto-Refresh Events Feature

## Overview
Events automatically refresh in the app using multiple strategies to ensure users always see the latest data.

## Refresh Strategies

### 1. **Auto-Refresh Timer** ⏱️
- Events automatically refetch every **60 seconds**
- Configured in `src/features/events/hooks/use-events.ts`
- Uses React Query's `refetchInterval: 60 * 1000`

### 2. **Pull-to-Refresh** 👆
- Users can swipe down on the events list to manually refresh
- Implemented in `app/(tabs)/classes.tsx`
- Uses React Native's `RefreshControl` component
- Visual feedback with loading spinner

### 3. **App Foreground Refresh** 📱
- Events automatically refresh when app comes to foreground
- Two mechanisms:
  - React Query's `refetchOnWindowFocus: true`
  - Native AppState listener (backup/fallback)
- Example: User switches to another app and back → events refresh

### 4. **Mount Refresh** 🔄
- Events refresh when component mounts
- Configured with `refetchOnMount: true`
- Ensures fresh data when navigating to screen

## Code Locations

### Events Hook
**File**: `src/features/events/hooks/use-events.ts`
```typescript
export function useEvents() {
  const result = useFetch<Event[]>(
    ['events', 'all'],
    () => eventsApi.getEvents(),
    {
      staleTime: 30 * 1000,
      refetchInterval: 60 * 1000,        // ← Auto-refresh every 60s
      refetchOnWindowFocus: true,        // ← Refresh on app focus
      refetchOnMount: true,              // ← Refresh on mount
    }
  );
  
  return result;
}
```

### Pull-to-Refresh
**File**: `app/(tabs)/classes.tsx`
```typescript
const onRefresh = useCallback(async () => {
  setRefreshing(true);
  try {
    await refetchEvents();
  } finally {
    setRefreshing(false);
  }
}, [refetchEvents]);

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#FFFFFF"
    />
  }
>
```

### AppState Listener
**File**: `app/(tabs)/classes.tsx`
```typescript
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState === 'active') {
      refetchEvents();
    }
  });

  return () => {
    subscription.remove();
  };
}, [refetchEvents]);
```

## Configuration

### Adjust Refresh Interval
To change auto-refresh frequency, modify `refetchInterval` in `use-events.ts`:
```typescript
refetchInterval: 30 * 1000,  // 30 seconds
refetchInterval: 2 * 60 * 1000,  // 2 minutes
refetchInterval: false,  // Disable auto-refresh
```

### Disable Auto-Refresh
Remove or set to `false`:
```typescript
{
  staleTime: 30 * 1000,
  refetchInterval: false,           // ← Disable timer
  refetchOnWindowFocus: false,      // ← Disable focus refresh
  refetchOnMount: false,            // ← Disable mount refresh
}
```

## User Experience

### Visual Feedback
- **Pull-to-refresh**: White spinner appears at top of list while refreshing
- **Auto-refresh**: Silent background update (no visual indicator)
- **Loading state**: "Loading classes…" message shown during initial load

### Network Efficiency
- React Query caching prevents unnecessary requests
- `staleTime: 30 * 1000` means data is considered fresh for 30 seconds
- Multiple refresh triggers won't cause duplicate requests within stale time

## Future Improvements

### 1. WebSockets (Real-time)
For instant updates without polling:
```typescript
// Backend needs to support WebSocket connections
const socket = io('wss://un1t-back-end-development.up.railway.app');
socket.on('event:created', (newEvent) => {
  queryClient.setQueryData(['events', 'all'], (old) => [...old, newEvent]);
});
```

### 2. Push Notifications
Notify users of new events even when app is closed:
```typescript
// Expo Push Notifications
import * as Notifications from 'expo-notifications';
// Backend sends push when new event created
```

### 3. Optimistic Updates
Update UI immediately before server confirms:
```typescript
const { mutate } = useMutation({
  onMutate: async (newEvent) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['events']);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['events']);
    
    // Optimistically update
    queryClient.setQueryData(['events'], (old) => [...old, newEvent]);
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['events'], context.previous);
  },
});
```

## Troubleshooting

### Events not refreshing?
1. Check network connection
2. Verify token is valid (not expired)
3. Check React Query DevTools (if installed)
4. Look for errors in console

### Too many requests?
1. Increase `refetchInterval` to reduce frequency
2. Check `staleTime` is appropriate (current: 30s)
3. Consider disabling `refetchOnMount` if navigating frequently

### Pull-to-refresh not working?
1. Ensure `ScrollView` has `RefreshControl` prop
2. Check `refetchEvents` function is defined
3. Verify `refreshing` state updates correctly
