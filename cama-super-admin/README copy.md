# CAMA-DOCTOR

React.js / Vite / Redux / Redux-toolkit / React-Query
<!-- credentials : "prod1234"
principal : "jhpark" -->
## package

```bash
|-- src/
| |-- main.js
| |-- app/
| |-- components/
|-- assets/
| |-- styles/
| |-- main.css
|-- node_modules/
|-- .gitignore
|-- package.json
|-- vite.config.js
```

## Version

node : v18.17.0

## Installation

설치 with npm

```bash
  cd project[폴더]
  npm i
  o + enter
```

## Naming Rule(?)

파일 및 폴더 네이밍:

- 폴더는 소문자 시작
- Page 대문자 시작(다른곳에서 Import 하기떄문) - index.tsx 는 제외
- Util, Hooks, 시스템 파일 들은 소문자 시작

## Router 규칙

/app 폴더 및 Page.tsx 파일을 기준으로 Route 구성

- \_로 시작 할 경우 Route 구성에서 제외하도록 추가

## Environment Variables

`VITE_BASE_URL` - BASE URL

`ANOTHER_API_KEY` - BASE PATH

`VITE_MAIN_MIN_WIDTH` - 화면조정 기준 최소넓이
