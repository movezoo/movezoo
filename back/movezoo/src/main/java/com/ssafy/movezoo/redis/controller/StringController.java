package com.ssafy.movezoo.redis.controller;

import com.ssafy.movezoo.redis.entity.StringEntity;
import com.ssafy.movezoo.redis.repository.StringRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
@RequiredArgsConstructor
public class StringController {

    private final StringRepository stringRepository;

    @PostMapping("string")
    public StringEntity saveString(@RequestBody StringEntity stringEntity){
        stringRepository.save(stringEntity);
        return stringEntity;
    }

    @GetMapping("string/{key}")
    public StringEntity get(@PathVariable("key") String key) {
        return stringRepository.get(key);
    }
}