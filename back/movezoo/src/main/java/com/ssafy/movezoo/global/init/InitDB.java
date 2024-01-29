package com.ssafy.movezoo.global.init;

import com.ssafy.movezoo.friendship.service.FriendService;
import com.ssafy.movezoo.game.domain.MyRacer;
import com.ssafy.movezoo.game.domain.Racer;
import com.ssafy.movezoo.game.dto.LapTimeRequestDto;
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

@Component
@RequiredArgsConstructor
public class InitDB {
    private final UserController userController;
    private final UserService userService;
    private final UserRepository userRepository;
    private final FriendService friendService;
    private final RacerService racerService;
    private final LapTimeService lapTimeService;
//    @Autowired
//    public InitDB(UserService userService) {
//        this.userService=userService;
//    }

    @PostConstruct
    public void init() {
        UsersInit();
    }

    public void UsersInit() {

        UserJoinRequestDto dto = new UserJoinRequestDto("123@123.com","123","test123");
        userController.registUser(dto);

        User userA = new User("rlackdgml97@naver.com","1234","창히");
        userA.setCoin(5000);
        userA.setProfileImgUrl("userA.jpg");
        userRepository.save(userA);

        User userB = new User("jww5555@naver.com","1234","재원");
        userB.setCoin(1000);
        userB.setProfileImgUrl("userB.jpg");
        userRepository.save(userB);

        User userC = new User("goqdp@naver.com","1234","창히분신");
        userC.setProfileImgUrl("userC.jpg");
        userRepository.save(userC);

        friendService.addFriend(2,1);
        friendService.addFriend(2,3);

        Racer uni = new Racer("우니",1000);
        Racer mard = new Racer("마드리드",3000);
        Racer bazzi = new Racer("배찌",500);
        Racer dao = new Racer("다오",0);

        racerService.save(uni);
        racerService.save(mard);
        racerService.save(bazzi);
        racerService.save(dao);

        System.out.println(dao);

        racerService.addMyRacer(userB.getUserId(),dao.getRacerId());
        racerService.addMyRacer(userB.getUserId(),bazzi.getRacerId());

        LapTimeRequestDto lapTimeRequestDto =new LapTimeRequestDto();
        lapTimeRequestDto.setUserId(1);
        lapTimeRequestDto.setRecord(1.100);
        lapTimeRequestDto.setTrackId(1);

        lapTimeService.addLapTime(lapTimeRequestDto);

        lapTimeRequestDto.setTrackId(2);

        lapTimeService.addLapTime(lapTimeRequestDto);

        lapTimeRequestDto.setTrackId(1);
        lapTimeRequestDto.setRecord(2.222);
        lapTimeRequestDto.setUserId(2);

        lapTimeService.addLapTime(lapTimeRequestDto);

        lapTimeRequestDto.setTrackId(1);
        lapTimeRequestDto.setRecord(5.528);
        lapTimeRequestDto.setUserId(3);

        lapTimeService.addLapTime(lapTimeRequestDto);

        lapTimeRequestDto.setTrackId(2);
        lapTimeRequestDto.setRecord(8.272);
        lapTimeRequestDto.setUserId(3);

        lapTimeService.addLapTime(lapTimeRequestDto);

        lapTimeRequestDto.setTrackId(3);
        lapTimeRequestDto.setRecord(8.272);
        lapTimeRequestDto.setUserId(3);

        lapTimeService.addLapTime(lapTimeRequestDto);
    }

    public void makeSession(HttpSession session){
        User user = userService.findById(1);
        session.setAttribute("user",user);
    }

}