package com.ssafy.movezoo.auth.controller;

import com.ssafy.movezoo.auth.dto.EmailMessage;
import com.ssafy.movezoo.auth.dto.EmailPostDto;
import com.ssafy.movezoo.auth.dto.EmailResponseDto;
import com.ssafy.movezoo.auth.sevice.EmailService;
import com.ssafy.movezoo.user.dto.MessageDto;
import com.ssafy.movezoo.user.dto.StatusEnum;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

//@RequestMapping("/email-auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final EmailService emailService;

    // 비밀번호 찾기 시 비밀번호 변경 후 메일로 전송
    @PostMapping("/email-auth/reset-password")
    public ResponseEntity<EmailMessage> sendPasswordMail(@RequestBody EmailPostDto emailPostDto) {
        EmailMessage emailMessage = EmailMessage.builder()
                .to(emailPostDto.getEmail())
                .subject("[천하제일자동차대회] 비밀번호 재발급 안내입니다.")
                .build();

        emailService.sendMail(emailMessage, "password");

        return ResponseEntity.ok().body(emailMessage);
    }

    // 회원가입 시 이메일로 인증코드 발송 후 인증가능하도록 함
    @PostMapping("/email-auth/create-certification")
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

    // 로그인
//    @PostMapping("/login")
//    public ResponseEntity<MessageDto> login(@RequestBody LoginRequestDto dto, HttpServletRequest httpServletRequest){
//        User user = loginService.login(dto.getUserEmail(), dto.getPassword());
//
//        // 로그인 성공 => 세션 생성
//
//        // 세션 생성 전 기존의 세션 파기    // 필요한가
////        httpServletRequest.getSession().invalidate();
//        HttpSession session = httpServletRequest.getSession(true);
//        // 세션에 userId를 넣어줌
//        session.setAttribute("userId", user.getUserId());
//        session.setMaxInactiveInterval(1800);   // 30min
//
//        MessageDto msg = MessageDto.builder()
//                .status(StatusEnum.OK)
//                .message("로그인 성공")
//                .build();
//
//        return ResponseEntity.ok().body(msg);
//    }

    // 사용자 인증 체크용
    @GetMapping("/check-auth")
    public void check() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            // 사용자가 인증되어 있을 때
            System.out.println("Authenticated user: " + authentication.getName());

            // 사용자의 권한 확인
            if (authentication.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ADMIN"))) {
                // 사용자가 ADMIN 권한을 가지고 있을 때
                System.out.println("Welcome, ADMIN!");
            } else {
                // 다른 권한을 가지고 있을 때
                System.out.println("Welcome, USER!");
            }
        } else {
            // 사용자가 인증되어 있지 않을 때
            System.out.println("User not authenticated");
        }
    }

    // 로그아웃
//    @GetMapping("/logout")
//    public ResponseEntity<MessageDto> logout(HttpServletRequest httpServletRequest){
//        HttpSession session = httpServletRequest.getSession(false);
//        if (session != null){
//            session.invalidate();
//        }
//
//        MessageDto msg = MessageDto.builder()
//                .status(StatusEnum.OK)
//                .message("로그아웃 성공")
//                .build();
//
//        return ResponseEntity.ok().body(msg);
//    }
}