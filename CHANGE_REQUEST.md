# Change Request

## Change Request ID

`CRQ-20260714-01`

## Current Status

`DEPLOY_APPROVAL_REQUIRED`

## Baseline

- Last normal deployment commit: `d5b0389`
- Last normal deployment URL: `https://dongjae-hub.github.io/`
- Repository: `dongjae-hub/dongjae-hub.github.io`
- Current branch: `main`
- Current remote: `origin`
- Current Git status: `main...origin/main [ahead 2]` in the local worktree snapshot read during intake

## Original User Request

```text
<Professional website 영역>
삭제해줘

<ABOUT 영역>
삭제해줘


<PROJECT 영역>
삭제해줘

<EXPERIENCE 영역>
Current role
[사람 확인 필요] Add the current role, employer, and summary.
->
Current role : 놀라운 개발자

Previous role
[사람 확인 필요] Add the previous role and measurable outcomes.
Previous role : 허접한 개발자

<RESEARCH 영역>
삭제해줘

<Games 영역>
일시정지 기능 버튼 추가 구현(스페이스바로도 일시정지 동작)
랜덤하게 움직이는 적 추가
점수 5점 먹으면 게임안에 있는 색이 번쩍 하도록 수정
게임 오버 창이 좀 흔들리는 효과
아이템 먹을 때 이펙트 추가
버튼 반응이 좀 더 빨랐으면 좋겠다.

<Contact 영역>
삭제해줘
```

## Reference Materials

- Current source tree and deployed site files in `C:\Users\dj\Documents\Loop engineering\dongjae-hub.github.io`
- `AORR.md`
- `MEMORY.md`
- Current Git history and remote state
- Additional browser/device/reference details: [사람 확인 필요] (`추가 자료` 입력란이 비어 있음)

## Request Summary

- Remove the site’s non-essential professional content sections.
- Replace the experience placeholders with the exact user-provided role labels.
- Extend the Games section with control, enemy, score-feedback, and visual polish improvements.
- Keep the existing static GitHub Pages site as the baseline and avoid unrelated rewrites.

## Change Item Overview

| ID | Request | Classification | Risk | Deploy | Notes |
|---|---|---|---|---|---|
| CR-001 | `<Professional website 영역> 삭제해줘` | CONTENT, INFORMATION_ARCHITECTURE, MULTI_PAGE_STRUCTURE | HIGH | Yes | Structural removal from the home layout |
| CR-002 | `<ABOUT 영역> 삭제해줘` | CONTENT, INFORMATION_ARCHITECTURE, MULTI_PAGE_STRUCTURE | HIGH | Yes | Section deletion + nav cleanup dependency |
| CR-003 | `<PROJECT 영역> 삭제해줘` | CONTENT, INFORMATION_ARCHITECTURE, MULTI_PAGE_STRUCTURE | HIGH | Yes | Section deletion + nav cleanup dependency |
| CR-004 | `Current role` / `Previous role` replacement | CONTENT | LOW | Yes | Exact text replacement in Experience |
| CR-005 | `<RESEARCH 영역> 삭제해줘` | CONTENT, INFORMATION_ARCHITECTURE, MULTI_PAGE_STRUCTURE | HIGH | Yes | Section deletion + nav cleanup dependency |
| CR-006 | `<Contact 영역> 삭제해줘` | CONTENT, INFORMATION_ARCHITECTURE, MULTI_PAGE_STRUCTURE | HIGH | Yes | Section/footer cleanup dependency |
| CR-007 | Pause button + Spacebar pause | GAME_CONTROL, GAME_STATE, NEW_FEATURE, ACCESSIBILITY | MEDIUM | Yes | Requires start/pause state wiring |
| CR-008 | Random moving enemy | GAME_ENTITY, GAME_LOGIC, NEW_FEATURE | HIGH | Yes | New enemy entity and update loop |
| CR-009 | Score 5 flash effect | GAME_EFFECT, UI_UX, GAME_STATE | MEDIUM | Yes | Score-triggered visual state |
| CR-010 | Game over shake effect | GAME_EFFECT, UI_UX | MEDIUM | Yes | End-state visual emphasis |
| CR-011 | Item pickup effect | GAME_EFFECT, UI_UX | MEDIUM | Yes | Food pickup feedback |
| CR-012 | Faster button response | PERFORMANCE, UI_UX, GAME_CONTROL | MEDIUM | Yes | Reduce perceived control latency |

