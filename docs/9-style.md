# my-todolist 프론트엔드 스타일 가이드

## 버전 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|---|---|---|---|
| 0.1 | 2026-08-27 | 최초 작성 | ohhyeun |
| 0.2 | 2026-08-27 | FE-09 이후 범위外 추가 작업(다크 모드)의 실제 구현 팔레트 반영: 3.8절 다크 모드 팔레트 신설 | ohhyeun |

## 1. 문서 개요

### 1.1 목적

본 문서는 할일 관리 웹 애플리케이션 "my-todolist"의 프론트엔드 시각 스타일 가이드를 정의한다. 화면 구조와 컴포넌트 배치는 [4-wireframe.md](./4-wireframe.md)에 SC-01~SC-06으로 이미 정의되어 있으므로 본 문서는 이를 재서술하지 않고 SC-xx ID로 참조하며, 그 위에 실제 CSS/컴포넌트 구현이 따라야 할 색상·타이포그래피·spacing·컴포넌트 스타일 토큰을 정의한다. 아직 `frontend/` 디렉토리는 구현되지 않았으며, 본 문서가 이후 FE-01~09 구현의 스타일 기준이 된다.

### 1.2 관련 문서

- PRD: [docs/2-prd.md](./2-prd.md) — 기술 스택(React 19 + TS), 반응형 웹 요구사항(5.2절)
- 와이어프레임: [docs/4-wireframe.md](./4-wireframe.md) — SC-01~SC-06 화면 구조, 3절 공통 컴포넌트, 5절 모바일 반응형 기준
- 프로젝트 구조 설계 원칙: [docs/5-project-principle.md](./5-project-principle.md) — FSD 구조, YAGNI 원칙

### 1.3 레퍼런스 출처

시각 무드는 Claude 공식 웹사이트(claude.com/ko)의 요금제 페이지 스크린샷을 참고했다. Claude 브랜드 자산(로고, 정확한 상표 컬러, 워드마크)은 그대로 사용하지 않으며, "따뜻한 뉴트럴 배경 + 세리프/산세리프 조합 + 절제된 포인트 컬러 + 얇은 헤어라인 보더 + 검정 Primary 버튼"이라는 스타일 언어만 차용해 my-todolist 고유의 팔레트로 재정의한다.

## 2. 디자인 원칙

1. **따뜻한 뉴트럴, 순백색 지양** — 배경은 크림/오프화이트 톤을 사용하고 순수한 `#FFFFFF`는 카드·모달 등 배경 위에 얹히는 표면에 한정한다.
2. **세리프(제목) + 산세리프(본문/UI) 이중 서체** — 화면/섹션 제목은 세리프로 에디토리얼한 느낌을 주고, 폼·버튼·라벨·데이터 등 실사용 UI 텍스트는 가독성 높은 산세리프를 사용한다.
3. **포인트 컬러는 절제해서 사용** — 브랜드 포인트 컬러(앰버/오렌지)는 강조가 필요한 최소 지점(포커스 링, 활성 탭, 진행중 배지 등)에만 쓰고, 버튼 등 주요 액션은 검정을 기본으로 한다.
4. **얇은 헤어라인, 무거운 그림자 금지** — 구획 구분은 두꺼운 보더나 진한 그림자 대신 1px 헤어라인 보더와 은은한 그림자만 사용한다.
5. **넉넉한 여백** — 폼/카드/리스트 요소 사이에 spacing 토큰(5절)을 일관되게 적용해 답답하지 않은 레이아웃을 만든다.

## 3. 컬러 팔레트

디자인 토큰은 CSS 커스텀 프로퍼티(`--color-*`)로 정의하는 것을 전제로 한다.

### 3.1 배경 / 표면

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-bg` | `#F5F3EE` | 앱 전체 배경 (body) |
| `--color-surface` | `#FFFFFF` | 카드, 모달, 입력 필드 등 배경 위 표면 |
| `--color-surface-hover` | `#F0EDE6` | 리스트 행 hover, 서브틀한 배경 강조 |

### 3.2 텍스트

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-text` | `#2B2A28` | 기본 본문/제목 텍스트 (순검정 대신 차콜) |
| `--color-text-muted` | `#6B685F` | 보조 설명, 타임스탬프, placeholder |
| `--color-text-inverse` | `#FFFFFF` | 검정/포인트 배경 위 텍스트 |

