package com.ssafy.racing.user.sevice;

import com.ssafy.racing.user.domain.User;
import com.ssafy.racing.user.dto.UserJoinRequest;
import com.ssafy.racing.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;

@Service
@RequiredArgsConstructor
@Transactional
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
    public int changeSettings(int userId, int volume, int mic){
        return userRepository.updateVolumeAndMic(userId, volume, mic);
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

    public int join(User user){
        int result = 1;
        if (userRepository.findByEmail(user.getUserEmail()) != null)
            result = 2;
        else if (userRepository.findByNickname(user.getNickname()) != null)
            result = 3;
        else {
            userRepository.save(user);
        }

        return result;
    }


}
