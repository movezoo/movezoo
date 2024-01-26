package com.ssafy.movezoo.auth.sevice;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {
    private final UserRepository userRepository;

    public User login(String userEmail, String password){
         User findUser = userRepository.findByEmail(userEmail);
//         Optional<User> optionalUser = userRepository.findByLoginId(req.getLoginId());
//        // loginId와 일치하는 User가 없으면 null return
////        if(optionalUser.isEmpty()) {
////            return null;
////        }
////
//        User user = optionalUser.get();

        // 아이디 비밀번호 체크 필요

        if (!findUser.getPassword().equals(password)){
            return null;
        }

        return findUser;
    }
}
