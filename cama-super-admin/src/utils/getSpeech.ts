export const getSpeech = (text: string) => {
  let voices: SpeechSynthesisVoice[] = [];

  // 디바이스에 내장된 voice를 가져온다.
  const setVoiceList = () => {
    voices = window.speechSynthesis.getVoices();
  };

  setVoiceList();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    // voice list에 변경됐을때, voice를 다시 가져온다.
    window.speechSynthesis.onvoiceschanged = setVoiceList;
  }

  const speech = (txt: string) => {
    // 기존 음성 재생 중지
    window.speechSynthesis.cancel();

    const utterThis = new SpeechSynthesisUtterance(txt);

    // 한국어 voice 찾기
    // const kor_voice = voices.find((voice) => voice.lang.includes("ko"));

    // Google 한국어 음성 찾기
    const googleKoreanVoice = voices.find(
      (voice) => voice.name.includes("Google") && voice.lang.includes("ko")
    );

    if (googleKoreanVoice) {
      utterThis.voice = googleKoreanVoice;
      window.speechSynthesis.speak(utterThis); // utterance를 재생(speak)한다.
    } else {
      console.error("한국어 음성이 지원되지 않습니다.");
    }
  };

  speech(text);
};
