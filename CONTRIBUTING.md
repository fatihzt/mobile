# Contributing Guidelines

## Code Style

- **TypeScript:** Strict mode aktif, `any` kullanımı yasak
- **Formatting:** Prettier kullanılır
- **Linting:** ESLint kurallarına uyulmalı

## Development Workflow

1. Feature branch oluştur: `git checkout -b feature/feature-name`
2. Değişiklikleri yap
3. Lint ve format kontrolü: `npm run lint && npm run format`
4. Test çalıştır: `npm test`
5. Commit ve push
6. Pull request oluştur

## Feature Development

### Yeni Feature Ekleme

1. `features/` altında yeni klasör oluştur
2. Feature yapısını oluştur:
   - `components/`
   - `hooks/`
   - `services/`
   - `store/`
   - `types.ts`
   - `index.ts`

3. Barrel export ekle (`index.ts`)
4. Feature'ı kullan

### Component Development

- shadcn/ui components kullan (`shared/components/ui/`)
- NativeWind classes ile styling
- TypeScript types tanımla
- Props interface oluştur

## Testing

- Unit tests: Jest
- Component tests: React Native Testing Library
- E2E tests: Detox/Maestro

## Commit Messages

- Format: `type(scope): message`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request

- Açıklayıcı title ve description
- Related issue varsa mention et
- Screenshots/video ekle (UI değişiklikleri için)
- Review beklenmeden merge etme

