package com.ssafy.racing.users.controller;


import com.ssafy.racing.users.domain.Users;
import com.ssafy.racing.users.dto.UserJoinRequest;
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
    public ResponseEntity<Users> join(@RequestBody UserJoinRequest dto) {
        Users usersA = new Users("rlackdgml97@naver.com","1234","창히");
//        return ResponseEntity.ok().body(usersA);
        return new ResponseEntity<>(usersA, HttpStatus.OK);

    }


}
