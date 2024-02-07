package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        log.info("일반 유저 로그인 - loadUserByUsername(userEmail)");
//        System.out.println("security 로그인 loadUserByUsername : " + userEmail);

        // 시큐리티 세션에 세션 정보를 저장해 주는데 > session은 Authentication 타입 객체여야 한다.
        // 그리고 Authentication 안의 유저는 UserDetails 타입 객체여야 한다
        // => 시큐리티 세션(내부 Authentication(내부 UserDetails))
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("not found userEmail : " + userEmail));

//        Optional<User> optionalUser = userRepository.findByEmail(userEmail);

        try {
            System.out.println("Login 유저 : "+ user.toString());

            return new CustomUserDetails(user);
        } catch (UsernameNotFoundException e){
            System.out.println("Login 실패 : "+ user.toString());

            e.printStackTrace();

            return null;
        }
    }
}
