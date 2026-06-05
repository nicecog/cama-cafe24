export default function TermsContent() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="space-y-8">
        {/* 제목 */}
        <div className="text-center pb-6 border-b-2 border-primary">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            서비스 이용약관
          </h1>
          <p className="text-sm text-gray-500">
            공고일자: 2023년 9월 1일 | 시행일자: 2023년 9월 1일
          </p>
        </div>

        {/* 제 1 장 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제 1 장 환영합니다!
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 1 조 (목적)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                휴딧 주식회사(이하 '회사')가 제공하는 서비스를 이용해 주셔서
                감사합니다. 회사는 여러분이 다양한 인터넷과 모바일 서비스를 좀
                더 편리하게 이용할 수 있도록 회사 또는 관계사의 개별 서비스에
                모두 접속 가능한 통합로그인 계정 체계를 만들고 그에 적용되는
                '회사 이용 약관(이하 '본 약관') 을 마련하였습니다. 본 약관은
                여러분이 휴딧 주식회사의 계정 서비스를 이용하는 데 필요한 권리,
                의무 및 책임사항, 이용조건 및 절차 등 기본적인 사항을 규정하고
                있으므로 조금만 시간을 내서 주의 깊게 읽어주시기 바랍니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 2 조 (약관의 효력 및 변경)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-medium">1.</span> 본 약관의 내용은 개별
                  서비스의 화면에 게시하거나 기타의 방법으로 공지하고, 본 약관에
                  동의한 여러분 모두에게 그 효력이 발생합니다.
                </p>
                <p>
                  <span className="font-medium">2.</span> 회사는 필요한 경우
                  관련법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수
                  있습니다. 본 약관이 변경되는 경우 회사는 변경사항을 시행일자
                  15일 전부터 여러분에게 서비스 공지사항에서 공지 또는 통지하는
                  것을 원칙으로 하며, 피치 못하게 여러분에게 불리한 내용으로
                  변경할 경우에는 그 시행일자 30일 전부터 휴딧 주식회사의 계정에
                  등록된 이메일 주소로 이메일을 발송하는 방법 등으로 개별적으로
                  알려 드리겠습니다.
                </p>
                <p>
                  <span className="font-medium">3.</span> 회사가 전항에 따라
                  공지 또는 통지를 하면서 공지 또는 통지일로부터 개정약관 시행일
                  7일 후까지 거부의사를 표시하지 아니하면 승인한 것으로 본다는
                  뜻을 명확하게 고지하였음에도 여러분의 의사표시가 없는 경우에는
                  변경된 약관을 승인한 것으로 봅니다. 여러분이 개정약관에
                  동의하지 않을 경우 여러분은 이용계약을 해지할 수 있습니다.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 3 조 (약관 외 준칙)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                본 약관에 규정되지 않은 사항에 대해서는 관련법령 또는 회사가
                정한 개별 서비스의 이용약관, 운영정책 및 규칙 등(이하
                '세부지침')의 규정에 따릅니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 4 조 (용어의 정의)
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    "휴딧 계정"이란 회사 또는 관계사가 제공하는 개별 서비스를
                    하나의 로그인 계정과 비밀번호로 인증, 회원정보 변경, 회원
                    가입 및 탈퇴 등을 관리할 수 있도록 회사가 정한 로그인 계정
                    정책을 말합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    "회원"이란 휴딧 계정이 적용된 개별 서비스에서 본 약관에
                    동의하고, 휴딧 계정을 이용하는 자를 말하고, "비회원"이란
                    회원이 아닌 자를 말합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    "관계사"란 회사와 제휴 관계를 맺고 휴딧 계정을 공동
                    제공하기로 합의한 회사를 말합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    "개별 서비스"란 휴딧 계정을 이용하여 접속 가능한 회사 또는
                    관계사가 제공하는 서비스를 말합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    "휴딧 계정 웹사이트"란 회원이 온라인을 통해 휴딧 계정 정보를
                    조회 및 수정할 수 있는 인터넷 사이트를 말합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    "휴딧 계정 정보"란 휴딧 계정을 이용하기 위해 회사가 정한
                    필수 내지 선택 입력 정보로서 휴딧 계정 웹사이트 또는 개별
                    서비스 내 휴딧 계정 설정 화면을 통해 정보 확인, 변경 처리
                    등을 관리할 수 있는 회원정보 항목을 말합니다.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 제 2 장 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제 2 장 휴딧 계정 이용계약
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 5 조 (계약의 성립)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-medium">1.</span> 휴딧 계정 이용 신청은
                  개별 서비스 또는 휴딧 계정 웹사이트 회원가입 화면에서 여러분이
                  휴딧 계정 정보에 일정 정보를 입력하는 방식으로 이루어집니다.
                </p>
                <p>
                  <span className="font-medium">2.</span> 휴딧 계정 이용계약은
                  여러분이 본 약관의 내용에 동의한 후 본 조 제1항에서 정한 이용
                  신청을 하면 회사가 입력된 일정 정보를 인증한 후 가입을
                  승낙함으로써 체결됩니다.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 6 조 (휴딧 계정 이용의 제한)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-medium">1.</span> 제5조에 따른 가입
                  신청자에게 회사는 원칙적으로 휴딧 계정의 이용을 승낙합니다.
                  다만, 회사는 아래 각 호의 경우에는 그 사유가 해소될 때까지
                  승낙을 유보하거나 승낙하지 않을 수 있습니다.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">①</span>
                    <span>
                      회사가 본 약관 또는 세부지침에 의해 여러분의 휴딧 계정을
                      삭제한 경우
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">②</span>
                    <span>
                      여러분이 다른 사람의 명의나 이메일 주소 등 개인정보를
                      이용하여 휴딧 계정을 생성하려한 경우
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">③</span>
                    <span>
                      휴딧 계정 생성 시 필요한 정보를 입력하지 않거나 허위의
                      정보를 입력한 경우
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">④</span>
                    <span>기타 관련법령에 위배되는 경우</span>
                  </li>
                </ul>
                <p>
                  <span className="font-medium">2.</span> 만약, 여러분이 위
                  조건에 위반하여 휴딧 계정을 생성한 것으로 판명된 때에는 회사는
                  즉시 여러분의 휴딧 계정 이용을 정지시키거나 휴딧 계정을
                  삭제하는 등 적절한 제한을 할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 제 3 장 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제 3 장 휴딧 계정 이용
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 7 조 (휴딧 계정 제공)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-medium">1.</span> 회사가 개별 서비스와
                  연동하여 휴딧 계정에서 제공하는 서비스 내용은 아래와 같습니다.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">①</span>
                    <span>
                      통합로그인: 휴딧 계정이 적용된 개별 서비스에서 하나의 휴딧
                      계정과 비밀번호로 로그인할 수 있는 통합 회원 인증 서비스를
                      이용할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">②</span>
                    <span>
                      SSO(Single Sign On): 웹브라우저나 특정 모바일 기기에서
                      휴딧 계정 1회 로그인으로 여러분이 이용 중인 개별 서비스간
                      추가 로그인 없이 자동 접속 서비스를 이용할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">③</span>
                    <span>
                      휴딧 계정 정보 통합 관리: 개별 서비스 이용을 위해 휴딧
                      계정 정보를 통합 관리합니다.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 8 조 (휴딧 계정 서비스의 변경 및 종료)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  회사는 휴딧 계정 서비스를 365일, 24시간 쉬지 않고 제공하기
                  위하여 최선의 노력을 다합니다. 다만, 설비의 유지·보수, 정전,
                  천재지변 등의 경우 서비스의 전부 또는 일부를 제한하거나 중지할
                  수 있습니다.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 9 조 (휴딧 계정 관리)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  <span className="font-medium">1.</span> 휴딧 계정은 여러분
                  본인만 이용할 수 있으며, 다른 사람이 여러분의 휴딧 계정을
                  이용하도록 허락할 수 없습니다. 여러분은 다른 사람이 여러분의
                  휴딧 계정을 무단으로 사용할 수 없도록 직접 비밀번호를
                  관리하여야 합니다.
                </p>
                <p>
                  <span className="font-medium">2.</span> 여러분은 휴딧 계정
                  웹사이트 또는 개별 서비스 내 휴딧 계정 설정 화면을 통하여
                  여러분의 휴딧 계정 정보를 열람하고 수정할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 제 4 장 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제 4 장 계약당사자의 의무
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 10 조 (회원의 의무)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  여러분이 휴딧 계정 서비스를 이용할 때 아래 각 호의 행위는
                  하여서는 안 됩니다.
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      허위 사실을 기재하거나 타인의 정보를 도용하는 행위
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>타인의 명예를 손상시키거나 불이익을 주는 행위</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>음란물을 게재하거나 음란사이트를 연결하는 행위</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>저작권 등 타인의 권리를 침해하는 행위</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      컴퓨터 바이러스 감염 자료를 등록 또는 유포하는 행위
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>스팸메일을 전송하는 행위</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>기타 불법한 행위</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 11 조 (개인정보의 보호)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                여러분의 개인정보의 안전한 처리는 회사에게 있어 가장 중요한 일
                중 하나입니다. 여러분의 개인정보는 서비스의 원활한 제공을 위하여
                여러분이 동의한 목적과 범위 내에서만 이용됩니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 12 조 (회원에 대한 통지 및 공지)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                회사는 여러분과의 의견 교환을 소중하게 생각합니다. 서비스 이용자
                전체에 대한 공지는 7일 이상 서비스 공지사항란에 게시함으로써
                효력이 발생합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 제 5 장 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제 5 장 이용계약 해지 등
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 13 조 (이용계약 해지)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  여러분이 휴딧 계정 이용을 더 이상 원치 않는 때에는 언제든지
                  서비스 내 제공되는 메뉴를 이용하여 이용계약의 해지 신청을 할
                  수 있으며, 회사는 법령이 정하는 바에 따라 신속히
                  처리하겠습니다.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 14 조 (손해배상)
              </h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>
                  회사는 회사의 과실로 인하여 여러분이 손해를 입게 될 경우 본
                  약관 및 관련 법령에 따라 여러분의 손해를 배상하겠습니다. 다만
                  회사는 회사의 과실 없이 발생된 손해에 대해서는 책임을 부담하지
                  않습니다.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                제 15 조 (분쟁의 해결)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                본 약관 또는 서비스는 대한민국법령에 의하여 규정되고 이행됩니다.
                서비스 이용과 관련하여 회사와 여러분 간에 분쟁이 발생하면 이의
                해결을 위해 성실히 협의할 것입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 하단 */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            공고일자: 2023년 9월 1일 | 시행일자: 2023년 9월 1일
          </p>
        </div>
      </div>
    </div>
  );
}