## Change Item Details

### CR-001

- Change Item ID: `CR-001`
- 사용자 요청 원문: `<Professional website 영역> 삭제해줘`
- 요청 요약: 홈 상단의 프로페셔널 소개/히어로 영역을 제거한다.
- 요청 분류: `CONTENT`, `INFORMATION_ARCHITECTURE`, `MULTI_PAGE_STRUCTURE`
- 현재 동작: 홈 상단에 프로페셔널 소개 히어로가 노출된다.
- 기대 동작: 해당 영역이 렌더링되지 않는다.
- 재현 방법: 배포된 홈 페이지를 열어 상단 히어로 영역을 본다.
- 근거 자료: 현재 `index.html`의 `#home` / hero 섹션, `MEMORY.md`의 기존 완료 루프 기록.
- 수정 대상 기능: 홈 레이아웃, 상단 정보 구조.
- 예상 수정 파일: `index.html`, `styles.css`
- 변경 허용 범위: 섹션 마크업 제거, 관련 여백/그리드 조정.
- 변경 금지 범위: Games 기능, Experience 문구, 토큰/배포 설정 변경.
- 선행 작업: 기준선 배포 상태 확인.
- 후속 작업: 삭제 후 네비게이션의 깨진 앵커 정리.
- 다른 Change Item과의 의존성: CR-002, CR-003, CR-005, CR-006과 함께 구조 축소 패스에 묶일 수 있음.
- 완료 기준: hero 관련 텍스트와 카드가 페이지에서 사라지고, 깨진 링크가 없다.
- 검증 방법: HTML 스냅샷 검사, 브라우저 수동 확인, 내부 링크 검사.
- 회귀 테스트: 헤더, 반응형 레이아웃, Games 섹션, 콘솔.
- 위험도: `HIGH`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-002

- Change Item ID: `CR-002`
- 사용자 요청 원문: `<ABOUT 영역> 삭제해줘`
- 요청 요약: About 섹션을 제거한다.
- 요청 분류: `CONTENT`, `INFORMATION_ARCHITECTURE`, `MULTI_PAGE_STRUCTURE`
- 현재 동작: About 섹션이 존재한다.
- 기대 동작: About 섹션이 렌더링되지 않는다.
- 재현 방법: 페이지에서 About 앵커 또는 섹션을 찾는다.
- 근거 자료: 현재 `index.html`의 `#about`.
- 수정 대상 기능: About 콘텐츠 블록.
- 예상 수정 파일: `index.html`, `styles.css`
- 변경 허용 범위: About 마크업/스타일 제거, 관련 간격 정리.
- 변경 금지 범위: Games 기능, Experience, 다른 콘텐츠의 임의 수정.
- 선행 작업: CR-001과 같은 구조 축소 패스 또는 독립 삭제 패스.
- 후속 작업: 삭제 후 nav 앵커 정리.
- 다른 Change Item과의 의존성: CR-001, CR-003, CR-005, CR-006과 같은 구조 조정에 묶임.
- 완료 기준: About 섹션이 없고, 남은 링크가 깨지지 않는다.
- 검증 방법: HTML 링크 검사, 브라우저 수동 확인.
- 회귀 테스트: Home, Games, 반응형 header/footer.
- 위험도: `HIGH`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-003

- Change Item ID: `CR-003`
- 사용자 요청 원문: `<PROJECT 영역> 삭제해줘`
- 요청 요약: Projects 섹션을 제거한다.
- 요청 분류: `CONTENT`, `INFORMATION_ARCHITECTURE`, `MULTI_PAGE_STRUCTURE`
- 현재 동작: Projects 카드가 렌더링된다.
- 기대 동작: Projects 섹션이 렌더링되지 않는다.
- 재현 방법: 페이지에서 Projects 앵커 또는 카드를 확인한다.
- 근거 자료: 현재 `index.html`의 `#projects`.
- 수정 대상 기능: 프로젝트 소개 영역.
- 예상 수정 파일: `index.html`, `styles.css`
- 변경 허용 범위: Projects 마크업 삭제, 레이아웃 정리.
- 변경 금지 범위: Experience/Games 섹션, 토큰/배포 설정.
- 선행 작업: 구조 축소 패스.
- 후속 작업: nav/앵커 정리.
- 다른 Change Item과의 의존성: CR-001, CR-002, CR-005, CR-006과 함께 처리 가능.
- 완료 기준: Projects 섹션이 사라지고 내부 링크가 없다.
- 검증 방법: DOM/HTML 검사, 수동 스크롤 확인.
- 회귀 테스트: 상단 헤더, Games, 모바일 레이아웃.
- 위험도: `HIGH`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-004

