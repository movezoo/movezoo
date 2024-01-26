package com.ssafy.racing.friendship.controller;

import com.ssafy.racing.friendship.dto.FriendInfoDto;
import com.ssafy.racing.friendship.dto.FriendResponseDto;
import com.ssafy.racing.friendship.service.FriendService;
import com.ssafy.racing.global.dto.SimpleResponseDto;
import com.ssafy.racing.user.domain.User;
import com.ssafy.racing.user.sevice.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections4.queue.PredicatedQueue;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;
    private final UserService userService;
    @GetMapping("/{userId}")
    public ResponseEntity<List<FriendResponseDto>> friendList(@PathVariable("userId") Integer userId){
        List<FriendResponseDto> result = friendService.findFriendList(userId);
        return ResponseEntity.status(HttpStatus.OK).body(result);

    }

    @PostMapping
    public ResponseEntity<SimpleResponseDto> registerFriend (@RequestBody FriendInfoDto registerDto){
        //친구관계로 설정하기 전에 한번더 인증하기, 편법으로 친구로 만들수있따
        //토큰이나 세션으로 대처
        User user = userService.findById(1);

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
    public ResponseEntity<SimpleResponseDto> unRegisterFriend(@RequestBody FriendInfoDto deleteDto){
        User user = userService.findById(1);

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
