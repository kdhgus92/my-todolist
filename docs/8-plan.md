# my-todolist 작업 실행 계획 (WBS)

## 버전 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|---|---|---|---|
| 0.1 | 2026-08-26 | 최초 작성 | ohhyeun |

## 1. 문서 개요

### 1.1 목적

본 문서는 할일 관리 웹 애플리케이션 "my-todolist"의 구체적인 작업 실행 계획(WBS)을 정의한다. 도메인 개념·엔티티·비즈니스 규칙, 제품 범위·기능 요구사항·일정, 사용자 행동 흐름, 화면 구조, 코드 구조 원칙, 시스템 아키텍처, DB 스키마는 이미 아래 문서들에 정의되어 있으므로 본 문서는 이를 재서술하지 않고 EN-xx/BR-xx/UC-xx/SC-xx ID 및 각 문서 절 번호로 참조하며, 그 위에 "무엇을, 어떤 순서로, 무엇이 끝나야 다음으로 넘어갈 수 있는지"를 Task 단위로 구체화한다.

PRD 8절에 이미 Day1(백엔드+DB)/Day2(프론트+통합)의 개략적 일정 분해가 존재하며, 본 문서는 이를 데이터베이스/백엔드/프론트엔드 3개 트랙의 실행 가능한 Task로 세분화한 것이다.

### 1.2 관련 문서

- 도메인 정의서: [docs/1-domain-definition.md](./1-domain-definition.md) (v0.3) — 엔티티(EN-xx), 비즈니스 규칙(BR-xx), 유스케이스(UC-xx)
- PRD: [docs/2-prd.md](./2-prd.md) (v0.2) — 제품 범위, 기능/비기능 요구사항, 기술 아키텍처, 일정, 리스크
- 사용자 시나리오: [docs/3-user-scenario.md](./3-user-scenario.md) (v0.1) — 사용자 행동 흐름
- 와이어프레임: [docs/4-wireframe.md](./4-wireframe.md) (v0.1) — 화면 구조(SC-xx)
- 프로젝트 구조 설계 원칙: [docs/5-project-principle.md](./5-project-principle.md) (v0.3) — 디렉토리 구조, 계층 원칙
- 아키텍처 다이어그램: [docs/6-arch.md](./6-arch.md) (v0.1) — 시스템 구성, 요청 흐름, 인증 흐름
- ERD: [docs/7-erd.md](./7-erd.md) (v0.1) — 테이블 구조, 제약조건
- DDL: [docs/schema.sql](./schema.sql) — users/categories/todos 실제 스키마

### 1.3 전제 및 제약

- 1인 개발, 총 2일(약 16시간 내외) 일정, 단일 인스턴스 운영을 전제로 한다(PRD 2.3, 5.4, 8절; 5-project-principle.md 2절).
- MVP 범위는 UC-01~06 + 카테고리 관리(생성/조회/삭제)이며, 자동화 테스트는 BR-05/BR-06/BR-08의 순수 함수 3종에만 한정한다(5-project-principle.md 5절).
- 프로젝트는 논리적으로 데이터베이스(DB) / 백엔드(BE) / 프론트엔드(FE) 3개 트랙으로 나누어 관리하되, 실제 작업은 1인이 순차 수행하므로 FE의 API 연동 Task는 대응하는 BE API Task를 선행 Task로 갖는다. 단, DB 스키마 확정 이후에는 BE 초기 세팅과 FE 초기 세팅(프로젝트 스캐폴딩, UI뿐인 부분)은 서로 선행 관계 없이 병행 가능하다.
- 아래 각 Task의 예상 소요시간은 대략적인 기준선이며, 총합은 2일 일정 안에서 소화 가능한 규모로 산정했다(YAGNI, 과설계 금지 — 5-project-principle.md 2절).

## 2. Task 목록 요약

