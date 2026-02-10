<!--
이 README.md는 보일러플레이트를 사용하는 "프로젝트"에서 편집하여 쓰는 템플릿입니다. 보일러플레이트 자체의 사용법/규칙/업데이트는 팀 개발 노션을 참고하세요
-->

# [프로젝트명]

> 작성 형태 : `간략한 프로젝트 소개`

## 개요

- 문제/목표:
- 핵심 기능:
- 대상 사용자:

## 🚀 주요 기능

> 작성 형태 : `- **[주요 기능]** : 기능 설명`

## 🛠 기술 스택

> 작성 형태 : `- **[기술스택명]** : 기술 스택 사용 목적`

### Frontend

- **React 19** : 사용자 인터페이스 구축
- **TypeScript** : 타입 안전성 보장
- **Vite** : 빠른 개발 환경 및 빌드 도구
- **Tailwind CSS** : 스타일링 프레임워크

### State Management

- **Zustand** : 경량 상태 관리 라이브러리
- **TanStack Query** : 서버 상태 관리

### UI Components

- \*\* \*\* :

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   ├── main/           # 메인 페이지 컴포넌트
│   └── ui/             # 기본 UI 컴포넌트
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 라이브러리
├── models/             # 타입 정의
├── pages/              # 페이지 컴포넌트
├── providers/          # React Context Provider
├── stores/             # Zustand 상태 관리
└── styles/
```

## 🎮 주요 페이지

> 작성 형태 : `- **[페이지명]** : 페이지 설명`

## 🔧 설치 및 실행

### 필수 요구사항

- Node.js: 22.18.x (Volta로 고정)
- pnpm: 10.14.x (Volta로 고정)

### Volta로 Node / pnpm 사용 (권장)

[Volta](https://volta.sh/)를 쓰면 이 프로젝트 디렉터리에서 자동으로 위 버전이 사용됩니다.

1. **Volta 설치**: https://volta.sh/ (Windows: `winget install Volta.Volta` 또는 인스톨러)
2. **프로젝트 폴더에서 한 번만 실행**:

```bash
volta install node@22.18.0
volta install pnpm@10.14.0
```

이후 이 폴더에서는 `node`, `pnpm`이 위 버전으로 고정됩니다.

### 설치 및 실행

```bash
pnpm install
pnpm dev
```

(pnpm이 없으면 위 "Volta로 Node / pnpm 사용" 절대로 먼저 실행)

### 환경 변수

필수 예시:

```env
VITE_API_BASE_URL=
```

### 스크립트

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "type-check": "tsc --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

## 🎯 주요 기능 상세

### [주요 기능 1]

- \*\* [하위 기능 1] : [하위 기능 설명]

### 컨벤션/워크플로우

- 커밋 규칙: Conventional Commits (Commitlint), 커밋 템플릿 사용 권장
- PR 템플릿: `.github/pull_request_template.md`
- 브랜치 전략: 예) trunk-based 또는 Git Flow (팀 결정)
- 코드 스타일: ESLint/Prettier 규칙 준수

## 🚀 배포

이 프로젝트는 Vite를 사용하여 정적 사이트로 빌드됩니다:

### 배포/CI

- 대상: (예: Vercel/Cloudflare/Netlify)
- 시크릿/환경: (예: VITE_API_BASE_URL 등)

### 라이선스

- (예: 사내/비공개, 또는 MIT)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
