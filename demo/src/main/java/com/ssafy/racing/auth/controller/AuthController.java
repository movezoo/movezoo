package com.ssafy.racing.auth.controller;

import com.ssafy.racing.auth.dto.EmailMessage;
import com.ssafy.racing.auth.dto.EmailPostDto;
import com.ssafy.racing.auth.dto.EmailResponseDto;
import com.ssafy.racing.auth.sevice.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/email-auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final EmailService emailService;

    // 비밀번호 찾기 시 비밀번호 변경 후 메일로 전송
    @PostMapping("/reset-password")
    public ResponseEntity<EmailMessage> sendPasswordMail(@RequestBody EmailPostDto emailPostDto) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(emailPostDto.getEmail())
                .subject("[천하제일자동차대회] 비밀번호 재발급 안내입니다.")
                .build();

        emailService.sendMail(emailMessage, "password");

        return ResponseEntity.ok().body(emailMessage);
    }

    // 회원가입 시 이메일로 인증코드 발송 후 인증가능하도록 함
    @PostMapping("/create-certification")
    public ResponseEntity<EmailMessage> sendJoinMail(@RequestBody EmailPostDto emailPostDto) {
        log.info("/email-auth/create-certification");
        EmailMessage emailMessage = EmailMessage.builder()
                .to(emailPostDto.getEmail())
                .subject("[천하제일자동차대회] 이메일 인증 코드 발송")
                .build();

        String code = emailService.sendMail(emailMessage, "email");

        EmailResponseDto emailResponseDto = new EmailResponseDto();
        emailResponseDto.setCode(code);


        return ResponseEntity.ok().body(emailMessage);
//        return new ResponseEntity<>(emailPostDto, HttpStatus.OK);
    }
}