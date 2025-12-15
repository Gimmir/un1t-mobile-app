# Project Structure Visualization

```
un1t-mobile-app/
│
├── 📱 app/                                # Expo Router (File-system routing)
│   ├── _layout.tsx                       # ✅ Root layout with providers
│   ├── (tabs)/                           # Tab navigation
│   │   ├── _layout.tsx                   # Tab bar configuration
│   │   ├── index.tsx                     # Home screen
│   │   └── explore.tsx                   # Explore screen
│   └── modal.tsx                         # Modal example
│
├── 🏗️ src/                               # Source code (Feature-based architecture)
│   │
│   ├── features/                         # Feature modules
│   │   │
│   │   ├── 🔐 auth/                      # Authentication feature
│   │   │   ├── api/
│   │   │   │   └── auth.api.ts          # ✅ Login, register, logout endpoints
│   │   │   ├── hooks/
│   │   │   │   └── use-auth.ts          # ✅ useLogin, useLogout hooks
│   │   │   └── components/
│   │   │       └── (your login forms)
│   │   │
│   │   ├── 📦 orders/                    # Orders feature
│   │   │   ├── api/
│   │   │   │   └── orders.api.ts        # ✅ CRUD operations for orders
│   │   │   ├── hooks/
│   │   │   │   └── use-orders.ts        # ✅ useOrders, useCreateOrder, etc.
│   │   │   └── components/
│   │   │       └── (your order lists, cards)
│   │   │
│   │   └── 👤 profile/                   # Profile feature
│   │       ├── api/
│   │       │   └── profile.api.ts       # ✅ Get/update profile endpoints
│   │       ├── hooks/
│   │       │   └── (your profile hooks)
│   │       └── components/
│   │           └── (your profile components)
│   │
│   ├── lib/                              # Core utilities
│   │   ├── axios.ts                     # ✅ Axios + interceptors + auto-logout
│   │   ├── storage.ts                   # ✅ MMKV storage utilities
│   │   └── query-client.ts              # ✅ TanStack Query config
│   │
│   ├── hooks/                            # Shared hooks
│   │   └── useFetch.ts                  # ✅ Generic API hooks wrapper
│   │
│   ├── types/                            # TypeScript types
│   │   └── api.d.ts                     # ✅ Backend API DTOs
│   │
│   └── utils/                            # Helper functions
│       └── (your utilities)
│
├── ⚙️ Configuration Files
│   ├── tailwind.config.js               # ✅ Tailwind CSS config
│   ├── metro.config.js                  # ✅ Metro bundler + NativeWind
│   ├── tsconfig.json                    # ✅ TypeScript strict mode
│   ├── global.css                       # ✅ Tailwind directives
│   └── nativewind-env.d.ts              # ✅ NativeWind types
│
├── 📚 Documentation
│   ├── ARCHITECTURE.md                  # ✅ Full architecture guide
│   ├── SETUP_SUMMARY.md                 # ✅ Setup & next steps
│   └── README.md                        # Original Expo README
│
└── 🔐 Environment
    └── .env.example                     # ✅ Environment template


═══════════════════════════════════════════════════════════════
                    DATA FLOW ARCHITECTURE
═══════════════════════════════════════════════════════════════

┌─────────────┐
│   Screen    │  (app/orders.tsx)
│  Component  │
└──────┬──────┘
       │ uses
       ▼
┌─────────────┐
│   Feature   │  (src/features/orders/hooks/use-orders.ts)
│    Hook     │  ← useOrders(), useCreateOrder()
└──────┬──────┘
       │ calls
       ▼
┌─────────────┐
│  Generic    │  (src/hooks/useFetch.ts)
│    Hook     │  ← useFetch(), useMutate()
└──────┬──────┘
       │ wraps
       ▼
┌─────────────┐
│  TanStack   │  (src/lib/query-client.ts)
│    Query    │  ← useQuery(), useMutation()
└──────┬──────┘
       │ uses
       ▼
┌─────────────┐
│   Feature   │  (src/features/orders/api/orders.api.ts)
│     API     │  ← ordersApi.getOrders()
└──────┬──────┘
       │ uses
       ▼
┌─────────────┐
│    Axios    │  (src/lib/axios.ts)
│  Instance   │  ← api.get(), api.post()
└──────┬──────┘
       │ interceptor injects
       ▼
┌─────────────┐
│    MMKV     │  (src/lib/storage.ts)
│   Storage   │  ← storageUtils.getString()
└─────────────┘


═══════════════════════════════════════════════════════════════
                    AUTHENTICATION FLOW
═══════════════════════════════════════════════════════════════

User Login:
1. User enters credentials in LoginScreen
2. useLogin() hook is called
3. authApi.login() sends POST to /auth/login
4. Axios interceptor adds headers
5. On success:
   ├─ Store accessToken in MMKV
   ├─ Store refreshToken in MMKV
   ├─ Store user data in MMKV
   └─ Navigate to home screen

Authenticated Request:
1. Component calls useOrders()
2. ordersApi.getOrders() triggers
3. Axios request interceptor:
   ├─ Reads token from MMKV
   ├─ Injects Bearer token in headers
   └─ Sends request

Auto Logout (401):
1. Backend returns 401 Unauthorized
2. Axios response interceptor catches it
3. Clears all MMKV storage
4. Redirects to /login


═══════════════════════════════════════════════════════════════
                         TECH STACK
═══════════════════════════════════════════════════════════════

Framework:           Expo SDK 54
React Native:        0.81+ (New Architecture)
Language:            TypeScript 5.7+ (Strict)
Routing:             Expo Router v6
Styling:             NativeWind v4 (Tailwind)
API State:           TanStack Query v5
HTTP Client:         Axios
Storage:             react-native-mmkv
Lists:               @shopify/flash-list
Forms:               react-hook-form
Validation:          zod
