package com.ssafy.racing.global.init;

import com.ssafy.racing.users.domain.Users;
import com.ssafy.racing.users.sevice.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
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

        Users usersA = new Users("rlackdgml97@naver.com","1234","창히");
        userService.join(usersA);

        Users usersB = new Users("jww5555@naver.com","1234","재원");
        userService.join(usersB);

        Users usersC = new Users("goqdp@naver.com","1234","창히분신");
        userService.join(usersC);
    }

}