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
Navigate to the backend directory, install dependencies, set up your database, and start the development server.

```bash
cd backend
npm install
# Configure your environment variables (.env) with Supabase credentials
npx prisma generate
npx tsx watch src/index.ts # Starts the server with hot-reloading
```

### 2. Mobile App Setup
Navigate to the mobile directory, install dependencies, and launch the Expo development server.

```bash
cd mobile
npm install
npx expo start
```
*Note for Android Emulator Users: The frontend is configured to target `http://10.0.2.2:3000` to correctly route local API requests to your machine's `localhost:3000`.*

Scan the QR code shown in the terminal with the Expo Go app on your phone, or press `a` or `i` to open it in an Android Emulator or iOS Simulator.

## 📝 License
This project is for educational purposes (BSIT-3B MOBAPLAB).
