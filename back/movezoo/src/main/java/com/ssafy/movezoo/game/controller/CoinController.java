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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/coin")
@RequiredArgsConstructor
@Slf4j
public class CoinController {
    private final UserService userService;
    private static int[] reward = { 0, 10, 7, 5, 3 };

    @GetMapping("/{userId}")
    public ResponseEntity<CoinResponseDto> findUserCoin(@PathVariable("userId") Integer userId){
//        System.out.println("findUserCoin!! "+ userId);

        User user = userService.findById(userId);

        // 사용자 아이디(PK)와 보유 코인 dto
        CoinResponseDto coinResponseDto = new CoinResponseDto();
        coinResponseDto.setUserId(user.getUserId());
        coinResponseDto.setCoin(user.getCoin());

        return ResponseEntity.status(HttpStatus.OK).body(coinResponseDto);
    }

    @PatchMapping
    // 방 세션 id, 닉네임 받아와서 보상 지급
    public ResponseEntity<SimpleResponseDto> getRewardCoin(Authentication authentication, @RequestBody RoomSessionIdDto dto){
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

//        String roomSessionId = dto.getRoomSessionId();    // roomSessionId: String
        String nickname = dto.getNickname();
        int ranking= dto.getRanking();

        log.info("api-coint-patch");
        log.info("dto {}", dto.toString());
        log.info("reward {}",reward[dto.getRanking()]);

        Optional<User> findUser = userService.findByNickname(nickname); // 닉네임으로 사용자 찾기

        // 사용자 검증
        if (findUser.isEmpty()) {
            simpleResponseDto.setSuccess(false);
            simpleResponseDto.setMsg("사용자를 찾을 수 없습니다.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(simpleResponseDto);
        }

        User user = findUser.get();
        log.info("coin target user {} {}",user.getUserId(), user.getUserEmail());

        userService.addCoin(findUser.get().getUserId(), reward[ranking]);   // 순위에 따른 재화 지급

        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("재화 지급 완료");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }


//    private List<SessionUserInfo> findSessionUserList(String roomSessionId) {
//        // 해당 방에 들어있는 유저에 대해서 처리하는 코드 필요
//        List<SessionUserInfo> result = new ArrayList<>();
//
//        result.add(new SessionUserInfo(1,90.5));
//        result.add(new SessionUserInfo(2,33.45));
//        result.add(new SessionUserInfo(3,34.12));
//        result.add(new SessionUserInfo(4,60.35));
//
//        Collections.sort(result, new Comparator<SessionUserInfo>() {
//            @Override
//            public int compare(SessionUserInfo o1, SessionUserInfo o2) {
//                int val1 = (int) (o1.getRecord()*10000);
//                int val2 = (int) (o2.getRecord()*10000);
//                return val1-val2;
//            }
//        });
//
//        return result;
//    }

    @Getter
    @Setter
    @AllArgsConstructor
    static class SessionUserInfo{
        private Integer userId;
        private Double record;
    }

}
