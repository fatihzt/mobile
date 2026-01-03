# 📱 EventApp Mobile - Expo Router + NativeWind + i18n

Mobile application development project. Built with Expo Router, NativeWind, and i18n.

---

## 🚀 Getting Started

### Requirements
- Node.js 18+
- npm or yarn
- Expo Go app (on your iOS/Android phone)

### Installation

```bash
# Install dependencies
npm install

# Start Expo development server
npm start
# or
npx expo start
```

### Testing with Expo Go

1. Download Expo Go app on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code when the development server starts
3. The app will open on your phone!

### Environment Variables

Create a `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
```

**Note:** Your backend must be running and on the same network. For localhost:
- iOS Simulator: `http://localhost:3000/api` works
- Android Emulator: Use `http://10.0.2.2:3000/api`
- Physical device: Use your computer's IP address (e.g., `http://192.168.1.100:3000/api`)

## 📁 Project Structure

```
mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (auth)/            # Auth stack
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/            # Tab navigation
│   │   ├── events.tsx
│   │   └── profile.tsx
│   ├── event/[id].tsx     # Dynamic route
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Index route
├── components/            # Reusable components
├── context/               # React Context providers
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── services/              # API calls, auth, etc.
│   ├── api.ts            # Axios instance
│   ├── auth.ts           # Authentication service
│   └── events.ts         # Events service
├── i18n/                  # Internationalization
│   ├── config.ts
│   └── locales/
│       ├── tr.json
│       └── en.json
├── types/                 # TypeScript type definitions
├── constants/             # App constants, config
└── assets/                # Images, fonts, etc.
```

## 📦 Technologies Used

- **Expo SDK 54** - React Native framework
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **i18next + react-i18next** - Internationalization
- **TypeScript** - Type safety
- **React Query (TanStack Query)** - Data fetching & caching
- **Expo Secure Store** - Secure token storage
- **Expo Notifications** - Push notifications
- **Axios** - HTTP client

## 🎨 UI/UX

- Modern and user-friendly interface
- Styling with NativeWind (Tailwind CSS)
- Responsive design
- Pull-to-refresh support
- Multi-language support (TR/EN)

## 📱 Features

- ✅ User registration/login
- ✅ Event list display
- ✅ Event details
- ✅ Event RSVP
- ✅ City-based filtering
- ✅ Search functionality
- ✅ Pull-to-refresh
- ✅ **Push Notifications** (Expo Push API)
- ✅ i18n (Turkish/English)
- 🔜 Offline support
- 🔜 Map integration

## 🔔 Push Notifications

Push notification system is fully integrated:

1. **Mobile**: When user logs in, push token is automatically obtained and sent to backend
2. **Backend**: When a new event is added, push notifications are sent to all users in the relevant city
3. **Expo Push API**: Backend sends notifications using Expo Push API

### Testing Push Notifications

