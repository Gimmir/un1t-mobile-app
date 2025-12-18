# Studio Filtering & User Studio Selection

## Changes Made

### 1. **User's Studio as Default Selection** 👤
Previously, the first studio in the list was always selected by default. Now:
- The app checks the current user's assigned studio (`user.studio`)
- If the user has a studio and it exists in the list, it's selected automatically
- Otherwise, falls back to the first studio in the list

**File**: `components/classes-screen/use-classes-screen-data.ts`

```typescript
// Import current user hook
import { useCurrentUser } from '@/src/features/users/hooks/use-users';

// Get current user data
const { data: currentUser } = useCurrentUser();

// Set user's studio as default
useEffect(() => {
  if (!selectedStudioId && studios.length) {
    // Try to get user's studio first
    const userStudio = currentUser?.studio;
    const userStudioId = typeof userStudio === 'string' 
      ? userStudio 
      : (userStudio as any)?._id ?? (userStudio as any)?.id;
    
    if (userStudioId) {
      // Check if user's studio is in the list
      const studioExists = studios.some(s => s.id === userStudioId);
      if (studioExists) {
        setSelectedStudioId(userStudioId);
        return;
      }
    }
    
    // Fallback to first studio
    setSelectedStudioId(studios[0].id);
  }
}, [selectedStudioId, studios, currentUser]);
```

### 2. **Fixed Event Filtering by Studio** 🏢
Previously, the code was checking `event.location` which is a populated object (not always available).
Now it correctly uses `event.studio` which is the studio ID from the backend.

**Before** ❌:
```typescript
const filtered = allEvents.filter((event) => {
  const location = (event as any)?.location;
  const locationId = typeof location === 'string'
    ? location
    : location?._id ?? location?.id ?? (event as any)?.locationId ?? null;
  return locationId ? String(locationId) === String(selectedStudioId) : true;
});
```

**After** ✅:
```typescript
const filtered = allEvents.filter((event) => {
  // event.studio is the correct field - it's the studio ID from backend
  const studioId = event.studio;
  return studioId ? String(studioId) === String(selectedStudioId) : false;
});
```

### 3. **Updated Type Definitions** 📝
Fixed Event type to use correct User and Studio types instead of custom interfaces.

**File**: `DATA_TYPES/event.ts`

**Before**:
```typescript
export interface EventInstructor {
  _id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
}

export interface EventLocation {
  _id: string;
  name: string;
}

instructor?: EventInstructor;
location?: EventLocation;
```

**After**:
```typescript
import type { User } from './user';
import type { Studio } from './studio';

instructor?: User;    // Full User object with firstName, lastName, avatar
location?: Studio;    // Full Studio object with title
```

### 4. **Fixed Field Names Across Components** 🔧
Updated all components to use correct field names from User and Studio types:

#### User fields:
- ~~`first_name`~~ → `firstName` ✅
- ~~`last_name`~~ → `lastName` ✅
- ~~`image_url`~~ → `avatar` ✅

#### Studio fields:
- ~~`name`~~ → `title` ✅

**Files updated**:
- `components/events/event-card.tsx`
- `app/class-details/[id].tsx`

## How It Works Now

### User Experience Flow:

1. **User opens Classes screen**
   - App fetches current user data
   - App fetches all studios
   - App fetches all events

2. **Studio Selection**
   - If user has an assigned studio → that studio is selected
   - If user has no studio or it's not in the list → first studio is selected
   - User can manually change studio via dropdown

3. **Event Filtering**
   - Only events matching `event.studio === selectedStudioId` are shown
   - Calendar dots show only dates with events for selected studio
   - Events list shows only events for selected studio on selected date

4. **Auto-Refresh**
   - Events refresh every 60 seconds
   - Events refresh when app comes to foreground
   - User can pull-to-refresh manually

### Data Flow:

```
Current User
    ↓
user.studio (ID)
    ↓
Selected Studio ID
    ↓
Filter events where event.studio === selectedStudioId
    ↓
Display filtered events in calendar & list
```

## Benefits

✅ **Better UX**: Users see their own studio's classes by default
✅ **Correct Filtering**: Events are filtered by actual studio ID, not populated data
✅ **Type Safety**: Using proper User and Studio types instead of custom interfaces
✅ **Consistency**: All components use the same field names (firstName, avatar, title)

## Testing

### Test Cases:

1. **User with assigned studio**:
   - Login as user with `user.studio` set
   - Open Classes screen
   - Verify user's studio is selected in dropdown
   - Verify only that studio's events are shown

2. **User without assigned studio**:
   - Login as user without `user.studio`
   - Open Classes screen
   - Verify first studio in list is selected
   - Verify events are filtered correctly

3. **Manual studio change**:
   - Select different studio from dropdown
   - Verify calendar updates
   - Verify events list updates
   - Verify only selected studio's events are shown

4. **Empty states**:
   - Select studio with no events
   - Verify "No classes available for this date" message
   - Verify calendar has no dots

## Future Improvements

### Multi-Studio Users (Coaches/Admins):
If a user belongs to multiple studios (`user.studios[]`), we could:
- Show a "My Studios" filter option
- Allow quick switching between user's studios
- Highlight user's studios in the dropdown

### Studio Favorites:
- Allow users to favorite studios
- Show favorites at top of dropdown
- Remember last selected studio in AsyncStorage
