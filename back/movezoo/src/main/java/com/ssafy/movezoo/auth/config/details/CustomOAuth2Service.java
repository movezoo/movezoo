package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2Service extends DefaultOAuth2UserService {
    private final UserRepository userRepository;

    public CustomOAuth2Service(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // accessToken으로 서드파티에 요청해서 사용자 정보를 얻어옴
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getClientId();
        String providerId = oAuth2User.getAttribute("sub");
        String username = provider + "_" + providerId; //중복이 발생하지 않도록 provider와 providerId를 조합

        String email = oAuth2User.getAttribute("email");

        // 이미 가입한 사용자인지 확인
        Optional<User> findMember = userRepository.findByGoogleEmail(email);
        if (findMember.isEmpty()) { // 가입한 사용자가 아니라면
            User user = new User(email, username);
            userRepository.save(user);
        }
        
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
