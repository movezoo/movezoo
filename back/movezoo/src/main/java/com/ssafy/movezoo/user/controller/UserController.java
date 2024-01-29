package com.ssafy.movezoo.user.controller;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.MessageDto;
import com.ssafy.movezoo.user.dto.StatusEnum;
import com.ssafy.movezoo.user.dto.UserJoinRequestDto;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<MessageDto> registUser(UserJoinRequestDto dto){
        String msg = "회원가입 성공";
        // 이메일, 닉네임 중복체크
        if (userService.checkUsersEmailDuplicate(dto.getUserEmail())){
            msg = "중복된 이메일입니다.";
        } else if (userService.checkNicknameDuplicate(dto.getNickname())){
            msg = "중복된 닉네임입니다.";
        } else {
            // 회원가입 성공
            userService.join(new User(dto.getUserEmail(), passwordEncoder.encode(dto.getPassword()), dto.getNickname()));
            System.out.println(passwordEncoder.encode(dto.getPassword()));
            MessageDto message = MessageDto.builder()
                    .status(StatusEnum.OK)
                    .message(msg)
                    .data(dto)
                    .build();

            return ResponseEntity.ok().body(message);
        }

        MessageDto message = MessageDto.builder()
                .status(StatusEnum.BAD_REQUEST)
                .message(msg)
                .build();

        return ResponseEntity.badRequest().body(message);
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
        if (userService.checkNicknameDuplicate(nickname)) {
            MessageDto message = MessageDto.builder()
                    .status(StatusEnum.BAD_REQUEST)
                    .message("중복된 닉네임입니다.")
                    .build();

            return ResponseEntity.badRequest().body(message);
        } else {
            userService.changeNickname(userId, nickname);

            MessageDto message = MessageDto.builder()
                    .status(StatusEnum.OK)
                    .message("닉네임 변경 성공")
                    .build();

            return ResponseEntity.ok().body(message);
        }
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
