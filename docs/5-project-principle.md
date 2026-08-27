# my-todolist 프로젝트 구조 설계 원칙

## 버전 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|---|---|---|---|
| 0.1 | 2026-08-26 | 최초 작성 | ohhyeun |
| 0.2 | 2026-08-26 | 최상위 원칙에 단일 책임 원칙(SRP) 항목 추가 | ohhyeun |
| 0.3 | 2026-08-26 | 프론트엔드 디렉토리 구조를 Feature-Sliced Design(FSD)으로 변경 (3.2, 7.2절) | ohhyeun |
| 0.4 | 2026-08-27 | DB-01/02·BE-01~07 실제 구현과의 정합성 점검 결과 반영: 백엔드 디렉토리 구조(7.1절) 보완, BR-08 카테고리명 중복 검증 방식 정정(5절), 테스트 범위 확대 반영(5절), CORS·Swagger UI·로그인 실패 응답·소유권 검증 예외 명시(2절 6항, 6절) | ohhyeun |
| 0.5 | 2026-08-27 | FE-01~09 및 세션 영속화(부팅 시 자동 로그인) 실제 구현과의 정합성 점검 결과 반영: 프론트엔드 디렉토리 구조(7.2절)의 `ProtectedRoute.tsx` 역할·`entities/user`·`shared/api/client.ts`·`features/manage-category` 서술을 실제 구현에 맞게 정정 | ohhyeun |
| 0.6 | 2026-08-27 | FE-09 이후 범위外 추가 작업(다크/라이트 모드, 다국어)의 실제 구현 반영: 프론트엔드 디렉토리 구조(7.2절) `shared/lib`에 `theme.ts`, `i18n.ts` 추가 | ohhyeun |

## 1. 문서 개요

### 1.1 목적

본 문서는 할일 관리 웹 애플리케이션 "my-todolist"의 실제 구현에 앞서, 프론트엔드/백엔드 코드가 따라야 할 구조 설계 원칙을 정의한다. 도메인 개념·엔티티·비즈니스 규칙, 제품 범위·기술 스택, 사용자 행동 흐름, 화면 구조는 이미 아래 문서들에 정의되어 있으므로 본 문서는 이를 재서술하지 않고 EN-xx/BR-xx/UC-xx ID 및 PRD 절 번호로 참조하며, 그 위에 "코드를 어떤 원칙으로 구성할 것인가"를 다룬다. 아직 코드가 작성되지 않은 상태이며, 본 문서는 이후 실제 구현의 기준이 된다.

### 1.2 관련 문서

- 도메인 정의서: [docs/1-domain-definition.md](./1-domain-definition.md) (v0.3) — 엔티티(EN-xx), 비즈니스 규칙(BR-xx), 유스케이스(UC-xx) 정의
- PRD: [docs/2-prd.md](./2-prd.md) (v0.2) — 제품 범위, 기능/비기능 요구사항, 기술 아키텍처, 일정, 리스크
- 사용자 시나리오: [docs/3-user-scenario.md](./3-user-scenario.md) (v0.1) — 사용자 행동 흐름
- 와이어프레임: [docs/4-wireframe.md](./4-wireframe.md) (v0.1) — 화면 구조(SC-xx)

## 2. 최상위 원칙

my-todolist는 1인 개발, 2일 일정, 단일 인스턴스 운영을 전제로 한다(PRD 2.3, 5.4, 8절). 이 제약은 구조 설계의 모든 선택에서 최우선 기준으로 작동한다.

