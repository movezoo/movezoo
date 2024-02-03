package com.ssafy.movezoo.friendship.controller;

import com.ssafy.movezoo.user.dto.UserInfoDto;
import com.ssafy.movezoo.friendship.dto.FriendResponseDto;
import com.ssafy.movezoo.friendship.service.FriendService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.sevice.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/friend")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;
    private final UserService userService;
    @GetMapping("/{userId}")
    public ResponseEntity<List<FriendResponseDto>> friendList(@PathVariable("userId") Integer userId){
        List<FriendResponseDto> friendList = friendService.findFriendList(userId);
        return ResponseEntity.status(HttpStatus.OK).body(friendList);
    }

    @PostMapping
    public ResponseEntity<SimpleResponseDto> registerFriend (Authentication authentication, @RequestBody UserInfoDto registerDto){
        //친구관계로 설정하기 전에 한번더 인증하기, 편법으로 친구로 만들수있따
        //토큰이나 세션으로 대처
        int userId = Integer.parseInt(authentication.getName());
        User user = userService.findById(userId);

        boolean result = friendService.addFriend(user.getUserId(),registerDto.getFriendId());

        SimpleResponseDto requestDto = new SimpleResponseDto();
        if(result){
            requestDto.setSuccess(true);
            requestDto.setMsg("등록완료");
            return ResponseEntity.status(HttpStatus.OK).body(requestDto);
        }
        requestDto.setSuccess(false);
        requestDto.setMsg("등록실패");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(requestDto);
    }

    @DeleteMapping
    public ResponseEntity<SimpleResponseDto> unRegisterFriend(Authentication authentication, @RequestBody UserInfoDto deleteDto){
        int userId = Integer.parseInt(authentication.getName());
        User user = userService.findById(userId);

        boolean result = friendService.deleteFriend(user.getUserId(),deleteDto.getFriendId());

        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        if(result){
             simpleResponseDto.setSuccess(true);
             simpleResponseDto.setMsg("삭제성공");
             return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
        }

        simpleResponseDto.setSuccess(false);
        simpleResponseDto.setMsg("삭제실패");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }

}
