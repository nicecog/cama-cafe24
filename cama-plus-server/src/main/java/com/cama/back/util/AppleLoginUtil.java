package com.cama.back.util;

import com.cama.back.AppContext;
import com.cama.back.domain.apple.IdTokenPayload;
import com.cama.back.domain.apple.TokenResponse;
import com.google.common.io.ByteStreams;
import com.google.common.io.CharSource;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.Reader;
import java.security.PrivateKey;
import java.util.Date;

@Component
public class AppleLoginUtil {

    private static final String APPLE_AUTH_URL = "https://appleid.apple.com/auth/token";

    private static final String KEY_ID = "NXTYWV777K";
    private static final String TEAM_ID = "4P67S664DY";
    private static final String CLIENT_ID = "com.camaplus.app";

    private static final String authKeyPath = "apple/AuthKey_NXTYWV777K.p8";

    private static PrivateKey pKey;


    private static PrivateKey getPrivateKey() throws IOException {
        //read your key
        byte[] buffer = ByteStreams.toByteArray(new ClassPathResource(authKeyPath).getInputStream());
        Reader targetReader = CharSource.wrap(new String(buffer)).openStream();
        final PEMParser pemParser = new PEMParser(targetReader);
        final JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        final PrivateKeyInfo object = (PrivateKeyInfo) pemParser.readObject();
        return converter.getPrivateKey(object);

    }

    private static String generateJWT() {
        if (pKey == null) {
            try {
                pKey = getPrivateKey();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return Jwts.builder()
                .setHeaderParam(JwsHeader.KEY_ID, KEY_ID)
                .setIssuer(TEAM_ID)
                .setAudience("https://appleid.apple.com")
                .setSubject(CLIENT_ID)
                .setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 5)))
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .signWith(pKey, SignatureAlgorithm.ES256)
                .compact();
    }


    public static IdTokenPayload appleAuth(String authorizationCode) {

        String token = generateJWT();

        MultiValueMap<String, String> param = new LinkedMultiValueMap<>();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(param, headers);

        param.add("client_id", CLIENT_ID);
        param.add("client_secret", token);
        param.add("grant_type", "authorization_code");
        param.add("code", authorizationCode);

        ResponseEntity<String> res = new RestTemplate().exchange(APPLE_AUTH_URL, HttpMethod.POST, request, String.class);

        TokenResponse tokenResponse = AppContext.GSONC.fromJson(res.getBody(), TokenResponse.class);
        String idToken = tokenResponse.getIdToken();
        String payload = idToken.split("\\.")[1];//0 is header we ignore it for now
        String decoded = new String(Decoders.BASE64.decode(payload));
        //decoded -> {"iss":"https://appleid.apple.com","aud":"com.aintop.decopapp","exp":1666675271,"iat":1666588871,"sub":"001942.86732c68a8934bc2bd203325916b3697.0440","nonce":"2f729abe3cd911afc8bcdd19cec1bb04f1d81a42501c92b824f5bda1f2d9b173","at_hash":"3Rg_bPEBcCl2Aa_qCGOpzw","email":"starctak@gmail.com","email_verified":"true","auth_time":1666588821,"nonce_supported":true}
        return AppContext.GSONC.fromJson(decoded, IdTokenPayload.class);
    }

}