1. **YAGNI — 지금 필요한 것만 만든다.** 도메인은 User/Category/Todo 3개 엔티티(EN-01~03)뿐이며, 상태(status)조차 저장 컬럼이 아닌 파생 계산값이다(BR-06). 향후 확장(공유, 알림, 소셜 로그인 등, 도메인 정의서 8절/PRD 3.2절 범위 외)을 가정한 추상화나 확장 포인트를 미리 만들지 않는다.
2. **관심사 분리는 하되, 계층 수는 최소로.** 레이어를 나누는 목적은 "코드를 어디서 찾을지 예측 가능하게 하는 것"이지 엔터프라이즈적 완결성이 아니다. 마이크로서비스, DDD 풀 레이어링(Entity/VO/Aggregate/Repository 인터페이스 분리 등), 이벤트소싱은 이 프로젝트 규모에 맞지 않으므로 채택하지 않는다.
3. **단일 책임 원칙(SRP).** 파일·함수·모듈은 하나의 변경 이유만 가져야 한다. 라우트는 매핑만, 컨트롤러는 req/res 변환만, 서비스는 하나의 비즈니스 규칙(BR-xx)만, 데이터 접근 모듈은 한 테이블의 쿼리만 담당한다(3절에서 계층별로 구체화). 한 함수가 검증+저장+응답변환을 동시에 하는 등 여러 책임이 섞이면 계층을 나눈 의미가 없어지므로, 계층 경계를 SRP 판단 기준으로 삼는다.
4. **단방향 데이터 흐름.** 프론트엔드는 서버 상태(할일/카테고리 목록)와 클라이언트 상태(로그인 여부 등)를 명확히 분리하고, UI는 상태를 조회만 하며 변경은 정해진 액션(TanStack Query mutation, Zustand action)을 통해서만 이루어진다. 백엔드는 요청이 라우트 → 서비스 → 데이터 접근 순으로만 흐르고 역방향 호출이 없다(3절 참조).
5. **실용주의.** 완벽한 설계보다 2일 안에 UC-01~06(PRD 3.1절)을 안전하게 구현·검증할 수 있는 구조를 우선한다. 판단이 갈리는 지점에서는 "더 적은 코드로, 더 적은 개념으로" 해결되는 쪽을 택한다.
6. **소유권 검증은 예외 없이 공통 경로를 통과시킨다.** BR-02(본인 소유만 CRUD 가능)는 모든 Category/Todo API에 적용되는 규칙이므로, 각 컨트롤러/서비스에서 개별적으로 재구현하지 않고 공통 함수(`utils/ownership.js`의 `assertOwnership`)로 처리해 빠짐을 방지한다. 단, 이 원칙은 "요청 대상 리소스(할일/카테고리 자체)의 소유자가 요청자와 같은가"에 한정되며, Todo 등록/수정 시 본문으로 넘어오는 `categoryId`가 실제로 요청자 소유 카테고리인지까지는 검증하지 않는다(1인 2일 규모에서 타인 categoryId를 알아내 악용할 실익이 낮다고 판단한 YAGNI 결정, BE-06 범위).

## 3. 의존성/레이어 원칙

### 3.1 백엔드 (Express + pg, ORM 미사용)

라우트 → 컨트롤러 → 서비스 → 데이터 접근(쿼리 모듈) 4계층으로 분리하되, ORM이 없는 만큼 "데이터 접근 계층 = 순수 SQL을 캡슐화한 함수 모음"으로 정의한다.

- **라우트(routes)**: URL과 HTTP 메서드를 컨트롤러 함수에 매핑하고, 인증 미들웨어(JWT 검증)·요청 유효성 검증 미들웨어를 연결하는 역할만 한다. 비즈니스 로직을 포함하지 않는다.
- **컨트롤러(controllers)**: HTTP 요청/응답(req/res)을 다루는 경계. req에서 값을 꺼내 서비스에 전달하고, 서비스 결과를 표준 응답 형식으로 변환한다. SQL을 직접 작성하지 않는다.
- **서비스(services)**: 비즈니스 규칙(BR-xx)이 실제로 구현되는 계층. 예: BR-05(종료일자 검증), BR-06(상태 계산), BR-09(카테고리 삭제 시 이관)는 반드시 서비스 계층에 위치한다. 트랜잭션 경계(예: 카테고리 삭제+할일 이관을 하나의 트랜잭션으로)도 서비스 계층에서 관리한다.
- **데이터 접근(repositories/queries)**: 테이블 단위(users, categories, todos)로 파일을 나누고, 각 파일은 해당 테이블에 대한 SQL 쿼리 함수만 export한다. 비즈니스 규칙 판단(예: 상태 계산)을 포함하지 않고, 순수하게 데이터의 CRUD/조회만 담당한다.
- **의존 방향**: 상위 계층(라우트)은 하위 계층(컨트롤러→서비스→데이터 접근)에만 의존하며 역방향 의존은 금지한다. 컨트롤러는 데이터 접근 계층을 직접 호출하지 않고 반드시 서비스를 경유한다(단, 서비스가 사실상 데이터 접근을 그대로 위임하는 단순 조회의 경우에도 계층 스킵 없이 서비스를 거치되, 서비스 함수 내부 로직은 얇아도 무방하다 — 계층 스킵보다 계층 일관성을 우선).
- ORM이 없으므로 쿼리 재사용(예: 사용자 소유 검증을 위한 `WHERE user_id = $1` 조건)은 데이터 접근 계층의 공용 헬퍼로 추출해 SQL 중복을 방지한다.
- 커넥션은 pg의 `Pool` 하나를 앱 전역에서 공유하며(PRD 6.2, 7절), 트랜잭션이 필요한 서비스 로직(BR-09)만 `pool.connect()`로 클라이언트를 명시적으로 얻어 `BEGIN/COMMIT/ROLLBACK`을 직접 관리한다.

