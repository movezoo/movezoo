package com.ssafy.movezoo.auth.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Map;


public class JWTDecoderUtil {

    public static Map<String, Object>  decodeJWTTokenHeader(String token) throws JsonProcessingException {
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String[] chunks = token.split("\\.");

        // 토큰을 각 섹션(Header, Payload, Signature)으로 분할
        String header = new String(decoder.decode(chunks[0]));

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> headerResult = objectMapper.readValue(header, Map.class);

        return headerResult;
    }
    public static Map<String, Object>  decodeJWTTokenPayload(String token) throws JsonProcessingException {
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String[] chunks = token.split("\\.");

        String payload = new String(decoder.decode(chunks[1]));

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> payloadResult = objectMapper.readValue(payload, Map.class);

        return payloadResult;
    }

    public static boolean isTokenValid(String token, String secretKey) throws Exception {
        String alg = (String) decodeJWTTokenHeader(token).get("alg");

        // 서명 알고리즘에 따라 시크릿 키 생성
        SecretKeySpec secretKeySpec;
        if (alg.equals("HS256")){   // HS256
            secretKeySpec = new SecretKeySpec(secretKey.getBytes(), SignatureAlgorithm.HS256.getJcaName());
        } else {    // RS256
            secretKeySpec = new SecretKeySpec(secretKey.getBytes(), SignatureAlgorithm.RS256.getJcaName());
        }

        // JWT 파서를 생성하고, 시크릿 키를 설정
        JwtParser jwtParser = Jwts.parser()
                .setSigningKey(secretKeySpec)
                .build();

        System.out.println(secretKey);
        System.out.println(secretKeySpec);

        try {
            jwtParser.parse(token);     // 토큰을 파싱해서 유효성 검사
        } catch (Exception e) {
            throw new Exception("Could not verify JWT token integrity!", e);
        }

        return true;
    }
}