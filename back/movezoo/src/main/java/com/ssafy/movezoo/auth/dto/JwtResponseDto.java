package com.ssafy.movezoo.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JwtResponseDto {

    /** 처리 결과에 대한 메시지 */
    private String message;

    /** 처리 상태 (성공 또는 에러) */
    private Status status;

    /** 예외 타입 (에러가 발생한 경우에 사용) */
    private String exceptionType;

    /** 생성된 JWT 문자열 */
    private String jwt;

    /** 디코딩된 JWS (JSON Web Signature) 객체 */
    private Jws<Claims> jws;


    // 처리 결과가 성공일 경우에 사용되는 생성자.
    // 생성된 JWT 문자열
    public JwtResponseDto(String jwt) {
        this.jwt = jwt;
        this.status = Status.SUCCESS;
    }

    // 처리 결과가 성공일 경우에 사용되는 생성자.
    // 디코딩된 JWS 객체
    public JwtResponseDto(Jws<Claims> jws) {
        this.jws = jws;
        this.status = Status.SUCCESS;
    }

     // 처리 상태를 나타내는 열거형 타입
    public enum Status {
        SUCCESS, ERROR
    }
}
