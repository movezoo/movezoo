package com.ssafy.movezoo.auth.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.movezoo.auth.config.details.CustomOAuth2Service;
import com.ssafy.movezoo.auth.config.details.CustomUserDetailsService;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.UserResponseDto;
import com.ssafy.movezoo.user.sevice.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity  // security 활성화 후 기본 스프링 필터체인에 등록
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig{

    private final CustomUserDetailsService UserDetailsServcie;
    private final CustomOAuth2Service customOAuth2Service;
    private final OAuthCustomSuccesHandler oAuthCustomSuccesHandler;
    private final UserService userService;

    AuthenticationEntryPoint authenticationEntryPoint;
    AccessDeniedHandler accessDeniedHandler;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000/","https://i10e204.p.ssafy.io/")); // 모든 도메인 허용
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Custom-Header"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600000L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        HttpSessionRequestCache requestCache = new HttpSessionRequestCache();
        requestCache.setMatchingRequestParameterName(null);

        // 인증 관리
        http
                .csrf(CsrfConfigurer::disable).cors(Customizer.withDefaults())// Cross site request forgery 비활성화
                //                .headers((headerConfig) ->  // 보안 헤더를 구성하며, iframe에 임베딩을 허용하도록 프레임 옵션을 비활성화
                //                        headerConfig.frameOptions(frameOptionsConfig ->
                //                                frameOptionsConfig.disable()
                //                        )
                //                )

                // 로그인 후 ?continue 가 붙는 것에 대한 해결
                .requestCache((request) ->
                        request.requestCache(requestCache))

                //  form 기반 로그인
                .formLogin((formLogin) ->
                                formLogin
                                        .loginPage("/")  // GET, 사용자 정의 로그인 페이지   // 설정자체를 안해야지 default로 제공해주는 페이지로 연결됨
                                        .usernameParameter("userEmail") // 로그인 폼에서 사용자 이름 및 비밀번호 매개변수를 지정
                                        .passwordParameter("password")
                                        .loginProcessingUrl("/api/login")   // POST, 로그인 submit 처리 URL
//                                    .defaultSuccessUrl("/main", true)    // 로그인 성공 시 홈 페이지로 리디렉션
//                                    .failureUrl("/main")
                                        .successHandler(new AuthenticationSuccessHandler() {
                                            @Override
                                            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                                                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                                                log.info("로그인 성공 - 사용자명: {}", userDetails.getUsername());

                                                // 세션에 사용자 정보 저장
                                                HttpSession session = request.getSession();
                                                session.setAttribute("user", userDetails);

                                                UserDetails userDetails2 = (UserDetails) session.getAttribute("user");
                                                log.info("session get {}", userDetails2.getUsername());

                                                User findUser = userService.findById(Integer.parseInt(userDetails.getUsername()));
                                                UserResponseDto userResponseDto = new UserResponseDto(findUser);

                                                log.info("login find user {}", userResponseDto.toString());

                                                Map<String, UserResponseDto> userMap = new HashMap<>();
                                                userMap.put("loginUser", userResponseDto);

                                                ObjectMapper objectMapper = new ObjectMapper();

                                                //json, encoding설정
                                                response.setContentType("application/json");
                                                response.setCharacterEncoding("utf-8");

                                                response.getWriter().write(objectMapper.writeValueAsString(userMap));
                                                // 성공 응답을 생성하거나 추가 작업 수행
                                                response.setStatus(HttpServletResponse.SC_OK);
                                            }
                                        })
                                        .failureHandler(new AuthenticationFailureHandler() {
                                            @Override
                                            public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                                                log.info("로그인 실패");
                                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                            }
                                        })
                )
                .logout((logoutConfig) ->   // 로그아웃 처리 및 로그아웃 후 홈 페이지로 리디렉션
                        logoutConfig
                                .logoutUrl("/api/logout")   // logout 처리 url
                                .logoutSuccessUrl("/")
                                .invalidateHttpSession(true)
                                .deleteCookies("JSESSIONID")
                )
                .userDetailsService(UserDetailsServcie)
                .oauth2Login(Customizer.withDefaults());

        // 인가 관리
        http
                .sessionManagement((session) ->
                        session
                                .maximumSessions(1) // 최대 허용 가능 세션 수 (-1: 무제한 세션 허용)
                                .maxSessionsPreventsLogin(true) // 동시 로그인 차단 (false: 기존 세션 만료, default)
                                .expiredUrl("/") // 세션이 만료된 경우 이동할 페이지


                );
        // 인증 및 인가(권한) 오류에 대한 예외 처리
        http
                .exceptionHandling((exception) ->
                        exception
                                .authenticationEntryPoint(authenticationEntryPoint) // 인증되지 않은 사용자
                                .accessDeniedHandler(accessDeniedHandler)  // 인증되었으나 권한이 없는 사용자
                );

        // 접근 관리
        http
                .authorizeHttpRequests((authorizeRequests) ->
                                authorizeRequests
                                        .requestMatchers("/**", "/api/login/**", "/api/login").permitAll()  // login 인증 절차없이 허용
//                                    .requestMatchers("/user").anonymous() // 인증되지 않은 사용자만 접근
//                                    .requestMatchers("/user/**").hasRole(UserRole.USER.name())    // 권한을 가진 사람만 접근 가능, hasAnyRole("","")
                                        .anyRequest().authenticated()   // authenticated(): 인증(로그인)한 사용자만 접근
                );

        // OAuth
        http
                .oauth2Login((oauth2Login) ->
                                oauth2Login
                                        .loginPage("/")
                                        .userInfoEndpoint((userInfoEndpointConfig -> userInfoEndpointConfig // OAuth2 로그인 성공 후 가져올 설정들
                                                .userService(customOAuth2Service))) // 서버에서 사용자 정보를 가져온 상태에서 추가로 진행하고자 하는 기능 명시
//                                .successHandler(successHandler())
                                        .successHandler(oAuthCustomSuccesHandler)
                );

        return http.build();
    }
    private AuthenticationSuccessHandler successHandler() {
        return new SimpleUrlAuthenticationSuccessHandler("/main"); // 로그인 성공 후 /main으로 이동
    }
}