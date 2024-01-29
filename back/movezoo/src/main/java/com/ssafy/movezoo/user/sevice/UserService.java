package com.ssafy.movezoo.user.sevice;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 사용자 정보 조회
    public User findById(int userId){
        return userRepository.findById(userId);
    }

    // 비밀번호 변경
    public int changePassword(String userEmail, String password){
        return userRepository.updatePassword(userEmail, password);
    }

    // 닉네임 변경
    public int changeNickname(int userId, String nickname){
        return userRepository.updateNickname(userId, nickname);
    }

    // 설정 변경
    public int changeSetting(int userId, int volume, int mic, int cameraSensitivity){
        return userRepository.updateSetting(userId, volume, mic, cameraSensitivity);
    }

    // 회원가입
    // 아이디 중복 체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkUsersEmailDuplicate(String usersEmail){
        Optional<User> userOptional = userRepository.findByEmail(usersEmail);

        // Optional이 비어있으면 false를 반환하도록 기본값을 설정
        User user = userOptional.orElse(null);

        if (user == null)
            return false;

        return !user.getUserEmail().equals(usersEmail);
    }

    // 닉네임 중복체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkNicknameDuplicate(String nickname){
        Optional<User> userOptional = userRepository.findByNickname(nickname);
        User user = userOptional.orElse(null);

        if (user == null)
            return false;

        return !user.getNickname().equals(nickname);
    }

    // 가입
    public boolean join(User user){
        userRepository.save(user);
        return true;
    }


}