### 3.3 포인트 컬러 (Primary Accent)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-accent` | `#D97706` | 포커스 링, 활성 탭/링크, "진행중" 배지, 체크박스 체크 상태 |
| `--color-accent-hover` | `#B45309` | accent 요소 hover |
| `--color-accent-subtle` | `#FDECD1` | accent 배경이 필요한 배지/하이라이트의 연한 배경 |

### 3.4 보더

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-border` | `#E4E0D6` | 카드/입력/네비게이션 등 기본 헤어라인 보더 |
| `--color-border-strong` | `#D6D1C4` | 입력 필드 hover/구분이 더 필요한 보더 |

### 3.5 검정 (Primary 버튼용)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-ink` | `#1F1E1C` | Primary 버튼 배경, 헤더 로고 텍스트 |
| `--color-ink-hover` | `#000000` | Primary 버튼 hover |

### 3.6 상태 색상 (에러/성공/경고)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-danger` | `#C0392B` | 오류 메시지 텍스트, 삭제 버튼 텍스트, 기한초과 배지 |
| `--color-danger-subtle` | `#FBE9E7` | 오류 인라인 메시지 배경(선택 사용) |
| `--color-success` | `#2F7D4F` | 성공 메시지, 완료 배지 |

### 3.7 할일 상태 배지 컬러 매핑 (SC-03, SC-04 연계)

| 상태 | 텍스트 색 | 배경 색 |
|---|---|---|
| 시작전 | `#6B685F` (`--color-text-muted`) | `#EDEAE2` |
| 진행중 | `#B45309` (`--color-accent-hover`) | `#FDECD1` (`--color-accent-subtle`) |
| 완료 | `#2F7D4F` (`--color-success`) | `#E4F1E8` |
| 기한초과 | `#C0392B` (`--color-danger`) | `#FBE9E7` (`--color-danger-subtle`) |

### 3.8 다크 모드 팔레트 (FE-09 이후 범위外 추가 작업)

본 문서 1.3절의 레퍼런스 무드는 라이트 모드를 기준으로 정의되었으며, 다크 모드는 애초 스코프에 없었다. FE-09 완료 후 사용자 요청으로 다크/라이트 토글이 추가 구현되면서 `frontend/src/index.css`의 `:root[data-theme="dark"]`에 아래 다크 팔레트가 정의되었다. 각 토큰의 용도는 3.1~3.6절과 동일하며, 값만 다크 모드 전용으로 재정의된다.

