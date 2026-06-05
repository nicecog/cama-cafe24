package com.cama.back.util;


import org.apache.commons.codec.binary.Hex;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class AESUtils {

    private static final String AES_KEY = "kkmouke0917";

    private AESUtils() {
        throw new RuntimeException();
    }

    /**
     * 암호화
     */
    public static String encrypt(String str) {

        try {

            String sha512String = getSHA512(AES_KEY);
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, getKeySpec(sha512String));
            return new String(Hex.encodeHex(cipher.doFinal(str.getBytes(StandardCharsets.UTF_8)))).toUpperCase();

        } catch (Exception e) {
            e.printStackTrace();
            return str;
        }

    }

    /**
     * 복호화
     */
    public static String decrypt(String str) {

        try {

            String sha512String = getSHA512(AES_KEY);
            byte[] unhexByteArray = Hex.decodeHex(str.toCharArray());
            Cipher encryptCipher = Cipher.getInstance("AES");
            encryptCipher.init(Cipher.DECRYPT_MODE, getKeySpec(sha512String));
            return new String(encryptCipher.doFinal(unhexByteArray), StandardCharsets.UTF_8);

        } catch (Exception e) {
            e.printStackTrace();
            return str;
        }
    }

    private static String getSHA512(String key) throws NoSuchAlgorithmException {

        byte[] bytes = key.getBytes(StandardCharsets.UTF_8);

        MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
        StringBuilder sb = new StringBuilder();
        for (int i : messageDigest.digest(bytes)) {
            sb.append(String.format("%02x", 0XFF & i));
        }

        return sb.toString();
    }


    private static SecretKeySpec getKeySpec(final String key) {

        final byte[] finalKey = new byte[16];
        int i = 0;
        for (byte b : key.getBytes(StandardCharsets.UTF_8)) {
            finalKey[i++ % 16] ^= b;
        }

        return new SecretKeySpec(finalKey, "AES");
    }
}