### 3.2 프론트엔드 (React 19 + TS + Zustand + TanStack Query, FSD)

프론트엔드는 Feature-Sliced Design(FSD)을 적용한다. 계층은 `app → pages → widgets → features → entities → shared` 순으로 고정되며, 상위 계층은 하위 계층만 import할 수 있고 같은 계층끼리 또는 하위에서 상위로의 import는 금지한다(FSD의 단방향 계층 규칙).

- **app**: 전역 진입점. 라우터 구성, React Query의 `QueryClientProvider`, 전역 스타일 등 애플리케이션 전체를 감싸는 설정만 둔다. 비즈니스 로직은 두지 않는다.
- **pages**: 와이어프레임의 화면(SC-xx) 1개당 페이지 1개. widgets/features/entities를 조합해 화면을 구성하는 역할만 하며, 자체 비즈니스 로직은 최소화한다.
- **widgets**: 여러 feature/entity를 묶어 화면의 독립적인 영역을 이루는 조합 단위(예: 공통 헤더, 할일 목록+필터 영역). 페이지 간 재사용되지 않는 조합은 굳이 widgets로 분리하지 않고 pages에 둔다(과설계 금지, 2절 YAGNI).
- **features**: 사용자 행동 단위(UC-xx에 대응)의 기능 슬라이스. 각 feature는 자신의 UI, 훅, mutation을 함께 가진다. 예: `login`, `signup`, `edit-profile`, `create-todo`, `edit-todo`, `delete-todo`, `filter-todos`, `manage-category`.
- **entities**: 도메인 엔티티(EN-01~03: User/Category/Todo) 단위 슬라이스. 엔티티 타입, 해당 엔티티의 조회 전용 API 함수·쿼리 훅(예: `useTodoList`), 최소한의 표시용 컴포넌트(예: `TodoCard`)만 둔다. 여기에는 생성/수정/삭제 같은 행동 로직을 넣지 않고 features에 둔다.
- **shared**: 프로젝트 전반에서 재사용되는, 특정 도메인에 속하지 않는 코드. API 클라이언트(fetch 래퍼, access_token 첨부, 401 시 refresh_token 재발급 트리거 — PRD 6.3절), 공통 UI 컴포넌트(버튼, 인풋, 확인 다이얼로그), 공통 유틸을 둔다. shared는 다른 어떤 계층도 import하지 않는다.
- **인증 상태(Zustand)**: access_token과 로그인 사용자 정보 등 전역 클라이언트 상태는 `entities/user`의 스토어로 둔다(로그인/로그아웃 자체는 `features/login`이 이 스토어를 갱신). TanStack Query는 Todo/Category 등 서버 데이터의 조회·캐싱·동기화를 전담하며, 같은 대상을 Zustand와 이중으로 보관하지 않는다.
- 각 슬라이스(feature/entity) 내부는 `ui/`, `model/`(상태·훅), `api/` 세그먼트로 구성해 슬라이스 간에는 반드시 공개 인터페이스(`index.ts`)를 통해서만 접근하고 내부 파일을 직접 import하지 않는다.
- 클라이언트 측 검증(예: BR-05 종료일자, 이메일 형식)은 서버 검증을 대체하지 않는 보조 수단으로만 둔다. 최종 판단은 항상 서버(서비스 계층)에서 이루어진다.

## 4. 코드/네이밍 원칙