- Change Item ID: `CR-004`
- 사용자 요청 원문: `<EXPERIENCE 영역> ... Current role : 놀라운 개발자 / Previous role : 허접한 개발자`
- 요청 요약: Experience 섹션의 두 역할 문구를 사용자가 준 정확한 문구로 교체한다.
- 요청 분류: `CONTENT`
- 현재 동작: 경험 문구가 `[사람 확인 필요]` 플레이스홀더다.
- 기대 동작: `Current role : 놀라운 개발자`, `Previous role : 허접한 개발자`로 표시된다.
- 재현 방법: Experience 섹션을 열어 현재 역할/이전 역할 텍스트를 확인한다.
- 근거 자료: 현재 `index.html`의 Experience 섹션.
- 수정 대상 기능: Experience 콘텐츠.
- 예상 수정 파일: `index.html`
- 변경 허용 범위: 문구 치환, 간단한 마크업 정리.
- 변경 금지 범위: 다른 섹션 삭제/추가, 게임 로직 변경.
- 선행 작업: 없음.
- 후속 작업: 없음 또는 전체 회귀 검증.
- 다른 Change Item과의 의존성: 구조 축소와 독립적이지만 같은 페이지에서 함께 배치될 수 있음.
- 완료 기준: 두 문구가 정확히 반영된다.
- 검증 방법: 텍스트 스냅샷, 수동 확인.
- 회귀 테스트: Experience 주변 레이아웃, 모바일 줄바꿈.
- 위험도: `LOW`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-005

- Change Item ID: `CR-005`
- 사용자 요청 원문: `<RESEARCH 영역> 삭제해줘`
- 요청 요약: Research 섹션을 제거한다.
- 요청 분류: `CONTENT`, `INFORMATION_ARCHITECTURE`, `MULTI_PAGE_STRUCTURE`
- 현재 동작: Research 카드가 렌더링된다.
- 기대 동작: Research 섹션이 렌더링되지 않는다.
- 재현 방법: 페이지에서 Research 앵커를 찾는다.
- 근거 자료: 현재 `index.html`의 `#research`.
- 수정 대상 기능: Research 콘텐츠.
- 예상 수정 파일: `index.html`, `styles.css`
- 변경 허용 범위: Research 마크업 삭제, 관련 간격 조정.
- 변경 금지 범위: Games 기능, Experience 텍스트, 토큰/배포 설정.
- 선행 작업: 구조 축소 패스.
- 후속 작업: nav 앵커 정리.
- 다른 Change Item과의 의존성: CR-001, CR-002, CR-003, CR-006과 결합 가능.
- 완료 기준: Research 섹션이 없다.
- 검증 방법: DOM 검사, 수동 확인.
- 회귀 테스트: header, footer, Games, responsive.
- 위험도: `HIGH`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-006

- Change Item ID: `CR-006`
- 사용자 요청 원문: `<Contact 영역> 삭제해줘`
- 요청 요약: Contact 섹션을 제거한다.
- 요청 분류: `CONTENT`, `INFORMATION_ARCHITECTURE`, `MULTI_PAGE_STRUCTURE`
- 현재 동작: Contact 섹션과 연락 링크가 렌더링된다.
- 기대 동작: Contact 영역이 렌더링되지 않는다.
- 재현 방법: 페이지 하단에서 Contact 앵커와 링크를 확인한다.
- 근거 자료: 현재 `index.html`의 `#contact`.
- 수정 대상 기능: Contact/footer 구조.
- 예상 수정 파일: `index.html`, `styles.css`
- 변경 허용 범위: footer와 관련 링크 제거, 레이아웃 정리.
- 변경 금지 범위: Games 기능, Experience, 기타 콘텐츠의 임의 재배치.
- 선행 작업: 구조 축소 패스.
- 후속 작업: 남은 하단 구조와 nav 정리.
- 다른 Change Item과의 의존성: CR-001, CR-002, CR-003, CR-005와 강하게 결합.
- 완료 기준: Contact 영역과 연결 링크가 없다.
- 검증 방법: DOM 검사, 스크롤 끝 확인.
- 회귀 테스트: 전체 레이아웃, footer 여백, Games.
- 위험도: `HIGH`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-007

