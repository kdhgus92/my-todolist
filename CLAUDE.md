# my-todolist 앱의 최상위 지침

## 반드시 준수해야할 지침

- 모든 커뮤니케이션은 한국어로 할 것
- 오버엔지니어링 금지

## 참조 문서

| 문서명 | 경로 | 요약 |
|---|---|---|
| 도메인 정의서 | `docs/1-domain-definition.md` | 용어 정의, 핵심 엔티티(User/Category/Todo, EN-01~03), 비즈니스 규칙(BR-01~09), 유스케이스(UC-01~06)와 수용 기준을 정의한 문서. |
| PRD | `docs/2-prd.md` | 목표 사용자, MVP 범위, 기능/비기능 요구사항, 기술 스택(React 19+TS+Zustand+TanStack Query, Node.js+Express+pg, PostgreSQL 17), 인증 방식(JWT access/refresh token), 일정·리스크를 정의한 제품 요구사항 문서. |
| 사용자 시나리오 | `docs/3-user-scenario.md` | 페르소나 2종과 UC-01~06 기반의 사용자 행동 흐름·화면 전환 시나리오, 전체 사용자 여정 요약. |
| 와이어프레임 | `docs/4-wireframe.md` | 회원가입/로그인/할일목록/등록·수정/마이페이지/카테고리 관리 등 화면별 ASCII 와이어프레임과 모바일 반응형 레이아웃. |
| 프로젝트 구조 설계 원칙 | `docs/5-project-principle.md` | 최상위 원칙(YAGNI, SRP 등), 백엔드 4계층(라우트-컨트롤러-서비스-데이터접근) 및 프론트엔드 FSD 구조, 네이밍/테스트/보안 원칙, 디렉토리 구조. |
| 아키텍처 다이어그램 | `docs/6-arch.md` | 전체 시스템 구성도, 백엔드 요청 처리 흐름, 인증(access/refresh token) 흐름을 나타낸 mermaid 다이어그램. |
| ERD | `docs/7-erd.md` | users/categories/todos 테이블 구조와 관계, 제약조건을 나타낸 mermaid ERD. |
| DDL | `docs/schema.sql` | ERD 기반 PostgreSQL 17 실제 테이블/인덱스/제약조건 생성 스크립트. |
| 실행 계획(WBS) | `docs/8-plan.md` | DB/백엔드/프론트엔드 트랙별 Task 분해, 각 Task의 수행 작업·완료 조건(체크박스)·선행 Task. |
| API 스펙 | `backend/swagger.json` | 백엔드 REST API의 OpenAPI 3.0 스펙(엔드포인트, 요청/응답 스키마, 에러 포맷, 인증 방식). |
| 스타일 가이드 | `docs/9-style.md` | 프론트엔드 색상/타이포그래피/spacing·radius·shadow 토큰, 버튼·입력필드·카드·모달·배지·체크박스 등 컴포넌트 스타일, 반응형 기준, 아이콘 가이드. |

## 코딩 작업 원칙 (Andrej Karpathy CLAUDE.md 요약)

1. **코딩 전 생각하기** — 가정을 명시적으로 드러내고, 불확실하면 구현 전에 질문한다. 여러 해석이 가능하면 조용히 하나를 고르지 말고 선택지를 제시한다. 더 간단한 방법이 있으면 이의를 제기한다.
2. **단순성 우선** — 요청된 문제만 푸는 최소한의 코드를 작성한다. 요청받지 않은 기능·추상화·설정 가능성·불가능한 상황에 대한 예외 처리를 추가하지 않는다. "선임 엔지니어가 과도하다고 할까?"를 기준으로 삼는다.
3. **세밀한 변경** — 필요한 부분만 건드린다. 관련 없는 코드/주석/포맷을 임의로 "개선"하거나 리팩토링하지 않는다. 기존 스타일을 따른다. 변경으로 고아가 된 임포트/변수/함수만 정리하고, 요청받지 않은 기존 데드코드는 삭제하지 않는다.
4. **목표 중심 실행** — 작업을 검증 가능한 목표로 바꾼다("버그 수정" → "재현 테스트 작성 후 통과시키기"). 다단계 작업은 `[단계] → 검증: [확인]` 형태로 계획을 명시한다.

원문: https://raw.githubusercontent.com/multica-ai/andrej-karpathy-skills/refs/heads/main/CLAUDE.md
