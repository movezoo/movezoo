package com.ssfay.racing.users.controller;

import com.ssfay.racing.users.domain.UserJoinRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody UserJoinRequest dto){
        return ResponseEntity.ok().body("회원가입 성공");
    }

    @PostMapping("/login")

}