| Task ID | 트랙 | 제목 | 선행 Task | 예상 소요 |
|---|---|---|---|---|
| DB-01 | DB | 스키마 마이그레이션 적용 및 DB 준비 | 없음 | 0.5h |
| DB-02 | DB | 제약조건·인덱스 수동 검증 | DB-01 | 0.5h |
| BE-01 | BE | 백엔드 프로젝트 초기 세팅 (config, app.js, server.js) | DB-01 | 1h |
| BE-02 | BE | 공통 미들웨어 및 공용 유틸 구현 | BE-01 | 1.5h |
| BE-03 | BE | 인증 API 구현 (UC-01: 회원가입/로그인/토큰재발급) | BE-02, DB-02 | 2h |
| BE-04 | BE | 사용자 정보 수정 API 구현 (UC-02) | BE-03 | 0.5h |
| BE-05 | BE | 카테고리 API 구현 (생성/조회/삭제, BR-04/08/09) | BE-03 | 1.5h |
| BE-06 | BE | 할일 API 구현 (등록/조회·필터링/수정/삭제, UC-03~06) | BE-05 | 2h |
| BE-07 | BE | 백엔드 단위테스트 + 헬스체크 + API 수동 점검 | BE-06 | 1h |
| FE-01 | FE | 프론트 프로젝트 초기화 및 FSD 스캐폴딩 (app 계층) | 없음 | 1h |
| FE-02 | FE | shared 계층 구현 (API 클라이언트, 공통 UI, 검증) | FE-01 | 1.5h |
| FE-03 | FE | entities 계층 구현 (user/category/todo) | FE-02 | 1.5h |
| FE-04 | FE | 인증 화면 구현 (SC-01/SC-02, UC-01) | FE-03, BE-03 | 1.5h |
| FE-05 | FE | 마이페이지 구현 (SC-05, UC-02) | FE-03, BE-04 | 1h |
| FE-06 | FE | 할일 등록/수정/삭제 폼 구현 (SC-04, UC-03/05/06) | FE-03, BE-06 | 2h |
| FE-07 | FE | 할일 목록·필터·카테고리 관리 구현 (SC-03/SC-06, UC-04) | FE-03, BE-05, BE-06 | 2h |
| FE-08 | FE | 반응형 레이아웃 적용 및 화면 흐름 통합 | FE-04, FE-05, FE-06, FE-07 | 0.5h |
| FE-09 | FE | 전체 수동 통합 테스트 (UC-01~06 수용 기준 체크) | FE-08, BE-07 | 1h |

트랙별 Task 개수: DB 2개, BE 7개, FE 9개 (총 18개), 예상 소요 합계 약 19.5h. PRD 9절이 명시한 "촉박한 일정" 리스크를 감안해 1인 2일(약 16h) 기준선 대비 다소 여유를 최소화한 배분이며, 실제 진행 시 BE-07/FE-09(테스트·통합 점검)에서 시간 조정이 발생할 수 있다.

## 3. Task 상세

### 3.1 DB 트랙

#### DB-01. 스키마 마이그레이션 적용 및 DB 준비

- 선행 Task: 없음
- 참조: [docs/schema.sql](./schema.sql), [docs/7-erd.md](./7-erd.md) 2절, [docs/5-project-principle.md](./5-project-principle.md) 7.1절(`backend/migrations/001_init.sql`)
- 수행 작업:
  - PostgreSQL 17 인스턴스(로컬 또는 개발용)를 준비하고 애플리케이션 전용 데이터베이스를 생성한다.
  - `docs/schema.sql`의 DDL을 `backend/migrations/001_init.sql`로 이관하고, 해당 파일을 대상 데이터베이스에 실행해 `users`, `categories`, `todos` 테이블과 인덱스를 생성한다.
  - `.env.example`에 DB 접속 정보(host/port/user/password/database) 항목을 정의한다(5-project-principle.md 6절).
- 완료 조건:
  - [x] `users`, `categories`, `todos` 3개 테이블이 정상 생성되었다.
  - [x] `backend/migrations/001_init.sql` 파일이 `docs/schema.sql`과 동일한 DDL을 포함하여 저장소에 존재한다.
  - [x] `.env.example`에 DB 접속 관련 환경변수 항목이 정의되어 있다.

#### DB-02. 제약조건·인덱스 수동 검증

- 선행 Task: DB-01
- 참조: [docs/schema.sql](./schema.sql), [docs/1-domain-definition.md](./1-domain-definition.md) BR-04/BR-05/BR-08
- 수행 작업:
  - `uq_categories_user_name`(사용자별 카테고리명 유일성, 대소문자·공백 무시)이 실제로 중복 삽입을 거부하는지 테스트 쿼리로 확인한다(BR-08).
  - `uq_categories_one_default_per_user`(사용자당 기본 카테고리 1개 제약)가 두 번째 `is_default=true` 삽입을 거부하는지 확인한다(EN-02).
  - `chk_todos_date_range`(`end_date >= start_date`)가 위반 데이터 삽입을 거부하는지 확인한다(BR-05).
  - `idx_todos_user_id`, `idx_todos_category_id`, `users.email` UNIQUE 인덱스가 존재하는지 `\d` 또는 `pg_indexes` 조회로 확인한다.
- 완료 조건:
  - [x] 카테고리명 중복(대소문자/공백 무시) 삽입 시 제약 위반 에러가 발생함을 확인했다.
  - [x] 사용자당 기본 카테고리 2개 삽입 시도가 거부됨을 확인했다.
  - [x] `end_date < start_date` 데이터 삽입이 CHECK 제약으로 거부됨을 확인했다.
  - [x] 4개 인덱스(users.email UNIQUE, todos.user_id, todos.category_id, categories 유니크 인덱스 2종)가 모두 존재함을 확인했다.

