package com.cama.tablet.service;

import com.cama.tablet.dto.QrPayload;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class QrPayloadParser {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TabletQrTokenService tokenService;

    public QrPayload parse(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("QR payload is empty");
        }
        String trimmed = raw.trim();

        if (looksLikeJwt(trimmed)) {
            return tokenService.verifyToPayload(trimmed);
        }

        if (trimmed.startsWith("{")) {
            try {
                JsonNode node = objectMapper.readTree(trimmed);
                int version = node.path("v").asInt(1);
                String token = textOrNull(node, "t");
                if (version >= 2 || token != null) {
                    if (token == null) {
                        throw new IllegalArgumentException("v2 QR에는 서명 토큰(t)이 필요합니다.");
                    }
                    return tokenService.verifyToPayload(token);
                }
                QrPayload legacy = objectMapper.treeToValue(node, QrPayload.class);
                rejectLegacyIfRequired(legacy);
                return legacy;
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid JSON QR payload");
            }
        }

        if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("cama-tablet:")) {
            Map<String, String> params = UriComponentsBuilder.fromUriString(
                    trimmed.contains("?") ? trimmed : "https://x/?" + trimmed.substring(trimmed.indexOf(':') + 1)
            ).build().getQueryParams().toSingleValueMap();

            String token = params.get("t");
            if (token != null && !token.isBlank()) {
                return tokenService.verifyToPayload(token);
            }

            if (params.containsKey("loginId")) {
                QrPayload p = new QrPayload();
                p.setLoginId(params.get("loginId"));
                if (params.containsKey("accountSeq")) {
                    p.setAccountSeq(Long.parseLong(params.get("accountSeq")));
                }
                rejectLegacyIfRequired(p);
                return p;
            }
        }

        throw new IllegalArgumentException("Unsupported QR format");
    }

    private void rejectLegacyIfRequired(QrPayload legacy) {
        if (tokenService.isRequireSigned()) {
            throw new IllegalArgumentException("서명된 QR(v2)만 사용할 수 있습니다. 환자 앱에서 새 QR을 발급해 주세요.");
        }
    }

    private static boolean looksLikeJwt(String value) {
        return value.chars().filter(ch -> ch == '.').count() == 2 && value.startsWith("eyJ");
    }

    private static String textOrNull(JsonNode node, String field) {
        JsonNode child = node.get(field);
        if (child == null || child.isNull()) {
            return null;
        }
        String text = child.asText();
        return text.isBlank() ? null : text;
    }
}