| 토큰 | 값 |
|---|---|
| `--color-bg` | `#1C1B19` |
| `--color-surface` | `#262421` |
| `--color-surface-hover` | `#2E2B27` |
| `--color-text` | `#EDEAE4` |
| `--color-text-muted` | `#A8A39A` |
| `--color-text-inverse` | `#1C1B19` |
| `--color-accent` | `#E2984B` |
| `--color-accent-hover` | `#F0A868` |
| `--color-accent-subtle` | `#3A2C18` |
| `--color-border` | `#3A3733` |
| `--color-border-strong` | `#4A4640` |
| `--color-ink` | `#EDEAE4` |
| `--color-ink-hover` | `#FFFFFF` |
| `--color-danger` | `#E0574A` |
| `--color-danger-subtle` | `#3D211D` |
| `--color-success` | `#4CAF7D` |
| `--color-success-subtle` | `#1F3327` |
| `--color-neutral-subtle` | `#33302B` |
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)` |
| `--shadow-md` | `0 4px 16px rgba(0, 0, 0, 0.4)` |

타이포그래피/spacing/radius 토큰(4~5절)은 다크 모드에서도 동일하게 유지되며 재정의되지 않는다.

## 4. 타이포그래피

### 4.1 폰트 패밀리

Google Fonts에서 무난하고 로드가 가벼운 두 서체를 선택한다.

| 용도 | 폰트 | CSS `font-family` | 적용 대상 |
|---|---|---|---|
| 세리프 (제목) | Noto Serif KR | `"Noto Serif KR", serif` | 화면 제목(H1: "할일 목록", "회원가입" 등), 모달 타이틀 |
| 산세리프 (본문/UI) | Pretendard | `"Pretendard", -apple-system, sans-serif` | 본문, 라벨, 버튼, 입력값, 네비게이션, 숫자/날짜 |

- Pretendard는 한글 가독성이 좋고 웹폰트 CDN(`pretendard` npm 패키지 또는 CDN)으로 손쉽게 적용 가능하므로 채택한다. Noto Serif KR은 Google Fonts에서 직접 로드한다.
- 두 폰트 모두 한글/영문/숫자를 모두 포함하므로 별도 fallback 매핑은 두지 않는다.

### 4.2 크기/굵기 스케일

| 토큰 | font-size | font-weight | 폰트 패밀리 | 사용처 |
|---|---|---|---|---|
| `--font-h1` | 28px / 1.75rem | 700 | 세리프 | 화면 타이틀(로그인, 회원가입, 할일 목록 등) |
| `--font-h2` | 20px / 1.25rem | 700 | 세리프 | 모달/섹션 타이틀(카테고리 관리 등) |
| `--font-body` | 15px / 0.9375rem | 400 | 산세리프 | 본문, 리스트 항목 텍스트 |
| `--font-label` | 13px / 0.8125rem | 500 | 산세리프 | 입력 필드 라벨, 필터 라벨 |
| `--font-button` | 15px / 0.9375rem | 600 | 산세리프 | 버튼 텍스트 |
| `--font-caption` | 12px / 0.75rem | 400 | 산세리프 | 오류 메시지, 타임스탬프, 보조 설명 |
| `--font-emphasis` | 15px / 0.9375rem | 700 | 산세리프 | 강조 숫자(예: 기간), 배지 텍스트 |

line-height는 제목류 1.3, 본문/UI류 1.5를 기본으로 한다.

## 5. Spacing / Radius / Shadow 토큰

### 5.1 Spacing (4px 기준 스케일)

| 토큰 | 값 |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |

- 입력 필드 내부 padding: `--space-3` (세로) / `--space-4` (가로)
- 카드 내부 padding: `--space-5`
- 폼 필드 간 간격: `--space-4`
- 화면 섹션 간 간격: `--space-6`~`--space-7`

### 5.2 Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius-sm` | 6px | 입력 필드, 배지, 체크박스 |
| `--radius-md` | 10px | 카드, 모달 |
| `--radius-full` | 999px | 버튼(pill), 필터 탭 컨테이너 |

### 5.3 Shadow