### 3.2 백엔드(BE) 트랙

#### BE-01. 백엔드 프로젝트 초기 세팅

- 선행 Task: DB-01
- 참조: [docs/5-project-principle.md](./5-project-principle.md) 7.1절 디렉토리 구조, PRD 6.2절/7절(Pool 크기 10~20)
- 수행 작업:
  - `backend/` 프로젝트를 초기화하고(Node.js + Express + pg + bcrypt + jsonwebtoken 등 최소 의존성만 설치), 7.1절 디렉토리 구조(`src/config`, `src/middlewares`, `src/routes`, `src/controllers`, `src/services`, `src/repositories`, `src/utils`)를 스캐폴딩한다.
  - `src/config/db.js`에서 pg `Pool`(크기 10~20)을 생성하고, `src/config/env.js`에서 환경변수를 로드/검증한다.
  - `src/app.js`(Express 앱 조립)와 `server.js`(진입점)를 작성하고, `GET /health`에서 서버 및 DB 연결 상태를 확인하는 엔드포인트를 둔다(5-project-principle.md 6절).
- 완료 조건:
  - [x] `backend/src` 하위에 config/middlewares/routes/controllers/services/repositories/utils 디렉토리가 생성되어 있다.
  - [x] `Pool` 기반 DB 연결이 정상 동작하며 `GET /health` 호출 시 200 응답과 함께 DB 연결 상태가 반환된다.
  - [x] `.env.example`에 포트, DB 접속 정보, JWT 시크릿, 토큰 만료 시간 항목이 모두 정의되어 있다.

#### BE-02. 공통 미들웨어 및 공용 유틸 구현

- 선행 Task: BE-01
- 참조: [docs/5-project-principle.md](./5-project-principle.md) 3.1절, 4절, 6절; BR-01, BR-02
- 수행 작업:
  - `middlewares/auth.js`: JWT access_token 검증 미들웨어를 구현한다(BR-01, 미인증 시 401).
  - `middlewares/errorHandler.js`: `{ error: { code, message } }` 공통 에러 응답 포맷을 구현한다(5-project-principle.md 4절).
  - `middlewares/validate.js`: 요청 바디 유효성 검증 공통 미들웨어를 구현한다.
  - `utils/caseMapper.js`: snake_case ↔ camelCase 변환 공용 헬퍼를 구현한다.
  - `utils/password.js`: bcrypt 기반 해시/검증 함수를 구현한다.
  - `utils/jwt.js`: access_token/refresh_token 발급·검증 함수를 구현한다(PRD 6.3절: access 15분~1시간, refresh 7일~14일).
  - BR-02(소유권 검증) 처리를 위한 공통 서비스 함수 또는 미들웨어 훅 지점을 마련한다(5-project-principle.md 2절 6항).
- 완료 조건:
  - [x] 유효하지 않거나 만료된 access_token으로 보호 라우트 호출 시 auth 미들웨어가 401을 반환한다.
  - [x] 임의 라우트에서 강제로 예외를 던졌을 때 errorHandler가 `{ error: { code, message } }` 형식으로 응답한다.
  - [x] `toCamelCase(row)` 헬퍼가 snake_case 컬럼(예: `user_id`, `is_done`)을 camelCase로 정확히 변환한다.
  - [x] password 해시/검증 함수와 jwt 발급/검증 함수가 각각 정상 동작함을 임시 스크립트로 확인했다.

#### BE-03. 인증 API 구현 (UC-01)

- 선행 Task: BE-02, DB-02
- 참조: [docs/1-domain-definition.md](./1-domain-definition.md) UC-01, EN-01, BR-01, BR-08; [docs/6-arch.md](./6-arch.md) 4절 인증 흐름; [docs/5-project-principle.md](./5-project-principle.md) 7.1절
- 수행 작업:
  - `repositories/users.repository.js`: users 테이블 CRUD 쿼리 함수(email 조회, insert 등)를 구현한다.
  - `repositories/categories.repository.js`의 기본 카테고리 생성 함수(회원가입 시 사용)를 구현한다.
  - `services/auth.service.js`: 회원가입(이메일 중복 검증, 비밀번호 해시, 사용자 생성 + 기본 카테고리 동시 생성 — 단일 트랜잭션), 로그인(email/password 검증, access/refresh 토큰 발급), 토큰 재발급 로직을 구현한다(BR-01, BR-08).
  - `controllers/auth.controller.js`, `routes/auth.routes.js`: `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh` 엔드포인트를 구현한다. refresh_token은 HttpOnly 쿠키로 설정한다(PRD 6.3절).
