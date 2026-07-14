# MEMORY

## Goal

- GitHub Pages용 프로페셔널 웹사이트 완성
- 반응형 데스크톱 및 모바일 지원
- `Games` 탭 구현
- 키보드와 모바일 터치로 조작 가능한 지렁이 게임 구현
- GitHub Pages 최초 배포
- `Step 1`의 `[게임 추가 기능:]`이 확인되면 이후 게임 루프에 반영

## Current State

- 현재 상태: `DEPLOYED`
- 완료한 루프: 4
- 완료 루프 요약: 정적 웹사이트, 반응형 레이아웃, 지렁이 게임 코어, 테스트, 빌드, 배포
- 다음 루프: [사람 확인 필요] 브라우저 화면/콘솔 보강 또는 콘텐츠 보강
- 현재 Retry 횟수: 0
- 현재 오류 fingerprint: 없음
- Blocker: 없음
- 마지막 정상 상태: `DEPLOYED`

## Execution Log

```text
Loop ID: 1
시작 시각: [사람 확인 필요]
목표: GitHub Pages용 정적 웹사이트의 안전한 기본 구조 만들기
시작 상태: READY
가설: 빈 저장소에 가장 안전한 첫 루프는 index/styles/script와 기본 nav/sections를 만드는 것이다
Act: 루트 정적 파일과 기본 섹션, Games 영역, MEMORY 기록을 추가했다
변경 파일: index.html, styles.css, script.js, MEMORY.md
Verifier: 파일 존재 확인, Claude Code CLI, node --check script.js, 로컬 정적 서버 응답 확인
테스트 결과: 부분 통과 - 파일/구조 검증 PASS, 임시 로컬 서버 연결 확인 FAIL
exit code: 1
오류 fingerprint: `Invoke-WebRequest` connection refused from the temporary Node static server command
Retry 횟수: 1
종료 상태: RETRYING
다음 작업: 로컬 HTTP verifier 명령을 바로잡은 뒤 동일 Verifier 재실행 [사람 확인 필요]
사람 확인 필요 항목: 실제 프로필 이름/소개/프로젝트, AORR.md 추가 여부, 로컬 HTTP verifier 방식 확정
```

```text
Loop ID: 2
시작 시각: [사람 확인 필요]
목표: AORR 메타데이터를 현재 저장소 기준으로 정렬
시작 상태: RETRYING
가설: 저장소명이 일치하지 않으면 이후 루프 기준이 흔들린다
Act: AORR.md의 대상 저장소명을 `dongjae-hub.github.io`로 수정했다
변경 파일: AORR.md, MEMORY.md
Verifier: Claude Code CLI, 문자열 검색으로 저장소명 일치 확인
테스트 결과: PASS
exit code: 0
오류 fingerprint: 없음
Retry 횟수: 0
종료 상태: PASSED
다음 작업: 실제 웹사이트 구현 루프 재개 [사람 확인 필요]
사람 확인 필요 항목: 실제 프로필 콘텐츠, 로컬 HTTP verifier 방식 확정
```

```text
Loop ID: 3
시작 시각: [사람 확인 필요]
목표: 프로페셔널 웹사이트와 지렁이 게임의 전체 구현
시작 상태: READY
가설: 빈 저장소의 기본 구조를 실제 사이트와 게임으로 확장하면 정적 GitHub Pages 배포가 가능해진다
Act: 헤더/내비게이션, About, Projects, Experience, Research, Games, Contact, snake game, tests, build, local HTTP verifier를 추가했다
변경 파일: index.html, styles.css, script.js, game.js, package.json, scripts/build.mjs, scripts/local-server.mjs, tests/site.test.mjs, tests/game-core.test.mjs, .gitignore, MEMORY.md
Verifier: `node --test`, `node scripts/build.mjs`, `curl.exe` 기반 로컬 HTTP 검증
테스트 결과: PASS on tests/build/HTTP
exit code: 0
오류 fingerprint: 브라우저 자동 검증 도구 부재
Retry 횟수: 0
종료 상태: HITL_REQUIRED
다음 작업: 브라우저 콘솔 및 viewport 확인 [사람 확인 필요]
사람 확인 필요 항목: 브라우저 콘솔 오류, 375/768/1440 viewport 화면 검증, 실제 프로필 콘텐츠
```

```text
Loop ID: 4
시작 시각: [사람 확인 필요]
목표: GitHub Pages 최초 배포
시작 상태: HITL_REQUIRED
가설: 현재 정적 사이트는 GitHub Pages source가 main/root로 설정되어 있으므로 main push 후 배포가 가능하다
Act: commit 생성 후 token 기반 HTTPS push를 수행하고 라이브 URL을 검증했다
변경 파일: 없음 (배포만 수행)
Verifier: `curl.exe`로 https://dongjae-hub.github.io/ 및 assets 200 확인
테스트 결과: PASS
exit code: 0
오류 fingerprint: 없음
Retry 횟수: 0
종료 상태: DEPLOYED
다음 작업: [사람 확인 필요] 브라우저 화면/콘솔 점검 또는 추가 콘텐츠 보강
사람 확인 필요 항목: 브라우저 자동화 검증, 실제 프로필 콘텐츠
```

## Guardrails

- 기존 개인 콘텐츠 임의 삭제 금지
- 확인되지 않은 경력이나 프로젝트 정보 생성 금지
- 테스트 삭제 또는 완화 금지
- 토큰 출력 금지
- 토큰을 HTML, CSS, JavaScript에 저장 금지
- 토큰을 Git에 커밋 금지
- `github_token.txt` 커밋 금지
- `env_settings.txt` 커밋 금지
- 백엔드 기능 추가 금지
- 대규모 리팩토링 금지
- 테스트를 통과시키기 위한 기능 제거 금지