1. Open the app on a physical device (doesn't work on simulator)
2. Log in
3. Create a new event on the backend or run sync
4. You should receive a notification!

## 🌍 i18n (Internationalization)

The app comes with Turkish and English support. Language files are in the `i18n/locales/` folder.

To add a new language:
1. Create a new JSON file under `i18n/locales/`
2. Add it to `i18n/config.ts`

## 🔗 Backend Integration

Backend API base URL should be defined in `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### API Endpoints Usage

- `GET /api/events` - Event list
- `GET /api/events/:id` - Event details
- `POST /api/events/:id/rsvp` - RSVP
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup
- `POST /api/notifications/register` - Push token registration

## 🚀 Development

```bash
# Start development server
npm start

# Run on iOS simulator (Mac required)
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## 🚀 Production Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Create build
eas build --platform ios
eas build --platform android
eas build --platform all
```

## 📝 Notes

- **Push Notifications**: Only works on physical devices, not on simulator
- **EAS Project ID**: Required for push notifications (in `.env` file)
- **Backend**: Your backend must be running
- **CORS**: Check CORS settings on backend

## 🐛 Troubleshooting

### Cannot connect to backend
- Make sure your backend is running
- Check `EXPO_PUBLIC_API_URL` value in `.env` file
- If using a physical device, use your computer's IP address
- Check CORS settings (on backend)

### Push notifications not working
- Are you using a physical device? (Doesn't work on simulator)
- Is EAS Project ID correct?
- Were notification permissions granted?
- Is Expo Push API integration correct on backend?

### NativeWind not working
- Check `metro.config.js` file
- Check `babel.config.js` file
- Make sure `global.css` is imported
- Restart development server

## 📚 Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [i18next Documentation](https://www.i18next.com/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push API](https://docs.expo.dev/push-notifications/push-notifications-setup/)

---

# 📱 EventApp Mobile - Expo Router + NativeWind + i18n

Mobil uygulama geliştirme projesi. Expo Router, NativeWind ve i18n kullanılarak geliştirilmiştir.

---

## 🚀 Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo Go app (iOS/Android telefonunuzda)

### Kurulum

```bash
# Dependencies yükle
npm install

# Expo development server başlat
npm start
# veya
npx expo start
```

### Expo Go ile Test Etme

1. Telefonunuzda Expo Go uygulamasını indirin:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Development server başladığında QR kodu tarayın
3. Uygulama telefonunuzda açılacak!

### Environment Variables

`.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_EAS_PROJECT_ID=your-eas-project-id
```

**Not:** Backend'iniz çalışıyor olmalı ve aynı network'te olmalısınız. Localhost için:
- iOS Simulator: `http://localhost:3000/api` çalışır
- Android Emulator: `http://10.0.2.2:3000/api` kullanın
- Fiziksel cihaz: Bilgisayarınızın IP adresini kullanın (örn: `http://192.168.1.100:3000/api`)

## 📁 Proje Yapısı

```
mobile/
├── app/                    # Expo Router (file-based routing)
│   ├── (auth)/            # Auth stack
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/            # Tab navigation
│   │   ├── events.tsx
│   │   └── profile.tsx
│   ├── event/[id].tsx     # Dynamic route
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Index route
├── components/            # Reusable components
├── context/               # React Context providers
│   ├── AuthContext.tsx
│   └── NotificationContext.tsx
├── services/              # API calls, auth, etc.
│   ├── api.ts            # Axios instance
│   ├── auth.ts           # Authentication service
│   └── events.ts         # Events service
├── i18n/                  # Internationalization
│   ├── config.ts
│   └── locales/
│       ├── tr.json
│       └── en.json
├── types/                 # TypeScript type definitions
├── constants/             # App constants, config
└── assets/                # Images, fonts, etc.
```

## 📦 Kullanılan Teknolojiler

- **Expo SDK 54** - React Native framework
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **i18next + react-i18next** - Internationalization
- **TypeScript** - Type safety
- **React Query (TanStack Query)** - Data fetching & caching
- **Expo Secure Store** - Secure token storage
- **Expo Notifications** - Push notifications
- **Axios** - HTTP client

## 🎨 UI/UX

- Modern ve kullanıcı dostu arayüz
- NativeWind (Tailwind CSS) ile styling
- Responsive tasarım
- Pull-to-refresh desteği
- Çoklu dil desteği (TR/EN)

## 📱 Özellikler

- ✅ Kullanıcı kayıt/giriş
- ✅ Event listesi görüntüleme
- ✅ Event detayları
- ✅ Event RSVP
- ✅ Şehir bazlı filtreleme
- ✅ Arama özelliği
- ✅ Pull-to-refresh
- ✅ **Push Notifications** (Expo Push API)
- ✅ i18n (Türkçe/İngilizce)
- 🔜 Offline support
- 🔜 Harita entegrasyonu

## 🔔 Push Notifications

Push notification sistemi tamamen entegre edilmiştir:

1. **Mobile**: Kullanıcı giriş yaptığında otomatik olarak push token alınır ve backend'e gönderilir
2. **Backend**: Yeni etkinlik eklendiğinde ilgili şehirdeki tüm kullanıcılara push notification gönderilir
3. **Expo Push API**: Backend Expo Push API kullanarak notification gönderir

### Push Notification Test Etme

1. Fiziksel cihazda uygulamayı açın (simulator'da çalışmaz)
2. Giriş yapın
3. Backend'de yeni bir etkinlik oluşturun veya sync çalıştırın
4. Notification almalısınız!

## 🌍 i18n (Internationalization)

Uygulama Türkçe ve İngilizce desteği ile gelir. Dil dosyaları `i18n/locales/` klasöründe.

Yeni dil eklemek için:
1. `i18n/locales/` altında yeni bir JSON dosyası oluşturun
2. `i18n/config.ts` dosyasına ekleyin

## 🔗 Backend Entegrasyonu

Backend API base URL'i `.env` dosyasında tanımlanmalı:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### API Endpoints Kullanımı

- `GET /api/events` - Event listesi
- `GET /api/events/:id` - Event detayı
- `POST /api/events/:id/rsvp` - RSVP
- `POST /api/auth/login` - Giriş
- `POST /api/auth/signup` - Kayıt
- `POST /api/notifications/register` - Push token kaydı

## 🚀 Development

```bash
# Development server başlat
npm start

# iOS simulator'da çalıştır (Mac gerekli)
npm run ios

# Android emulator'da çalıştır
npm run android

# Web'de çalıştır
npm run web
```

## 🚀 Production Build

```bash
# EAS CLI yükle
npm install -g eas-cli

# EAS'a login ol
eas login

# Build oluştur
eas build --platform ios
eas build --platform android
eas build --platform all
```

## 📝 Notlar

- **Push Notifications**: Sadece fiziksel cihazlarda çalışır, simulator'da çalışmaz
- **EAS Project ID**: Push notification için EAS Project ID gerekli (`.env` dosyasında)
- **Backend**: Backend'inizin çalışıyor olması gerekiyor
- **CORS**: Backend'de CORS ayarlarını kontrol edin

## 🐛 Sorun Giderme

### Backend'e bağlanamıyorum
- Backend'inizin çalıştığından emin olun
- `.env` dosyasındaki `EXPO_PUBLIC_API_URL` değerini kontrol edin
- Fiziksel cihaz kullanıyorsanız, bilgisayarınızın IP adresini kullanın
- CORS ayarlarını kontrol edin (backend'de)

### Push notification çalışmıyor
- Fiziksel cihaz kullanıyor musunuz? (Simulator'da çalışmaz)
- EAS Project ID doğru mu?
- Bildirim izni verildi mi?
- Backend'de Expo Push API entegrasyonu doğru mu?

### NativeWind çalışmıyor
- `metro.config.js` dosyasını kontrol edin
- `babel.config.js` dosyasını kontrol edin
- `global.css` dosyasının import edildiğinden emin olun
- Development server'ı yeniden başlatın

## 📚 Kaynaklar

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [i18next Documentation](https://www.i18next.com/)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push API](https://docs.expo.dev/push-notifications/push-notifications-setup/)
