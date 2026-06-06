# NaiPoMemories 📸🎥

A mobile application similar to [Locket Widget](https://locket.cam), built with **React Native + Expo + TypeScript**. Share photos and short videos (up to 2 minutes) directly with your close friends.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Explanation](#2-architecture-explanation)
3. [Folder Structure](#3-folder-structure)
4. [Firebase Setup](#4-firebase-setup)
5. [Cloudinary Setup](#5-cloudinary-setup)
6. [Environment Setup](#6-environment-setup)
7. [How to Run Locally](#7-how-to-run-locally)
8. [Authentication Flow](#8-authentication-flow)
9. [Friend Request Flow](#9-friend-request-flow)
10. [Media Upload Flow](#10-media-upload-flow)
11. [Feed Flow](#11-feed-flow)
12. [Future Scalability Considerations](#12-future-scalability-considerations)

---

## 1. Project Overview

NaiPoMemories lets users:

- **Register / Login / Logout** — via Firebase Authentication
- **Search friends by email** — find other users
- **Send / accept / reject friend requests** — manage connections
- **Capture photos** — using the device camera
- **Record short videos** — up to 120 seconds
- **Share media** — upload to Cloudinary, save metadata to Firestore
- **View a feed** — see their own posts and friends' posts, sorted newest first

**Tech Stack:**

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 56) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router (file-based) |
| Server State | TanStack React Query |
| Client State | Zustand |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Auth | Firebase Authentication |
| Database | Firestore |
| Media Storage | Cloudinary |

---

## 2. Architecture Explanation

This project follows **Clean Architecture** principles with a strict data flow:

```
Screen  →  Hook  →  Service  →  Repository  →  Firebase / Cloudinary
```

| Layer | Responsibility |
|---|---|
| **Screen** | UI only. Calls hooks, renders data. No business logic. |
| **Hook** | Connects React Query / Zustand / React Hook Form to the service layer. |
| **Service** | Business logic, input validation, orchestration of multiple repo calls. |
| **Repository** | The **only** layer that talks directly to Firebase or Cloudinary. |

**Rules:**
- Screens NEVER import from repositories directly.
- Services NEVER import from React or Expo Router.
- Repositories NEVER contain business logic.

---

## 3. Folder Structure

```
src/
├── app/                    # Expo Router file-based navigation
│   ├── _layout.tsx         # Root layout: QueryClient + auth listener
│   ├── index.tsx           # Root redirect (auth → feed or login)
│   ├── (auth)/             # Unauthenticated routes (login, register)
│   └── (app)/              # Authenticated routes (tabs: feed, camera, friends, profile)
│
├── features/               # Feature-based modules (main business logic)
│   ├── auth/               # Login, register, logout
│   ├── profile/            # User profile, Firestore user documents
│   ├── friends/            # Friend requests and friendships
│   ├── posts/              # Post creation and feed
│   ├── camera/             # Camera UI and recording
│   └── media/              # Cloudinary upload
│
├── components/
│   ├── ui/                 # Reusable UI: Button, Input, Avatar, Loader...
│   └── layout/             # ScreenContainer, Header
│
├── store/                  # Zustand stores (client-only state)
│   ├── auth.store.ts       # isAuthenticated, user, isInitializing
│   └── app.store.ts        # theme, network, global loading
│
├── lib/
│   └── firebase.ts         # Firebase app initialization (singleton)
│
├── theme/                  # Design tokens (Stitch-ready)
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── shadows.ts
│
├── constants/
│   ├── queryKeys.ts        # React Query keys factory
│   ├── routes.ts           # Route path constants
│   └── storageKeys.ts      # AsyncStorage / SecureStore keys
│
├── utils/
│   ├── date.utils.ts       # Timestamp formatting, timeAgo
│   ├── validation.utils.ts # Email check, file size, video duration
│   └── error.utils.ts      # AppError, FirebaseAuthError, getErrorMessage
│
└── types/
    └── index.ts            # Global shared types
```

---

## 4. Firebase Setup

> You need a free Firebase account: https://firebase.google.com

### Step-by-step

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**
2. Name it (e.g., `naipo-memories`) → Continue → Create project

### Enable Authentication

3. In the left sidebar: **Build → Authentication → Get started**
4. Enable **Email/Password** provider → Save

### Create Firestore Database

5. **Build → Firestore Database → Create database**
6. Choose **Start in test mode** (for development) → Next → Enable
7. **Important:** In Firestore, go to **Rules** tab and add these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /friendRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.senderId;
      allow update: if request.auth.uid == resource.data.receiverId;
    }
    match /friendships/{friendshipId} {
      allow read, create: if request.auth != null;
    }
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Get Firebase Config

8. **Project Settings** (gear icon) → **Your apps** → Click `</>` (Web)
9. Register app (any nickname) → Copy the `firebaseConfig` object values

---

## 5. Cloudinary Setup

> You need a free Cloudinary account: https://cloudinary.com

### Step-by-step

1. Sign up at [Cloudinary](https://cloudinary.com) → Dashboard
2. Note your **Cloud Name** from the dashboard top (e.g., `dxxxxxx`)

### Create an Upload Preset

3. **Settings** (gear icon) → **Upload** tab → Scroll to **Upload presets**
4. Click **Add upload preset**
5. Set **Signing Mode** to `Unsigned`
6. Give it a name (e.g., `naipo_memories_preset`)
7. (Optional) Set folder to `naipomemories/` to organize uploads
8. Save the preset

---

## 6. Environment Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your values in `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...

   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

> **Note:** The `.env` file is gitignored. Never commit it. Share credentials with teammates using a secure method (e.g., 1Password, Bitwarden, or a private vault).

---

## 7. How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org) v18+ installed
- [Expo Go](https://expo.dev/go) app on your phone (iOS or Android)
- Or an Android emulator / iOS simulator

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd NaiPoMemories

# 2. Install dependencies
npm install

# 3. Set up environment variables (see Section 6)
cp .env.example .env
# Fill in your Firebase and Cloudinary values

# 4. Start the development server
npx expo start
```

### Running on your device

- **Physical device:** Scan the QR code in terminal with the Expo Go app
- **Android emulator:** Press `a` in the terminal
- **iOS simulator:** Press `i` in the terminal (macOS only)
- **Web browser:** Press `w` in the terminal

---

## 8. Authentication Flow

```
User opens app
     │
     ▼
Root _layout.tsx
  → Starts Firebase onAuthStateChanged listener
  → While waiting: shows <Loader fullScreen />
     │
     ▼
Auth state resolves
     │
     ├─ User logged in ──→ Redirect to /(app)/feed
     │
     └─ No user ─────────→ Redirect to /(auth)/login
```

**Register:**
1. User fills RegisterForm (displayName, email, password, confirmPassword)
2. Zod validates all fields client-side
3. `useRegister` → `authService.register()` → `authRepository.register()`
4. Firebase creates Auth user + Firestore document in `users/{uid}`
5. `onAuthStateChanged` fires → Zustand auth store updates → redirect to feed

**Login:**
1. User fills LoginForm (email, password)
2. `useLogin` → `authService.login()` → `authRepository.login()`
3. Firebase authenticates → `onAuthStateChanged` fires → redirect to feed

**Logout:**
1. User taps "Sign Out" in Profile tab
2. `useLogout` → `authService.logout()` → Firebase signOut
3. React Query cache is fully cleared (prevents data leaks between accounts)
4. Redirect to login screen

---

## 9. Friend Request Flow

```
Current user                    Target user
     │                               │
     │  Search by email              │
     ▼                               │
userRepository.findByEmail()         │
     │                               │
     │  Validation checks:           │
     │  - Not self                   │
     │  - No duplicate request       │
     │  - Not already friends        │
     ▼                               │
friendRepository.sendRequest()       │
     │                               │
     │              friendRequests/{id} created (status: 'pending')
     │                               │
     │                               ▼
     │                  Target sees request in Friends tab
     │                               │
     │                    Accept/Reject
     │                               │
     │                    friendRepository.updateRequestStatus('accepted')
     │                    friendRepository.createFriendship(user1Id, user2Id)
     │                               │
     │                         friendships/{id} created
```

**Firestore Collections:**

- `friendRequests/{id}` — `{ senderId, receiverId, status, createdAt }`
- `friendships/{id}` — `{ user1Id, user2Id, createdAt }`

---

## 10. Media Upload Flow

```
User captures photo/video
     │
     ▼
CameraView → useCreatePost
     │
     ▼
postService.createPost()
     │
     ├─ mediaService.uploadImage() or uploadVideo()
     │       │
     │       ├─ Validate: file exists, size < limit, duration ≤ 120s
     │       │
     │       └─ mediaRepository.upload()
     │               │
     │               └─ POST to Cloudinary /upload endpoint (multipart/form-data)
     │                   → Returns { secureUrl, publicId, thumbnailUrl }
     │
     └─ postRepository.create()
             │
             └─ Writes to Firestore posts/{id}:
                { userId, mediaType, mediaUrl, thumbnailUrl, caption, createdAt }
```

**Progress tracking:** Axios `onUploadProgress` callback → state → displayed as "Uploading... X%"

---

## 11. Feed Flow

```
User opens Feed tab
     │
     ▼
FeedList → useFeed(userId)
     │
     ▼
postService.getFeed(userId)
     │
     ├─ friendService.getFriendIds(userId)
     │       │
     │       └─ Queries friendships collection for all friendships involving userId
     │           Returns array of friend UIDs
     │
     └─ postRepository.getFeedPosts([userId, ...friendIds])
             │
             └─ Queries posts collection:
                WHERE userId IN [self + friends]
                ORDER BY createdAt DESC
                (Chunked in groups of 30 due to Firestore `in` limit)
```

**Pull-to-refresh:** React Query `refetch()` triggered by `RefreshControl` on the FlatList.

---

## 12. Future Scalability Considerations

### Real-time Feed
Currently the feed uses one-time Firestore queries. For real-time updates, replace `getDocs` with `onSnapshot` listeners and integrate with React Query's `setQueryData`.

### Pagination
Add cursor-based pagination using Firestore's `startAfter()` and React Query's `useInfiniteQuery` for infinite scroll on the feed.

### Push Notifications
When a friend shares a new post, use **Expo Notifications** + **Firebase Cloud Functions** to send push notifications to all connected friends.

### Video Streaming
For smoother video playback, enable **Cloudinary Adaptive Streaming (HLS)** on upload. Display videos using `expo-video` with HLS URL instead of direct MP4.

### Friend Lists > 30
The current Firestore `in` query is chunked to 30. For users with many friends, consider a Firestore Collection Group query or a denormalized feed document per user.

### Profile Image Upload
Currently `avatarUrl` is stored but upload UI is not built. Add `expo-image-picker` → `mediaService.uploadImage()` → `userService.updateProfile()` to complete this feature.

### Security Rules
Before going to production, tighten Firestore security rules — especially the `friendships` collection — to prevent users from creating unauthorized friendship documents.

### Testing
- **Unit tests:** Use Jest with `@testing-library/react-native` for hooks and services
- **E2E tests:** Use Detox for full user flow testing on real devices