- 완료 조건:
  - [x] 유효한 email/password로 회원가입 시 사용자 계정과 `isDefault=true` 카테고리가 함께 생성된다(UC-01 수용 기준).
  - [x] 이미 등록된 email로 회원가입 시 요청이 거부되고 사유가 반환된다(BR-08).
  - [x] 비밀번호가 최소 8자 미만이면 회원가입이 거부된다.
  - [x] 올바른 email/password로 로그인 시 access_token(응답 바디)과 refresh_token(HttpOnly 쿠키)이 발급된다.
  - [x] 잘못된 email/password로 로그인 시 인증 실패 사유가 반환된다.
  - [x] `POST /auth/refresh` 호출 시 유효한 refresh_token으로 새 access_token이 발급된다.

#### BE-04. 사용자 정보 수정 API 구현 (UC-02)

- 선행 Task: BE-03
- 참조: [docs/1-domain-definition.md](./1-domain-definition.md) UC-02, BR-07
- 수행 작업:
  - `services/users.service.js`에 name 수정 로직을 구현한다(email은 수정 대상에서 제외 — BR-07).
  - `controllers/users.controller.js`, `routes/users.routes.js`: `PATCH /users/me` 엔드포인트를 구현하고 auth 미들웨어를 적용한다.
- 완료 조건:
  - [x] 로그인 상태에서 name을 변경하면 변경된 name이 저장되고 응답에 반영된다.
  - [x] 요청 바디에 email 변경 값을 포함해도 email은 변경되지 않는다(BR-07).
  - [x] access_token 없이 `PATCH /users/me` 호출 시 401로 거부된다(BR-01).

#### BE-05. 카테고리 API 구현

- 선행 Task: BE-03
- 참조: [docs/1-domain-definition.md](./1-domain-definition.md) EN-02, BR-04, BR-08, BR-09; [docs/2-prd.md](./2-prd.md) 4.7절
- 수행 작업:
  - `repositories/categories.repository.js`에 목록 조회, 생성, 삭제, 카테고리 소속 할일 일괄 이관 쿼리를 구현한다.
  - `services/categories.service.js`: 카테고리명 중복 검증(대소문자 무시, 트림 비교 — BR-08), 기본 카테고리 삭제 방지(BR-04), 삭제 시 소속 할일을 기본 카테고리로 이관하는 로직을 하나의 트랜잭션(`BEGIN/COMMIT/ROLLBACK`)으로 구현한다(BR-09).
  - `controllers/categories.controller.js`, `routes/categories.routes.js`: `GET /categories`, `POST /categories`, `DELETE /categories/:id` 엔드포인트를 구현하고 auth 미들웨어 및 소유권 검증(BR-02)을 적용한다.
- 완료 조건:
  - [x] 로그인 사용자가 새 카테고리명을 등록하면 정상 생성된다.
  - [x] 동일 사용자 내 대소문자/공백만 다른 중복 카테고리명 등록 시 거부된다(BR-08).
  - [x] 기본 카테고리(`isDefault=true`) 삭제 요청은 서버에서 거부된다(BR-04).
  - [x] 일반 카테고리 삭제 시 해당 카테고리의 모든 할일이 기본 카테고리로 이관된 뒤 카테고리가 삭제된다(BR-09).
  - [x] 타 사용자 소유 카테고리에 대한 삭제 요청은 거부된다(BR-02).

#### BE-06. 할일 API 구현 (UC-03~06)

- 선행 Task: BE-05
- 참조: [docs/1-domain-definition.md](./1-domain-definition.md) EN-03, UC-03~06, BR-02, BR-03, BR-05, BR-06; [docs/2-prd.md](./2-prd.md) 4.3~4.6절
- 수행 작업:
  - `repositories/todos.repository.js`: 할일 CRUD 및 사용자 소유 조건(`WHERE user_id = $1`)이 포함된 목록 조회 쿼리(카테고리 필터 파라미터 포함)를 구현한다.
  - `services/todos.service.js`: 등록 시 카테고리 미지정이면 기본 카테고리 자동 적용(BR-03), 종료일자 ≥ 시작일자 검증(BR-05, 별도 순수 함수로 분리), 조회 시점 기준 상태(시작전/진행중/완료/기한초과) 계산(BR-06, 4.4절 판정 규칙을 별도 순수 함수로 분리), 소유권 검증(BR-02)을 구현한다.
  - `controllers/todos.controller.js`, `routes/todos.routes.js`: `POST /todos`, `GET /todos`(카테고리·상태 쿼리 파라미터 필터링), `PATCH /todos/:id`, `DELETE /todos/:id` 엔드포인트를 구현한다.
