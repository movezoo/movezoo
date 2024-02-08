package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.dto.CoinResponseDto;
import com.ssafy.movezoo.game.dto.RoomSessionIdDto;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

//@RestController
//@RequestMapping("/api/coin")
@RequiredArgsConstructor
public class CoinController {
    private final UserService userService;
    private static int[] reward = {10,7,5,3};

    @GetMapping("/{userId}")
    public ResponseEntity<CoinResponseDto> findUserCoin(@PathVariable Integer userId){
        User user = userService.findById(userId);

        CoinResponseDto coinResponseDto = new CoinResponseDto();
        coinResponseDto.setUserId(user.getUserId());
        coinResponseDto.setCoin(user.getCoin());

        return ResponseEntity.status(HttpStatus.OK).body(coinResponseDto);
    }

    @PostMapping
    public ResponseEntity<SimpleResponseDto> gameReward(Authentication authentication, @RequestBody RoomSessionIdDto dto){
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        String roomSessionId = dto.getRoomSessionId();    // roomId: Long
        String nickname = dto.getNickname();
        int ranking= 0; //dto.getNickname;

        //별별별 다른 페이지로 이동하는거 막아 화이트에이블뜨게, 아무것도 안뜨는거 에바"
        //1. 닉네임으로 사용자를 입력받는다
        //2. 사용자를 검증한다
        //3. 맞다면 순위별로 재화지급

        Optional<User> findUser = userService.findByNickname(nickname);
        if(findUser.isEmpty() || authentication.getName() != user.getUserId()) {
            simpleResponseDto.setSuccess(false);
            simpleResponseDto.setMsg("사용자를 찯을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(simpleResponseDto);
        }

        User user = findUser.get();

        userService.addUserCoin(user.getUserId(),reward[ranking]);

        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("순위별 재화 지급 완료");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }
    
//    @PostMapping
//    public ResponseEntity<SimpleResponseDto> gameReward(@RequestBody RoomSessionIdDto dto){
//        String roomSessionId = dto.getRoomSessionId();    // roomId: Long
//
//        List<SessionUserInfo> sessionUserList = findSessionUserList(roomSessionId);
//
//        for(int i = 0 ;i<sessionUserList.size(); i++){
//            SessionUserInfo sessionUserInfo = sessionUserList.get(i);
//            userService.addUserCoin(sessionUserInfo.getUserId(),reward[i]);
//        }
//
//        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
//        simpleResponseDto.setSuccess(true);
//        simpleResponseDto.setMsg("순위별 재화 지급 완료");
//        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
//    }


//    @PostMapping
//    public ResponseEntity<SimpleResponseDto> gameReward(@RequestBody RoomSessionIdDto dto){
//        String roomSessionId = dto.getRoomSessionId();    // roomId: Long
//
//        List<SessionUserInfo> sessionUserList = findSessionUserList(roomSessionId);
//
//        for(int i = 0 ;i<sessionUserList.size(); i++){
//            SessionUserInfo sessionUserInfo = sessionUserList.get(i);
//            userService.addUserCoin(sessionUserInfo.getUserId(),reward[i]);
//        }
//
//        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
//        simpleResponseDto.setSuccess(true);
//        simpleResponseDto.setMsg("순위별 재화 지급 완료");
//        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
//    }


    private List<SessionUserInfo> findSessionUserList(String roomSessionId) {
        // 해당 방에 들어있는 유저에 대해서 처리하는 코드 필요

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
