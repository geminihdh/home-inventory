# Home Inventory PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a private Home Inventory Management Web App (PWA) that stores data locally in the user's browser using IndexedDB.

**Architecture:** A single-page application (SPA) built with React and TypeScript. It uses `idb` for local storage and follows PWA standards for offline access and home screen installation. The UI is designed for mobile-first utility.

**Tech Stack:** React, TypeScript, Vite, Vanilla CSS, idb (IndexedDB wrapper).

---

### Task 1: Project Scaffolding & PWA Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `public/manifest.json`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`

- [ ] **Step 1: Initialize Vite project with React and TypeScript**
Run: `npm create vite@latest . -- --template react-ts`
Expected: Project structure created.

- [ ] **Step 2: Install dependencies**
Run: `npm install idb uuid lucide-react`
Run: `npm install -D vite-plugin-pwa @types/uuid`

- [ ] **Step 3: Configure Vite PWA plugin**
Modify `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '우리집 물건 관리',
        short_name: '홈인벤토리',
        description: '개인용 물건 관리 앱',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: initial project scaffolding with PWA support"
```

---

### Task 2: IndexedDB Database Layer

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/inventory.ts`

- [ ] **Step 1: Define Item type**
`src/db/schema.ts`:
```typescript
export interface InventoryItem {
  id: string;
  name: string;
  image: string; // Base64
  description: string;
  location: string;
  purchaseDate: string;
  expiryDate: string;
  memo: string;
  createdAt: number;
}
```

- [ ] **Step 2: Implement DB initialization and CRUD operations**
`src/db/inventory.ts`:
```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { InventoryItem } from './schema';

interface InventoryDB extends DBSchema {
  items: {
    key: string;
    value: InventoryItem;
    indexes: { 'by-name': string; 'by-location': string };
  };
}

const DB_NAME = 'home-inventory-db';
const STORE_NAME = 'items';

export async function initDB() {
  return openDB<InventoryDB>(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('by-name', 'name');
      store.createIndex('by-location', 'location');
    },
  });
}

export async function getAllItems(): Promise<InventoryItem[]> {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function addItem(item: InventoryItem) {
  const db = await initDB();
  await db.add(STORE_NAME, item);
}
```

- [ ] **Step 3: Commit**
```bash
git add src/db/
git commit -m "feat: implement IndexedDB layer for inventory items"
```

---

### Task 3: Core UI - Layout & Item List

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/ItemList.tsx`
- Create: `src/components/ItemCard.tsx`

- [ ] **Step 1: Create ItemCard component**
`src/components/ItemCard.tsx`:
```tsx
import React from 'react';
import { InventoryItem } from '../db/schema';

export const ItemCard: React.FC<{ item: InventoryItem }> = ({ item }) => {
  return (
    <div className="item-card">
      <div className="item-thumbnail">
        {item.image ? <img src={item.image} alt={item.name} /> : <span>No Image</span>}
      </div>
      <div className="item-info">
        <h3>{item.name}</h3>
        <p>{item.location}</p>
        {item.expiryDate && <p className="expiry">유통기한: {item.expiryDate}</p>}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Create ItemList component**
`src/components/ItemList.tsx`:
```tsx
import React from 'react';
import { InventoryItem } from '../db/schema';
import { ItemCard } from './ItemCard';

export const ItemList: React.FC<{ items: InventoryItem[] }> = ({ items }) => {
  return (
    <div className="item-list">
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
};
```

- [ ] **Step 3: Update App.tsx to display list**
- [ ] **Step 4: Commit**

---

### Task 4: Item Registration Form & Image Upload

**Files:**
- Create: `src/components/AddItemForm.tsx`
- Create: `src/utils/image.ts` (for resizing)

- [ ] **Step 1: Implement image resizing utility**
- [ ] **Step 2: Create form component with camera/file input**
- [ ] **Step 3: Implement location selection (frequently used list)**
- [ ] **Step 4: Save new item to DB**
- [ ] **Step 5: Commit**

---

### Task 5: Search, Filter & Final Polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Implement search bar logic**
- [ ] **Step 2: Implement D-Day calculation for expiry dates**
- [ ] **Step 3: Finalize mobile responsive CSS styling**
- [ ] **Step 4: Verify PWA manifest and offline service worker**
- [ ] **Step 5: Commit**