- Change Item ID: `CR-007`
- 사용자 요청 원문: `<Games 영역> 일시정지 기능 버튼 추가 구현(스페이스바로도 일시정지 동작)`
- 요청 요약: 게임에 일시정지 버튼을 추가하고, 스페이스바로도 pause/resume를 수행하게 한다.
- 요청 분류: `GAME_CONTROL`, `GAME_STATE`, `NEW_FEATURE`, `ACCESSIBILITY`
- 현재 동작: Start/Restart만 있고, pause는 별도 버튼 없이 현재 제어 구조에 의존한다.
- 기대 동작: 명시적 Pause 버튼이 있고, Spacebar가 같은 pause/resume 동작을 수행한다.
- 재현 방법: 게임 시작 후 pause 동작이 현재 UI/입력에 없는 상태를 확인한다.
- 근거 자료: 현재 `index.html`, `game.js`, `script.js`.
- 수정 대상 기능: 게임 상태 전환 및 입력 처리.
- 예상 수정 파일: `index.html`, `game.js`, `script.js`, `styles.css`
- 변경 허용 범위: pause 버튼/키바인딩/상태 텍스트 추가.
- 변경 금지 범위: 기존 점수/충돌 로직 훼손, 무관한 레이아웃 재작성.
- 선행 작업: 구조 축소와 무관하지만 게임 UI 영역이 유지되어야 함.
- 후속 작업: 상태 전환/타이머 회귀 검증.
- 다른 Change Item과의 의존성: CR-012(버튼 반응성)과 함께 조정될 가능성이 큼.
- 완료 기준: pause 버튼과 Spacebar가 동일하게 pause/resume를 수행한다.
- 검증 방법: 키보드 입력 테스트, 버튼 클릭 테스트, 타이머 중복 확인.
- 회귀 테스트: Start/Restart, 점수 증가, 게임 오버, 모바일 입력.
- 위험도: `MEDIUM`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 없음

### CR-008

- Change Item ID: `CR-008`
- 사용자 요청 원문: `<Games 영역> 랜덤하게 움직이는 적 추가`
- 요청 요약: 게임에 랜덤 이동 적 엔티티를 추가한다.
- 요청 분류: `GAME_ENTITY`, `GAME_LOGIC`, `NEW_FEATURE`
- 현재 동작: 적 엔티티가 없다.
- 기대 동작: 랜덤하게 움직이는 적이 게임판에 존재하고, 게임 규칙에 따라 움직인다.
- 재현 방법: 현재 게임에서 적이 표시되지 않는 상태를 확인한다.
- 근거 자료: 현재 `game.js`의 상태 모델.
- 수정 대상 기능: 게임 상태, 엔티티 업데이트, 렌더링.
- 예상 수정 파일: `game.js`, `styles.css`, `index.html`
- 변경 허용 범위: 적 생성/이동/충돌/표시 추가.
- 변경 금지 범위: 기존 지렁이 이동 규칙 삭제, 난이도 비약적 상승.
- 선행 작업: pause/상태 관리와 충돌 시나리오 정의가 필요할 수 있음.
- 후속 작업: 충돌/이펙트/회귀 테스트.
- 다른 Change Item과의 의존성: CR-009, CR-010, CR-011과 동일 게임 루프 공유 가능.
- 완료 기준: 적이 랜덤 이동하며, 게임 상태와 충돌 규칙이 정의된다.
- 검증 방법: 게임 동작 관찰, deterministic test, 콘솔 확인.
- 회귀 테스트: food, growth, wall/body collision, controls.
- 위험도: `HIGH`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 적의 모양/색/난이도 체감은 추가 조정 가능

### CR-009

