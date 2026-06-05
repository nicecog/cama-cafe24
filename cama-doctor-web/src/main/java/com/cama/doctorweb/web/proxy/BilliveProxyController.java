package com.cama.doctorweb.web.proxy;

import com.cama.doctorweb.config.CamaProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;

/**
 * 기존 React 앱이 호출하던 https://api.billive.me 를 동일 출처 /proxy 로 우회합니다.
 * 브라우저는 api_key: Bearer &lt;token&gt; 헤더를 그대로 전달하면 서버가 Billive로 전달합니다.
 */
@Slf4j
@RestController
@RequestMapping("/proxy")
public class BilliveProxyController {

    private final RestTemplate restTemplate;
    private final CamaProperties camaProperties;

    @Autowired
    public BilliveProxyController(
            @Qualifier("billiveRestTemplate") RestTemplate restTemplate,
            CamaProperties camaProperties
    ) {
        this.restTemplate = restTemplate;
        this.camaProperties = camaProperties;
    }

    @RequestMapping(value = "/**")
    public ResponseEntity<byte[]> proxy(HttpServletRequest request)
            throws URISyntaxException, IOException {
        String base = camaProperties.getBillive().getBaseUrl();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }

        String contextPath = request.getContextPath() == null ? "" : request.getContextPath();
        String prefix = contextPath + "/proxy";
        String uri = request.getRequestURI();
        if (!uri.startsWith(prefix)) {
            return ResponseEntity.badRequest().build();
        }
        String remainder = uri.substring(prefix.length());
        String query = request.getQueryString();
        String target = base + remainder + (query != null && !query.isEmpty() ? "?" + query : "");

        HttpHeaders forwardHeaders = new HttpHeaders();
        String apiKey = request.getHeader("api_key");
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = request.getHeader("Authorization");
        }
        if (apiKey != null && !apiKey.isBlank()) {
            forwardHeaders.put("api_key", Collections.singletonList(apiKey));
        }
        String contentType = request.getContentType();
        if (contentType != null && !contentType.isBlank()) {
            try {
                forwardHeaders.setContentType(MediaType.parseMediaType(contentType));
            } catch (Exception ignored) {
                forwardHeaders.add(HttpHeaders.CONTENT_TYPE, contentType);
            }
        }
        String accept = request.getHeader(HttpHeaders.ACCEPT);
        if (accept != null && !accept.isBlank()) {
            forwardHeaders.set(HttpHeaders.ACCEPT, accept);
        }

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        byte[] body = readRequestBody(request, method);
        HttpEntity<byte[]> entity = new HttpEntity<>(body, forwardHeaders);

        try {
            ResponseEntity<byte[]> upstream = restTemplate.exchange(new URI(target), method, entity, byte[].class);
            HttpHeaders out = new HttpHeaders();
            if (upstream.getHeaders().getContentType() != null) {
                out.setContentType(upstream.getHeaders().getContentType());
            }
            return new ResponseEntity<>(upstream.getBody(), out, upstream.getStatusCode());
        } catch (RestClientException e) {
            log.error("Billive 프록시 실패: {} {}", method, target, e);
            throw e;
        }
    }

    /**
     * multipart/form-data 포함 원본 바이트를 그대로 Billive로 전달합니다.
     * {@code @RequestBody}는 multipart 경계를 깨뜨릴 수 있어 InputStream을 사용합니다.
     */
    private static byte[] readRequestBody(HttpServletRequest request, HttpMethod method) throws IOException {
        if (method == HttpMethod.GET || method == HttpMethod.HEAD || method == HttpMethod.OPTIONS) {
            return null;
        }
        return request.getInputStream().readAllBytes();
    }
}
