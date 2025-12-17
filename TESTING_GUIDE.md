# 🧪 Testing Your API Integration

## Quick Start Test

### 1. Start the Development Server
```bash
npm start
# or
npx expo start
```

### 2. Test Login Flow

#### Open the app and navigate to Login screen
- Click "Get Started" or "Login" button from home screen
- Navigate to `app/(auth)/login.tsx`

#### Enter Test Credentials
```
Email: admin@un1t.com
Password: 123qwe23
```

#### Expected Behavior:
1. ✅ Form validates email and password
2. ✅ "LOGIN" button triggers API call
3. ✅ ActivityIndicator shows during request
4. ✅ Inputs are disabled during loading
5. ✅ On success: Alert "Login successful!" appears
6. ✅ After clicking OK: Navigate to /(tabs) home screen
7. ✅ Token is saved in MMKV encrypted storage
8. ✅ All future API requests include `Authorization: Bearer <token>` header

#### If Login Fails:
1. ✅ Alert shows error message from backend
2. ✅ User can retry login
3. ✅ No navigation occurs

### 3. Verify Token Storage

Add this to any screen to check stored token:
```tsx
import { authUtils } from '@/src/features/auth/utils/auth-utils';

useEffect(() => {
  const token = authUtils.getToken();
  const user = authUtils.getUser();
  console.log('Token:', token);
  console.log('User:', user);
}, []);
```

## 🔍 Debugging

### Check Network Requests

#### Using React Native Debugger:
```bash
# Install React Native Debugger (if not installed)
brew install --cask react-native-debugger

# Start debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

#### Using Console Logs:
The integration already includes console logs:
- ✅ "Login successful, token stored" - on successful login
- ✅ "Login failed: <error>" - on login error
- ✅ "No token received from backend" - if backend response is missing token

### Check Axios Requests

Add this to `src/lib/axios.ts` for detailed logging:
```typescript
// Add after line 25 (in request interceptor)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageUtils.getString(StorageKeys.AUTH_TOKEN);
    
    // 🔍 DEBUG: Log request
    console.log('🔵 API Request:', config.method?.toUpperCase(), config.url);
    console.log('🔑 Token:', token ? 'Present' : 'Missing');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  // ... rest
);

// Add after line 45 (in response interceptor)
apiClient.interceptors.response.use(
  (response) => {
    // 🔍 DEBUG: Log response
    console.log('🟢 API Response:', response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    // 🔍 DEBUG: Log error
    console.log('🔴 API Error:', error.config?.url, error.response?.status);
    
    // ... rest of error handling
  }
);
```

## 🧪 Manual API Testing

### Test Login Endpoint with cURL
```bash
curl -X POST https://un1t-back-end-development.up.railway.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@un1t.com",
    "password": "123qwe23"
  }'
```

Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  // OR
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@un1t.com"
  }
}
```

### Test Authenticated Endpoint
```bash
# First, get token from login
TOKEN="<paste-token-here>"

# Then test protected endpoint
curl https://un1t-back-end-development.up.railway.app/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Common Issues & Solutions

### Issue: "Network error. Please check your connection."
**Solution:**
1. Check if backend is running: https://un1t-back-end-development.up.railway.app
2. Check internet connection
3. Verify `.env` file exists with correct `API_URL`
4. Restart Metro bundler: `npx expo start --clear`

### Issue: 401 Unauthorized after login
**Solution:**
1. Token might be expired - logout and login again
2. Backend might have changed token format
3. Check console logs for token storage
4. Verify `Authorization` header is added (check axios interceptor)

### Issue: Login button does nothing
**Solution:**
1. Check console for errors
2. Verify `useLogin` hook is properly imported
3. Check form validation - ensure email/password pass validation
4. Add console.log in `onSubmit` to debug

### Issue: App crashes on login
**Solution:**
1. Check TypeScript errors: `npx tsc --noEmit`
2. Check for missing dependencies
3. Clear cache: `npx expo start --clear`
4. Check console logs for error stack trace

### Issue: Token not saving to storage
**Solution:**
1. Check `use-auth.ts` - verify token extraction logic
2. Add console.log to see backend response
3. Verify MMKV is properly initialized
4. Check if backend returns `token` or `accessToken`

## ✅ Success Checklist

After implementation, verify:
- [ ] `.env` file exists with API_URL
- [ ] Login screen shows loading indicator during request
- [ ] Login inputs are disabled during request
- [ ] Success alert shows on successful login
- [ ] Error alert shows on failed login
- [ ] Navigation to /(tabs) occurs after successful login
- [ ] Token is stored in MMKV (check with authUtils.getToken())
- [ ] Logout clears storage and redirects to login
- [ ] Future API requests include Authorization header
- [ ] 401 errors trigger auto-logout

## 📊 Testing Different Scenarios

### Test Case 1: Valid Login
```
Email: admin@un1t.com
Password: 123qwe23
Expected: ✅ Success alert → Navigate to /(tabs)
```

### Test Case 2: Invalid Password
```
Email: admin@un1t.com
Password: wrongpassword
Expected: ❌ Error alert with message
```

### Test Case 3: Invalid Email Format
```
Email: notanemail
Password: 123qwe23
Expected: ❌ Form validation error before API call
```

### Test Case 4: Empty Fields
```
Email: (empty)
Password: (empty)
Expected: ❌ Form validation errors
```

### Test Case 5: Network Offline
```
1. Turn off internet/WiFi
2. Try to login
Expected: ❌ "Network error. Please check your connection."
```

## 🎯 Next Steps

After successful login test:
1. Test logout functionality
2. Add authentication checks to protected screens
3. Test token persistence (close/reopen app)
4. Implement auto-login if token exists
5. Add token refresh logic (if using refresh tokens)

## 📝 Notes

- All API calls automatically include the token (via Axios interceptor)
- 401 errors automatically logout user
- Token is encrypted in MMKV storage
- Form validation happens before API call (saves unnecessary requests)
- Error messages come from backend response or fallback to generic messages