- 완료 조건:
  - [x] 카테고리 미지정으로 할일 등록 시 기본 카테고리가 자동 적용된다(BR-03).
  - [x] `endDate < startDate`로 등록/수정 시도 시 서버에서 거부된다(BR-05).
  - [x] `GET /todos`가 본인 소유 할일만 반환하며, 카테고리 필터와 상태 필터(계산값 기준) 쿼리 파라미터가 각각 정상 동작한다(UC-04, BR-02, BR-06).
  - [x] 응답에 포함된 각 할일의 상태 값이 4.4절 판정 규칙(시작전/진행중/완료/기한초과) 4가지 분기와 일치한다.
  - [x] 본인 소유 할일에 대한 수정/삭제가 정상 반영된다(UC-05, UC-06).
  - [x] 타 사용자 소유 할일에 대한 수정/삭제 요청은 거부된다(BR-02).

#### BE-07. 백엔드 단위테스트 + 헬스체크 + API 수동 점검

- 선행 Task: BE-06
- 참조: [docs/5-project-principle.md](./5-project-principle.md) 5절
- 수행 작업:
  - `test/todoDateValidation.test.js`: BR-05(종료일자 ≥ 시작일자) 순수 함수 단위테스트를 `node:test` + `assert`로 작성한다.
  - `test/todoStatus.test.js`: BR-06 상태 판정 함수의 4가지 분기(시작전/진행중/완료/기한초과)에 대한 단위테스트를 작성한다.
  - `test/categoryNameCompare.test.js`: BR-08 카테고리명 중복 비교(대소문자 무시, 공백 트림) 함수 단위테스트를 작성한다.
  - `GET /health`가 실제 DB 연결 실패 상황에서도 적절히 비정상 상태를 반환하는지 확인한다.
  - Postman/curl 등으로 UC-01~06 전체 API 엔드포인트를 순서대로(회원가입→로그인→카테고리 생성→할일 등록/조회/수정/삭제→카테고리 삭제 이관) 수동 호출해 정상 동작을 점검한다.
- 완료 조건:
  - [x] BR-05/BR-06/BR-08 세 순수 함수에 대한 단위테스트가 모두 통과한다.
  - [x] `node --test`(또는 동등 명령) 실행 시 전체 테스트가 그린이다.
  - [x] UC-01~06에 대응하는 API 시나리오를 수동으로 순서대로 호출했을 때 도메인 정의서 7절의 수용 기준을 모두 만족함을 확인했다.

### 3.3 프론트엔드(FE) 트랙

#### FE-01. 프론트 프로젝트 초기화 및 FSD 스캐폴딩

- 선행 Task: 없음
- 참조: [docs/5-project-principle.md](./5-project-principle.md) 3.2절, 7.2절
- 수행 작업:
  - `frontend/` 프로젝트를 React 19 + TypeScript로 초기화하고(Vite 등), 7.2절 디렉토리 구조(`app`, `pages`, `widgets`, `features`, `entities`, `shared`)를 스캐폴딩한다.
  - `app/providers/QueryProvider.tsx`(TanStack Query `QueryClientProvider`), `app/routes/router.tsx`, `app/App.tsx`를 작성해 앱 골격을 구성한다(비즈니스 로직 없음, 3.2절).
  - Zustand, TanStack Query, 라우터 등 최소 의존성만 설치한다.
- 완료 조건:
  - [x] `frontend/src` 하위에 app/pages/widgets/features/entities/shared 6개 디렉토리가 생성되어 있다.
  - [x] `npm run dev`로 개발 서버 실행 시 빈 화면이라도 정상 기동되고(브라우저 접속으로 확인) `QueryClientProvider`가 앱 전체를 감싸고 있다.
  - [x] FSD 계층 규칙(상위→하위 단방향 import)을 ESLint 등으로 강제하지 않더라도, 최소한 문서화된 규칙을 팀(1인) 내 인지 상태로 남긴다(주석 또는 README 1줄).

#### FE-02. shared 계층 구현

- 선행 Task: FE-01
- 참조: [docs/5-project-principle.md](./5-project-principle.md) 3.2절, 4.3절 와이어프레임 3절(공통 컴포넌트)
- 수행 작업:
  - `shared/api/client.ts`: fetch 래퍼를 구현해 access_token을 Authorization 헤더에 첨부하고, 401 응답 시 refresh_token 기반 재발급을 트리거한다(PRD 6.3절, 6-arch.md 4절 인증 흐름).
  - `shared/ui/Button.tsx`, `Input.tsx`, `ConfirmDialog.tsx`(와이어프레임 3.2절 공통 확인 다이얼로그), `FormFieldError.tsx`(와이어프레임 3.3절 인라인 오류 메시지)를 구현한다.
  - `shared/lib/validators.ts`: 이메일 형식, 비밀번호 길이 등 클라이언트 측 보조 검증 함수를 구현한다(서버 검증 대체 아님).
  - `shared/types/domain.ts`: EN-01~03 공용 타입 및 Status 유니온 타입(`'시작전' | '진행중' | '완료' | '기한초과'`)을 정의한다.
