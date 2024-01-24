package com.ssafy.racing.users.sevice;
import com.ssafy.racing.users.domain.Users;
import com.ssafy.racing.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public int changPassword(String usersEmail, String password){
        return userRepository.updatePassword(usersEmail,password);
    }

    public Users join(Users users){
        return userRepository.save(users);
    }

    //회원가입시 메일 인증 코드를 확인하는 함수
    public boolean checkAuthNumber(String usersEmail, String authNumber){
        Users users = userRepository.findByEmail(usersEmail);
        String usersAuthNumber = users.getAuthNumber();
        return usersAuthNumber!=null && usersAuthNumber.equals(authNumber);
    }

}
