package com.ssafy.movezoo.auth.config.details;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuthCustomSuccesHandler extends SimpleUrlAuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        log.info("소셜 로그인 성공 - 사용자명: {}", userDetails.getUsername());

        // 세션에 사용자 정보 저장
        HttpSession session = request.getSession();
        session.setAttribute("user", userDetails);

        UserDetails userDetails2 = (UserDetails)session.getAttribute("user");
        log.info("session get oauth2 {} ", userDetails2.getUsername());

        response.setStatus(HttpServletResponse.SC_OK);
        response.sendRedirect("/main");
    }

}