- 완료 조건:
  - [x] `client.ts`를 통한 API 호출이 access_token을 자동으로 첨부하며, 401 응답 시 refresh 후 원 요청을 재시도하는 로직이 동작한다.
  - [x] ConfirmDialog가 삭제 계열 액션에서 재사용 가능한 형태로 구현되어 있다.
  - [x] validators.ts의 이메일/비밀번호 검증 함수가 단독 호출로 정상 동작함을 확인했다.
  - [x] domain.ts에 User/Category/Todo 타입과 Status 유니온 타입이 정의되어 있다.

#### FE-03. entities 계층 구현

- 선행 Task: FE-02
- 참조: [docs/5-project-principle.md](./5-project-principle.md) 3.2절 entities 항목, 7.2절
- 수행 작업:
  - `entities/user`: `model/authStore.ts`(Zustand — access_token, 로그인 사용자 정보), `api/users.api.ts`(UC-02 조회/수정 API 호출), `index.ts`를 구현한다.
  - `entities/category`: `model/useCategoryList.ts`(TanStack Query 조회 훅), `api/categories.api.ts`, `ui/CategoryBadge.tsx`, `index.ts`를 구현한다.
  - `entities/todo`: `model/useTodoList.ts`(TanStack Query 조회 훅, 카테고리·상태 필터 파라미터 지원), `model/todoStatus.ts`(BR-06 클라이언트 표시용 상태 계산 — 백엔드 계산 결과를 신뢰하되 즉시 반영용 보조 계산), `api/todos.api.ts`, `ui/TodoCard.tsx`, `index.ts`를 구현한다.
- 완료 조건:
  - [x] `useTodoList`, `useCategoryList` 훅이 각각 API를 호출해 캐싱된 목록 데이터를 반환한다(BE-05, BE-06 API 스펙 기준).
  - [x] `authStore`가 로그인 후 access_token과 사용자 정보를 보관하고, 로그아웃 시 초기화된다.
  - [x] `TodoCard`, `CategoryBadge` 컴포넌트가 각각 단일 항목을 표시용으로만 렌더링하며 생성/수정/삭제 로직을 포함하지 않는다(entities는 조회 전용).
  - [x] 각 슬라이스는 `index.ts`를 통해서만 외부에 공개된다.

#### FE-04. 인증 화면 구현 (SC-01/SC-02)

- 선행 Task: FE-03, BE-03
- 참조: [docs/4-wireframe.md](./4-wireframe.md) 4.1, 4.2절(SC-01, SC-02), UC-01
- 수행 작업:
  - `features/signup`: 회원가입 폼 UI, 클라이언트 1차 검증(이메일 형식, 비밀번호 길이), 회원가입 mutation, 서버 오류(BR-08) 인라인 표시를 구현한다.
  - `features/login`: 로그인 폼 UI, 로그인 mutation(성공 시 authStore 갱신), 인증 실패 사유 인라인 표시를 구현한다.
  - `pages/signup/index.tsx`, `pages/login/index.tsx`: 각각 SC-01, SC-02 화면을 구성하고 상호 이동 링크를 연결한다.
  - `app/routes/ProtectedRoute.tsx`: 비인증 상태에서 보호 화면 접근 시 SC-02로 리다이렉트하는 로직을 구현하고 router에 반영한다(BR-01).
- 완료 조건:
  - [x] 와이어프레임 4.1절 레이아웃대로 회원가입 폼이 렌더링되고, 성공 시 로그인 화면으로 이동한다.
  - [x] 이미 등록된 email로 회원가입 시도 시 인라인 오류 메시지가 표시된다(BR-08).
  - [x] 로그인 성공 시 access_token이 authStore에 저장되고 할일 목록 화면 경로로 이동한다.
  - [x] 비인증 상태로 보호 경로에 직접 접근 시 로그인 화면으로 리다이렉트된다(BR-01).

#### FE-05. 마이페이지 구현 (SC-05)