- **JS/TS 코드**: 변수·함수는 camelCase, React 컴포넌트 파일 및 컴포넌트명은 PascalCase, 그 외 파일(훅, 유틸, 서비스 모듈)은 camelCase 또는 kebab-case 중 계층별로 하나를 통일해 사용한다(백엔드: kebab-case 파일명 예 `todo.service.js`, 프론트: 컴포넌트 `TodoList.tsx`, 훅 `useTodos.ts`).
- **PostgreSQL 스키마**: 테이블명은 복수형 snake_case(`users`, `categories`, `todos`), 컬럼명도 snake_case(`user_id`, `category_id`, `start_date`, `end_date`, `is_default`, `is_done`, `created_at`)를 사용한다. PostgreSQL 식별자 관례를 그대로 따른다.
- **JS-DB 네이밍 불일치 처리**: ORM이 없으므로 자동 매핑이 없다. 데이터 접근 계층(3.1절)의 쿼리 함수가 SQL 결과 행(snake_case)을 애플리케이션 객체(camelCase)로 변환하는 책임을 지며, 이 변환은 데이터 접근 계층 경계에서 한 번만 수행한다. 서비스/컨트롤러/프론트엔드로 넘어가는 시점부터는 항상 camelCase만 사용하고 snake_case 필드가 상위 계층으로 새어나가지 않도록 한다. 변환 로직은 매 쿼리마다 재작성하지 않고 공용 매핑 헬퍼(예: `toCamelCase(row)`)로 공통화한다.
- **도메인 용어 일치**: 도메인 정의서 3절(용어 정의)의 한글 용어를 코드 식별자에 직역하지 않되, EN-01~03의 속성명(id, userId, categoryId, title, startDate, endDate, isDone, name, email, password, isDefault, createdAt)은 프론트/백엔드 어디서든 동일한 영문 필드명으로 통일해 사용한다. status는 저장 컬럼이 없으므로(BR-06) DB 스키마에 컬럼을 두지 않고, 서비스 계층 또는 프론트 표시 로직에서만 계산되는 필드로 취급한다.
- **에러 응답 형식 통일**: 모든 API 에러 응답은 `{ error: { code, message } }` 형태 등 하나의 공통 포맷으로 고정하고, BR-05/BR-08 위반 시의 거부 사유도 이 포맷을 통해 반환해 프론트에서 일관되게 처리한다(구체적 코드 체계는 구현 시 확정).

## 5. 테스트/품질 원칙

PRD 9절은 "테스트 커버리지 부족"을 이미 리스크로 명시하고 있다. 이를 감추지 않고, 제한된 시간 안에서 리스크가 큰 지점에만 테스트를 선별 투입하는 전략을 취한다.

- **반드시 자동화 테스트를 작성하는 대상**: 순수 함수로 분리 가능하고 회귀 위험이 큰 핵심 비즈니스 로직만 대상으로 한다.
  - BR-05: 종료일자 ≥ 시작일자 검증 함수(`utils/todoRules.js`의 `isValidDateRange`)
  - BR-06: 상태(시작전/진행중/완료/기한초과) 판정 함수(`utils/todoRules.js`의 `computeStatus`, 도메인 정의서 4.4절의 4가지 분기 전부)
  - BR-08 중 카테고리명 중복 비교 로직(대소문자 무시, 공백 트림): 실제 중복 검증 자체는 DB 유니크 인덱스 `uq_categories_user_name`(`lower(trim(name))`, 7-erd.md 3절)가 담당하고 서비스 계층은 위반 시 발생하는 `23505` 에러를 `CATEGORY_NAME_ALREADY_EXISTS`로 매핑만 한다. `utils/categoryRules.js`의 순수 함수(`normalizeCategoryName`/`areCategoryNamesEqual`)는 이 비교 규칙의 명세이자 단위테스트 대상으로만 존재하며 실행 경로에서 호출되지 않는다.
  - 위 로직들은 DB나 HTTP에 의존하지 않는 순수 함수로 구현해 단위 테스트를 붙이기 쉽게 만든다(테스트 용이성 자체가 함수 분리의 근거가 된다).
