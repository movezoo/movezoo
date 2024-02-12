package com.ssafy.movezoo.user.controller;

import com.ssafy.movezoo.game.serivce.RacerService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.dto.*;
import com.ssafy.movezoo.user.repository.UserRepository;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RacerService racerService;

    // 회원가입
    @PostMapping
    public ResponseEntity<SimpleResponseDto> registUser(@RequestBody UserJoinRequestDto dto) {
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

        String msg = "회원가입 성공";
        // 이메일, 닉네임 중복체크
        if (userService.checkUsersEmailDuplicate(dto.getUserEmail())) {
            msg = "중복된 이메일입니다.";
        } else if (userService.checkNicknameDuplicate(dto.getNickname())) {
            msg = "중복된 닉네임입니다.";
        } else {
            // 회원가입 성공
            userService.join(new User(dto.getUserEmail(), passwordEncoder.encode(dto.getPassword()), dto.getNickname()));

            Optional<User> findUser = userService.findByEmail(dto.getUserEmail());
            if (findUser.isPresent()) {
                for (int i = 1; i <= 4; i++) {
                    racerService.addMyRacer(findUser.get().getUserId(), i);
                }
            }

            simpleResponseDto.setSuccess(true);
            simpleResponseDto.setMsg(msg);

            return ResponseEntity.ok().body(simpleResponseDto);
        }

        simpleResponseDto.setSuccess(false);
        simpleResponseDto.setMsg(msg);

        return ResponseEntity.badRequest().body(simpleResponseDto);
    }

    // 비밀번호 변경
    @PatchMapping("/password")
    public ResponseEntity<SimpleResponseDto> changePassword(@RequestBody UserPasswordRequestDto dto) {
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto(true, "비밀번호 변경 성공");

        userService.changePassword(dto.getUserEmail(), passwordEncoder.encode(dto.getPassword()));

        return ResponseEntity.ok().body(simpleResponseDto);
    }

    // 닉네임 변경
    @PatchMapping("/nickname")
    public ResponseEntity<SimpleResponseDto> changeNickname(@RequestBody UserNicknameRequestDto dto, Authentication authentication) {
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto(false,"미인증");

//        if (authentication == null || dto.getUserEmail()==null || dto.getNickname()==null)
        if (authentication == null || dto.getNickname() == null) {
            simpleResponseDto.setMsg("authentication 객체 없음 / 닉네임 값이 없습니다.");
            return ResponseEntity.badRequest().body(simpleResponseDto);
        }
//        User findUser = userService.findById(Integer.parseInt(authentication.getName()));
//        if (findUser == null || !findUser.getUserEmail().equals(dto.getUserEmail()))
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(simpleResponseDto);

        // authentication => 로그인한 사용자의 아이디(PK)를 가져옴
        User findUser = userService.findById(Integer.parseInt(authentication.getName()));
        if (findUser == null) {
            simpleResponseDto.setMsg("사용자를 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(simpleResponseDto);
        }

        // 닉네임 중복체크
        if (userService.checkNicknameDuplicate(dto.getNickname())) {
            // 바꾸려는 닉네임이 DB에 있는 경우
            User user = userRepository.findById(Integer.parseInt(authentication.getName()));

            if (user.getNickname().equals(dto.getNickname()))
                // 이미 내 닉네임인 경우
                simpleResponseDto.setMsg("현재 닉네임과 동일합니다.");
            else
                // 다른 사람이 가지고있는 닉네임인 경우
                simpleResponseDto.setMsg("중복된 닉네임 입니다.");


            return ResponseEntity.badRequest().body(simpleResponseDto);
        }

        userService.changeNickname(Integer.parseInt(authentication.getName()), dto.getNickname());

        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("닉네임 변경 성공");

        return ResponseEntity.ok().body(simpleResponseDto);
    }

    // 프로필 이미지 변경
    @PatchMapping("/profile")
    public ResponseEntity<SimpleResponseDto> changeProfile(@RequestBody UserProfileRequestDto dto, Authentication authentication) {
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto(true, "프로필 변경 성공");

        userService.changeProfileImg(Integer.parseInt(authentication.getName()), dto.getProfileImgUrl());

        return ResponseEntity.ok().body(simpleResponseDto);
    }


    // 설정 변경
    @PatchMapping("/settings")
    public ResponseEntity<SimpleResponseDto> changeSettings(@RequestBody UserSettingRequestDto dto, Authentication authentication) {
        userService.changeSetting(Integer.parseInt(authentication.getName()), dto.getVolume(), dto.getMic(), dto.getCameraSensitivity());
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto(true, "설정 변경 완료");

        return ResponseEntity.ok().body(simpleResponseDto);
    }

    // 사용자 정보 조회
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUserInfo(@PathVariable int userId) {
        User user = userService.findById(userId);

        if (user != null) {
            UserResponseDto userResponseDto = new UserResponseDto(user);
            return ResponseEntity.ok().body(userResponseDto);
        }

        return ResponseEntity.badRequest().body(new UserResponseDto());
    }
}
