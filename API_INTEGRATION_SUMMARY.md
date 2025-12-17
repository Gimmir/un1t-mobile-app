# Backend API Integration - Complete Setup

## ✅ Files Created/Updated

### 1. Environment Configuration
- **`.env`** - Backend URL configuration
  ```
  API_URL=https://un1t-back-end-development.up.railway.app
  ```

### 2. TypeScript Types
- **`src/types/api.d.ts`** - Updated with flexible LoginResponse
  - Supports both `token` and `accessToken` fields
  - All required interfaces for API communication

### 3. Storage Layer
- **`src/lib/storage.ts`** - MMKV encrypted storage
  - Secure token storage with encryption
  - Type-safe storage utilities

### 4. HTTP Client
- **`src/lib/axios.ts`** - Axios instance with interceptors
  - ✅ Auto-adds `Authorization: Bearer <token>` to all requests
  - ✅ Handles 401 errors → auto logout + redirect to login
  - ✅ Global error handling for all HTTP errors

### 5. Query Configuration
- **`src/lib/query-client.ts`** - TanStack Query setup
  - Retry logic, stale time, cache management

### 6. Generic Hooks
- **`src/hooks/useFetch.ts`** - Reusable data fetching hooks
  - `useFetch` - for GET requests
  - `useMutate` - for POST/PUT/DELETE requests

### 7. Auth API
- **`src/features/auth/api/auth.api.ts`** - Auth endpoints
  - `authApi.login()` - POST /auth/login
  - `authApi.logout()` - POST /auth/logout
  - Ready for expansion (register, reset password, etc.)

### 8. Auth Hooks
- **`src/features/auth/hooks/use-auth.ts`** - Auth business logic
  - ✅ `useLogin()` - handles flexible token naming (token OR accessToken)
  - ✅ Saves token to encrypted MMKV storage
  - ✅ `useLogout()` - clears storage and redirects

### 9. Login Screen Integration
- **`app/(auth)/login.tsx`** - Full API integration
  - ✅ Connected to `useLogin()` hook
  - ✅ Loading state with ActivityIndicator
  - ✅ Error handling with Alert dialogs
  - ✅ Success Alert with navigation to /(tabs)
  - ✅ Disabled inputs during API request
  - ✅ Form validation with Zod

## 🚀 How It Works

### Login Flow:
1. User enters email/password
2. Form validation (Zod schema)
3. `useLogin()` hook calls `authApi.login()` via Axios
4. Axios interceptor adds headers if needed
5. Backend responds with token (either `token` or `accessToken`)
6. Hook stores token in MMKV encrypted storage
7. Success Alert shown → Navigate to /(tabs)
8. All future API requests auto-include `Authorization: Bearer <token>`

### Error Handling:
- **Network errors** - "Network error. Please check your connection."
- **401 Unauthorized** - Auto logout + redirect to login
- **Other errors** - Alert with server error message

### Security Features:
- ✅ MMKV encrypted storage for tokens
- ✅ Automatic token injection via Axios interceptor
- ✅ Auto logout on 401 (expired/invalid token)
- ✅ Secure token handling (flexible naming support)

## 📝 Test Credentials
```
Email: admin@un1t.com
Password: 123qwe23
```

## 🔧 Usage Examples

### In any component/screen:
```tsx
import { useLogin, useLogout } from '@/src/features/auth/hooks/use-auth';

// Login
const { mutate: login, isPending } = useLogin();
login({ email: 'user@example.com', password: 'pass123' });

// Logout
const { mutate: logout } = useLogout();
logout();
```

### Making authenticated API calls:
```tsx
import { api } from '@/src/lib/axios';

// GET request (token auto-added)
const user = await api.get<User>('/users/me');

// POST request (token auto-added)
const order = await api.post<Order>('/orders', orderData);
```

## ✨ Key Features Implemented
- [x] Environment variables (.env)
- [x] MMKV encrypted storage
- [x] Axios with interceptors (auto token, auto logout on 401)
- [x] TanStack Query configuration
- [x] Generic reusable hooks (useFetch, useMutate)
- [x] TypeScript types with flexible token naming
- [x] Auth API endpoints
- [x] useLogin/useLogout hooks with flexible token handling
- [x] Login screen with full integration:
  - Loading state (ActivityIndicator)
  - Error handling (Alert)
  - Success navigation
  - Disabled inputs during request

## 🎯 Ready to Use!
All files are created and integrated. The app is ready to connect to your backend API.
