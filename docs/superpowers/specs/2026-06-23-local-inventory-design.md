# Home Inventory - Local-only Architecture Design

## 1. 개요
기존의 Google 로그인 및 Firebase 기반 동기화 기능을 제거하고, 완전한 로컬(IndexedDB) 애플리케이션으로 전환합니다. 데이터의 영속성을 보장하기 위해 사용자가 직접 JSON 파일 형태로 데이터를 백업하고 복원할 수 있는 기능을 추가합니다.

## 2. 주요 변경 사항
### 2.1 Firebase 의존성 제거
- `src/services/auth.ts`: 삭제
- `src/services/firebase.ts`: 삭제
- `src/components/Login.tsx`: 삭제
- `src/App.tsx`: 인증 관련 로직, `syncItems`, `saveItemToFirebase` 등 Firebase Firestore 관련 코드 제거 및 IndexedDB 단독 사용으로 전환.

### 2.2 로컬 데이터 관리 강화
- `src/db/inventory.ts`: Firebase 동기화 로직을 제거하고, CRUD 작업이 모두 로컬 IndexedDB에서 직접 수행되도록 최적화합니다.
- `exportData()`: IndexedDB의 모든 데이터를 JSON 객체로 변환하여 파일로 다운로드합니다.
- `importData(jsonData)`: 업로드된 JSON 데이터를 파싱하여 IndexedDB에 저장합니다 (기존 데이터와 병합 또는 교체 방식 선택 가능).

## 3. UI/UX 변경 사항
- `App.tsx`: 로그인 화면을 제거하고 바로 메인 화면(인벤토리 목록)이 나타나도록 합니다.
- 헤더/메뉴: '로그아웃' 버튼을 제거하고, '설정' 또는 '데이터 관리' 메뉴를 추가하여 '백업', '복원' 버튼을 배치합니다.

## 4. 데이터 흐름
1. **읽기/쓰기**: `App.tsx`에서 직접 `src/db/inventory.ts`의 `getAllItems`, `addItem`, `updateItem`, `deleteItem`을 호출합니다.
2. **백업**: `exportData` 호출 -> IndexedDB `items` 스토어 전체 조회 -> `Blob` 생성 -> 사용자 브라우저 다운로드.
3. **복원**: `importData` 호출 -> 사용자 파일 업로드 -> JSON 파싱 -> `db.clear()` 후 새로운 데이터 저장 또는 `db.put`으로 병합.

## 5. 단계별 구현 계획
1. **정리**: 인증 및 Firebase 서비스 파일 삭제 및 `App.tsx` 클린업.
2. **로컬 로직 강화**: `src/db/inventory.ts`에서 Firebase 함수 제거.
3. **백업/복원 로직 추가**: `src/utils/backup.ts` (신규 파일)에 export/import 로직 구현.
4. **UI 반영**: `App.tsx`에 백업/복원 UI 통합.