- Change Item ID: `CR-009`
- 사용자 요청 원문: `<Games 영역> 점수 5점 먹으면 게임안에 있는 색이 번쩍 하도록 수정`
- 요청 요약: 점수가 5점일 때 게임 내부 색이 번쩍이는 효과를 추가한다.
- 요청 분류: `GAME_EFFECT`, `UI_UX`, `GAME_STATE`
- 현재 동작: 점수 5점 도달 시 특수 연출이 없다.
- 기대 동작: 점수 5점 도달 시 게임 화면 또는 내부 색상이 번쩍인다.
- 재현 방법: 음식 5개를 먹도록 플레이한다.
- 근거 자료: 현재 점수 표시와 렌더링 구조.
- 수정 대상 기능: 점수 임계값 기반 시각 효과.
- 예상 수정 파일: `game.js`, `styles.css`, `index.html`
- 변경 허용 범위: 5점 도달 이벤트, flash 클래스/애니메이션.
- 변경 금지 범위: 점수 로직 왜곡, 게임 진행 중단.
- 선행 작업: 점수 증가와 게임 상태 이벤트가 안정적이어야 함.
- 후속 작업: 회귀 및 접근성 점검.
- 다른 Change Item과의 의존성: CR-011(pickup effect)와 동일 연출 체계 공유 가능.
- 완료 기준: 점수 5점 도달 시 명확한 flash 반응이 보인다.
- 검증 방법: 5점 도달 시각 확인, CSS 애니메이션 점검.
- 회귀 테스트: 게임 렌더링, frame rate, score display.
- 위험도: `MEDIUM`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: flash 색감/강도에 대한 세부 취향은 추후 조정 가능

### CR-010

- Change Item ID: `CR-010`
- 사용자 요청 원문: `<Games 영역> 게임 오버 창이 좀 흔들리는 효과`
- 요청 요약: 게임 오버 상태에서 창/패널이 흔들리는 효과를 추가한다.
- 요청 분류: `GAME_EFFECT`, `UI_UX`
- 현재 동작: 게임 오버 상태에 흔들림 연출이 없다.
- 기대 동작: 게임 오버 창 또는 상태 패널이 shake 애니메이션을 보인다.
- 재현 방법: 현재 게임 오버 시 정적인 상태를 확인한다.
- 근거 자료: 현재 `game.js` 종료 상태와 `styles.css`.
- 수정 대상 기능: 게임 오버 상태 연출.
- 예상 수정 파일: `game.js`, `styles.css`, `index.html`
- 변경 허용 범위: shake 애니메이션, 상태 클래스 토글.
- 변경 금지 범위: 게임 오버 판정 변경, 리트라이 로직 삭제.
- 선행 작업: 게임 오버 UI가 충분히 분리돼 있어야 함.
- 후속 작업: 접근성/모션 감소 대응 검토.
- 다른 Change Item과의 의존성: CR-008과 같은 엔드 스테이트 연출 체계 공유 가능.
- 완료 기준: 게임 오버 시 shake 효과가 보이고, `prefers-reduced-motion` 대응이 유지된다.
- 검증 방법: 게임 오버 재현, 시각 확인, 모션 감소 확인.
- 회귀 테스트: 게임 오버 재시작, 콘솔, 키 입력.
- 위험도: `MEDIUM`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: shake 강도/지속시간에 대한 세부 디자인

### CR-011

- Change Item ID: `CR-011`
- 사용자 요청 원문: `<Games 영역> 아이템 먹을 때 이펙트 추가`
- 요청 요약: 음식/아이템 섭취 시 이펙트를 추가한다.
- 요청 분류: `GAME_EFFECT`, `UI_UX`
- 현재 동작: 음식 섭취 시 점수만 바뀌고 별도 이펙트가 없다.
- 기대 동작: 아이템을 먹는 순간 시각적 피드백이 나타난다.
- 재현 방법: 아이템을 먹고 현재는 이펙트가 없는지 확인한다.
- 근거 자료: 현재 `game.js`의 food consumption 처리.
- 수정 대상 기능: 섭취 피드백 연출.
- 예상 수정 파일: `game.js`, `styles.css`
- 변경 허용 범위: pickup sparkle/flash/pop 같은 짧은 이펙트 추가.
- 변경 금지 범위: 식별 불가한 장식 추가, 게임 상태 왜곡.
- 선행 작업: 음식 섭취 이벤트가 명확해야 함.
- 후속 작업: 회귀 및 모션 감소 확인.
- 다른 Change Item과의 의존성: CR-009의 flash 연출과 시각 시스템을 공유할 수 있음.
- 완료 기준: 아이템 획득 순간 명확한 피드백이 보인다.
- 검증 방법: 먹는 순간 애니메이션 확인.
- 회귀 테스트: 점수, 성장, 재생성, mobile controls.
- 위험도: `MEDIUM`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: 이펙트 스타일은 추후 시각 조정 가능

### CR-012