- 선행 Task: FE-03, BE-04
- 참조: [docs/4-wireframe.md](./4-wireframe.md) 3.1절(공통 헤더), 4.5절(SC-05), UC-02, BR-07
- 수행 작업:
  - `widgets/header/ui/Header.tsx`: 와이어프레임 3.1절 공통 헤더(로고/네비게이션/로그아웃)를 구현하고, 로그아웃 클릭 시 토큰 폐기 및 로그인 화면 이동을 연결한다.
  - `features/edit-profile`: name 수정 폼 UI와 mutation을 구현한다(email은 읽기 전용 표시).
  - `pages/my-page/index.tsx`: SC-05 화면을 구성한다.
- 완료 조건:
  - [x] 공통 헤더가 인증 후 전 화면에서 렌더링되며 비인증 화면(SC-01, SC-02)에서는 노출되지 않는다.
  - [x] name 변경 후 저장 시 변경 내용이 반영되고 성공 메시지가 표시된다.
  - [x] email 입력란은 비활성(수정 불가) 상태로 렌더링된다(BR-07).
  - [x] 로그아웃 클릭 시 토큰이 폐기되고 로그인 화면으로 이동한다.

#### FE-06. 할일 등록/수정/삭제 폼 구현 (SC-04)

- 선행 Task: FE-03, BE-06
- 참조: [docs/4-wireframe.md](./4-wireframe.md) 4.4절(SC-04), UC-03, UC-05, UC-06, BR-03, BR-05
- 수행 작업:
  - `features/create-todo`: 등록 폼 UI(제목/시작일자/종료일자/카테고리), 클라이언트 측 날짜 검증(BR-05 보조), 등록 mutation을 구현한다. 카테고리 미선택 시 기본값 안내를 표시한다(BR-03).
  - `features/edit-todo`: 수정 모드 진입 시 기존 값 로딩, 완료 여부 토글, 수정 mutation, 소유권 오류(BR-02) 처리를 구현한다.
  - `features/delete-todo`: 삭제 확인 다이얼로그(shared/ui/ConfirmDialog 재사용) 및 삭제 mutation을 구현한다.
  - `pages/todo-form/index.tsx`: 등록/수정 공용 SC-04 화면을 구성하고, 라우트 파라미터로 등록/수정 모드를 분기한다.
- 완료 조건:
  - [x] 등록 모드에서 카테고리 미선택 시 기본 카테고리가 자동 적용됨을 화면상 안내와 함께 확인했다.
  - [x] 종료일자를 시작일자보다 이전으로 입력하면 클라이언트에서 1차로 저장이 차단되고 인라인 오류가 표시된다(BR-05).
  - [x] 수정 모드 진입 시 기존 값(제목/기간/카테고리/완료 여부)이 폼에 채워진 상태로 표시된다.
  - [x] 저장/삭제 성공 시 SC-03(할일 목록)으로 이동하며 목록에 즉시 반영된다.
  - [x] 타 사용자 소유 할일에 대한 접근/저장 시 서버 거부 응답이 화면에 적절히 표시된다(BR-02).

#### FE-07. 할일 목록·필터·카테고리 관리 구현 (SC-03/SC-06)

- 선행 Task: FE-03, BE-05, BE-06
- 참조: [docs/4-wireframe.md](./4-wireframe.md) 4.3절(SC-03), 4.6절(SC-06), UC-04, BR-02, BR-04, BR-06, BR-08, BR-09
- 수행 작업:
  - `features/filter-todos`: 카테고리 필터·상태 필터 바 UI 및 필터 상태 관리(쿼리 파라미터 연동)를 구현한다.
  - `features/manage-category`: 카테고리 생성 폼, 목록, 삭제 액션(기본 카테고리 삭제 버튼 비활성화 — BR-04)을 모달 형태로 구현하고, 삭제 확인 다이얼로그와 연결한다(BR-09).
  - `widgets/todo-board/ui/TodoBoard.tsx`: filter-todos + entities/todo 목록 조합, 완료 체크박스 즉시 토글(BR-06 상태 재계산 반영)을 구현한다.
  - `pages/todo-list/index.tsx`: SC-03 화면을 구성하고 할일 등록 버튼(→SC-04), 카테고리 관리 버튼(→SC-06 모달)을 연결한다.
- 완료 조건:
  - [x] 카테고리 필터 변경 시 해당 카테고리의 할일만 표시된다(UC-04).
  - [x] 상태 필터 변경 시 4.4절 판정 규칙에 따라 계산된 상태와 일치하는 항목만 표시된다(BR-06).
  - [x] 목록의 완료 체크박스 클릭 시 즉시 isDone이 토글되고 상태 배지가 재계산되어 반영된다.
  - [x] 카테고리 관리 모달에서 중복 이름 등록 시 인라인 오류가 표시되고(BR-08), 기본 카테고리는 삭제 버튼이 비활성화되어 있다(BR-04).
  - [x] 일반 카테고리 삭제 후 모달을 닫으면 SC-03의 필터·목록이 최신 카테고리 상태로 갱신되고, 이관된 할일이 기본 카테고리로 표시된다(BR-09).

