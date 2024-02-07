package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
@Slf4j
public class CustomOAuth2Service extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public CustomOAuth2Service(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("oauth 유저 로그인 - loadUser(userRequest)");
//        System.out.println("oauth 로그인 loadUser : " + userRequest.getAccessToken().getTokenValue());

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String nickname = oAuth2User.getAttribute("name");

        // 이미 가입한 사용자인지 확인
        Optional<User> optionalUser = userRepository.findByGoogleEmail(email);

        // 가입한 사용자가 아니라면
        if (optionalUser.isEmpty()) {
            while (userRepository.findByNickname(nickname).isPresent()){
                Random random = new Random(System.currentTimeMillis());
                int randVal = random.nextInt(999);
                nickname = nickname.concat(String.valueOf(randVal));

                System.out.println("randVal : "+randVal);
            }

            log.info("새로운 소셜 사용자 등록 성공");
            User user = new User(email, nickname);
            userRepository.save(user);
        }

        log.info("OAuth2User loadUser - 로그인한 유저 attributes : "+oAuth2User.getAttributes().toString());


        return oAuth2User;
    }

//    private void validateAttributes(Map<String, Object> attributes) throws IllegalAccessException {
//        if (!attributes.containsKey("email")){
//            throw new IllegalAccessException("서드파티의 응답에 email이 존재하지 않습니다.");
//        }
//    }
//
//    private User registerIfNewUser(Map<String, Object> userInfoAttributes){
//        String email = (String) userInfoAttributes.get("email");
//        String name = (String) userInfoAttributes.get("name");
//
//        Optional<User> optionalUser = userRepository.findByGoogleEmail(email);
//
//        if (optionalUser.isPresent())   // 이미 가입한 소셜 사용자인 경우
//            return optionalUser.get();
//
//        User user = new User(email, name);
//        return userRepository.save(user);
//    }
}
