# HAPN Mobile

Expo/React Native mobile app. Art Deco dark theme.

## Architecture
- **Routing**: Expo Router (file-based, `app/` directory)
- **State**: Jotai (client) + React Query (server)
- **Storage**: expo-secure-store (tokens)
- **i18n**: i18next (Turkish + English)

## Patterns
- Feature-based modules: `features/{name}/hooks|services|store|types`
- Shared code: `shared/components/ui|services|lib|types`
- Import aliases: `@/features/*`, `@/shared/*`, `@/config/*`

## Design System
- Background: `#171612`, Surface: `#201d18`, Gold: `#d4af35`
- Text: champagne `#f2f0e9`, platinum `#b6b1a0`, muted `#9e9888`
- Icons: `@expo/vector-icons` Ionicons (ASLA emoji kullanma)
- Touch targets: minimum 44x44pt
- Spacing: 4, 8, 12, 16, 24, 32, 48 (8pt grid)
- Theme files: `shared/theme/` (colors, spacing, typography)

## Rules
- TypeScript strict, no `any`
- New components -> `shared/components/ui/`
- New strings -> `i18n/locales/en.json` + `tr.json`
- No console.log in production (use `__DEV__` guard)
- accessibilityLabel on all interactive elements
- Error, loading, empty states for all async operations

## Key Files
- `app/_layout.tsx` - Root providers
- `app/(tabs)/events.tsx` - Main screen (790 lines)
- `shared/services/api.ts` - Axios client
- `features/auth/store/authAtoms.ts` - Auth state
- `features/events/hooks/useEvents.ts` - Event data

## Knowledge Base
Full context: `/Users/fatihozata/hapn-kb/02-mobile/`
