import Dietary from "@/assets/images/character/dietary.png";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import Title from "@/app/webview/coaching/component/Layout/Title";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import AnswerList from "@/app/webview/coaching/component/Layout/AnswerList";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

const answerValues = [
  "가족의 행복 ",
  "경제적 안정",
  "활력있는 삶 ",
  "심리적 안정 ",
  "건강",
  "사회적 성공과 성취",
  "기타",
];
// Day1
export default function StartDayStep1(props: any) {
  const { data, onNext, onChange } = props;

  const { alert } = useAlert();

  //  답 선택
  const onChangeHandler = (value: string) => {
    if (data.value === value) return;

    onChange({
      ...data,
      value,
      extra: "",
    });
  };

  const isExtra = data.value === answerValues[answerValues.length - 1];

  // 다음 선택
  const onNextHandler = () => {
    if (!data.value) {
      alert("답변을 선택해 주십시오.");
      return;
    }

    //체크되어잇을경우
    if (isExtra && data.extra === "") {
      alert("나에게 중요한 삶의 가치를 입력해 주세요.");
      return;
    }

    onNext("A2");
  };

  return (
    <>
      <MainCard>
        <Title>식사습관 가이드</Title>
        <div className="text-center flex justify-center  my-10">
          <img src={Dietary} alt="character" className="w-24" />
        </div>
        <TextBox>
          <p className="text-camaColor font-bold  ">
            안녕하세요, ‘카마플러스’에 오신 것을 환영합니다.
          </p>
          <br />
          앞으로 16일 동안 '건강한 식사습관 만들기' 프로젝트가 진행돼요.
        </TextBox>
        <TextArea className="mt-10">
          건강한 식사 습관을 만들기 위해 해야 할 것이 있어요. 바로 자신의 삶에서
          가장 중요하게 여기는 가치와 목표가 무엇인지 생각해보는 것이죠.
        </TextArea>

        <TextArea className="mt-8 mb-4 !text-camaColor text-center font-bold tracking-tighter ">
          당신의 삶에서 가장 중요한 것은 <br />
          무엇입니까?
        </TextArea>
        <TextArea>
          <AnswerList
            list={answerValues}
            onChange={onChangeHandler}
            value={data.value}
          >
            {isExtra && (
              <input
                type="text"
                value={data.extra}
                onChange={({ target: { value } }) => {
                  onChange({
                    ...data,
                    extra: value,
                  });
                }}
                placeholder="중요한 삶의 가치를 입력해주세요"
                className="border w-full text-base  p-[8px] rounded-lg border-camaBlue  my-1 px-2 focus:outline-none"
              />
            )}
          </AnswerList>
        </TextArea>
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
