import { useCallback, useId } from "react";

// HTTP 메서드 타입 정의
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | null;
// 폼 데이터 타입 정의 (키-값 쌍의 객체)
type FormData = Record<string, string>;

/**
 * 새 창에서 폼을 제출하는 커스텀 훅
 * @param url 폼을 제출할 URL
 * @param formData 제출할 폼 데이터
 * @param windowOptions 새 창의 옵션 (선택적)
 * @param method HTTP 메서드 (기본값: POST)
 * @returns 폼 제출 및 새 창 열기 함수
 */
const useOpenWindowForm = (
  url: string,
  formData: FormData,
  windowOptions?: string,
  method: HttpMethod = "POST"
) => {
  // 고유한 ID 생성 (팝업 창 이름으로 사용)
  const id = useId();

  // useCallback을 사용하여 함수 메모이제이션
  return useCallback(() => {
    // 동적으로 폼 요소 생성
    const form = document.createElement("form");
    form.method = method || "POST";
    form.action = url;
    form.target = "_blank"; // 기본적으로 새 탭에서 열기

    // formData의 각 항목을 hidden input으로 폼에 추가
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // 생성한 폼을 body에 임시로 추가
    document.body.appendChild(form);

    // windowOptions가 제공된 경우, 새 창 열기
    if (windowOptions) {
      const windowName = `newPopup_${id}`; // 고유한 창 이름 생성
      const newWindow = window.open("", windowName, windowOptions);
      if (newWindow) {
        form.target = windowName; // 폼의 target을 새 창으로 설정
      } else {
        // 새 창 열기 실패 시 (예: 팝업 차단) 에러 처리
        console.error(
          "Error: 새 창을 열 수 없습니다. 팝업 차단을 확인해주세요."
        );
        document.body.removeChild(form);
        return;
      }
    }

    // 폼 제출
    form.submit();
    // 제출 후 폼 요소 제거 (클린업)
    document.body.removeChild(form);
  }, [url, formData, method, windowOptions, id]); // 의존성 배열: 이 값들이 변경될 때만 함수 재생성
};

export default useOpenWindowForm;
