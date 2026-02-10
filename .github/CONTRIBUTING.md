# Contributing Guide

> 📌 **기본 규칙은 팀 개발 노션에 있으며, 프로젝트별로 커스텀한 내용은 이 파일에 기록합니다.**
> 이 문서는 프로젝트에 기여할 때 따라야 할 규칙과 설정을 안내하며, PR과 Issue 생성 시 상단에 링크가 표시됩니다.
> 🔗 [FE 팀 온보딩 노션 바로가기](https://www.notion.so/248a21a99aa4808bacedf1647febf890?v=248a21a99aa480bea10e000c0f2b8ca1&source=copy_link)

## 1. PR 생성 규칙

- **PR 제목**: 커밋 규칙과 동일한 형식 사용
  - `feature` : 새로운 기능 추가에 대한 정보
  - `fix`: 새로운 기능을 추가하지 않은 모든 수정 사항
  - `docs`: 문서만 변경하는 경우
  - `test`: 테스트만 변경하는 경우
  - `chore`: 그 외

- **본문 포함 내용**:
  - 변경 이유
  - 주요 변경 사항
  - 관련 이슈 번호 (e.g., `Closes #123`)
  - (UI 변경이 있을 경우) 스크린 샷 첨부

- **검증 필수 항목** (자동 검증 환경 전제)

  > 스타일 규칙 (ESLint, Prettier) 준수와 코드 빌드 여부는 자동화되어 있기 때문에.
  > 자동화가 잡지 못하는 부분 (문서, UX, 테스트 커버리지, 리뷰 편의성)만 확인합니다.
  - pr 브랜치 확인 여부
  - 관련 문서 / 가이드 업데이트 여부
  - (테스트 커버리지 필요할 경우) 테스트 코드 작성 여부
  - (패키지 변경이 있을 경우) 변경된 패키지 작성 여부

## 2. 이슈 작성 가이드

- **버그 이슈**:
  - 환경 정보
  - 재현 단계
  - 기대 동작 / 실제 동작
  - 로그 / 스크린샷
- **기능 요청**:
  - 문제/배경
  - 제안하는 해결책
  - 고려한 대안

## 3. 브랜치 전략

**`[브랜치 종류]`**/**`[담당 파트]`**/**`[작성자 이니셜]`**/**`[기능명]`**

#### **브랜치 종류 및 목적**

- `master`: 배포 브랜치
- `develop`: 통합 개발 브랜치
- `feature/*`: 기능 개발 (`feature/fe/kmj/login-api` / `feature/be/jsh/user-auth`)
- `fix/*`: 버그 수정
- `refactor/*`: 리팩토링 (기능에 영향 없는 사항들 수정)
- `docs/*`: 문서

#### **담당 파트**

- `fe`: 프론트엔드
- `be`: 백엔드
- `infra`: 인프라

## 4. 커밋 컨벤션

주요 규칙과 타입이 존재하며, commit 작성 후 **Git Hook + CommitLint**를 통해 자동 검증되고 있습니다.

- 자동 검증 관련 파일: `.husky/commit-msg`, `commitlint.config.js`

### **주요 규칙**

- header (형태: `type: subject`) 입력 필수
- type: 소문자만 허용 (!BREAKING CHANGE, !HOTFIX 제외)
- subject: 대소문자 시작 제한 없음 / 50자 이내 작성
- body: 선택 작성 / 한줄 72자 이내

### **주요 타입**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `design`: UI 스타일 변경 (마크업/CSS 수정 등)
- `!BREAKING CHANGE`: 호환성을 깨뜨리는 변경
- `!HOTFIX`: 긴급 패치
- `style`: 코드 포맷 변경 (동작 영향 없음)
- `refactor`: 리팩토링
- `docs`: 문서 변경
- `test`: 테스트 추가/수정
- `chore`: 기타 변경
- `rename`: 파일/폴더명 변경
- `remove`: 파일/코드 제거

### **커밋 템플릿 ( `.gitmessage.txt` )**

`git commit` 이후 켜지는 vim 에디터에 템플릿이 보입니다.

- 설정 CLI 멍령어: `git config commit.template .gitmessage.txt`

## 5. 코드 스타일

Toast UI 컨벤션을 기반으로 자체 규정을 사용하고 있으며, **ESLint**를 통한 강제 및 **Prettier**를 통한 포매팅을 적용했습니다. 주요 린터와 포매터 규칙은 개발 노션 온보딩 문서를 참고해주세요.

### commit 작성 전 : 코드 스타일 강제

commit 작성 전 **Git Hook + lint-staged**를 통해 자동 검증되고 있습니다. 자동 검증 시에는 eslint의 `--cache` 옵션과 prettier의 `--ignore-unknown` 옵션을 통해 변경 검증 시간을 최소화하기 위해 설정해둔 상태입니다.

- 린터 & 포매터 관련 파일: `.prettierignore`, `.prettierrc`, `eslint.config.mjs`
- 자동 검증 관련 파일: `.husky/pre-commit`, `package.json > "lint-staged"`

### 개발 환경 설정 통일성 부여

또한 팀원 내 개발 환경을 일치시키기 위해 IDE 설정을 맞추고 있으며, 레포지토리에 업로드되는 형태를 맞추기 위한 설정 역시 존재합니다. 또한 팀 내에서 필요한 extension 역시 공유 파일이 존재합니다.

- IDE 설정 관련 파일: `.editorconfig`, `.vscode/settings.json`
- IDE extension 관련 파일: `.vscode/extensions.json`
- 레포지토리 업로드 관련 파일: `.gitattributes`

### (+) Git Hook 실행 순서

1. pre-commit: lint-staged (ESLint / Prettier) 검사
2. commit-msg: CommitLint 검사 (커밋 메시지 형식 통일)
3. pre-push: build:fast 실행 (빠른 피드백, 최소한의 타입/번들 검증)

   > ⚠️ **주의사항**
   > `build:fast`는 **프로덕션 빌드와 100% 동일하지 않습니다**.
   > 다음과 같은 한계가 있으므로, **배포 전에는 반드시 정식 빌드(`vite build`)와 스모크 테스트**를 수행해야 합니다.
   >
   > 1. 압축(minify) 과정에서만 발생하는 런타임 오류를 잡지 못할 수 있음 (예: 식별자 축약 의존 코드)
   > 2. 소스맵 생성이 비활성화되어 Sentry 등 오류 매핑 검증 불가
   > 3. 압축 단계에서만 동작하는 플러그인 최적화 미적용
   > 4. CI/CD나 배포 환경과 동작이 다를 수 있음
