package com.ssafy.movezoo.redis.controller;


import com.ssafy.movezoo.redis.service.RedisService;
import com.ssafy.movezoo.redis.dto.RedisDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RedisController {
    private final RedisService redisService;

    @PostMapping("/redis")
    public boolean create(@RequestBody RedisDto redisDto) {
        redisService.setRedisValue(redisDto.getKey(), redisDto.getVal());
        return true;
    }

    @GetMapping("/redis")
    public String read(@RequestParam String key) {
        return redisService.getRedisValue(key);
    }

    @PutMapping("/redis")
    public boolean update(@RequestBody RedisDto redisDto) {
        redisService.updateRedisValue(redisDto.getKey(), redisDto.getVal());
        return true;
    }

    @DeleteMapping("/redis")
    public boolean delete(@RequestBody RedisDto redisDto){
        redisService.deleteRedisValue(redisDto.getKey());
        return true;
    }


    @GetMapping("/redis/list")
    public List<String> readList(@RequestParam String key) {
        return redisService.getList(key);
    }

    @PutMapping("/redis/list")
    public boolean updateList(@RequestBody RedisDto redisDto) {
        System.out.println(redisDto.getKey()+" "+ redisDto.getVal());
        redisService.addToList(redisDto.getKey(), redisDto.getVal());
        return true;
    }

}
