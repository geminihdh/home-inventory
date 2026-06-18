# Firebase 동기화 구현 계획 (Firestore + Storage + Auth)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 현재 로컬 전용(IndexedDB)인 인벤토리 데이터를 Firebase를 통해 여러 기기에서 동기화할 수 있도록 구현합니다.

**Architecture:** Firebase Auth(Google 로그인)로 사용자를 식별하고, 이미지는 Firebase Storage에, 아이템 정보(URL 포함)는 Firestore에 저장합니다. IndexedDB는 오프라인 캐시 레이어로 유지합니다.

**Tech Stack:** Firebase Web SDK (v11+), React, TypeScript, idb (IndexedDB)

---

### Task 1: Firebase 프로젝트 설정 및 SDK 설치

**Files:**
- Modify: `package.json`
- Create: `src/services/firebase.ts`

- [x] **Step 1: Firebase SDK 설치**
Run: `npm install firebase`

- [x] **Step 2: Firebase 초기화 설정 파일 생성**
```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // 사용자가 Firebase 콘솔에서 프로젝트 생성 후 제공되는 설정을 여기에 넣어야 함
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 오프라인 지원 활성화
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});
```

- [x] **Step 3: 커밋**
```bash
git add package.json src/services/firebase.ts
git commit -m "chore: add firebase sdk and initialization"
```

---

### Task 2: Firebase Auth (Google 로그인) 구현

**Files:**
- Create: `src/services/auth.ts`
- Create: `src/components/Login.tsx`

- [x] **Step 1: 인증 서비스 작성**
```typescript
// src/services/auth.ts
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

- [x] **Step 2: 로그인 UI 컴포넌트 작성**
```tsx
// src/components/Login.tsx
import React from 'react';
import { signInWithGoogle } from '../services/auth';

export const Login: React.FC = () => {
  return (
    <div className="login-container">
      <h2>내 물건 관리 시작하기</h2>
      <p>기기 간 동기화를 위해 로그인이 필요합니다.</p>
      <button onClick={signInWithGoogle} className="login-button">
        Google로 로그인
      </button>
    </div>
  );
};
```

- [x] **Step 3: 커밋**
```bash
git add src/services/auth.ts src/components/Login.tsx
git commit -m "feat: implement google authentication"
```

---

### Task 3: Firebase Storage 이미지 업로드 서비스 구현

**Files:**
- Create: `src/services/imageUpload.ts`

- [ ] **Step 1: 이미지 업로드 로직 작성**
```typescript
// src/services/imageUpload.ts
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (userId: string, itemId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `users/${userId}/images/${itemId}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

// Base64를 File로 변환하는 유틸리티 (필요 시)
export const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
```

- [ ] **Step 2: 커밋**
```bash
git add src/services/imageUpload.ts
git commit -m "feat: add image upload service for firebase storage"
```

---

### Task 4: Firestore 인벤토리 서비스 리팩토링

**Files:**
- Modify: `src/db/inventory.ts` (Firebase 연동으로 대체 또는 래핑)

- [ ] **Step 1: Firestore 기반 CRUD 구현**
```typescript
// src/db/inventory.ts (수정 제안)
import { db } from '../services/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import type { InventoryItem } from './schema';

const COLLECTION_NAME = 'items';

export const syncItems = (userId: string, callback: (items: InventoryItem[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => doc.data() as InventoryItem);
    callback(items);
  });
};

export const saveItemToFirebase = async (item: InventoryItem) => {
  await setDoc(doc(db, COLLECTION_NAME, item.id), item);
};

export const deleteItemFromFirebase = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
```

- [ ] **Step 2: 커밋**
```bash
git add src/db/inventory.ts
git commit -m "feat: refactor inventory service to use firestore"
```

---

### Task 5: App.tsx 통합 및 최종 테스트

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 로그인 상태에 따른 화면 전환 및 실시간 동기화 연결**
```tsx
// src/App.tsx 내부 로직 (예시)
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<InventoryItem[]>([]);

useEffect(() => {
  const unsubscribeAuth = subscribeToAuthChanges((u) => {
    setUser(u);
  });
  return () => unsubscribeAuth();
}, []);

useEffect(() => {
  if (user) {
    const unsubscribeSync = syncItems(user.uid, (syncedItems) => {
      setItems(syncedItems);
      // 로컬 IndexedDB와도 동기화하는 로직 추가 가능
    });
    return () => unsubscribeSync();
  }
}, [user]);
```

- [ ] **Step 2: 커밋**
```bash
git add src/App.tsx
git commit -m "feat: integrate firebase auth and sync into app"
```