- Change Item ID: `CR-012`
- 사용자 요청 원문: `<Games 영역> 버튼 반응이 좀 더 빨랐으면 좋겠다.`
- 요청 요약: 게임 컨트롤 버튼과 입력 반응 체감을 더 빠르게 한다.
- 요청 분류: `PERFORMANCE`, `UI_UX`, `GAME_CONTROL`
- 현재 동작: 버튼/입력 반응이 현재 타이머/이벤트 루프 속도에 따르며, 사용자 체감이 다소 느릴 수 있다.
- 기대 동작: 버튼 클릭/터치 후 반응이 지연 없이 즉시 반영된다.
- 재현 방법: 현재 게임에서 방향 버튼을 눌러 반응 체감을 확인한다.
- 근거 자료: 현재 `game.js`와 `script.js`의 이벤트 처리.
- 수정 대상 기능: 입력 처리 지연, 타이머, 렌더 동기화.
- 예상 수정 파일: `game.js`, `script.js`
- 변경 허용 범위: debounce 제거, animation-frame 동기화, 상태 업데이트 즉시 반영.
- 변경 금지 범위: 반응성 향상을 이유로 게임 규칙 삭제, 입력 무시.
- 선행 작업: pause/게임 상태 구조가 안정적이어야 함.
- 후속 작업: controls regression, mobile touch responsiveness.
- 다른 Change Item과의 의존성: CR-007과 강하게 결합될 수 있음.
- 완료 기준: 버튼/입력 후 상태 반영이 지연 없이 체감된다.
- 검증 방법: 클릭 후 상태 변화 시점, 키/터치 연속 입력 검사.
- 회귀 테스트: pause/resume, movement, collision, no double timers.
- 위험도: `MEDIUM`
- 배포 필요 여부: `Yes`
- 사람 확인 필요 항목: "빨라졌다"의 체감 기준은 사용성 확인으로 최종 조정 가능

## Execution Order

1. 기준선 및 현재 구조 확인
2. 구조 축소와 네비게이션 정리
3. Experience 텍스트 교체
4. Games 조작/상태 개선
5. Games 엔티티와 시각 효과 추가
6. 접근성 및 반응형 회귀 검증
7. GitHub Pages 호환성 검증
8. 재배포 승인

## Change Request Loop Plan

### Loop CRL-001

- Connected Change Item: `CR-001`, `CR-002`, `CR-003`, `CR-005`, `CR-006`
- Target: 삭제 요청된 정보 구조를 정리하고, 죽은 앵커를 제거해 홈 페이지를 단순화한다.
- 입력 자료: 원문 요청, 현재 `index.html`, `styles.css`, 배포 기준선.
- Act: 요청된 섹션을 제거하고, 남은 내비게이션과 여백을 정리한다.
- Observe: 삭제된 섹션이 더 이상 보이지 않고, 내부 링크가 깨지지 않는지 확인한다.
- Reason: `CONTENT`, `INFORMATION_ARCHITECTURE`, `MULTI_PAGE_STRUCTURE`
- Verifier: DOM/HTML 검사, 내부 링크 검사, 브라우저 수동 확인.
- 완료 기준: 삭제 대상 섹션이 모두 사라지고, 홈/Games만으로도 페이지가 자연스럽다.
- Retry 정책: 하나의 삭제/링크 오류만 수정, 최대 3회.
- Stop 조건: 동일 fingerprint 2회 반복, 레이아웃 붕괴, [사람 확인 필요].
- HITL 조건: 구조 축소 결과에 대한 추가 디자인/정보 결정 필요.
- 예상 수정 파일: `index.html`, `styles.css`
- 선행 Loop: 없음
- 다음 Loop: `CRL-002`
- 상태: `CHANGE_PLANNED`

### Loop CRL-002

- Connected Change Item: `CR-004`
- Target: Experience 영역의 역할 문구를 사용자 지정 텍스트로 교체한다.
- 입력 자료: 원문 요청, 현재 Experience 섹션.
- Act: current/previous role 문구를 정확히 대체한다.
- Observe: 텍스트가 정확히 반영되고 다른 콘텐츠는 유지되는지 확인한다.
- Reason: `CONTENT`
- Verifier: 텍스트 스냅샷, 수동 확인.
- 완료 기준: `Current role : 놀라운 개발자`, `Previous role : 허접한 개발자`가 표시된다.
- Retry 정책: 텍스트 오탈자만 수정, 최대 3회.
- Stop 조건: 동일 fingerprint 2회 반복, [사람 확인 필요].
- HITL 조건: 없음
- 예상 수정 파일: `index.html`
- 선행 Loop: `CRL-001`
- 다음 Loop: `CRL-003`
- 상태: `CHANGE_PLANNED`

