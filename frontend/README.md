# my-todolist frontend

React 19 + TypeScript + Vite 기반 프론트엔드. FSD(Feature-Sliced Design) 구조를 따른다.

## 구조 규칙

계층 순서는 `app → pages → widgets → features → entities → shared`이며, 상위 계층은 하위 계층만 import할 수 있다(역방향 import 금지). 각 슬라이스는 내부 구현을 감추고 `index.ts`를 통해서만 외부에 공개한다. 자세한 규칙은 [docs/5-project-principle.md](../docs/5-project-principle.md) 3.2절, 7.2절을 참고한다.

## 개발 서버 실행

```bash
npm run dev
```
