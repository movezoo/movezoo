package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.auth.config.OAuthAttributes;
import com.ssafy.movezoo.game.serivce.RacerService;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.UserResponseDto;
import com.ssafy.movezoo.user.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CustomOAuth2Service extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final HttpSession session;
    private final RacerService racerService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("oauth 유저 로그인 - loadUser(userRequest)");

        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        // OAuth2 서비스 구분 코드 (구글, 카카오 네이버)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        // OAuth2 로그인 진행시 키가 되는 필드 값 (PK) (구글의 기본 코드는 "sub")
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        // OAuth2UserService
        OAuthAttributes attributes = OAuthAttributes.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        User user = saveOrUpdate(attributes);
//        String email = attributes.getEmail();
//        String nickname = attributes.getNickname();
//
//        User user = new User(email, nickname);
//
//        Optional<User> optionalUser = userRepository.findByGoogleEmail(email);
//        // 이전에 가입한 사용자가 아니라면
//        if (optionalUser.isEmpty()) {
//            while (userRepository.findByNickname(nickname).isPresent()) {
//                Random random = new Random(System.currentTimeMillis());
//                int randVal = random.nextInt(999);
//                nickname = nickname.concat(String.valueOf(randVal));
//
////                System.out.println("randVal : " + randVal);
//            }
//
//            log.info("새로운 소셜 사용자 등록 성공");
//            user.setNickname(nickname);
//            userRepository.save(user);
//        }

        session.setAttribute("user", new UserResponseDto(user));

        log.info("OAuth2User loadUser - 로그인한 유저 attributes : " + oAuth2User.getAttributes().toString());
        log.info("OAuth2User loadUser - 넣을 유저 : "+user.toString());
        return new CustomUserDetails(user);
    }

        // 소셜로그인시 기존 회원이 존재하면 이메일만 업데이트 해 기존 데이터 보존
    private User saveOrUpdate(OAuthAttributes attributes) {
//        User user = userRepository.findByGoogleEmail(attributes.getEmail())
//                .map(entity -> entity.update(attributes.getEmail()))
//                .orElse(attributes.toEntity());
        User user = attributes.toEntity();

        Optional<User> findUser = userRepository.findByGoogleEmail(attributes.getEmail());
        if (!findUser.isPresent()){
            User saveUser = userRepository.save(user);

            for (int i = 1; i <= 4; i++){
                racerService.addMyRacer(saveUser.getUserId(), i);
            }

            user.setUserEmail(user.getGoogleUserEmail());
            log.info("소셜 로그인 회원가입 : {}", user.toString());

            return saveUser;
        }

        return findUser.get();
    }

}
