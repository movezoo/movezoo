package com.ssafy.movezoo.global.init;

import com.ssafy.movezoo.friendship.service.FriendService;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import com.ssafy.movezoo.user.sevice.UserService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InitDB {
    private final UserService userService;
    private final UserRepository userRepository;
    private final FriendService friendService;
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

        friendService.addFriend(2,1);
        friendService.addFriend(2,3);


    }

    public void makeSession(HttpSession session){
        User user = userService.findById(1);
        session.setAttribute("user",user);
    }

}