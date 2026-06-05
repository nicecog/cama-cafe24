package com.cama.back.service.account;


import com.cama.back.domain.account.Account;
import com.cama.back.domain.admin.CmAdmin;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.domain.firebase.Firebase;
import com.cama.back.dto.account.AccountRequest;
import com.cama.back.dto.account.ChangeLoginIdRequest;
import com.cama.back.dto.account.ChangeLoginIdResponse;
import com.cama.back.dto.account.SnsRequest;
import com.cama.back.dto.sns.SnsRsp;
import org.springframework.http.ResponseEntity;

public interface AccountService {

    // 로그인
    Account login(String loginId, String password);

    // 로그인
    Account loginPassApp(String impUid);

    // 로그인
    CmDoctor loginDoctor(String loginId, String password);

    // 관리자
    CmAdmin loginAdmin(String loginId, String password);

    void signUpDefault(AccountRequest accountRequest);

    void signUpGeneralDefault(AccountRequest accountRequest);

    void signUpSns(AccountRequest accountRequest);

    void firebaseToken(Account account, Firebase firebase);

    SnsRsp snsData(SnsRequest dto, boolean appleCheck);

    // 카카오 연결끊기
    ResponseEntity<String> dropKakao(String token);

    // 네이버 연결끊기
    ResponseEntity<String> dropNaver(String token);

    ChangeLoginIdResponse changeLoginId(Long accountSeq, String currentLoginId, ChangeLoginIdRequest request);

}
