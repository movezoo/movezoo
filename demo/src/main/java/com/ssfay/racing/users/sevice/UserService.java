package com.ssfay.racing.users.sevice;

import com.ssfay.racing.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public int changPassword(String usersEmail, String password){
        return userRepository.updatePassword(usersEmail,password);
    }

}
