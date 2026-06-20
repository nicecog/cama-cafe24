package com.cama.tablet.service;

import com.cama.tablet.config.TabletQrProperties;
import com.cama.tablet.dto.QrPayload;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TabletQrTokenServiceTest {

    @Test
    void issueAndVerifyRoundTrip() {
        TabletQrProperties props = new TabletQrProperties();
        props.setSecret("test-secret");
        props.setTtlSeconds(60);
        TabletQrTokenService service = new TabletQrTokenService(props);

        TabletQrTokenService.IssuedToken issued = service.issue(558L, "patient01");
        assertTrue(issued.getQrPayload().contains("\"v\":2"));
        assertTrue(issued.getQrPayload().contains("\"t\":"));

        QrPayload payload = service.verifyToPayload(issued.getToken());
        assertEquals(558L, payload.getAccountSeq());
        assertEquals("patient01", payload.getLoginId());
        assertEquals(2, payload.getV());
    }

    @Test
    void expiredTokenRejected() throws InterruptedException {
        TabletQrProperties props = new TabletQrProperties();
        props.setSecret("test-secret");
        props.setTtlSeconds(1);
        TabletQrTokenService service = new TabletQrTokenService(props);

        String token = service.issue(1L, "u").getToken();
        Thread.sleep(1100L);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.verifyToPayload(token)
        );
        assertTrue(ex.getMessage().contains("만료"));
    }
}
