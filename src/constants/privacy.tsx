import React from 'react';

export const privacyContents = [
  <div key={0} className="mb-5">
    <p>
      포퐁(이하 &quot;회사&quot;)은 「개인정보 보호법」 등 관련 법령을 준수하며, 회원의 개인정보를 안전하게 보호하기
      위해 다음과 같이 개인정보 처리방침을 수립·공개합니다.
    </p>
  </div>,
  <div key={1} className="mb-5">
    <p>제1조 (수집하는 개인정보 항목)</p>
    <p>회사는 서비스 제공을 위하여 아래와 같은 개인정보를 수집합니다.</p>
    <p>회원가입 시</p>
    <ol className="list-decimal" start={1}>
      <li className="ms-[21px]">필수항목: 이메일 주소, 비밀번호, 이름(닉네임), 연락처</li>
      <li className="ms-[21px]">선택항목: 거주지역, 기타 프로필 정보</li>
    </ol>
    <p>상담/입양 신청 시 (브리더에게 전달되는 정보)</p>
    <ol className="list-decimal" start={1}>
      <li className="ms-[21px]">필수항목: 이름, 연락처, 이메일 주소</li>
      <li className="ms-[21px]">
        추가항목(상담 목적에 따라 기재 가능):
        <ul className="list-disc">
          <li className="ms-[42px]">성별, 연령대, 거주지, 가족 구성원, 결혼계획, 직업 등</li>
          <li className="ms-[42px]">현재/이전 반려동물 경험</li>
          <li className="ms-[42px]">희망하는 반려동물의 특징(품종, 외모, 컬러, 성격 등)</li>
          <li className="ms-[42px]">희망 입양 시기</li>
          <li className="ms-[42px]">가족 동의 여부, 알레르기 검사 여부</li>
          <li className="ms-[42px]">기타 문의사항</li>
        </ul>
      </li>
    </ol>
  </div>,
  <div key={2} className="mb-5">
    <p>제2조 (개인정보의 수집 및 이용 목적)</p>
    <p>
      회사는 개인정보 보호법 제15조 및 제17조에 따라 정보주체의 동의 또는 계약 이행을 위하여 개인정보를 수집·이용합니다.
    </p>
    <ol className="list-decimal">
      <li className="ms-[21px]">회원 식별 및 서비스 제공: 로그인, 마이페이지 이용, 서비스 접근 권한 관리</li>
      <li className="ms-[21px]">
        상담·입양 신청 처리: 브리더 회원에게 신청자의 정보를 전달하고, 상담 및 입양 심사 과정 지원
      </li>
      <li className="ms-[21px]">서비스 운영 및 관리: 회원관리, 민원처리, 신고 처리, 분쟁 대응</li>
      <li className="ms-[21px]">보안 및 법령 준수: 부정 이용 방지, 법적 의무 이행</li>
    </ol>
  </div>,
  <div key={3} className="mb-5">
    <p>제3조 (개인정보의 보유 및 이용 기간)</p>
    <ol className="list-decimal" start={1}>
      <li className="ms-[21px]">
        회원가입 정보: 회원 탈퇴 시점으로부터 1년간 보관 후 파기
        <br />
        <span className="text-body-xs text-grayscale-gray5">
          단, 이는 서비스 이용 약관 위반, 제재 이력 회원의 반복 가입 및 부정 이용(어뷰징) 행위 방지를 위한 최소한의 범위
          내 보관이며, 보관 기간 동안 해당 정보는 재가입 제한 및 분쟁 대응 목적으로만 이용됩니다.
        </span>
      </li>
      <li className="ms-[21px]">상담/입양 신청 정보: 상담 종료 또는 입양 확정 직후 파기</li>
      <li className="ms-[21px]">
        법령에 따른 보존: 관련 법령에 따라 일정 기간 보존이 필요할 경우 해당 기간 동안 보관 후 즉시 파기
        <ul className="list-disc">
          <li className="ms-[42px]">계약 또는 청약철회 관련 기록: 5년</li>
          <li className="ms-[42px]">소비자 불만 및 분쟁처리 기록: 3년</li>
          <li className="ms-[42px]">전자상거래 등에서의 표시·광고 기록: 6개월</li>
        </ul>
      </li>
    </ol>
  </div>,
  <div key={4} className="mb-5">
    <p>제4조 (개인정보의 제3자 제공)</p>
    <p>
      회사는 원칙적으로 회원의 개인정보를 외부에 제공하지 않습니다. 단, 상담/입양 신청 시 신청자가 작성한 개인정보는
      해당 브리더 회원에게 제공됩니다. 법령에 따라 수사기관이나 행정기관이 적법하게 요청하는 경우에는 예외적으로 제공될
      수 있습니다.
    </p>
    <p>
      회사는 입양 계약의 당사자가 아니며, 상담 및 입양 신청 과정에서 제공되는 개인정보는 브리더 회원과 입양자 간 상담 및
      의사결정을 지원하기 위한 목적으로만 제공됩니다. 입양 계약의 체결, 이행 및 그에 따른 법적 책임은 브리더 회원과
      입양자에게 있으며, 회사는 해당 계약에 관여하지 않습니다.
    </p>
  </div>,
  <div key={5} className="mb-5">
    <p>제5조 (개인정보 처리 위탁)</p>
    <p>
      회사는 개인정보 처리를 외부 업체에 위탁하지 않습니다. 다만 서비스 운영 과정에서 필요할 경우, 위탁 사실과 범위를
      사전에 고지하고 동의를 받습니다.
    </p>
  </div>,
  <div key={6} className="mb-5">
    <p>제6조 (개인정보 파기 절차 및 방법)</p>
    <ol className="list-decimal" start={1}>
      <li className="ms-[21px]">파기 절차: 보유기간 종료 또는 처리 목적 달성 시 지체 없이 파기</li>
      <li className="ms-[21px]">파기 방법: 전자 파일은 복구 불가능한 방법으로 영구 삭제, 종이 문서는 분쇄 또는 소각</li>
    </ol>
  </div>,
  <div key={7} className="mb-5">
    <p>제7조 (회원의 권리와 행사 방법)</p>
    <ol className="list-decimal" start={1}>
      <li className="ms-[21px]">회원은 언제든지 자신의 개인정보를 열람, 수정, 삭제, 처리정지 요구할 수 있습니다.</li>
      <li className="ms-[21px]">
        회원은 서비스 내 &apos;마이페이지&apos; 또는 고객센터를 통해 권리를 행사할 수 있습니다.
      </li>
      <li className="ms-[21px]">만 14세 미만 아동 회원의 경우, 법정대리인이 위 권리를 행사할 수 있습니다.</li>
      <li className="ms-[21px]">
        회원은 개인정보 제공에 대한 동의를 언제든지 철회할 수 있으며, 동의 철회 시 서비스 이용이 제한될 수 있습니다.
      </li>
    </ol>
  </div>,
  <div key={8} className="mb-5">
    <p>제8조 (개인정보의 안전성 확보 조치)</p>
    <p>회사는 개인정보가 분실·도난·누출·위조·변조되지 않도록 다음과 같은 조치를 취합니다.</p>
    <ul className="list-disc">
      <li className="ms-[21px]">개인정보 접근권한 최소화 및 관리</li>
      <li className="ms-[21px]">암호화 저장(비밀번호, 주요 개인정보)</li>
      <li className="ms-[21px]">네트워크 구간 TLS 암호화 전송</li>
      <li className="ms-[21px]">정기적 보안 점검 및 모니터링</li>
    </ul>
  </div>,
  <div key={9} className="mb-5">
    <p>제9조 (개인정보 보호책임자)</p>
    <p>회사는 개인정보 처리에 관한 업무를 총괄하여 책임지는 개인정보 보호책임자를 지정하고 있습니다.</p>
    <ul className="list-disc">
      <li className="ms-[21px]">성명: 양세빈</li>
      <li className="ms-[21px]">연락처: pawriendsofficial@gmail.com</li>
    </ul>
  </div>,
  <div key={10} className="mb-5">
    <p>제10조 (개정 및 고지 의무)</p>
    <p>
      본 개인정보처리방침은 시행일로부터 적용되며, 내용 추가·삭제·수정이 있을 시 시행일 최소 7일 전부터 공지사항을 통해
      안내합니다.
    </p>
    <ul className="list-disc">
      <li className="ms-[21px]">공고일자: 2025년 12월 21일</li>
      <li className="ms-[21px]">시행일자: 2025년 12월 23일</li>
    </ul>
  </div>,
];
