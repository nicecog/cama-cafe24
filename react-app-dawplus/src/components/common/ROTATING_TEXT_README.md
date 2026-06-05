# Rotating Text Component

React Bits의 Rotating Text 애니메이션을 참고하여 만든 텍스트 회전 컴포넌트입니다.

## 📦 생성된 파일

- `src/components/common/RotatingText.tsx` - 기본 버전
- `src/components/common/RotatingTextAdvanced.tsx` - 고급 버전 (5가지 애니메이션)
- `src/routes/_auth/_layout/home/-components/configured/MotivationalMessage.tsx` - 간단한 사용 예시
- `src/routes/_auth/_layout/home/-components/configured/RotatingTextExamples.tsx` - 다양한 사용 예시

## 🚀 기본 사용법

```tsx
import RotatingText from "@/components/common/RotatingText";

function MyComponent() {
  const messages = [
    "오늘도 화이팅! 💪",
    "건강한 하루 되세요! 🌟",
    "꾸준함이 힘입니다! ✨",
  ];

  return (
    <RotatingText 
      texts={messages} 
      interval={3000}
      className="text-lg font-bold text-primary"
    />
  );
}
```

## 🎨 고급 사용법 (애니메이션 타입)

```tsx
import RotatingTextAdvanced from "@/components/common/RotatingTextAdvanced";

function MyComponent() {
  return (
    <RotatingTextAdvanced
      texts={["메시지 1", "메시지 2", "메시지 3"]}
      interval={4000}
      animationType="slide-up" // fade | slide-up | slide-down | scale | rotate
      className="text-base"
    />
  );
}
```

## 📋 Props

### RotatingText (기본)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `texts` | `string[]` | **required** | 회전할 텍스트 배열 |
| `interval` | `number` | `3000` | 텍스트 변경 간격 (ms) |
| `className` | `string` | `""` | 추가 CSS 클래스 |

### RotatingTextAdvanced (고급)
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `texts` | `string[]` | **required** | 회전할 텍스트 배열 |
| `interval` | `number` | `3000` | 텍스트 변경 간격 (ms) |
| `className` | `string` | `""` | 추가 CSS 클래스 |
| `animationType` | `"fade" \| "slide-up" \| "slide-down" \| "scale" \| "rotate"` | `"fade"` | 애니메이션 타입 |

## 🎯 애니메이션 타입 설명

- **fade**: 부드러운 페이드 인/아웃
- **slide-up**: 아래에서 위로 슬라이드
- **slide-down**: 위에서 아래로 슬라이드
- **scale**: 크기 변화 효과
- **rotate**: 회전 + 스케일 효과

## 💡 사용 예시

### 1. 메인 화면에 추가하기

`src/routes/_auth/_layout/home/index.tsx`에 추가:

```tsx
import { SimpleMotivation } from "./-components/configured/RotatingTextExamples";

function RouteComponent() {
  return (
    <div>
      <Header userName={accountMe.data?.name ?? ""} />
      <SimpleMotivation /> {/* 여기에 추가 */}
      <DailyCarousel />
      {/* ... */}
    </div>
  );
}
```

### 2. Header에 서브타이틀로 추가

`src/routes/_auth/_layout/home/-components/configured/Header.tsx`에 추가:

```tsx
import RotatingTextAdvanced from "@/components/common/RotatingTextAdvanced";

export default function Header({ userName }: HeaderProps) {
  const subtitles = [
    "당신의 건강 여정을 응원합니다",
    "함께 이겨내는 하루하루",
  ];

  return (
    <div className="bg-primary pt-16 rounded-b-2xl pb-10 px-5">
      <div className="text-white">
        <h1>{pt("MSG_01")}, {userName}{pt("MSG_02")}</h1>
        
        {/* 서브타이틀 추가 */}
        <RotatingTextAdvanced
          texts={subtitles}
          interval={4000}
          animationType="slide-up"
          className="text-sm text-white/80 mt-2"
        />
        
        {/* ... */}
      </div>
    </div>
  );
}
```

### 3. 독립 컴포넌트로 사용

```tsx
import { DailyTip, InspirationalQuote } from "./-components/configured/RotatingTextExamples";

function MyPage() {
  return (
    <div className="space-y-4">
      <DailyTip />
      <InspirationalQuote />
    </div>
  );
}
```

## 🎨 스타일링 팁

```tsx
// 그라디언트 텍스트
<RotatingText 
  texts={messages}
  className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
/>

// 그림자 효과
<RotatingText 
  texts={messages}
  className="text-xl font-bold text-white drop-shadow-lg"
/>

// 배경과 함께
<div className="bg-primary/10 rounded-lg p-4">
  <RotatingText 
    texts={messages}
    className="text-lg text-primary"
  />
</div>
```

## ⚡ 성능 최적화

- 텍스트 배열이 변경되지 않으면 자동으로 메모이제이션됨
- 컴포넌트 언마운트 시 타이머 자동 정리
- 텍스트가 1개 이하면 애니메이션 비활성화

## 🔧 커스터마이징

애니메이션 속도나 효과를 변경하려면 컴포넌트 파일에서 `duration-300`, `duration-500` 등의 값을 조정하세요.

```tsx
// RotatingText.tsx 또는 RotatingTextAdvanced.tsx에서
className="transition-all duration-500" // 500ms로 변경
```
