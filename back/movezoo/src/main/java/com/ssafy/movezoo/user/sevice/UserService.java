package com.ssafy.movezoo.user.sevice;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.UserJoinRequest;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;

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
        userRepository.findByEmail(usersEmail);
        User user = userRepository.findByEmail(usersEmail);
        return !user.getUserEmail().equals(usersEmail);
    }

    // 닉네임 중복체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkNicknameDuplicate(String nickname){
        User user = userRepository.findByNickname(nickname);
        return !user.getNickname().equals(nickname);
    }

    // 회원가입
    public boolean join(User user){
        // 아이디 또는 이메일이 중복일 경우
        // 여기서 자꾸 initDB랑 충돌나서 문제 생기는 것 같음 => 몰루겟음
//        if (userRepository.findByEmail(user.getUserEmail()) != null || userRepository.findByNickname(user.getNickname()) != null)
//            return false;

        userRepository.save(user);
        return true;
    }

    public void addUserCoin(int userId, int coin){
        User user = userRepository.findById(userId);
        user.setCoin(user.getCoin()+coin);
    }

    public void useUserCoin(int userId, int coin){
        User user = userRepository.findById(userId);
        user.setCoin(user.getCoin()-coin);
    }


}
