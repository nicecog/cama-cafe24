package com.cama.back.util;

import com.cama.back.domain.common.CommonDate;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Pattern;

import static java.util.regex.Pattern.matches;

@Component
public class JhUtil {

    public boolean checkEmail(String email) {
        return matches("[\\w~\\-.+]+@[\\w~\\-]+(\\.[\\w~\\-]+)+", email);
    }

    public boolean checkNull(Object obj) {
        return ObjectUtils.anyNotNull(obj);
    }

    public boolean checkSamePassword(String newPwd1, String newPwd2) {
        return newPwd1.equalsIgnoreCase(newPwd2);
    }

    public boolean checkPassword(String password) {


        //'숫자', '문자', '특수문자' 무조건 1개 이상, 비밀번호 '최소 8자에서 최대 20자'까지 허용
        // (특수문자는 정의된 특수문자만 사용 가능)
        // ^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$

        return matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\\d~!@#$%^&*()+|=]{8,12}$", password);
    }

    public String dashRemoveAndTrim(String value) {
        String trim = value.trim();
        return trim.replaceAll("(-+)|( +)", "");
    }

    public boolean checkPhone(String phone) {
        return matches("^(0|1){3}(\\d){3,4}(\\d){4}$", phone);
    }

    public boolean isCheckId(String id) {
        return Pattern.matches("^[a-zA-Z0-9]{4,20}$", id);
    }

    public boolean checkPasswordLength(int minLength, String password) {
        return password.length() <= minLength;
    }

    public String uuid() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    public String numberGenerator(int len, int dupCd) {

        Random rand = new Random();
        String numStr = ""; //난수가 저장될 변수

        for (int i = 0; i < len; i++) {

            //0~9 까지 난수 생성
            String ran = Integer.toString(rand.nextInt(10));

            if (dupCd == 1) {
                //중복 허용시 numStr에 append
                numStr += ran;
            } else if (dupCd == 2) {
                //중복을 허용하지 않을시 중복된 값이 있는지 검사한다
                if (!numStr.contains(ran)) {
                    //중복된 값이 없으면 numStr에 append
                    numStr += ran;
                } else {
                    //생성된 난수가 중복되면 루틴을 다시 실행한다
                    i -= 1;
                }
            }
        }
        return numStr;
    }

    public String makeInviteCode() {
        String middle = numberGenerator(7, 1);
        String last = generateRandomAlphabet(5);
        return middle + last;
    }

    public String generateRandomAlphabet(int count) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(count);
        for (int i = 0; i < count; i++)
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        return sb.toString();
    }

    public String generateRandomString(int count) {
        String chars = "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(count);
        for (int i = 0; i < count; i++)
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        return sb.toString();
    }

    public boolean isoDateFormatterChecker(String date) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate.parse(date, formatter);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    /**
     * 해당월
     */
    public CommonDate firstLastDate() {

        LocalDate date = LocalDate.now(ZoneId.of("Asia/Seoul"));
        LocalDate first = date.with(TemporalAdjusters.firstDayOfMonth());

        LocalDate last = date.with(TemporalAdjusters.lastDayOfMonth());

        return CommonDate.builder()
                .startDate(first.toString())
                .endDate(last.toString())
                .build();

    }


}