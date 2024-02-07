package com.ssafy.movezoo.auth.config.details;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class OAuthCustomSuccesHandler extends SimpleUrlAuthenticationSuccessHandler {

    // Security가 요청을 가로챈 경우 사용자가 원래 요청했던 URI 정보를 저장한 객체
    private RequestCache requestCache = new HttpSessionRequestCache();
    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        setDefaultTargetUrl("/");

        SavedRequest savedRequest = requestCache.getRequest(request, response);

        log.info("소셜 로그인 성공 - 사용자명: {}", userDetails.getUsername());

        // 있을 경우 URI 등 정보를 가져와서 사용
        if (savedRequest != null){
            String targetUrl = savedRequest.getRedirectUrl();
            redirectStrategy.sendRedirect(request, response, targetUrl);
        } else {
            redirectStrategy.sendRedirect(request, response, getDefaultTargetUrl());
        }


        // 세션에 사용자 정보 저장
        HttpSession session = request.getSession();
        session.setAttribute("user", userDetails);

        UserDetails userDetails2 = (UserDetails)session.getAttribute("user");
        log.info("session get oauth2 {} ", userDetails2.getUsername());

        response.setStatus(HttpServletResponse.SC_OK);
    }

}
