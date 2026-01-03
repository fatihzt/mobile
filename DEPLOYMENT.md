# iOS Deployment Guide

## Prerequisites

1. **Apple Developer Account** ($99/yıl)
2. **EAS CLI** installed globally: `npm install -g eas-cli`
3. **Expo Account** (free tier yeterli)

## Setup Steps

### 1. EAS Login

```bash
eas login
```

### 2. Configure EAS Project

```bash
eas build:configure
```

Bu komut `eas.json` dosyasını oluşturur/günceller.

### 3. Environment Variables

`.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_URL=https://your-production-api.com/api
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_EAS_PROJECT_ID=your-project-id
```

### 4. Build for Production

```bash
# iOS production build
eas build --platform ios --profile production
```

### 5. Submit to App Store

```bash
# Submit to App Store
eas submit --platform ios
```

## TestFlight Beta Testing

1. Build oluşturulduktan sonra otomatik olarak TestFlight'a yüklenir
2. App Store Connect'te TestFlight sekmesinden test kullanıcıları ekleyin
3. Beta test yapıldıktan sonra production'a submit edin

## App Store Connect Setup

1. **App Information:**
   - App name, subtitle, category
   - Privacy Policy URL (zorunlu)
   - Support URL

2. **Pricing and Availability:**
   - Price tier (ücretsiz için Free)
   - Availability (hangi ülkelerde)

3. **App Store Screenshots:**
   - iPhone 6.7" (1290x2796)
   - iPhone 6.5" (1242x2688)
   - iPhone 5.5" (1242x2208)
   - iPad Pro 12.9" (2048x2732)

4. **App Description:**
   - Türkçe ve İngilizce
   - Keywords
   - Promotional text

5. **Age Rating:**
   - Content rating questionnaire doldurun

## Version Management

- **Version:** Semantic versioning (1.0.0)
- **Build Number:** Her build için artırılmalı
- `app.config.js` içinde `ios.buildNumber` güncellenmeli

## Troubleshooting

### Build Fails

- EAS Build logs kontrol edin
- Environment variables doğru mu kontrol edin
- Dependencies güncel mi kontrol edin

### App Store Rejection

- App Store Review Guidelines'a uygunluk kontrol edin
- Privacy Policy URL çalışıyor mu kontrol edin
- Screenshots ve description doğru mu kontrol edin

