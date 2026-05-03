# LifeTrack

LifeTrack is a full-stack mobile application that helps users manage and organize their daily activities. The cross-platform mobile app is built with React Native and Expo, while the backend is powered by Node.js and Prisma.

## 🚀 Technologies Used

### Mobile (Frontend)
*   [React Native](https://reactnative.dev/)
*   [Expo](https://expo.dev/)
*   [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
*   TypeScript

### Backend
*   [Node.js](https://nodejs.org/)
*   [Prisma ORM](https://www.prisma.io/)
*   TypeScript

## 📂 Project Structure

```text
lifetrack-app/
├── backend/            # Node.js + Prisma backend API
│   ├── prisma/         # Prisma schema and migrations
│   └── ...
└── mobile/             # React Native / Expo application
    ├── app/            # Expo Router file-based routing
    │   ├── (auth)/     # Authentication screens (login, create profile)
    │   ├── (tabs)/     # Main tab navigation
    │   └── ...
    └── src/            # Additional source files and screens
```

## 🛠️ Getting Started

### Prerequisites
*   Node.js installed
*   A package manager (npm, yarn, or pnpm)
*   Expo Go app on your physical device or an emulator/simulator setup

### 1. Backend Setup
Navigate to the backend directory, install dependencies, and set up your database with Prisma.

```bash
cd backend
npm install
# Configure your environment variables (.env) if necessary
npx prisma generate
npm run dev # or the specific start script in your package.json
```

### 2. Mobile App Setup
Navigate to the mobile directory, install dependencies, and launch the Expo development server.

```bash
cd mobile
npm install
npx expo start
```
Scan the QR code shown in the terminal with the Expo Go app on your phone, or press `a` or `i` to open it in an Android Emulator or iOS Simulator.

## 📝 License
This project is for educational purposes (BSIT-3B MOBAPLAB).
