export default function PrivacyContent() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="space-y-8">
        {/* 제목 */}
        <div className="text-center pb-6 border-b-2 border-primary">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            개인정보 처리방침
          </h1>
          <p className="text-sm text-gray-500">시행일자: 2022년 4월 25일</p>
        </div>

        {/* 서문 */}
        <section>
          <div className="bg-blue-50 border-l-4 border-primary p-4 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-gray-900">휴딧 주식회사</strong>
              ('https://www.hudit.co.kr' 이하 '휴딧')은 「개인정보 보호법」
              제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을
              신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
              개인정보 처리방침을 수립·공개합니다.
            </p>
          </div>
        </section>

        {/* 제1조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제1조 (개인정보의 처리 목적)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              휴딧 주식회사는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지
              않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에
              따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>

            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  1. 홈페이지 회원가입 및 관리
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
                  회원자격 유지·관리, 서비스 부정이용 방지, 만14세 미만 아동의
                  개인정보 처리 시 법정대리인의 동의여부 확인, 각종 고지·통지,
                  고충처리 목적으로 개인정보를 처리합니다.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  2. 민원사무 처리
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지,
                  처리결과 통보 목적으로 개인정보를 처리합니다.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  3. 재화 또는 서비스 제공
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증을 목적으로
                  개인정보를 처리합니다.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">
                  4. 마케팅 및 광고에의 활용
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성
                  정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스
                  제공 및 광고 게재, 서비스의 유효성 확인, 접속빈도 파악 또는
                  회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를
                  처리합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 제2조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제2조 (개인정보의 처리 및 보유 기간)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium">1.</span> 휴딧 주식회사는 법령에
              따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집
              시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를
              처리·보유합니다.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">
                홈페이지 회원가입 및 관리
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    보유기간: 수집·이용에 관한 동의일로부터 <strong>3년</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>
                    보유근거: 「개인정보보호법」 제15조(개인정보의 수집·이용)
                    제1항
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>신용정보의 수집/처리 및 이용 등에 관한 기록: 3년</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-medium">•</span>
                  <span>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 제3조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제3조 (처리하는 개인정보의 항목)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              휴딧 주식회사는 다음의 개인정보 항목을 처리하고 있습니다.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">
                홈페이지 회원가입 및 관리
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-gray-800">필수항목:</span>
                  <span className="text-gray-700 ml-2">
                    휴대전화번호, 비밀번호, 로그인ID, 성별, 생년월일, 이름,
                    서비스 이용 기록, 접속 로그, 접속 IP 정보
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제4조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제4조 (개인정보의 파기절차 및 파기방법)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium">1.</span> 휴딧 주식회사는 개인정보
              보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
              때에는 지체없이 해당 개인정보를 파기합니다.
            </p>

            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium">2.</span> 정보주체로부터 동의받은
              개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도 불구하고
              다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당
              개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여
              보존합니다.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">
                3. 개인정보 파기의 절차 및 방법
              </h3>

              <div className="pl-4 border-l-2 border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">파기절차</h4>
                <p className="text-gray-700 leading-relaxed">
                  휴딧 주식회사는 파기 사유가 발생한 개인정보를 선정하고, 휴딧
                  주식회사의 개인정보 보호책임자의 승인을 받아 개인정보를
                  파기합니다.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">파기방법</h4>
                <p className="text-gray-700 leading-relaxed">
                  전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을
                  사용합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 제5조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제5조 (정보주체와 법정대리인의 권리·의무 및 그 행사방법)
          </h2>
          <div className="space-y-3 text-gray-700 leading-relaxed">
            <p>
              <span className="font-medium">1.</span> 정보주체는 휴딧 주식회사에
              대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를
              행사할 수 있습니다.
            </p>
            <p>
              <span className="font-medium">2.</span> 제1항에 따른 권리 행사는
              휴딧 주식회사에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라
              서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 휴딧
              주식회사는 이에 대해 지체 없이 조치하겠습니다.
            </p>
            <p>
              <span className="font-medium">3.</span> 제1항에 따른 권리 행사는
              정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실
              수 있습니다.
            </p>
            <p>
              <span className="font-medium">4.</span> 개인정보 열람 및 처리정지
              요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여
              정보주체의 권리가 제한될 수 있습니다.
            </p>
          </div>
        </section>

        {/* 제6조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제6조 (개인정보의 안전성 확보조치)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              휴딧 주식회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를
              취하고 있습니다.
            </p>

            <div className="grid gap-3">
              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary font-bold text-lg">1</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    정기적인 자체 감사 실시
                  </h4>
                  <p className="text-gray-700 text-sm">
                    개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로
                    자체 감사를 실시하고 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary font-bold text-lg">2</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    개인정보 취급 직원의 최소화 및 교육
                  </h4>
                  <p className="text-gray-700 text-sm">
                    개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜
                    최소화하여 개인정보를 관리하는 대책을 시행하고 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary font-bold text-lg">3</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    내부관리계획의 수립 및 시행
                  </h4>
                  <p className="text-gray-700 text-sm">
                    개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고
                    시행하고 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary font-bold text-lg">4</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    해킹 등에 대비한 기술적 대책
                  </h4>
                  <p className="text-gray-700 text-sm">
                    해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을
                    막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을
                    하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고
                    기술적/물리적으로 감시 및 차단하고 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary font-bold text-lg">5</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    개인정보의 암호화
                  </h4>
                  <p className="text-gray-700 text-sm">
                    이용자의 개인정보는 비밀번호는 암호화되어 저장 및 관리되고
                    있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송
                    데이터를 암호화하거나 파일 잠금 기능을 사용하는 등의 별도
                    보안기능을 사용하고 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary font-bold text-lg">6</span>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    접속기록의 보관 및 위변조 방지
                  </h4>
                  <p className="text-gray-700 text-sm">
                    개인정보처리시스템에 접속한 기록을 최소 1년 이상 보관,
                    관리하고 있으며, 접속기록이 위변조 및 도난, 분실되지 않도록
                    보안기능을 사용하고 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 제7조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제7조 (쿠키 사용)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            휴딧 주식회사는 정보주체의 이용정보를 저장하고 수시로 불러오는
            '쿠키(cookie)'를 사용하지 않습니다.
          </p>
        </section>

        {/* 제8조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제8조 (개인정보 보호책임자)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              휴딧 주식회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고,
              개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary/5 border-2 border-primary/20 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  개인정보 보호책임자
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">성명:</span> 최완규
                  </li>
                  <li>
                    <span className="font-medium">직책:</span> 연구소장
                  </li>
                  <li>
                    <span className="font-medium">직급:</span> 수석
                  </li>
                  <li>
                    <span className="font-medium">연락처:</span> 010-3298-4763
                  </li>
                  <li>
                    <span className="font-medium">이메일:</span>{" "}
                    nicecog@hudit.co.kr
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  개인정보 보호 담당부서
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">성명:</span> 최완규
                  </li>
                  <li>
                    <span className="font-medium">직책:</span> 연구소장
                  </li>
                  <li>
                    <span className="font-medium">직급:</span> 수석
                  </li>
                  <li>
                    <span className="font-medium">연락처:</span> 010-3298-4763
                  </li>
                  <li>
                    <span className="font-medium">이메일:</span>{" "}
                    nicecog@hudit.co.kr
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 제9조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제9조 (개인정보의 열람청구)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              정보주체는 「개인정보 보호법」 제35조에 따른 개인정보의 열람
              청구를 아래의 부서에 할 수 있습니다.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">
                개인정보 열람청구 접수·처리 부서
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">성명:</span> 최완규
                </li>
                <li>
                  <span className="font-medium">직책:</span> 연구소장
                </li>
                <li>
                  <span className="font-medium">직급:</span> 수석
                </li>
                <li>
                  <span className="font-medium">연락처:</span> 010-3298-4763
                </li>
                <li>
                  <span className="font-medium">이메일:</span>{" "}
                  nicecog@hudit.co.kr
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 제10조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제10조 (권익침해 구제방법)
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여
              개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에
              분쟁해결이나 상담 등을 신청할 수 있습니다.
            </p>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-primary font-bold">1</span>
                <div>
                  <p className="font-medium text-gray-800">
                    개인정보분쟁조정위원회
                  </p>
                  <p className="text-sm text-gray-600">
                    (국번없이) 1833-6972 | www.kopico.go.kr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-primary font-bold">2</span>
                <div>
                  <p className="font-medium text-gray-800">
                    개인정보침해신고센터
                  </p>
                  <p className="text-sm text-gray-600">
                    (국번없이) 118 | privacy.kisa.or.kr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-primary font-bold">3</span>
                <div>
                  <p className="font-medium text-gray-800">대검찰청</p>
                  <p className="text-sm text-gray-600">
                    (국번없이) 1301 | www.spo.go.kr
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-primary font-bold">4</span>
                <div>
                  <p className="font-medium text-gray-800">경찰청</p>
                  <p className="text-sm text-gray-600">
                    (국번없이) 182 | ecrm.cyber.go.kr
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mt-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                「개인정보보호법」제35조(개인정보의 열람), 제36조(개인정보의
                정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에
                대하여 공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는
                이익의 침해를 받은 자는 행정심판법이 정하는 바에 따라 행정심판을
                청구할 수 있습니다.
              </p>
              <p className="text-xs text-gray-600 mt-2">
                ※ 행정심판에 대해 자세한 사항은
                중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기
                바랍니다.
              </p>
            </div>
          </div>
        </section>

        {/* 제11조 */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">
            제11조 (개인정보 처리방침 변경)
          </h2>
          <p className="text-gray-700 leading-relaxed">
            이 개인정보처리방침은 2022년 4월 25일부터 적용됩니다.
          </p>
        </section>

        {/* 하단 */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">시행일자: 2022년 4월 25일</p>
        </div>
      </div>
    </div>
  );
}