#### FE-08. 반응형 레이아웃 적용 및 화면 흐름 통합

- 선행 Task: FE-04, FE-05, FE-06, FE-07
- 참조: [docs/4-wireframe.md](./4-wireframe.md) 5절(모바일 SC-03), 6절(화면 흐름), PRD 5.2절
- 수행 작업:
  - SC-03 할일 목록 화면에 모바일 폭(약 375~480px) 카드형 레이아웃과 헤더 햄버거 메뉴를 적용한다(와이어프레임 5절).
  - 그 외 화면(SC-01, 02, 04, 05, 06)은 중앙 카드 영역이 화면 폭에 자연스럽게 축소되는지 브라우저 폭 조정으로 확인하고, 깨지는 지점이 있으면 최소 스타일만 보정한다.
  - 와이어프레임 6절 화면 흐름(회원가입↔로그인, 목록↔등록/수정, 목록→카테고리 관리 모달, 목록↔마이페이지, 로그아웃)이 실제 라우팅과 일치하는지 전체 점검한다.
- 완료 조건:
  - [x] 모바일 폭에서 SC-03이 카드형 레이아웃으로 정상 표시되고 헤더 메뉴가 햄버거 아이콘으로 축소된다.
  - [x] 나머지 화면이 모바일 폭에서 레이아웃이 깨지지 않고 폼/텍스트가 잘리지 않는다.
  - [x] 와이어프레임 6절에 명시된 모든 화면 전환 경로가 실제 앱에서 동일하게 동작한다.

#### FE-09. 전체 수동 통합 테스트

- 선행 Task: FE-08, BE-07
- 참조: [docs/1-domain-definition.md](./1-domain-definition.md) 7절 UC-01~06 수용 기준, [docs/5-project-principle.md](./5-project-principle.md) 5절
- 수행 작업:
  - 도메인 정의서 7절의 UC-01~06 수용 기준(Given-When-Then)을 체크리스트로 삼아 실제 브라우저에서 처음부터 끝까지(회원가입→로그인→카테고리 생성→할일 등록→목록/필터 확인→수정→삭제→카테고리 삭제 이관→마이페이지 수정→로그아웃) 수동 시나리오를 수행한다.
  - access_token 만료 후 refresh_token 기반 재발급이 실제로 끊김 없이 동작하는지 확인한다(6-arch.md 4절).
  - 발견된 결함을 기록하고, 시간 내 수정 가능한 항목은 즉시 수정한다(1인 2일 일정상 전수 수정을 보장하지는 않음 — PRD 9절 리스크).
- 완료 조건:
  - [x] UC-01~06의 모든 Given-When-Then 수용 기준을 브라우저 수동 조작으로 확인했다.
  - [x] access_token 만료 시나리오에서 refresh_token 재발급 흐름이 사용자 조작 끊김 없이 동작함을 확인했다.
  - [x] 발견된 결함 목록과 각 항목의 조치 여부(수정 완료/보류)가 기록되어 있다.

**FE-09 결함 기록**:
1. TodoBoard 행 클릭이 자식 요소의 `stopPropagation`에 전부 가로막혀 실제로는 빈 여백을 눌러야만 수정화면으로 이동하던 버그 — 사용자 리포트로 FE-08 완료 후 발견, 즉시 수정 완료(커밋 `c42dcc2`).
2. Header/FilterBar에서 반응형 클래스와 충돌하는 인라인 `style={{display:'flex',...}}`가 미디어쿼리를 무력화해 모바일 폭에서 햄버거 메뉴가 전혀 동작하지 않던 버그 — FE-08 자체 검증 중 발견, 즉시 수정 완료(커밋 `4047eb8`).
3. 그 외 FE-09 전체 통합 재검증(UC-01~06, access_token 만료→refresh)에서 신규 결함 없음.

**FE-09 이후 범위外 추가 작업** (WBS Task ID 없음, 사용자 요청으로 수행 — 새 Task 항목은 만들지 않음, YAGNI):
- 새로고침 시 로그인 세션이 매번 풀리는 문제를 사용자가 지적해 부팅 시 `POST /auth/refresh`로 세션을 복구하도록 프론트에 추가(`entities/user/model/bootstrapAuth.ts`). 이 과정에서 "로그아웃해도 refresh_token 쿠키가 남아 자동 재로그인되는" 회귀 버그가 드러나 백엔드에 `POST /auth/logout`(refresh_token 쿠키 clearCookie)을 신규 추가했다(커밋 `09cb4a5`). backend test 169/169 통과, swagger.json 갱신, 실브라우저로 재검증 완료.
