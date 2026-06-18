# 디자인 문서: Firebase 기반 기기 간 데이터 동기화

**날짜:** 2026-06-18
**상태:** 초안
**작성자:** Gemini CLI

## 1. 개요
현재 IndexedDB를 사용하는 로컬 저장 방식의 PWA 프로젝트를 Firebase를 활용한 서버 기반 저장 방식으로 전환하여, 모바일과 PC 등 여러 기기에서 실시간으로 데이터를 동기화할 수 있도록 개선한다.

## 2. 목표 및 제약 조건
- **목표:** 기기 간 실시간 데이터 동기화, 영구적인 데이터 보관, 오프라인 지원 유지.
- **제약 조건:** Firebase 무료 티어 범위 내 사용 (Firestore 1GB, Storage 5GB).

## 3. 아키텍처 및 기술 스택
- **Database:** Firebase Firestore (NoSQL Document DB)
- **Storage:** Firebase Cloud Storage (이미지 파일 저장)
- **Authentication:** Firebase Auth (Google 로그인 추천)
- **Local Cache:** 기존 IndexedDB (오프라인 접근성 및 로딩 속도 향상용)

## 4. 데이터 모델 변경
### InventoryItem (기본 스키마)
```typescript
interface InventoryItem {
  id: string;
  userId: string; // 데이터 소유자 식별용 추가
  name: string;
  image: string; // 변경: Base64 문자열 -> Firebase Storage HTTPS URL
  description: string;
  location: string;
  purchaseDate: string;
  expiryDate: string;
  memo: string;
  createdAt: number;
  updatedAt: number; // 동기화 충돌 방지용 추가
}
```

## 5. 주요 프로세스
### 5.1 데이터 생성/업로드 흐름
1. 사용자가 아이템 정보와 사진 입력.
2. 사진(File 객체)을 Firebase Storage의 `users/{userId}/images/{itemId}` 경로로 업로드.
3. 업로드 완료 후 이미지의 `downloadURL` 획득.
4. 아이템 정보와 이미지 URL을 포함하여 Firestore의 `items` 컬렉션에 저장.
5. 로컬 IndexedDB에도 최신 데이터 저장.

### 5.2 동기화 및 오프라인 전략
- **실시간 리스너:** Firestore의 `onSnapshot`을 사용하여 다른 기기에서 변경된 데이터를 실시간으로 반영.
- **오프라인 우선:** Firestore SDK의 `enableIndexedDbPersistence` 기능을 활용하여 네트워크 연결이 끊겨도 데이터 읽기/쓰기 가능. 연결 시 자동 동기화.

## 6. 보안 규칙 (Firebase Rules)
- **Firestore:** `request.auth.uid == resource.data.userId` (본인의 데이터만 접근 가능)
- **Storage:** `request.auth.uid == userId` 경로 권한 부여.

## 7. 향후 계획
- Firebase 프로젝트 생성 및 웹 앱 등록.
- `firebase-config.ts` 설정 추가.
- `src/services/storage.ts`를 Firebase 기반으로 리팩토링.
- 로그인 UI 및 가드 추가.
