package com.cama.back.util;

import com.cama.back.AppContext;
import com.cama.back.domain.api.BizMsg;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class KakaoAlimtalkUtils {

    private static final String PROFILE_KEY = "cfab315ee8a312de6b18543d7746746b2b7b2982";
    private static final String TALK_URL = "https://alimtalk-api.bizmsg.kr";


    public static void pushTalk(BizMsg bizMsg) {

        for (String phone : bizMsg.getPhone()) {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> params = new HashMap<>();
            params.put("message_type", "at");
            params.put("profile", PROFILE_KEY);

            params.put("phn", phone);

            params.put("tmplId", bizMsg.getTemplateCode());
            params.put("msg", bizMsg.getMsg());


            Map<String, Object> btnMap = new HashMap<>();
            //btnMap.put("name", "유상판 공식 온라인");
            //btnMap.put("type", "WL");

            //btnMap.put("url_mobile", "https://www.youfacepan.com");
            //btnMap.put("url_pc", "https://www.youfacepan.com");

            //params.put("button1", btnMap);

            String body = AppContext.GSON.toJson(Collections.singletonList(params));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
            headers.add("userid", "simplay1019");

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(TALK_URL + "/v2/sender/send", entity, String.class);
        }


    }

}