- **실제로는 위 핵심 로직 외에 컨트롤러/서비스/리포지토리/미들웨어/유틸 전반에도 `node:test` 단위테스트를 추가했다**(의존 대상을 목(mock)으로 대체하는 순수 단위테스트이며, 실제 DB·HTTP를 띄우는 통합 테스트는 아니다). 최소 대상은 위 세 로직이라는 기준은 유지하되, 시간이 허용되어 커버리지를 넓힌 결과다.
- **테스트하지 않는 것(의도적 생략)**: 실제 DB/HTTP를 띄우는 컨트롤러·라우트 통합 테스트, E2E 테스트, 프론트엔드 컴포넌트 테스트는 2일 일정상 생략하고 수동 확인으로 대체한다(PRD 9절 리스크로 이미 인지). 새 테스트 프레임워크나 커버리지 도구 도입 없이, Node.js 내장 `node:test` + `assert`만으로 테스트를 작성해 별도 설정 비용을 없앤다.
- **린트/포맷터**: 프론트엔드(TypeScript)와 백엔드(JavaScript)에 각각 ESLint를 적용하고, Prettier로 포맷을 통일한다. 커밋 전 수동 실행 수준으로 충분하며, CI 파이프라인 구축(PRD 10절 향후 과제)은 범위 밖이다.
- **수동 확인 기준**: UC-01~06(도메인 정의서 7절)의 수용 기준(Given-When-Then)을 그대로 수동 체크리스트로 사용해 Day 2 통합 단계(PRD 8절)에서 훑는다. 별도 체크리스트 문서를 새로 만들지 않고 도메인 정의서의 수용 기준을 그대로 활용한다.

## 6. 설정/보안/운영 원칙

- **환경변수**: DB 접속 정보(host/port/user/password/database), JWT 시크릿(access/refresh 각각 별도 키 권장), 포트 번호, 토큰 만료 시간(PRD 6.3절: access 15분~1시간, refresh 7일~14일) 등은 모두 `.env` 기반 환경변수로 관리하고 코드에 하드코딩하지 않는다. `.env`는 `.gitignore`에 포함하고 `.env.example`만 저장소에 커밋한다.
- **비밀번호(BR-08, EN-01)**: bcrypt 등 단방향 해시 알고리즘으로 저장 전 해싱하며, 평문 비밀번호는 로그에도 남기지 않는다.
- **JWT 토큰 보안(PRD 6.3절)**: access_token은 짧은 만료(15분~1시간)로 발급해 Authorization Bearer 헤더로만 전송하고 서버 저장소에 영속화하지 않는다(클라이언트도 메모리 보관만, localStorage 금지). refresh_token은 HttpOnly + Secure + SameSite 속성의 쿠키로만 전달하며, 자바스크립트에서 접근 불가능해야 한다. refresh_token의 서버 측 화이트리스트/블랙리스트 관리는 PRD 10절에 따라 MVP 범위에서 제외한다.
- **CORS**: 프론트엔드 배포 오리진만 허용 목록에 등록하고, credentials(쿠키 전송)를 허용하는 경우 와일드카드(`*`) origin은 사용하지 않는다. 허용 오리진은 `FRONTEND_ORIGIN` 환경변수로 지정하며, 미지정 시 로컬 개발 기본값(`http://localhost:5173`)을 사용한다.
- **인가(BR-01, BR-02)**: 인증 미들웨어가 모든 보호 라우트에서 JWT를 검증하고, 소유권 검증(BR-02)은 3.1절에서 정의한 공통 경로를 통해서만 수행해 개별 엔드포인트 구현 누락을 방지한다.
- **로그인 실패 응답**: 이메일이 존재하지 않는 경우와 비밀번호가 틀린 경우를 구분하지 않고 동일한 `401 INVALID_CREDENTIALS` 응답으로 통일해, 응답 차이를 통한 이메일 등록 여부 유추(계정 열거, user enumeration)를 방지한다.
- **API 문서(Swagger UI)**: `NODE_ENV`가 `production`이 아닐 때만 `/api-docs`에 `swagger-ui-express`로 `backend/swagger.json`을 마운트한다. 운영 환경에서는 노출하지 않는다.
- **로깅 최소 기준**: 요청 단위로 method/path/status/응답시간을 표준 출력에 기록하는 수준의 최소 구조화 로깅만 적용한다(전용 로깅 인프라나 로그 수집 시스템은 PRD 10절 향후 과제로 남긴다). 비밀번호, 토큰 원문 등 민감정보는 어떤 로그에도 남기지 않는다.
- **DB 커넥션 풀링/인덱스**: PRD 7절의 방침(Pool 크기 10~20, users.email·todos.user_id·todos.category_id 인덱스)을 그대로 구현 기준으로 채택한다.
- **헬스 체크**: `GET /health` 등 단일 엔드포인트로 서버 및 DB 연결 상태만 간단히 확인 가능하게 한다. 별도 메트릭 수집(Prometheus 등)은 이 규모에서 과설계이므로 도입하지 않는다.

