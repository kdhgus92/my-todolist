# my-todolist 아키텍처 다이어그램

## 버전 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|---|---|---|---|
| 0.1 | 2026-08-26 | 최초 작성 | ohhyeun |

## 1. 문서 개요

### 1.1 목적

본 문서는 할일 관리 웹 애플리케이션 "my-todolist"의 시스템/네트워크 수준 아키텍처를 mermaid 다이어그램으로 표현한다. 1인 개발·2일 일정의 단순한 3-tier(프론트/백엔드/DB) 구조임을 전제로, 세부 파일·엔드포인트·컴포넌트 나열 없이 핵심 구조와 데이터 흐름만 다룬다.

### 1.2 관련 문서

- 도메인 정의서: [docs/1-domain-definition.md](./1-domain-definition.md) (v0.3)
- PRD: [docs/2-prd.md](./2-prd.md) (v0.2)
- 사용자 시나리오: [docs/3-user-scenario.md](./3-user-scenario.md) (v0.1)
- 와이어프레임: [docs/4-wireframe.md](./4-wireframe.md) (v0.1)
- 프로젝트 구조 설계 원칙: [docs/5-project-principle.md](./5-project-principle.md) (v0.3)

## 2. 전체 시스템 구성도

사용자 브라우저의 프론트엔드(SPA)가 백엔드 API 서버와 통신하고, 백엔드는 PostgreSQL을 통해 데이터를 영속화한다. access_token은 응답 바디로 전달되어 클라이언트 메모리에 보관되고, refresh_token은 HttpOnly 쿠키로 전달된다(5-project-principle.md 6절).

```mermaid
flowchart LR
    User(["사용자"])
    FE["프론트엔드 SPA<br/>React 19 + TypeScript<br/>(FSD 구조, 상세는 5-project-principle.md 참조)"]
    BE["백엔드 API 서버<br/>Node.js + Express"]
    DB[("PostgreSQL 17<br/>users / categories / todos")]

    User -->|브라우저 조작| FE
    FE -->|HTTPS 요청<br/>Authorization: Bearer access_token<br/>Cookie: refresh_token HttpOnly| BE
    BE -->|JSON 응답<br/>+ access_token 발급/재발급| FE
    BE -->|SQL 쿼리<br/>pg Pool| DB
    DB -->|조회 결과| BE
```

## 3. 백엔드 요청 처리 흐름

백엔드는 라우트 → 컨트롤러 → 서비스 → 데이터 접근 4계층으로 구성되며, 요청은 상위 계층에서 하위 계층으로만 흐른다(5-project-principle.md 3.1절).

```mermaid
flowchart TD
    Client(["프론트엔드 요청"]) --> Route["라우트<br/>URL/메서드 매핑, 인증 미들웨어(JWT 검증)"]
    Route --> Controller["컨트롤러<br/>req/res 변환"]
    Controller --> Service["서비스<br/>비즈니스 규칙(BR-xx) 처리"]
    Service --> Repository["데이터 접근<br/>테이블별 SQL 쿼리 함수"]
    Repository --> DB[("PostgreSQL")]
    DB --> Repository
    Repository --> Service
    Service --> Controller
    Controller --> Client
```

## 4. 인증 흐름 (로그인 및 토큰 재발급)

로그인 시 access_token(짧은 만료)과 refresh_token(HttpOnly 쿠키, 긴 만료)이 함께 발급되며, access_token 만료 시 refresh_token으로 재발급을 시도한다(PRD 6.3절, 5-project-principle.md 6절).

```mermaid
sequenceDiagram
    participant FE as 프론트엔드
    participant BE as 백엔드
    participant DB as PostgreSQL

    FE->>BE: POST /auth/login (email, password)
    BE->>DB: 사용자 조회 및 비밀번호 검증
    DB-->>BE: 사용자 정보
    BE-->>FE: access_token(응답 바디) + refresh_token(HttpOnly 쿠키)

    Note over FE: access_token 만료 후 API 요청

    FE->>BE: API 요청 (만료된 access_token)
    BE-->>FE: 401 Unauthorized
    FE->>BE: POST /auth/refresh (Cookie: refresh_token)
    BE->>BE: refresh_token 검증
    BE-->>FE: 신규 access_token 발급
    FE->>BE: 원 요청 재시도 (신규 access_token)
```
