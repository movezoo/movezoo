package com.ssafy.movezoo.user.controller;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.MessageDto;
import com.ssafy.movezoo.user.dto.StatusEnum;
import com.ssafy.movezoo.user.dto.UserJoinRequest;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    @PostMapping
    public ResponseEntity<MessageDto> registUser(UserJoinRequest dto){
        boolean result = userService.join(new User(dto.getUserEmail(), dto.getPassword(), dto.getNickname()));

        if (result){
            MessageDto msg = MessageDto.builder()
                    .status(StatusEnum.OK)
                    .message("회원가입 성공")
                    .data(dto)
                    .build();

            return ResponseEntity.ok().body(msg);
        } else {
            MessageDto msg = MessageDto.builder()
                    .status(StatusEnum.BAD_REQUEST)
                    .message("회원가입 실패")
                    .build();

            return ResponseEntity.badRequest().body(msg);
        }
    }

    // 비밀번호 변경
    @PatchMapping("/password")
    public ResponseEntity<MessageDto> changePassword(String userEmail, String password){
        userService.changePassword(userEmail, password);

        MessageDto msg = MessageDto.builder()
                .status(StatusEnum.OK)
                .message("비밀번호 변경 성공")
                .build();

        return ResponseEntity.ok().body(msg);
    }

    // 닉네임 변경
    @PatchMapping("/nickname")
    public ResponseEntity<MessageDto> changeNickname(int userId, String nickname){
        // 닉네임 중복체크
//        if (userService.checkNicknameDuplicate(nickname)) {
//            Message msg = Message.builder()
//                    .status(StatusEnum.BAD_REQUEST)
//                    .message("닉네임 중복")
//                    .build();
//
//            return ResponseEntity.badRequest().body(msg);
//        } else {
        userService.changeNickname(userId, nickname);

        MessageDto msg = MessageDto.builder()
                .status(StatusEnum.OK)
                .message("닉네임 변경 성공")
                .build();

        return ResponseEntity.ok().body(msg);
//        }
    }

    // 설정 변경
    @PatchMapping("/settings")
    public ResponseEntity<MessageDto> changeSettings(int userId, int volume, int mic, int cameraSensitivity){
        userService.changeSetting(userId, volume, mic, cameraSensitivity);
        MessageDto msg = MessageDto.builder()
                .status(StatusEnum.OK)
                .message("설정 변경 성공")
                .build();

        return ResponseEntity.ok().body(msg);
    }


    // 사용자 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<MessageDto> getUserInfo(@PathVariable int userId){
        MessageDto msg = MessageDto.builder()
                .status(StatusEnum.OK)
                .message("조회 성공")
                .data(userService.findById(userId))
                .build();

        return ResponseEntity.ok().body(msg);
    }


}
