# 🚀 React-App

React Project 기본세팅

## 🤷‍♂️ Author

- **채지웅** : 2025.02.03

## ⚙️ Packages

- React (V19.x — 2026-06-04 마이그레이션, `npm run build` 검증)
- Node.js (V20.18.2+)
- Tailwind 3.x

## 🍕 Start

1. yarn install or npm install
2. yarn dev

## ⏲️ 참고 사항

API 호스트: `https://camaplus.cafe24.com/` (구 `api.camaplus.me` 아님). `src/config/stage.ts` · `.env.cafe24.example` 참고.

## Cafe24 배포

```powershell
# 빌드만
npm run build:cafe24

# VPS 업로드 + nginx (CAMA_SSH_TARGET=root@IP)
..\deploy\scripts\deploy-react-app-cafe24.ps1 -Build -ApplyNginx
```

상세: [../docs/CAFE24_REACT_APP_DEPLOY.md](../docs/CAFE24_REACT_APP_DEPLOY.md)
🚨 eslint, prettier 필수

# 🚀 TanStack Router 파일 네이밍 규칙

TanStack Router에서 파일 기반 라우팅을 사용할 때, 특정 네이밍 규칙을 따르면 라우팅 방식이 달라집니다.  
아래는 주요 규칙을 정리한 표입니다.

## 📌 네이밍 규칙 정리

| 네이밍 규칙  | 설명                         | 예제                                    |
| ------------ | ---------------------------- | --------------------------------------- |
| `__root.tsx` | 최상위 루트 라우트           | `/`                                     |
| `.` (점)     | 중첩 라우트                  | `blog.post.tsx` → `/blog/post`          |
| `$` (달러)   | URL 파라미터 (동적 라우트)   | `users.$id.tsx` → `/users/:id`          |
| `_` (접두어) | URL에 포함되지 않는 레이아웃 | `_layout.tsx`                           |
| `_` (접미어) | 부모 없이 독립적인 라우트    | `dashboard.settings_.tsx` → `/settings` |
| `index.tsx`  | 부모와 동일한 경로           | `blog/index.tsx` → `/blog`              |
| `.route.tsx` | 폴더 내 라우트 파일          | `post.route.tsx` → `/blog/post`         |
| `.lazy.tsx`  | 코드 스플리팅                | `dashboard.lazy.tsx` → `/dashboard`     |

## 📂 예제 파일 구조

```plaintext
📂 routes
 ┣ 📄 __root.tsx            # ✅ 최상위 루트 라우트
 ┣ 📄 dashboard.tsx         # ✅ /dashboard
 ┣ 📄 dashboard.settings_.tsx  # ✅ /settings (부모 없이 독립적인 라우트)
 ┣ 📄 users.$id.tsx         # ✅ /users/:id (동적 라우트)
 ┣ 📄 blog.post.tsx         # ✅ /blog/post (blog의 자식 라우트)
 ┣ 📂 blog
 ┃ ┣ 📄 index.tsx          # ✅ /blog (부모와 동일한 경로)
 ┃ ┗ 📄 post.route.tsx     # ✅ /blog/post (폴더 내 라우트)
 ┣ 📂 _auth
 ┃ ┣ 📄 login.tsx          # ✅ /login (레이아웃이지만 URL에는 포함되지 않음)
 ┃ ┣ 📄 register.tsx       # ✅ /register
 ┣ 📄 dashboard.lazy.tsx    # ✅ /dashboard (코드 스플리팅 적용)
```
