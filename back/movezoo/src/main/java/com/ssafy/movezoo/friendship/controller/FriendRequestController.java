package com.ssafy.movezoo.friendship.controller;

import com.ssafy.movezoo.user.dto.UserInfoDto;
import com.ssafy.movezoo.friendship.dto.FriendRequestDto;
import com.ssafy.movezoo.friendship.dto.FriendResponseDto;
import com.ssafy.movezoo.friendship.service.FriendRequestService;
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
@RequestMapping("/api/friend-request")
@RequiredArgsConstructor
public class FriendRequestController {
    private final FriendRequestService friendRequestService;
    private final UserService userService;
    private final FriendService friendService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<FriendResponseDto>> friendRequestList(@PathVariable Integer userId){
        List<FriendResponseDto> friendList = friendRequestService.findFriendRequestList(userId);
        return ResponseEntity.status(HttpStatus.OK).body(friendList);
    }

    @PostMapping
    public ResponseEntity<SimpleResponseDto> requestFriend(Authentication authentication, @RequestBody UserInfoDto friendInfoDto){
        int userId = Integer.parseInt(authentication.getName());
        User user = userService.findById(userId);

        boolean result = friendRequestService.addFriendRequest(user.getUserId(), friendInfoDto.getFriendId());
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        if(result){
            simpleResponseDto.setSuccess(true);
            simpleResponseDto.setMsg("등록성공");
            return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
        }

        simpleResponseDto.setSuccess(false);
        simpleResponseDto.setMsg("등록실패");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(simpleResponseDto);
    }

    @DeleteMapping
    public ResponseEntity<SimpleResponseDto> changeRequestFriend(Authentication authentication, @RequestBody FriendRequestDto requestDto){
        int userId = Integer.parseInt(authentication.getName());
        User user = userService.findById(userId);

        if(requestDto.isAllow()){
            //친구 추가후 요청삭제
            friendService.addFriend(user.getUserId(),requestDto.getFriendId());
        }

        friendRequestService.deleteFriendRequest(requestDto.getFriendId(),user.getUserId());
        
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("요청처리완료");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }


}
