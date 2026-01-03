# Mobile App Architecture Documentation

## Overview

EventApp mobile uygulaması **Feature-Based Architecture** kullanılarak geliştirilmiştir. Her feature kendi klasöründe, bağımsız çalışabilir şekilde organize edilmiştir.

## Architecture Pattern

### Feature-Based Architecture

Her feature kendi klasöründe organize edilir:
- `components/` - Feature-specific UI components
- `hooks/` - Custom React hooks
- `services/` - API calls ve business logic
- `store/` - Jotai atoms (state management)
- `types.ts` - TypeScript type definitions
- `index.ts` - Barrel export

### Shared Code

`shared/` klasörü altında tüm uygulama genelinde kullanılan kodlar:
- `components/ui/` - shadcn/ui components
- `hooks/` - Shared hooks
- `lib/` - Utilities ve helpers
- `services/` - Core services (API client)
- `store/` - Global state atoms
- `types/` - Shared types

## State Management

### Jotai (Atomic State Management)

- **Feature-based atoms:** Her feature kendi atom'larına sahip
- **Global atoms:** Shared store'da global state
- **Async atoms:** `jotai/utils` ile async state yönetimi

### Example Usage

```typescript
// Feature atom
import { userAtom } from '../features/auth/store/authAtoms';
import { useAtom } from 'jotai';

const [user, setUser] = useAtom(userAtom);
```

## Routing

### Expo Router (File-Based Routing)

- `app/` klasörü altında file-based routing
- `(auth)/` - Auth stack
- `(tabs)/` - Tab navigation
- `event/[id].tsx` - Dynamic routes

## Styling

### NativeWind (Tailwind CSS)

- Utility-first CSS framework
- Tailwind classes ile styling
- `cn()` utility function ile class merging

## Type Safety

- TypeScript strict mode aktif
- Zod schemas ile runtime validation
- Tüm API response'ları type-safe

## Code Organization Rules

1. **Feature Independence:** Her feature bağımsız çalışabilmeli
2. **Barrel Exports:** Her feature `index.ts` ile export edilmeli
3. **Shared Code:** Feature'lar arası paylaşılan kod `shared/` altında
4. **Naming Conventions:**
   - Components: PascalCase
   - Hooks: camelCase, `use` prefix
   - Services: camelCase
   - Types: PascalCase, `Type` suffix
   - Atoms: camelCase, `Atom` suffix

## File Structure

```
mobile/
├── app/                    # Expo Router
├── features/               # Feature modules
│   ├── auth/
│   ├── events/
│   ├── notifications/
│   └── profile/
├── shared/                 # Shared code
│   ├── components/ui/     # shadcn/ui
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
├── config/                # Configuration
└── assets/                # Static assets
```

## Best Practices

1. **Feature Isolation:** Feature'lar birbirine bağımlı olmamalı
2. **Type Safety:** `any` kullanımı yasak
3. **Error Handling:** Tüm async işlemlerde error handling
4. **Performance:** React Query cache, memoization, lazy loading
5. **Security:** SecureStore, input validation, token management

