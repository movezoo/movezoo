package com.ssafy.racing.global.init;

import com.ssafy.racing.user.domain.User;
import com.ssafy.racing.user.sevice.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class InitDB {
    private final UserService userService;
//    @Autowired
    public InitDB(UserService userService) {
        this.userService=userService;
    }

    @PostConstruct
    public void init() {
        UsersInit();
    }

    public void UsersInit() {

        User userA = new User("rlackdgml97@naver.com","1234","창히");
        userService.join(userA);

        User userB = new User("jww5555@naver.com","1234","재원");
        userService.join(userB);

        User userC = new User("goqdp@naver.com","1234","창히분신");
        userService.join(userC);
    }

}