| 토큰 | 값 | 용도 |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(31, 30, 28, 0.06)` | 카드, 입력 필드 기본 |
| `--shadow-md` | `0 4px 16px rgba(31, 30, 28, 0.12)` | 모달, 드롭다운 |

무거운 그림자(다중 레이어, 큰 blur)는 사용하지 않는다(디자인 원칙 4).

## 6. 컴포넌트 스타일

### 6.1 버튼

| 종류 | 배경 | 텍스트 | 보더 | 사용처 |
|---|---|---|---|---|
| Primary | `--color-ink` (hover: `--color-ink-hover`) | `--color-text-inverse` | 없음 | 가입하기, 로그인, 저장, 추가, 할일 등록 |
| Secondary (outline) | `--color-surface` | `--color-text` | 1px `--color-border-strong` | 취소, 닫기, 목록으로 |
| Danger | `--color-surface` | `--color-danger` | 1px `--color-danger` | 삭제 (SC-04, SC-06, 3.2절 확인 다이얼로그) |

- 공통: `padding: 10px 20px`, `border-radius: --radius-full`, `font: --font-button`, `disabled` 시 `opacity: 0.4` + `cursor: not-allowed`.
- 3.2절 확인 다이얼로그의 `[삭제]` 버튼은 Danger를 채움(배경 `--color-danger`, 텍스트 흰색)으로 표시해 되돌릴 수 없는 액션임을 강조한다.

### 6.2 입력 필드 (텍스트/이메일/비밀번호/날짜/select)

- 배경: `--color-surface`, 보더: 1px `--color-border`, radius: `--radius-sm`, padding: `--space-3` `--space-4`
- placeholder 텍스트: `--color-text-muted`
- focus 시: 보더 색을 `--color-accent`로 변경 + `box-shadow: 0 0 0 3px var(--color-accent-subtle)`
- 오류 상태(BR-05/BR-08 위반 시, 3.3절 검증 메시지 연계): 보더 색 `--color-danger`, 하단에 `--font-caption` 크기의 `--color-danger` 텍스트로 오류 메시지 노출
- 비활성(마이페이지 email 필드 등): 배경 `--color-surface-hover`, 텍스트 `--color-text-muted`, 커서 `not-allowed`

### 6.3 카드 (SC-01/02/04/05 중앙 폼 카드, SC-03 리스트 행 컨테이너)

- 배경: `--color-surface`, 보더: 1px `--color-border`, radius: `--radius-md`, shadow: `--shadow-sm`
- 내부 padding: `--space-5`
- 카드 타이틀: `--font-h2` (세리프)

### 6.4 모달/다이얼로그 (SC-06 카테고리 관리, 3.2절 확인 다이얼로그)

- 배경: `--color-surface`, radius: `--radius-md`, shadow: `--shadow-md`
- 오버레이: `rgba(43, 42, 40, 0.4)` (`--color-text` 기반 반투명 검정)
- 타이틀: `--font-h2`, 상단 우측 닫기(x) 버튼은 `--color-text-muted`, hover 시 `--color-text`
- 최대 너비 480px, 화면 중앙 정렬

### 6.5 배지/칩 (상태 배지, 카테고리 표시)

- 상태 배지: padding `2px 10px`, radius `--radius-sm`, `--font-emphasis` 축소판(12px, 600), 3.7절 컬러 매핑 적용
- 카테고리 칩(선택 사항, 리스트에서 카테고리명 표시 시): 배경 `--color-surface-hover`, 텍스트 `--color-text-muted`, radius `--radius-sm`, padding `2px 8px`

### 6.6 체크박스 (완료 여부 토글, SC-03/SC-04)

- 크기 18x18px, radius `--radius-sm`(4px 상당), 미체크 시 보더 1px `--color-border-strong` + 배경 흰색
- 체크 시: 배경 `--color-accent`, 체크마크 흰색
- 완료된 할일의 제목 텍스트는 취소선(`text-decoration: line-through`) + `--color-text-muted` 적용 (SC-03 4.3절 "완료" 표기와 연계)

## 7. 반응형 기준

[4-wireframe.md 5절](./4-wireframe.md#5-모바일-반응형-레이아웃-sc-03-할일-목록)과 일치시킨다.

| 브레이크포인트 | 폭 | 레이아웃 |
|---|---|---|
| 데스크톱 | 481px 이상 | 와이어프레임 4절 기준 레이아웃. SC-03은 테이블형 리스트, 헤더는 전체 메뉴 노출 |
| 모바일 | 375px~480px | SC-03은 카드형 리스트로 전환, 필터는 세로 스택, 헤더 메뉴는 햄버거(☰) 아이콘으로 축소 |

- CSS 미디어 쿼리 기준점: `@media (max-width: 480px)` 하나만 사용한다(추가 브레이크포인트는 YAGNI에 따라 두지 않음).
- SC-01/02/04/05/06은 별도 도식이 와이어프레임에 없으므로, 중앙 폼 카드의 `max-width`를 지정(예: 400~480px)하고 화면 폭이 좁아지면 카드가 `width: 100%`로 자연스럽게 줄어들도록 구현한다.

## 8. 아이콘 가이드

- 라이브러리: **lucide-react** 하나만 사용한다. 얇은 선(line) 기반 미니멀 스타일로 레퍼런스 무드와 일치하고, React 19 호환·트리쉐이킹을 지원해 별도 스프라이트/커스텀 아이콘 세트 구축이 불필요하다.
- 스타일: `stroke-width: 1.5~2`, 색상은 배경과 대비되는 `--color-text` 단색을 기본으로 하고, 인터랙티브 아이콘(hover 가능한 삭제/수정/닫기 등)만 hover 시 `--color-accent` 또는 `--color-danger`로 전환한다.
- 사용처 예: 체크박스 옆 없음(체크박스는 6.6절 커스텀 스타일 사용), 수정(`Pencil`), 삭제(`Trash2`), 캘린더 입력(`Calendar`), 드롭다운 화살표(`ChevronDown`), 모달 닫기(`X`), 햄버거 메뉴(`Menu`).
- 아이콘 크기는 16px(인라인, 버튼 내부) / 20px(단독 액션 아이콘) 두 가지만 사용한다.