## 7. 디렉토리 구조

### 7.1 백엔드 (Express + pg)

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # pg Pool 생성/설정
│   │   └── env.js             # 환경변수 로드/검증
│   ├── middlewares/
│   │   ├── auth.js            # JWT 검증 미들웨어 (BR-01)
│   │   ├── errorHandler.js    # 공통 에러 응답 포맷
│   │   ├── requestLogger.js   # 요청 단위 method/path/status/응답시간 로깅 (6절)
│   │   └── validate.js        # 요청 바디 유효성 검증
│   ├── routes/
│   │   ├── auth.routes.js     # UC-01 회원가입/로그인/토큰 재발급
│   │   ├── users.routes.js    # UC-02 사용자 정보 수정
│   │   ├── categories.routes.js   # 카테고리 CRUD (UC-03/04 전제)
│   │   └── todos.routes.js    # UC-03~06 할일 CRUD/필터링
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── categories.controller.js
│   │   └── todos.controller.js
│   ├── services/
│   │   ├── auth.service.js       # 회원가입/로그인/토큰 발급, 기본 카테고리 생성
│   │   ├── users.service.js      # 이름 수정 (BR-07)
│   │   ├── categories.service.js # 이름 중복 검증, 기본 카테고리 삭제 방지(BR-04), 이관(BR-09)
│   │   └── todos.service.js      # 날짜 검증(BR-05), 상태 계산(BR-06), 소유권 검증(BR-02)
│   ├── repositories/
│   │   ├── users.repository.js
│   │   ├── categories.repository.js
│   │   └── todos.repository.js
│   ├── utils/
│   │   ├── caseMapper.js      # snake_case <-> camelCase 변환 (4절)
│   │   ├── password.js        # 해시/검증
│   │   ├── jwt.js             # access/refresh 토큰 발급/검증
│   │   ├── appError.js        # 공통 에러 클래스 (statusCode/code/message)
│   │   ├── ownership.js       # 소유권 검증 공통 함수 (BR-02, 2절 6항)
│   │   ├── cookies.js         # refresh_token 쿠키 파싱
│   │   ├── todoRules.js       # BR-05 날짜 검증, BR-06 상태 판정 순수 함수
│   │   └── categoryRules.js   # BR-08 카테고리명 비교 규칙 명세(순수 함수, 5절 참조)
│   └── app.js                 # Express 앱 조립 (미들웨어/라우트/Swagger UI 등록)
├── migrations/
│   └── 001_init.sql           # users/categories/todos 테이블, 인덱스 (PRD 7절)
├── test/                      # node:test 단위테스트 (5절 참조, 아래는 대표 파일 예시)
│   ├── todoStatus.test.js     # BR-06 상태 판정
│   ├── todoDateValidation.test.js  # BR-05 날짜 검증
│   ├── categoryNameCompare.test.js # BR-08 카테고리명 중복 비교
│   └── (그 외 controllers/services/repositories/middlewares/utils 단위테스트 다수)
├── server.js                  # 진입점 (app.listen)
├── swagger.json                # OpenAPI 3.0 스펙 (API 스펙 문서)
├── .env.example
└── package.json
```

### 7.2 프론트엔드 (React 19 + TypeScript + Zustand + TanStack Query)

```
frontend/
├── src/
│   ├── app/
│   │   ├── providers/
│   │   │   └── QueryProvider.tsx   # TanStack Query의 QueryClientProvider
│   │   ├── routes/
│   │   │   ├── router.tsx          # 화면 라우팅, 6절 화면 흐름 매핑
│   │   │   └── ProtectedRoute.tsx  # 비인증 접근 시 SC-02로 리다이렉트 + 인증된 화면 공통 헤더(Header) 렌더링 (BR-01)
│   │   └── App.tsx
│   ├── pages/
│   │   ├── signup/index.tsx        # SC-01
│   │   ├── login/index.tsx         # SC-02
│   │   ├── todo-list/index.tsx     # SC-03
│   │   ├── todo-form/index.tsx     # SC-04 (등록/수정 공용)
│   │   └── my-page/index.tsx       # SC-05
│   ├── widgets/
│   │   ├── header/
│   │   │   └── ui/Header.tsx           # 3.1절 공통 헤더, 로그아웃 액션 포함
│   │   └── todo-board/
│   │       └── ui/TodoBoard.tsx        # SC-03: filter-todos + entities/todo 목록 조합
│   ├── features/
│   │   ├── login/          # UC-01: 로그인 폼 + auth mutation
│   │   ├── signup/         # UC-01: 회원가입 폼 + 검증(BR-08)
│   │   ├── edit-profile/   # UC-02: 이름 수정 (BR-07)
│   │   ├── create-todo/    # UC-03: 등록 폼, 날짜 검증(BR-05)
│   │   ├── edit-todo/      # UC-05: 수정 폼, 소유권 오류 처리(BR-02)
│   │   ├── delete-todo/    # UC-06: 삭제 확인 다이얼로그 + mutation
│   │   ├── filter-todos/   # UC-04: 카테고리·상태 필터 바
│   │   └── manage-category/  # 카테고리 생성/삭제 모달 (SC-06, BR-04/BR-09)
│   │       ├── ui/CategoryManageModal.tsx
│   │       └── index.ts
│   ├── entities/
│   │   ├── user/
│   │   │   ├── model/authStore.ts      # Zustand: access_token, 로그인 사용자 정보
│   │   │   ├── model/bootstrapAuth.ts  # 앱 부팅 시 refresh+/users/me로 세션 복구 (6-arch.md 4.1절)
│   │   │   ├── api/users.api.ts        # UC-02 조회/수정 API 호출, /users/me 조회
│   │   │   └── index.ts
│   │   ├── category/
│   │   │   ├── model/useCategoryList.ts  # TanStack Query 조회 훅
│   │   │   ├── api/categories.api.ts
│   │   │   ├── ui/CategoryBadge.tsx
│   │   │   └── index.ts
│   │   └── todo/
│   │       ├── model/useTodoList.ts      # TanStack Query 조회 훅
│   │       ├── model/todoStatus.ts       # BR-06 상태 계산(클라이언트 표시용)
│   │       ├── api/todos.api.ts
│   │       ├── ui/TodoCard.tsx
│   │       └── index.ts
│   └── shared/
│       ├── api/client.ts       # fetch 래퍼, 토큰 첨부, 401 시 refresh 처리, 부팅 시 세션 복구·로그아웃용 refreshAccessToken/logoutRequest 노출 (PRD 6.3절, 6-arch.md 4.1절)
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── ConfirmDialog.tsx   # 3.2절 확인 다이얼로그
│       │   └── FormFieldError.tsx  # 3.3절 인라인 오류 메시지
│       ├── lib/
│       │   ├── validators.ts   # 클라이언트 측 보조 검증(이메일 형식 등)
│       │   ├── theme.ts        # 다크/라이트 모드 Zustand 스토어, localStorage 영속화, 시스템 선호도 감지 (FE-09 이후 범위外 추가 작업)
│       │   └── i18n.ts         # 한/영/일 다국어 딕셔너리+Zustand 스토어, localStorage 영속화, 브라우저 언어 감지 (FE-09 이후 범위外 추가 작업)
│       └── types/
│           └── domain.ts       # EN-01~03 공용 타입, Status 유니온 타입
│   └── main.tsx
├── index.html

├── .env.example
└── package.json
```

계층 구조는 FSD 규칙(app → pages → widgets → features → entities → shared, 상위→하위 단방향 의존)을 따르며, 각 features/entities 슬라이스는 `index.ts`로만 외부에 공개한다(3.2절 참조).

## 8. 향후 확장 시 주의사항

PRD 10절(향후 과제)에 해당하는 항목(자동화 테스트 확대, 캐싱 레이어, 모니터링/배포 파이프라인, refresh_token 서버 측 저장)은 본 문서의 구조를 깨지 않고 각 계층에 점진적으로 추가 가능하도록 설계했다. 예컨대 캐싱 레이어 도입 시에는 데이터 접근 계층(repositories) 내부에만 캐시 조회/무효화 로직을 추가하면 되고, 서비스/컨트롤러/프론트엔드는 변경할 필요가 없다. 다만 이는 현재 시점의 요구사항이 아니므로 미리 구현하지 않는다(2절 YAGNI 원칙).
