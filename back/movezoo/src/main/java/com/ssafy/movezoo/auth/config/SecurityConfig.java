    package com.ssafy.movezoo.auth.config;

    import com.ssafy.movezoo.auth.config.oauth.UserDetailsServiceImpl;
    import com.ssafy.movezoo.user.dto.UserRole;
    import lombok.RequiredArgsConstructor;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.web.AuthenticationEntryPoint;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.access.AccessDeniedHandler;

    @Configuration
    @EnableWebSecurity  // security 활성화 후 기본 스프링 필터체인에 등록
    @RequiredArgsConstructor
    public class SecurityConfig {

        private final UserDetailsServiceImpl UserDetailsServcie;
        AuthenticationEntryPoint authenticationEntryPoint;
        AccessDeniedHandler accessDeniedHandler;
//        private final AuthenticationEntryPoint authenticationEntryPoint;
//        private final AccessDeniedHandler accessDeniedHandler;

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

            // 인증 관리

            http
                    .csrf((csrfConfig) -> csrfConfig.disable()) // Cross site request forgery 비활성화
    //                .headers((headerConfig) ->  // 보안 헤더를 구성하며, iframe에 임베딩을 허용하도록 프레임 옵션을 비활성화
    //                        headerConfig.frameOptions(frameOptionsConfig ->
    //                                frameOptionsConfig.disable()
    //                        )
    //                )
                    // 접근 관리
                    .authorizeHttpRequests((authorizeRequests) ->
                            authorizeRequests
                                    .requestMatchers("/**","/login/**", "/login").permitAll()  // login 인증 절차없이 허용
                                    .requestMatchers("/users").anonymous() // 인증되지 않은 사용자만 접근
                                    .requestMatchers("/users/**").hasRole(UserRole.USER.name())    // 권한을 가진 사람만 접근 가능, hasAnyRole("","")
                                    .anyRequest().authenticated()   // authenticated(): 인증(로그인)한 사용자만 접근
                    )
                    //  form 기반 로그인
                    .formLogin((formLogin) ->
                            formLogin
    //                                .loginPage("/login")  // GET, 사용자 정의 로그인 페이지   // 설정자체를 안해야지 default로 제공해주는 페이지로 연결됨
                                    .usernameParameter("useremail") // 로그인 폼에서 사용자 이름 및 비밀번호 매개변수를 지정
                                    .passwordParameter("password")
                                    .loginProcessingUrl("/api/login/login-proc")   // POST, 로그인 submit 처리 URL
                                    .defaultSuccessUrl("/success", true)    // 로그인 성공 시 홈 페이지로 리디렉션
                                    .failureUrl("/login?error=true")
                    )
                    .logout((logoutConfig) ->   // 로그아웃 처리 및 로그아웃 후 홈 페이지로 리디렉션
                            logoutConfig
//                                    .logoutUrl("/logout")   // logout 처리 url
                                    .logoutSuccessUrl("/login")
                                    .invalidateHttpSession(true)
                                    .deleteCookies("JSESSIONID")
                    )
                    .userDetailsService(UserDetailsServcie);

            // 인가 관리
            http
                .sessionManagement((session) ->
                        session
                                .maximumSessions(1) // 최대 허용 가능 세션 수 (-1: 무제한)
                                .maxSessionsPreventsLogin(true) // 동시 로그인 차단 (false: 기존 세션 만료, default)
                                .expiredUrl("/expired") // 세션이 만료된 경우 이동할 페이지
                );
            // 인증 및 인가(권한) 오류에 대한 예외 처리
            http
                .exceptionHandling((exception)->
                        exception
                                .authenticationEntryPoint(authenticationEntryPoint) // 인증되지 않은 사용자
                                .accessDeniedHandler(accessDeniedHandler)  // 인증되었으나 권한이 없는 사용자
                );



            return http.build();
        }
    }