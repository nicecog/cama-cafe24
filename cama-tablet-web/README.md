# cama-tablet-web

태블릿 가로 대시보드 React SPA. Android WebView에서 로드.

## 실행

```bash
npm install
npm run dev
```

http://localhost:5175 — 브라우저에서는 QR 테스트 입력(prompt) 사용.

## 환경변수

`.env.development`:

```
VITE_API_BASE_URL=
```

비우면 Vite proxy → `http://127.0.0.1:8090`
