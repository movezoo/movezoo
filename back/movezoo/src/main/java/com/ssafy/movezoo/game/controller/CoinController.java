package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.dto.CoinResponseDto;
import com.ssafy.movezoo.game.dto.RoomSessionDto;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/coin")
@RequiredArgsConstructor
public class CoinController {
    private final UserService userService;
    private  static int[] reward = {10,7,5,3};

    @GetMapping("/{userId}")
    public ResponseEntity<CoinResponseDto> findUserCoin(@PathVariable Integer userId){
        User user = userService.findById(userId);

        CoinResponseDto coinResponseDto = new CoinResponseDto();
        coinResponseDto.setUserId(user.getUserId());
        coinResponseDto.setCoin(user.getCoin());

        return ResponseEntity.status(HttpStatus.OK).body(coinResponseDto);
    }

    @PostMapping
    public ResponseEntity<SimpleResponseDto> gameReward(@RequestBody RoomSessionDto roomSessionDto){
        int roomId = roomSessionDto.getSessionId();

        List<SessionUserInfo> sessionUserList = findSessionUserList(roomId);

        for(int i = 0 ;i<sessionUserList.size(); i++){
            SessionUserInfo sessionUserInfo = sessionUserList.get(i);
            userService.addUserCoin(sessionUserInfo.getUserId(),reward[i]);
        }

        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("순위별 재화 지급 완료");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }

    private List<SessionUserInfo> findSessionUserList(int roomId) {
        List<SessionUserInfo> result = new ArrayList<>();

        result.add(new SessionUserInfo(1,90.5));
        result.add(new SessionUserInfo(2,33.45));
        result.add(new SessionUserInfo(3,34.12));
        result.add(new SessionUserInfo(4,60.35));

        Collections.sort(result, new Comparator<SessionUserInfo>() {
            @Override
            public int compare(SessionUserInfo o1, SessionUserInfo o2) {
                int val1 = (int) (o1.getRecord()*10000);
                int val2 = (int) (o2.getRecord()*10000);
                return val1-val2;
            }
        });

        return result;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    static class SessionUserInfo{
        private Integer userId;
        private Double record;
    }

}
