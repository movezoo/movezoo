package com.ssafy.racing.auth.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrfConfig) -> csrfConfig.disable())
                .headers((headerConfig) ->
                        headerConfig.frameOptions(frameOptionsConfig ->
                                frameOptionsConfig.disable()
                        )
                )
                .authorizeHttpRequests((authorizeRequests) ->
                        authorizeRequests
                                .requestMatchers(PathRequest.toH2Console()).permitAll() // 인증 절차없이 허용
                                .requestMatchers("/", "/login/**").permitAll()
//                                .requestMatchers().hasRole()    // 권한에 따른 접근제한
                                .anyRequest().authenticated()   // authenticated(): 인증(로그인)이 필요함
                )
//                .exceptionHandling((exceptionConfig)->exceptionConfig.authenticationEntryPoint(unauthoriedEntryPoint).accessDeniedHandler(accessDeniedHandler))
                .formLogin((formLogin) ->
                        formLogin
                                .loginPage("/login/login")
                                .usernameParameter("userEmail")
                                .passwordParameter("password")
                                .loginProcessingUrl("/login/login-proc")
                                .defaultSuccessUrl("/", true)
                )
                .logout((logoutConfig) ->
                        logoutConfig.logoutSuccessUrl("/")
                );

        return http.build();
    }
}