package com.ssafy.movezoo.redis.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RedisService {

    //StringRedisTemplate : 내부적으로 redis연결 관리
    private  final StringRedisTemplate stringRedisTemplate;

    private final int LIMIT_TIME=3*60;  //3분

    /**
     *
     ValueOperations는 Spring Data Redis 프로젝트에서 제공하는 인터페이스
     Redis의 값(value)에 대한 기본적인 연산 제공
     주로 Redis의 문자열 값을 다루는데 사용
     */
    public void setRedisValue(String key, String val) {
        ValueOperations<String, String> stringStringValueOperations = stringRedisTemplate.opsForValue();
        stringStringValueOperations.set(key,val);
//        stringStringValueOperations.set(key,val,LIMIT_TIME);
    }

    public String getRedisValue(String key) {
        ValueOperations<String, String> stringStringValueOperations = stringRedisTemplate.opsForValue();
        String value = stringStringValueOperations.get(key);
        if(value==null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    public void updateRedisValue(String key, String val) {
        ValueOperations<String, String> stringStringValueOperations = stringRedisTemplate.opsForValue();
        stringStringValueOperations.getAndSet(key,val);

    }

    public void deleteRedisValue(String key) {
        stringRedisTemplate.delete(key);
    }


    public boolean addToList(String key, String value) {
        ListOperations<String, String> listOperations = stringRedisTemplate.opsForList();
        System.out.println(key+" "+value);
        listOperations.rightPush(key, value); // 리스트의 오른쪽에 데이터를 추가합니다.
        return true;
    }

    // 리스트의 데이터를 가져와 출력합니다.
    public List<String> getList(String key) {
        ListOperations<String, String> listOperations = stringRedisTemplate.opsForList();
        // 리스트의 모든 데이터를 가져옵니다.
        return listOperations.range(key, 0, -1);
    }
}