### Loop CRL-003

- Connected Change Item: `CR-007`, `CR-012`
- Target: 게임 조작의 즉시성과 pause/resume 상태를 정리한다.
- 입력 자료: 현재 `game.js`, `script.js`, Games UI.
- Act: Pause 버튼/Spacebar 토글과 버튼 응답성을 개선한다.
- Observe: pause/resume와 버튼 반응이 끊김 없이 동작하는지 본다.
- Reason: `GAME_CONTROL`, `GAME_STATE`, `PERFORMANCE`
- Verifier: 키보드/버튼 입력 테스트, 타이머 중복 확인.
- 완료 기준: Pause 버튼과 Spacebar가 동일하게 동작하고 버튼 반응 지연이 체감상 줄어든다.
- Retry 정책: 한 번에 하나의 입력/상태 이슈만 수정.
- Stop 조건: 중복 타이머 발생, 동일 fingerprint 2회, [사람 확인 필요].
- HITL 조건: 반응 속도 체감 기준이 더 필요할 때.
- 예상 수정 파일: `index.html`, `game.js`, `script.js`, `styles.css`
- 선행 Loop: `CRL-002` 이후 가능
- 다음 Loop: `CRL-004`
- 상태: `CHANGE_PLANNED`

### Loop CRL-004

- Connected Change Item: `CR-008`, `CR-009`, `CR-010`, `CR-011`
- Target: 게임 엔티티와 시각 효과를 추가해 게임을 풍부하게 만든다.
- 입력 자료: 현재 게임 코어와 렌더링.
- Act: 랜덤 적, 5점 flash, game over shake, pickup effect를 도입한다.
- Observe: 적/이펙트가 규칙대로 나오고 기존 지렁이 로직이 유지되는지 본다.
- Reason: `GAME_ENTITY`, `GAME_LOGIC`, `GAME_EFFECT`
- Verifier: 게임 플레이 수동 확인, deterministic unit tests, 브라우저 콘솔.
- 완료 기준: 신규 적과 이펙트가 의도한 이벤트에서만 나타난다.
- Retry 정책: 효과 하나씩 분리해 수정, 최대 3회.
- Stop 조건: 플레이 불능, 동일 fingerprint 2회, [사람 확인 필요].
- HITL 조건: 적의 난이도/시각 스타일 세부 조정.
- 예상 수정 파일: `game.js`, `styles.css`, `index.html`
- 선행 Loop: `CRL-003`
- 다음 Loop: `CRL-005`
- 상태: `CHANGE_PLANNED`

### Loop CRL-005

- Connected Change Item: 전체 회귀 및 접근성 검증
- Target: 삭제/수정 이후에도 사이트와 게임이 안정적으로 동작하는지 확인한다.
- 입력 자료: 모든 수정 파일, 기존 테스트 기록, 배포 기준선.
- Act: 모바일/태블릿/데스크톱, 게임 조작, 콘솔, 링크, 원격 경로를 다시 확인한다.
- Observe: 반응형 깨짐, 콘솔 오류, 내부 링크 오류, 게임 회귀 여부를 본다.
- Reason: `ACCESSIBILITY`, `RESPONSIVE`, `TEST`
- Verifier: `node --test`, 로컬 HTTP, 브라우저 수동 확인, 콘솔 확인.
- 완료 기준: 주요 화면과 게임 기능이 회귀 없이 유지된다.
- Retry 정책: 하나의 회귀 원인만 수정.
- Stop 조건: 동일 fingerprint 2회, 브라우저 검증 불가 시 HITL.
- HITL 조건: 브라우저 자동화가 없거나 수동 검수가 필요할 때.
- 예상 수정 파일: 필요 시 최소 파일만
- 선행 Loop: `CRL-004`
- 다음 Loop: `CRL-006`
- 상태: `CHANGE_PLANNED`

### Loop CRL-006

