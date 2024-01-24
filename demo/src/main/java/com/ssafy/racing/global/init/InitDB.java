package com.ssafy.racing.global.init;

import com.ssafy.racing.user.domain.User;
import com.ssafy.racing.user.repository.UserRepository;
import com.ssafy.racing.user.sevice.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitDB {
    private final UserService userService;
    private final UserRepository userRepository;
//    @Autowired
//    public InitDB(UserService userService) {
//        this.userService=userService;
//    }

    @PostConstruct
    public void init() {
        UsersInit();
    }

    public void UsersInit() {

        User userA = new User("rlackdgml97@naver.com","1234","창히");
        userRepository.save(userA);

        User userB = new User("jww5555@naver.com","1234","재원");
        userRepository.save(userB);

        User userC = new User("goqdp@naver.com","1234","창히분신");
        userRepository.save(userC);


        User a = userRepository.findById(1);
        User b = userRepository.findById(1);

        System.out.println(a.toString());
        System.out.println(b.toString());
        System.out.println(a.equals(b));

    }

}