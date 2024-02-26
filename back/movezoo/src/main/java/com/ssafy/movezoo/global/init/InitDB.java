package com.ssafy.movezoo.global.init;

import com.ssafy.movezoo.friendship.service.FriendService;
import com.ssafy.movezoo.game.domain.Item;
import com.ssafy.movezoo.game.domain.MyRacer;
import com.ssafy.movezoo.game.domain.Racer;
import com.ssafy.movezoo.game.dto.LapTimeRequestDto;
import com.ssafy.movezoo.game.serivce.ItemService;
import com.ssafy.movezoo.game.serivce.LapTimeService;
import com.ssafy.movezoo.game.serivce.RacerService;
import com.ssafy.movezoo.user.controller.UserController;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.UserJoinRequestDto;
import com.ssafy.movezoo.user.repository.UserRepository;
import com.ssafy.movezoo.user.sevice.UserService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

//@Component
@RequiredArgsConstructor
public class InitDB {
    private final UserController userController;
    private final UserService userService;
    private final UserRepository userRepository;
    private final FriendService friendService;
    private final RacerService racerService;
    private final LapTimeService lapTimeService;
    private final ItemService itemService;

//    @Autowired
//    public InitDB(UserService userService) {
//        this.userService=userService;
//    }

    //    @PostConstruct
    public void init() {
        UsersInit();
    }

    public void UsersInit() {

    }
}