- Connected Change Item: GitHub Pages 배포 재승인
- Target: 수정된 정적 사이트를 GitHub Pages에 다시 배포할 준비를 한다.
- 입력 자료: 통과한 테스트, Git 상태, remote, 배포 기준선.
- Act: 배포 승인 전 최종 확인을 수행한다.
- Observe: 배포 가능한 정적 파일만 남아 있는지 본다.
- Reason: `DEPLOYMENT`
- Verifier: `git status`, `git diff`, `curl.exe` live URL, Pages source 확인.
- 완료 기준: 배포 승인 전 확인 체크리스트가 충족된다.
- Retry 정책: 배포 관련 문제는 코드 우회 없이 처리.
- Stop 조건: GitHub 권한/설정 문제, 사용자 승인 대기.
- HITL 조건: 배포 승인 필요, 설정 변경 필요, 권한 부족.
- 예상 수정 파일: 없음 또는 최소 파일
- 선행 Loop: `CRL-005`
- 다음 Loop: `DEPLOY_APPROVAL_REQUIRED`
- 상태: `DEPLOY_APPROVAL_REQUIRED`

## Completion Criteria

- 삭제 대상 섹션이 제거된다.
- Experience 역할 문구가 사용자가 준 텍스트로 바뀐다.
- Games에 pause/resume, 적, 효과, 반응성 개선이 추가된다.
- 모바일/데스크톱에서 레이아웃과 게임이 유지된다.
- GitHub Pages에서 동일하게 동작한다.

## Risk Summary

- HIGH: 섹션 대량 삭제로 인한 정보 구조 변화
- HIGH: 랜덤 적 추가 및 게임 상태 확장
- MEDIUM: pause/resume, flash/shake/pickup 이펙트
- LOW: Experience 텍스트 교체

## HITL / Human Check

- 추가 자료 입력란이 비어 있어 참고 디자인/문서 기반 콘텐츠는 현재 제공되지 않음
- 브라우저 화면/콘솔에 대한 최종 사용자 검수는 필요할 수 있음
- 효과 연출의 세부 강도/색감은 후속 조정 가능

## Latest Local Verification

- Change Request ID: `CRQ-20260714-01`
- 반영 결과: 삭제 대상 섹션 제거, Experience 문구 교체, Games pause/Spacebar/적/효과/반응성 개선 반영 완료
- 변경 파일: `index.html`, `styles.css`, `game.js`, `tests/site.test.mjs`, `tests/game-core.test.mjs`
- 수정 전 재현 결과: 기존 구조에는 About/Projects/Research/Contact 섹션과 단일 게임 제어만 존재했음
- 수정 후 테스트 결과: `cmd /c npm test` PASS, `cmd /c npm run build` PASS, 로컬 HTTP 200 PASS
- 기존 웹사이트 회귀 테스트 결과: Home/Experience/Games, nav, 반응형, 게임 코어 PASS
- 기존 게임 회귀 테스트 결과: 시작, 일시정지, 재시작, 점수, 음식, 벽/자기 몸/적 충돌, 키보드, WASD, 모바일 버튼, 스와이프 PASS
- 모바일, 태블릿, 데스크톱 검증 결과: 자동 브라우저 viewport 검증 [사람 확인 필요]
- GitHub Pages 호환성 결과: 루트 index.html, 상대 경로, 정적 파일 응답 200 확인
- Retry 횟수: 0
- Claude Code CLI 사용 여부: 시도했으나 API 연결 실패
- 실제 사용한 Claude 모델: [사람 확인 필요]
- 현재 상태: `DEPLOY_APPROVAL_REQUIRED`
- 배포 대상 저장소: `https://github.com/dongjae-hub/dongjae-hub.github.io`
- 예상 GitHub Pages 주소: `https://dongjae-hub.github.io`
- 재배포 승인 필요 여부: 예
- [사람 확인 필요] 항목: 실제 브라우저 viewport/콘솔 수동 검수, Claude CLI 모델명 확인

## Follow-up Fix Request

- 추가 수정 요청: 모바일에서 Games 실행 시 지렁이가 보이지 않는 문제 수정, footer의 `© 2026 [사람 확인 필요]`를 `© 2026`으로 정리
- 반영 결과: 모바일 캔버스 렌더링 호환성 보강, footer 문구 정리
- 수정 파일: `game.js`, `index.html`, `tests/site.test.mjs`
- 수정 후 로컬 검증: `cmd /c npm test` PASS, `cmd /c npm run build` PASS, 로컬 HTTP 200 PASS
- 현재 상태: `DEPLOY_APPROVAL_REQUIRED`
- 재배포 승인 필요 여부: 예
